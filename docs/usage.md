# Using loadout

How to install loadout, how each kind of asset loads and how you invoke it, and how the
pieces work together. For a one-line description of every asset, see
[`catalog.md`](./catalog.md).

> **New to a project and not sure where to begin?** Run **`/start`** (or ask
> *"I want to build X — what should I do?"*). The `getting-started` skill clarifies the
> goal, picks the right workflow, decides manual vs autonomous loop, and hands you a
> ready-to-run kickoff prompt.

---

## 1. Mental model

`coding agent = model + harness`. loadout is a library of **harness components** plus a CLI
to install them. Each component lives where it loads:

| Asset | What it is | Loads / triggers |
|---|---|---|
| **Rule** (`.mdc`) | A persistent *constraint* — no steps to run | Always, on matching files, when the agent judges it relevant, or on `@mention` |
| **Skill** (`SKILL.md`) | An invokable *procedure* with a beginning and end | When your request matches its description, or you call it by name |
| **Command** (`.md`) | A repeatable action | When you type `/name` |
| **Subagent** (`.md`) | A delegated task in its own context | When the main agent dispatches it (or you ask for it) |
| **MCP server** | External tool/data access | At session start, from `.mcp.json` / `.cursor/mcp.json` |
| **Hook** (`hooks.json`) | Deterministic, must-happen-every-time enforcement | At lifecycle points (after edit, before commit, session start) |
| **Template / doc / runbook** | Starter files and reference material | You read/use them; the CLI vendors them into the project |

The golden rule: **a constraint is a rule, a procedure is a skill, must-happen enforcement
is a hook, standing knowledge is `AGENTS.md`.**

---

## 2. How each asset type loads and how you call it

### Rules (`.mdc`)

A rule's frontmatter decides *when it loads*. Four modes:

| Mode | Frontmatter | How it triggers | Use for |
|---|---|---|---|
| **Always** | `alwaysApply: true` | Loaded on every request | A few short, universal constraints (kept tiny — every token loads every time) |
| **Auto (glob)** | `globs: [...]`, `alwaysApply: false` | Attaches when a matching file is in context | Language/area constraints (e.g. `**/*.ts`) |
| **Agent-requested** | `description:` set, no globs | The agent pulls it in when it judges the rule relevant | Situational conventions |
| **Manual** | no description, no globs | Only when you `@rule-name` it in chat | Rarely-needed references |

- **In Cursor:** rules live in `.cursor/rules/*.mdc` and load per the table above. `@rule-name` forces one in.
- **In Claude Code:** there's no native `.mdc`. `loadout add` *projects* a rule's body into a managed block in `CLAUDE.md` so the same constraint applies. Genuinely cross-tool baseline conventions belong in `AGENTS.md`.
- You generally don't "call" a rule — you rely on it loading. To check which are active in Cursor: Settings → Rules.

### Skills (`SKILL.md`)

A skill is selected primarily by its **description** — write requests that match it, and the
agent invokes it. You can also call one explicitly:

- **Claude Code:** `/skill-name` (e.g. `/planning-a-change`), or just describe the task and let it auto-trigger. Delivered via the plugin (`/plugin install core-engineering@loadout`).
- **Cursor:** skills load from `.cursor/skills/<name>/`; the agent invokes one when your request matches its description. `loadout add <skill>` vendors it.
- Skills use **progressive disclosure**: only the lean `SKILL.md` body loads on trigger; reference files load on demand. So having many installed is cheap until used.

Example: "plan and ship the auth refactor" will pull in `planning-a-change` then
`reviewing-and-shipping`; or run `/planning-a-change` to force it.

### Commands

Type the slash command: `/start`, `/changelog`. Commands are explicit, repeatable actions.
`loadout add <command>` vendors them to `.cursor/commands/<id>.md` (Cursor) and
`.claude/commands/<id>.md` (Claude Code); Claude Code can alternatively get them via the
plugin marketplace.

### Subagents

A subagent runs in its own context window and reports back, which keeps your main context
clean and lets the maker differ from the checker.

- Dispatch by asking: *"use the **reviewer** subagent on this diff"* or *"use **explorer** to find where sessions are handled."*
- Both tools load custom subagents from a per-tool dir: Claude Code from `.claude/agents/`, Cursor from `.cursor/agents/`. `loadout add <agent>` vendors the persona into both; Claude Code can also get them via the plugin.

### MCP servers

Configured in `.mcp.json` (Claude Code) / `.cursor/mcp.json` (Cursor) and loaded at session
start. `loadout add template-mcp` merges a starter (Context7 + Playwright) **by key** without
overwriting your existing servers. Treat any external MCP as trusted prompt text — see the
`audit-external-skills` rule.

### Hooks

Deterministic scripts at lifecycle points (after edit, before commit, session start).
Principle: **success is silent, failures are verbose.** Use a hook when something must
happen every time (format-on-write, typecheck/lint gate, block destructive commands,
approval before push). See the [`harness-hooks`](../processes/runbooks/harness-hooks.md)
runbook for ready-to-paste `hooks.json` + scripts. loadout ships one hook directly: the
SessionStart update-notify hook, installed by `loadout init`.

---

## 3. Installing and consuming

loadout ships across three layers; use whichever fits.

### A. Claude Code plugins (skills, commands, subagents)

```bash
/plugin marketplace add naffis/loadout
/plugin install core-engineering@loadout
/plugin install meta@loadout
/plugin update core-engineering
```

### B. Cursor rules (Remote Rules — one time per machine)

Cursor → **Settings → Rules and Commands → Remote Rule (GitHub)** → paste
`https://github.com/naffis/loadout`. Rules auto-sync on push.

### C. Vendored assets (the CLI)

```bash
npx github:naffis/loadout init          # detect tools, scaffold, install notify hook, lockfile
npx github:naffis/loadout list          # see everything available (or --installed)
npx github:naffis/loadout add ship-a-feature planning-a-change no-any
npx github:naffis/loadout update        # pull latest, three-way merge (keeps your edits)
npx github:naffis/loadout update --check # dry run; non-zero exit if updates exist (for CI)
npx github:naffis/loadout diff <id>     # upstream vs your local copy
npx github:naffis/loadout doctor        # validate the loadout repo itself
```

What `add` does per type: skills → `.cursor/skills/<id>/`; rules → `.cursor/rules/<id>.mdc`
**and** projected into `CLAUDE.md`; commands → `.cursor/commands/<id>.md` + `.claude/commands/<id>.md`;
agents → `.cursor/agents/<id>.md` + `.claude/agents/<id>.md`; MCP → merged into
`.mcp.json`/`.cursor/mcp.json`; docs/workflows → copied preserving their path. Everything
vendored is tracked in `loadout.lock.json`, so `update` can three-way merge without clobbering
local edits (a true conflict gets markers, never silent data loss).

---

## 4. How the pieces work together

Composition is explicit. Every asset declares (in `registry.json`, and in each skill's
`## Pairs with` section) what it pairs with and which **workflows** it serves. A workflow
(`processes/workflows/<name>.md`) is a named recipe that sequences rules, skills, commands,
and subagents, with optional `gate` (objective check), `stop_condition`, and `state` fields.

**Worked example — `ship-a-feature`:**

1. **Rules in the background** color everything: `no-shortcuts`, `size-limits`, `testing-conventions`, `commit-and-pr-conventions`, `regression-test`.
2. **`planning-a-change`** (skill) — explore, write and stress-test a short plan.
3. Implement, adding tests for new behavior.
4. **`reviewer`** (subagent) checks the diff against the plan in a fresh context — maker ≠ checker.
5. **`writing-commit-messages`** → **`opening-a-pr`** (skills); **`making-a-pr-reviewable`** if the diff is noisy.
6. The `gate` (your test+lint command) must pass before "done."

Other shipped workflows: `fix-ci-until-green`, `cut-a-release`, `onboard-to-codebase`.

**Routing within a workflow** follows the golden rule: the constraints are rules loaded
automatically, the steps are skills, enforcement is a hook, and a separate subagent verifies.
The quality loop is a good mini-example: `reviewing-code-quality` (find issues) →
`refactoring-code` (fix them safely) under the `size-limits` + `refactor-discipline` rules.

---

## 5. Build a feature, end to end

A worked, copy-paste path for landing a non-trivial change with the `ship-a-feature`
workflow.

**Equip the project once.** Adding a workflow doesn't pull in its parts, so vendor the
workflow plus the skills and rules it sequences (its `uses:` block):

```bash
npx github:naffis/loadout add \
  ship-a-feature \
  planning-a-change writing-tests reviewing-and-shipping \
  writing-commit-messages opening-a-pr making-a-pr-reviewable updating-docs \
  no-shortcuts size-limits testing-conventions test-coverage \
  commit-and-pr-conventions regression-test documentation-updates
```

If you use Cursor **Remote Rules**, all rules auto-sync — drop the rule ids and just add the
workflow + skills.

**Invoke it.** You don't call each asset by hand: rules load automatically, and naming the
workflow makes the agent walk its steps. In Cursor (Agent) or Claude Code, paste:

> Follow the `ship-a-feature` workflow to build `<your feature>`.
> Gate: `<your test + lint command>`.
> Done when: tests + lint pass, a reviewer pass finds no correctness/intent gaps, PR opened.

Unsure which workflow fits, or starting cold? Run **`/start`** (or *"I want to build X —
what should I do?"*) and `getting-started` routes you and hands back a kickoff prompt.

**What runs, in order:**

1. **Plan** — `planning-a-change` explores the code and writes a stress-tested plan.
2. **Implement** — smallest safe change first, under the background rules (`no-shortcuts`, `size-limits`, …).
3. **Test** — `writing-tests`; bug fixes get a failing-then-passing test (`regression-test`).
4. **Verify** — run the `gate` (your test + lint command) and show the evidence.
5. **Docs** — `updating-docs` in the same change.
6. **Review (maker ≠ checker)** — dispatch the `reviewer` on the diff vs the plan (*"use the reviewer subagent on this diff"*). In Cursor this is a separate review pass; in Claude Code it's the `reviewer` agent.
7. **Commit & PR** — `writing-commit-messages` → `opening-a-pr` (`making-a-pr-reviewable` first if the diff is noisy).

Set the `gate` to your real command so step 4 is objective. The workflow records progress in
its `state` file, so a resumed run continues cleanly. Other workflows follow the same
pattern: `fix-ci-until-green`, `cut-a-release`, `onboard-to-codebase`.

---

## 6. Authoring and keeping it sharp (self-improving)

loadout is meant to compound — every mistake becomes a permanent guard ("the ratchet").

- **`hardening-the-harness`** (skill) — the ratchet itself: take a real failure and encode a guard in the *right* layer (an `AGENTS.md` line, a rule, a hook, a subagent check, or a skill).
- **`rule-author`** / **`skill-author`** (skills) — scaffold a new rule/skill to loadout's conventions and apply the rule-vs-skill test. `skill-author` enforces the frontmatter contract (gerund name, third-person description, body <500 lines, references one level deep) that `doctor` checks.
- **`learning-from-chats`** (skill) — mine recurring preferences from chats into rules/skills/`AGENTS.md`.
- **Progression:** the [`harness-setup`](../processes/runbooks/harness-setup.md) runbook walks the default → self-improving rungs; [`loop-preflight`](../processes/runbooks/loop-preflight.md) gates before you automate anything.

After authoring, add a `registry.json` entry and run `loadout doctor` (it validates
frontmatter, composition references, orphaned files, and lockfile integrity). CI runs
`doctor` on every push.

---

## 7. See also

- [`catalog.md`](./catalog.md) — one-line reference for every skill, rule, agent, command, workflow, runbook, and template.
- [`external-practices.md`](./external-practices.md) — the Anthropic/Cursor conventions behind the assets.
- [`agent-harness-engineering.md`](./agent-harness-engineering.md) and [`loop-engineering.md`](./loop-engineering.md) — the methodologies loadout is built on.
