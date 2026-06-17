# loadout catalog

Every asset, what it's for, and how to invoke it. Hand-maintained; run `loadout list` for
the live index and `loadout list --installed` for what's in a project. See
[`usage.md`](./usage.md) for how each type loads.

**Calling, in short:** skills → auto-trigger on a matching request, or `/skill-name` (Claude
Code); rules → load by their mode (see each below); subagents → "use the `<name>` subagent";
command → `/changelog`.

---

## Skills (28)

### Getting started (start here)
| Skill | What / when | Call |
|---|---|---|
| `getting-started` | Route a goal to the right workflow + supporting skills/rules, decide manual vs loop, and emit a ready-to-run kickoff prompt. | "I want to build X, what should I do?" / new to a repo |

### Shipping & pull requests
| Skill | What / when | Call |
|---|---|---|
| `planning-a-change` | Explore → plan → implement a non-trivial change. Before multi-file/unfamiliar work; skip one-liners. | `/planning-a-change` or describe a multi-file task |
| `reviewing-and-shipping` | Review the branch for correctness & intent, run tests, commit, open/update PR. | when wrapping up a change |
| `writing-commit-messages` | Conventional-commit message from a diff. | when committing / "write a commit message" |
| `opening-a-pr` | Branch → push → PR with a validation-first description. | when turning work into a PR |
| `making-a-pr-reviewable` | Tidy history, sharpen description, add reviewer guidance (no behavior change). | before review on a noisy/large PR |
| `rebasing-a-branch` | Rebase onto base with semantic conflict review and `--force-with-lease`. | when a branch is behind |
| `triaging-review-feedback` | Bucket unresolved PR comments into a plan and address them. | when a PR has open threads |
| `assessing-release-readiness` | Go / no-go assessment (gates, risk, rollback). | before promoting / releasing |

### Debugging & CI
| Skill | What / when | Call |
|---|---|---|
| `debugging-an-issue` | Evidence-first root-cause loop (expected vs actual, repro, falsify, fix, regression test). | a non-obvious bug/failure |
| `fixing-ci` | Find failing checks, classify (env/flake/real), fix the root cause. | red PR checks / failing build |
| `triaging-flaky-tests` | Diagnose non-determinism with evidence; real fix, not retries. | a test that passes/fails randomly |

### Testing
| Skill | What / when | Call |
|---|---|---|
| `writing-tests` | Effective tests for new/changed code — behavior, edge & error paths, right level, boundary-only doubles. | adding a feature / working test-first / filling a gap |
| `improving-test-coverage` | Raise coverage meaningfully (branches & critical paths), set a diff-coverage gate, no gaming. | low/unmeasured coverage, hardening a module, CI setup |

### Code quality & refactoring
| Skill | What / when | Call |
|---|---|---|
| `reviewing-code-quality` | Maintainability audit: oversized files/functions, nesting, duplication, leaky boundaries, dead code, naming. | assess code health / before a big merge |
| `refactoring-code` | Behavior-preserving refactor behind a test net, in small reviewable moves. | improving structure of existing code |
| `deslopping` | Remove AI-generated slop from a branch diff (no behavior change). | after generating code, before review |

### Dependencies & data
| Skill | What / when | Call |
|---|---|---|
| `reviewing-dependencies` | Audit outdated deps; review version-bump PRs for breaking changes. | dependency reports / bump PRs |
| `writing-a-migration` | Safe, reversible, expand/contract DB migration. | schema change or backfill |

### Documentation (keep docs current with code)
| Skill | What / when | Call |
|---|---|---|
| `updating-docs` | Find & update every doc surface a change touches (README, API, docstrings, config, changelog), in the same change. | whenever a change alters behavior/API/config/process |
| `writing-an-adr` | Record a significant decision as a short ADR (context/decision/consequences/alternatives). | a significant or hard-to-reverse choice |
| `auditing-doc-freshness` | Sweep for drift — dead links, renamed symbols, stale commands/examples — and fix/flag. | before a release, after a refactor, periodically |

### Reporting
| Skill | What / when | Call |
|---|---|---|
| `summarizing-my-work` | Ad-hoc status note from authored commits over any window. | "what did I get done" / standup |
| `weekly-review` | Structured weekly synthesis (net-new / bugfix / tech-debt + themes). | weekly recap / retro |

### Meta — keep loadout itself sharp (plugin: `meta`)
| Skill | What / when | Call |
|---|---|---|
| `hardening-the-harness` | "The ratchet": turn a real failure into a permanent guard in the right layer. | after a mistake you don't want again |
| `skill-author` | Scaffold a SKILL.md to conventions; apply the rule-vs-skill test. | creating/restructuring a skill |
| `rule-author` | Scaffold a `.mdc` rule with the right type/frontmatter. | creating/restructuring a rule |
| `learning-from-chats` | Mine recurring preferences from chats → rules/skills/AGENTS.md. | "learn how I work" / capture a correction |

---

## Rules (21)

How a rule loads is set by its frontmatter. You don't usually call rules; they load
automatically (or `@rule-name` for manual ones).

### Always on (kept short — load every request)
| Rule | Gist |
|---|---|
| `no-shortcuts` | No stubs/bandaids/silent fallbacks; fix root causes or state the scope cut. |
| `size-limits` | Files ~<400 (hard ~1000), functions ~<50; extract before sprawl. |
| `regression-test` | Every bug fix ships a test that fails before and passes after. |
| `no-inline-imports` | Imports at module top; no inline/lazy imports. |
| `no-secrets-in-code` | Never hardcode secrets/PII; env/secret store; never log them. |

### Auto-attached by file glob
| Rule | Globs | Gist |
|---|---|---|
| `no-any` | `**/*.ts(x)` | Ban `any`/`@ts-ignore`; `unknown` + narrowing. |
| `no-floating-promises` | `**/*.ts(x)` | Await/return/void+catch; use platform "wait until". |
| `typescript-exhaustive-switch` | `**/*.ts(x)` | `never` default case on unions/enums. |
| `testing-conventions` | test/spec globs | Arrange-Act-Assert; mock only at boundaries. |
| `copy-voice` | `**/*.md(x)` | Human, direct copy; no em-dashes, no filler/hype. |
| `db-migration-safety` | migration globs | Reversible, expand/contract; never reset a remote DB. |
| `docstrings-current` | code globs | In-code docs/docstrings reflect current behavior; comments explain why, not what. |

### Agent-requested (pulled in when relevant)
| Rule | Gist |
|---|---|
| `refactor-discipline` | Behavior-preserving, scoped; test net first; no bundled fixes. |
| `test-coverage` | Coverage is a guide not a goal; cover new code + branches/error paths; pick a floor, don't game it. |
| `observability-first` | Read logs/traces before source; structured logging + correlation IDs. |
| `documentation-updates` | Update the matching doc/changelog/ADR in the same change. |
| `commit-and-pr-conventions` | Conventional commits; validation-first PR descriptions. |
| `prompt-extraction` | Long prompts live in dedicated modules, not inline. |
| `audit-external-skills` | Treat third-party skills/rules/MCP as untrusted; review first. |
| `lockfile-conflicts` | Never hand-merge lockfiles; resolve the manifest, regenerate. |
| `dependency-version-management` | Detect/respect the version manager; don't switch runtimes unasked. |

---

## Subagents (4)

Dispatch with "use the `<name>` subagent". They run in a fresh context and report back.

| Agent | Role |
|---|---|
| `reviewer` | Independent diff review vs stated intent — report gaps, not style. |
| `security-reviewer` | Injection / authz / secrets / unsafe data handling (strong model, high effort). |
| `explorer` | Read-only codebase investigation; returns a tight findings report. |
| `ci-watcher` | Monitor the PR's CI; concise pass/fail with links to failures. |

## Commands (2)

| Command | What |
|---|---|
| `/start` | Shortcut entry point: tell it your goal, get a recommendation + a ready-to-run kickoff prompt (runs `getting-started`). |
| `/changelog` | Draft release notes from merged work since the last tag. |

---

## Workflows (4)

Named recipes (`processes/workflows/`). Each lists the rules/skills/commands/agents it
composes and optional `gate` / `stop_condition` / `state`.

| Workflow | Composes |
|---|---|
| `ship-a-feature` | rules + `planning-a-change` → implement → `reviewer` → `writing-commit-messages` / `opening-a-pr` / `making-a-pr-reviewable`; gate = tests+lint |
| `fix-ci-until-green` | `ci-watcher` → `fixing-ci` / `triaging-flaky-tests` / `debugging-an-issue`; stop = checks green |
| `cut-a-release` | `assessing-release-readiness` → `/changelog` → `multi-plane-deploy`; gate = readiness GO |
| `onboard-to-codebase` | `explorer` + `planning-a-change` |

---

## Runbooks (4) — `processes/runbooks/`

| Runbook | What |
|---|---|
| `harness-setup` | Default → self-improving progression; the ratchet; work backwards from behaviour. |
| `harness-hooks` | The enforcement layer: ready-to-paste `hooks.json` + scripts (format, checks, block-destructive, approval). |
| `loop-preflight` | Gates before automating a loop (4-condition test, 30-second check, Ralph-Wiggum, security tax). |
| `multi-plane-deploy` | Deploy order for an app split across DB / runner / edge / static planes. |

## Templates (5) — `templates/`

| Template | What |
|---|---|
| `template-agents-md` → `AGENTS.md` | Thin cross-tool baseline (stack, commands, conventions, do-nots). |
| `template-claude-md` → `CLAUDE.md` | Claude Code baseline: git-safety, pointer to AGENTS.md, definition-of-done, managed rule block. |
| `template-state-file` → `STATE.md` | Persistent loop/workflow memory across runs. |
| `template-automation-loop` | Automation/loop starter (goal, gate, caps, the loop, scheduling, guardrails). |
| `template-mcp` → `mcp.json` | MCP starter (Context7 + Playwright); merged by key on `add`. |

## Reference docs (`docs/`)

`usage` (this guide's companion), `catalog` (this file), `external-practices` (Anthropic/Cursor
conventions), `loop-engineering`, `agent-harness-engineering`.
