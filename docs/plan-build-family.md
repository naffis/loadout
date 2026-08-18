# Plan-build family — 2026 planning + verify

Owning doc for `create-plan`, `review-plan`, `complete-the-build`, and
`review-build`. Routing: `.cursor/skills/_shared/plan-build-family.md`.

## Problem

Same class as the flight family: thoroughness as **long self-graded prose**.
`review-plan` Pass 5 was literally "think deeply / 100% sure" — models skim it.
`create-plan` buried a 100-line template in the skill body. `review-build` and
`complete-the-build` claimed greps without receipts and hoped a "fresh chat"
would appear.

## State of the art (2026-08-17)

| Source                                                           | Takeaway                                                                                                                                      |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| [Cursor Plan Mode](https://cursor.com/docs/agent/plan-mode)      | Clarify → research repo → editable plan → Build. Save to workspace. If the build misses, **revert + refine the plan + rebuild**, don't patch. |
| [Cursor Subagents / verifier](https://cursor.com/docs/subagents) | Isolated Judge: agents mark incomplete work done                                                                                              |
| Planner-Worker-Judge (2026 long-running agents)                  | Done-conditions are testable; Judge must not be the Worker                                                                                    |
| Flight family (this repo)                                        | Scripts + readonly checker; no more checklist theater                                                                                         |

## What shipped

1. Slim `create-plan` — template → `references/plan-template.md`; official
   clarify-first step; `plan-ban-sweep` + `plan-checker`.
2. `review-plan` Pass 5 is **mechanical** (RECEIPT + `plan-checker`), not
   "be thorough again". Rule no longer duplicates the 150-line workflow.
3. `complete-the-build` / `review-build` quote `shortcut-sweep.sh`;
   `review-build` requires `flight-checker` (or `/review`).
4. Shared routing `_shared/plan-build-family.md`.

Loadout ships the generalized copies (`naffis-coding-loadout`).
