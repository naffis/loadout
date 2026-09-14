---
name: complete-the-build
description: >
  Exhaust remaining plan gaps until the matrix is empty, then hand off to review-build. Use for "complete the build", "finish the plan", or "close the gaps".
---

# Complete the build

Build to an **empty gap matrix**. Do not invent scope. Prefer this **before** `review-build` whenever any phase is Partial, Missing, or Punted.

Anti-triggers: no gap inventory → keep implementing then `review-build` · claimed-done → `review-build` · session wrap → `reviewing-and-shipping` · release go/no-go → `assessing-release-readiness` · no plan → `create-plan` / `review-plan` · mid-build course-correct → `deep-flight` · wrap + sibling hunt → `post-flight`.

Read `rules/complete-the-build.mdc` and `references/gap-matrix.md`. Matrix **before any code**. No plan + no named ACs → ask (or `create-plan`); do not invent an exhaustion pass. No commit/push/PR unless asked.

## Workflow

### 1. Ground truth

```bash
git status
git diff <base>...HEAD
git diff
```

Locate the plan (user path, `.cursor/plans/`, `PLAN.md`, `docs/plans/`). Re-read it. Read `DECISIONS.md` / parking-lot / open todos if present.

### 2. Gap inventory (mandatory — no edits yet)

Produce the matrix from `references/gap-matrix.md`. Rows: every phase/task, every AC, applicable `definition-of-done.mdc` rows, in-scope Discovered Issues / Future Improvements, **deferral inventory** (`references/deferral-taxonomy.md`).

Status: `Done` | `Partial` | `Missing` | `Punted` | `Out-of-scope` (with reason). Print the matrix **before** the build loop.

Already empty → hand off to `review-build`. Do not invent work.

### 3. Work queue

P0 correctness/security/data-loss → missing ACs → Partial/Punted → tests/DoD/docs/observability for in-scope behavior.

Ban inventing scope. Ban "skip for now" without a **survivor** row (`references/deferral-taxonomy.md`).

### 4. Build

One open row at a time. Implement against the plan. Verify via `references/phase-verify.md`. Mark `Done` with file:symbol. Update the living plan as you go.

### 5. Completeness re-pass

Rebuild the matrix from evidence (not the previous copy). Quote shortcut-sweep RECEIPT:

```bash
.cursor/skills/_shared/scripts/shortcut-sweep.sh
```

Walk applicable DoD rows. Run project gates and **paste output**. Fix until clean.

### 6. Convergence

Repeat steps 4–5 until **two consecutive** re-passes show zero `Partial` / `Missing` / `Punted` (survivors only per taxonomy).

Stop and ask if: same error 3+ times · fixes break each other · an AC needs architecture not in the plan · unresolved security · about to destroy unrecoverable data.

### 7. Completion report + handoff

```markdown
# Build completion: <change name>

## Verdict

COMPLETE | COMPLETE WITH SURVIVORS | INCOMPLETE

## Gap matrix (final)

| #   | Plan item | Status | Location | Verified how |
| --- | --------- | ------ | -------- | ------------ |

## Built this pass

- …

## Survivors (or "none")

| Item | Survivor criterion | Logged at |
| ---- | ------------------ | --------- |

## Commands run

| Command | Outcome |
| ------- | ------- |

## Next

Ready for `review-build` (prefer a **fresh chat** — maker ≠ checker).
```

Edits stay unstaged unless the user asked to commit.

## Never do

- Code before the first gap matrix is published; invent scope; silent deferrals without a survivor
- Jump to `review-build` while open rows remain; claim COMPLETE from memory
- Commit/push/PR unless explicitly asked

## Pairs with

- skills: `review-build`, `post-flight`, `create-plan`, `review-plan`,
  `agentic-loop`, `writing-tests`, `updating-docs`
- rules: `complete-the-build-rule`, `no-shortcuts`,
  `definition-of-done`, `regression-test`
- commands: `complete-the-build-cmd` (`/complete-the-build`), `review-build-cmd`
  (`/review-build`)
- workflows: `plan-then-build` (between implement and `review-build`)
