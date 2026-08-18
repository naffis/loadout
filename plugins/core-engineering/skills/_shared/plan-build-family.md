# Plan-build family — when to use which skill

Routing for plan → exhaust → grade. Do not duplicate this table in each
SKILL.md — link here.

Owning rationale: `docs/dev/plan-build-family.md`.
Thoroughness gates after code starts: `_shared/flight-family.md`.

## The family

| When                                             | Skill                    | Job                                                    | Edits?              |
| ------------------------------------------------ | ------------------------ | ------------------------------------------------------ | ------------------- |
| Seed thought / "deep dive:" — no plan requested  | `deep-dive`              | Recommend, do not plan                                 | No                  |
| Thorough plan-only artifact (`/plan`)            | **`create-plan`**        | Repo + external research → CreatePlan + research `.md` | Plan artifacts only |
| Existing plan needs a hard review                | **`review-plan`**        | Fresh research, pre-mortem, rewrite plan               | Plan artifacts only |
| Light explore-then-build (one short plan)        | `planning-a-change`      | Sketch + implement                                     | Yes after plan      |
| Open plan rows Partial / Missing / Punted        | **`complete-the-build`** | Gap matrix → build to empty                            | Yes                 |
| Claimed-done vs written plan (prefer fresh chat) | **`review-build`**       | Adversarial plan/requirement grade                     | Blockers/majors     |
| Mid-build course-correct                         | `deep-flight`            | Layer + RECEIPT + `flight-checker`                     | Yes — fix drift     |
| Session wrap + sibling hunt                      | `post-flight`            | Ask-vs-ship + checker                                  | Yes                 |

`create-plan` delivery ≠ permission to code. Wait for **Build** or an explicit
implement ask. If a build missed the intent: **revert, refine the plan,
rebuild** (Cursor Plan Mode) — do not patch a drifted agent.

## Why this is not more checklist prose

2026 Cursor Plan Mode: clarify → research repo → reviewable plan → you edit →
Build. Planner-Worker-Judge: a Judge verifies done-conditions that workers
self-report. Same class as the flight family — long self-graded "be thorough"
passes get skimmed.

| Gate                 | Failure it catches                                             |
| -------------------- | -------------------------------------------------------------- |
| `create-plan`        | Write-only `.md` (no Build UI); TBD; unsourced "best practice" |
| `review-plan`        | Rubber-stamp; chat-only critique; stale CreatePlan             |
| `complete-the-build` | Reviewing/shipping while rows are still open                   |
| `review-build`       | Maker memory as ground truth; sweep without RECEIPT            |

## Isolated checkers

| Gate                                        | Checker                                                           |
| ------------------------------------------- | ----------------------------------------------------------------- |
| `create-plan` / `review-plan`               | **`plan-checker`** (`readonly`) — plan files, not maker rationale |
| `review-build` / `complete-the-build` prove | **`flight-checker`** and/or native `/review`                      |

A `generalPurpose` Task fed the maker's story is not a checker. Same-session
degrade cannot yield APPROVED / PASS / COMPLETE.

## Mechanical receipts

```bash
# Plan artifacts (TBD / defer / "figure out during"):
.cursor/skills/_shared/scripts/plan-ban-sweep.sh .cursor/plans/<file>.md

# Implementation diffs:
.cursor/skills/_shared/scripts/shortcut-sweep.sh
```

Quote the `RECEIPT` block. No receipt = skipped work.
