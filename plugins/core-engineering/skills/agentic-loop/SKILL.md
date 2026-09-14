---
name: agentic-loop
description: >
  Run a multi-step coding task as a verified perceive→act→verify loop. Use for "agentic loop", "stop condition", or "maker-checker". Not a full feature cycle (running-a-dev-cycle) or a single bug (debugging-an-issue).
---

# Agentic loop

Connective tissue for a non-trivial task: contract → one unit → verify → record → next. Hand off to the owner skill in the table.

## When to use

Multi-step / long-horizon work · a stop condition you cannot fake · context budget · spawn / parallelize.

| Situation | Use instead |
| --- | --- |
| Full dev cycle, "build this end to end", autonomous mode | `running-a-dev-cycle` |
| Prove a root cause + ship a no-bandaid class fix | `root-cause-fix` |
| A quick everyday bug (red test, typecheck, wrong value) | `debugging-an-issue` |
| Designing the *product's* agent-facing tools / MCP | `agent-tool-design` |
| Running N independent work items at once | `orchestrating-parallel-agents` |
| Splitting one task into pipeline/graph units | `task-topology` → `build-as-graph` (default remains this single loop) |
| Large/ambiguous task needing a written plan first | `create-plan` / `planning-a-change` (or Plan mode) |

## Levers

### 1. Stop condition as a contract

Write it before starting (TodoWrite, scratch, or PR body). Authoring: `references/verification-and-stop-conditions.md`. Outer shippable contract: `definition-of-done.mdc`.

| Field | Weak | Verifiable |
| --- | --- | --- |
| **End state** | "improve X" | "`parseDuration('90m')` returns `5400`; the new case is covered" |
| **Evidence** | "looks done" | "the project's test + typecheck gate exits 0; a new regression test fails on revert" |
| **Constraints** | (unstated) | "no `any`; no public-API change; no new always-on rule" |
| **Budget** | (unbounded) | "stop after N edit-verify cycles; escalate if still red" |

### 2. Independent checker (maker ≠ checker)

Objective ground truth first: project typecheck, affected tests, lint, regression that fails-on-revert (`regression-test.mdc`). Preserve why a check failed. For shippable work, a **fresh** `reviewer` / `security-reviewer` (or Cursor `bugbot` / `security-review`) reads the diff against the contract. See `references/subagents-and-parallelism.md`.

### 3–4. Durable memory + context budget

`TodoWrite` per unit. Long/cross-session: a file a fresh context can resume from. Compact when the window fills. Playbook: `references/context-engineering.md`.

### 5. Git fence

Autonomy is edit-and-verify, never git. **Never climb past unstaged edits** without an explicit ask: no stage, commit, branch, push, or PR (`commit-and-pr-conventions.mdc`).

| Level | Unattended | Human still in the path |
| --- | --- | --- |
| 0 | One turn | Every turn |
| 1 | Investigate + report, no edits | You act on findings |
| 2 | Draft the change; leave **unstaged** | You review every diff |
| 3 | Checker gates the diff before you present | You approve; checker filters |
| 4 | Edit→verify→fix to a green contract | You audit the log + final diff |

## Stop and ask

Still red after the budget, verification impossible to define, or the correct fix needs a scope/architecture decision the user owns — stop. Report what you tried and what's blocking. Do not thrash or ship a bandaid.

Silently committing/pushing because the loop "finished" is forbidden. Leave edits unstaged.

## Pairs with

- skills: `root-cause-fix`, `create-plan`, `planning-a-change`, `reviewing-and-shipping`,
  `post-flight`, `orchestrating-parallel-agents`, `running-a-dev-cycle`, `task-topology`,
  `decompose`, `integrate`
- rules: `no-shortcuts`, `regression-test`, `definition-of-done`
- agents: `reviewer`, `explorer`, `implement-node`
- docs: `agentic-patterns`, `loop-engineering`
- runbooks: `loop-preflight`
- workflows: `run-autonomous-loop`, `plan-then-build`, `run-quality-loop`, `clear-the-queue`,
  `ship-a-feature`, `build-as-graph`
