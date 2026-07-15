# loadout

The kit you equip for a mission. `loadout` is the single source of truth for Claude
Code skills and Cursor rules, plus the docs, processes, and project scaffolds that go
with them. New projects pull from it, you push improvements back, and existing projects
pick up updates on a schedule.

Skills and rules are designed to **compose into named workflows** that get real work
done — not sit as an unordered pile.

> **Status: functional.** The CLI (`init`, `add`, `list`, `update`, `diff`, `doctor`) is
> implemented with a lockfile and three-way merge. The library is general-purpose: 2
> Claude Code plugins (42 skills, 6 commands, 4 subagents), 29 Cursor rules, 13 workflows, 6
> runbooks, and templates — generalized from practice and sanitized for public use.
> Domain/vertical-specific assets are intentionally left out. See
> `docs/external-practices.md`, `docs/agentic-patterns.md`, and `docs/loop-engineering.md`
> for the conventions and patterns behind them.

## Quick start

**Agents:** if the user pastes this repo and says *use this* or *update to latest*,
follow **[`INSTALL.md`](./INSTALL.md)** (skill mirror: `equipping-loadout`).

Install into any project, then pull in what you need:

```bash
cd your-project
npx github:naffis/loadout init                       # detect Cursor/Claude, scaffold dirs, lockfile, notify hook
npx github:naffis/loadout list                       # browse available skills, rules, docs, and workflows
npx github:naffis/loadout add start getting-started ship-a-feature no-any  # or follow INSTALL.md for the full starter
```

Then open the project in **Cursor** or **Claude Code** and use it:

- **Rules** (e.g. `no-any`) apply automatically — the agent follows them on every edit.
- **Skills** load on demand — ask in plain language ("plan a change", "fix CI"), or run
  **`/start`** to have loadout clarify the goal, pick the right workflow, and hand you a
  ready-to-run kickoff prompt.
- **Commands** for the plan→review→build loop: **`/plan`**, **`/review-plan`**,
  **`/review-build`** (prefer review commands in a fresh chat when stakes are high).
- **Workflows** (e.g. `ship-a-feature`, `plan-then-build`) compose rules, skills, and
  subagents into one named recipe.

Pull upstream improvements anytime — local edits are preserved via a three-way merge:

```bash
npx github:naffis/loadout update                     # merges updates; conflicts shown as markers, never silent
```

Prefer native distribution (Claude Code plugins / Cursor Remote Rules) instead of
vendoring? See [Consuming loadout](#consuming-loadout) below.

## Documentation

- **[INSTALL.md](./INSTALL.md)** — agent contract for *use this* / *update to latest*.
- **[docs/usage.md](./docs/usage.md)** — how to install loadout, how each asset type loads and how you invoke it, and how the pieces compose. Start here.
- **[docs/catalog.md](./docs/catalog.md)** — one-line reference for every skill, rule, subagent, command, workflow, runbook, and template, with how to call each.
- **[docs/external-practices.md](./docs/external-practices.md)** — the Anthropic/Cursor authoring conventions behind the assets.
- **[docs/agentic-patterns.md](./docs/agentic-patterns.md)** — the 2026 agentic-coding pattern catalog (context engineering, evaluator-optimizer, subagents, spec-driven, tool design, root-cause) mapped to the assets that encode each.
- **[docs/agent-harness-engineering.md](./docs/agent-harness-engineering.md)** and **[docs/loop-engineering.md](./docs/loop-engineering.md)** — the methodologies loadout is built on.

## Three distribution layers

| Layer | Covers | Mechanism |
|---|---|---|
| **A. Claude Code plugins** | skills, commands, subagents, hooks, MCP configs | native plugin marketplace (`.claude-plugin/marketplace.json`) |
| **B. Cursor rules + skills** | `.mdc` rules, `SKILL.md` skills | Cursor Remote Rules + shared `SKILL.md` |
| **C. Vendored assets** | docs, processes, workflows, scaffolds, `AGENTS.md`, MCP merges | the `loadout` CLI + per-project lockfile |

`SKILL.md` is the portable unit — the same skill folder serves both Claude Code (via a
plugin) and Cursor (via `.cursor/skills/`).

## Consuming loadout

**Claude Code plugins:**

```bash
/plugin marketplace add naffis/loadout
/plugin install core-engineering@loadout
/plugin install meta@loadout
/plugin update core-engineering
/plugin marketplace update
```

**Cursor rules (Remote Rules, one time per machine):**

> Settings → Rules and Commands → Remote Rule (GitHub) → paste
> `https://github.com/naffis/loadout`, pointed at `rules/`. Rules auto-sync on push.

**Vendored assets (CLI):**

```bash
npx github:naffis/loadout init        # bootstrap a project (detect tools, hook, lockfile)
npx github:naffis/loadout add <id>    # vendor an asset into this project
npx github:naffis/loadout list        # show available assets
npx github:naffis/loadout update      # pull latest, three-way merge managed assets
npx github:naffis/loadout doctor      # validate manifests, frontmatter, lockfile
```

Pin consumers to release tags, not `main` — e.g. `npx github:naffis/loadout#v0.12.0 update`.

## CLI commands

| Command | Purpose |
|---|---|
| `loadout init` | Bootstrap a project: detect Cursor/Claude, scaffold dirs, install the SessionStart notify hook, write `loadout.lock.json` |
| `loadout add <id...>` | Vendor assets into a project (rules → `.cursor/rules` + projected into `CLAUDE.md`; skills → `.cursor/skills`; MCP merged into `.mcp.json`/`.cursor/mcp.json`) |
| `loadout list [--installed]` | Show available assets, or what is installed locally (with drift flags) |
| `loadout update [--check]` | Pull latest and three-way merge managed assets; `--check` is a dry run that exits non-zero if updates exist |
| `loadout diff <id>` | Show upstream vs local for one asset |
| `loadout doctor` | Validate manifests, frontmatter, composition refs, orphaned files, and lockfile integrity |

There is no `build` command. Nothing is generated; the manifests are hand-maintained
and `doctor` catches mistakes.

### Keeping projects up to date

- **Cursor rules** auto-sync via Remote Rules — nothing to do.
- **Claude Code plugins**: set `autoUpdate: true` in `.claude/settings.json` (best-effort
  in this Claude Code version), and rely on the SessionStart notify hook to prompt
  `/plugin update` once per day. Pin to release tags, not `main`.
- **Vendored assets**: run `loadout update` per project, or schedule `loadout update --check`
  in CI to open an update PR when drift exists.

## Updates never clobber local edits

The CLI tracks vendored copies in `loadout.lock.json`, recording a `baseHash` (upstream
at install) and `localHash` (the file as written). On `loadout update`, a `diff3`-style
three-way merge applies upstream changes while preserving local edits, and surfaces
conflicts as markers rather than silently discarding either side.

## Security: review skills before you install

Skills and rules are instructions an agent will follow, so an installed asset is part of
your trust boundary — a malicious instruction can hide in a description ("skills as
injection vectors"). Before installing:

- Read the `SKILL.md`/`.mdc` you are vendoring, not just its name.
- Pin to a release tag and review the diff on `loadout update`.
- Check `provenance` in `registry.json` when present (harvest date / origin notes).

`loadout doctor` runs an injection-pattern lint over `SKILL.md`/`.mdc` (prompt-injection
phrases, pipe-to-shell, hardcoded credentials, env-var exfiltration) and warns on matches.
It is a backstop, not a substitute for reading what you install.

## Development

```bash
npm install          # installs deps and builds (via `prepare`)
npm run build        # tsc -> dist/
npm run doctor       # node dist/index.js doctor
npm run dev -- doctor # run the TS source directly via tsx
```

The CLI source lives in [`cli/`](./cli) and compiles to `dist/`.

## Repository layout

```
INSTALL.md                         # agent contract: use this / update to latest
.claude-plugin/marketplace.json   # plugin catalog (hand-maintained)
plugins/<plugin>/                  # Claude Code plugins; skills live here
rules/<rule>.mdc                   # Cursor rules (flat, for Remote Rules)
docs/                              # reference docs (vendored)
processes/runbooks/                # checklists, operational procedures
processes/workflows/               # named recipes that compose assets
templates/                         # AGENTS.md, CLAUDE.md, config starters
hooks/check-plugin-updates.sh      # SessionStart update notify hook
cli/                               # the loadout CLI source
registry.json                      # CLI vendoring index + composition metadata
```

## License

MIT
