---
name: review-build
description: >
  Review implemented work against the plan with evidence. Use for "review the build" or "did we build what we planned".
---

# Review a build

Adversarial check of a claimed-done implementation. Prefer a fresh chat
(maker ≠ checker). **Fix blockers and majors in the code** — chat-only
critique is a failure. Read `rules/review-build.mdc`. Leave edits **unstaged**.

## Workflow

### 1. Ground truth

```bash
git status && git diff <base>...HEAD && git diff
```

Review the diff, not memory.

### 2. Trace the plan or original request

Map every requirement / plan step to file:line. Fix or justify deviations.
No written plan → original ask + in-session ACs. Material **Partial /
Missing / Punted** rows → **stop**, hand off to `complete-the-build`.

### 2b. TASK.md allowlist (when a task graph exists)

If `.loadout/tasks/<slug>/TASK.md` (or plan topology) declares unit
allowlists: slice `git diff` per unit. **PASS** only if every edited path
is ⊆ that unit's allowlist (contract file read-only). Breaches are
**blockers** — revert or record a topology amendment. Shared-contract
disagreement → `integrate` spec review. Skip when no TASK.md exists.

### 3–4. Sweep, checker, gates

```bash
.cursor/skills/_shared/scripts/shortcut-sweep.sh
```

Quote the `RECEIPT`. Launch **`flight-checker`** (`readonly`, no
`resume`). Same-session self-grade cannot yield PASS. Run every check
`AGENTS.md` / CI / the plan names; **paste output**. Fail → fix and
re-run. **Blocker** / **major**: fix in code now. **Minor**: cheap or log.

### 5. Final report

```markdown
# Build review: <change name>

## Verdict
PASS | PASS WITH NOTES | FAIL

## Requirement / plan trace
| Requirement or plan step | Implemented at | Status |
| ------------------------ | -------------- | ------ |

## Unit boundaries (if task graph)
| Unit | Allowlist | Diff paths outside allowlist | Status |
| ---- | --------- | ---------------------------- | ------ |

## Deviations from plan

## Shortcut sweep hits → fixed or justified

## Commands run
| Command | Outcome |
| ------- | ------- |

## Findings found → fixed

## Left open (with reason) — or "none"
```

## Pairs with

- skills: `review-plan`, `create-plan`, `complete-the-build`, `post-flight`, `reviewing-and-shipping`,
  `deslopping`, `simplifying-code`, `writing-tests`, `reviewing-code-quality`,
  `task-topology`, `integrate`
- rules: `review-build-rule`, `no-shortcuts`, `definition-of-done`,
  `regression-test`, `testing-conventions`, `implement-node-rule`
- agents: `flight-checker` (required), `reviewer`, `security-reviewer`,
  `implement-node`
- refs: `_shared/plan-build-family.md`, `_shared/scripts/shortcut-sweep.sh`
- commands: `plan` (`/plan`), `review-plan-cmd` (`/review-plan`), `complete-the-build-cmd` (`/complete-the-build`),
  `review-build-cmd` (`/review-build`), `post-flight-cmd` (`/post-flight`)
- workflows: `plan-then-build`, `ship-a-feature`, `run-autonomous-loop`, `build-as-graph`
