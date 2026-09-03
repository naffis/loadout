# Defect-hunt family — when to use which skill

Single routing table. Do not duplicate in each SKILL.md — link here.

Owning rationale: `docs/defect-hunt-family.md` in the loadout checkout
(`doc-defect-hunt-family`). Consumers may keep a longer copy under
`docs/agents/`. Routing table below is the skill SoT.

## The family

| When                                                                           | Skill                                 | Job                                                        | Edits?               |
| ------------------------------------------------------------------------------ | ------------------------------------- | ---------------------------------------------------------- | -------------------- |
| Large named surface, no single known bug — "hunt defects", "exhaustive review" | **`hunting-defects`**                 | Census → partition → hunt classes → refute → sibling sweep | No (report)          |
| Leaks / listeners / timers / streams / money latch                             | `auditing-resource-lifecycle`         | Acquire vs release on every path                           | No (report)          |
| Empty / error / timeout / cancel / retry / park / fail-closed                  | `walking-failure-paths`               | Exhaustive failure-path walk                               | No (report)          |
| Diff vs trunk, about to wrap                                                   | `reviewing-and-shipping`              | Behavior-changing risk in the working tree                 | No unless asked      |
| Maintainability only (size, nesting, names)                                    | `reviewing-code-quality`              | Health grade                                               | No                   |
| Known symptom, diagnose / fix                                                  | `debugging-an-issue` / `root-cause-fix` | Proven cause                                             | Yes after proof      |
| Runtime logs / staging / prod, no local repro                                  | `debugging-with-observability`        | Correlation ids → logs                                     | No                   |
| Session wrap of _this_ work                                                    | `post-flight`                         | Sibling sweep + fix                                        | Yes                  |
| User asked to fix hunt findings                                                | `do-it-right` then `root-cause-fix`   | Class-kill                                                 | Yes after Chosen Fix |

## Completeness contract

Do **not** say "I reviewed the package" without:

1. Quoted `census.sh` RECEIPT (`review:` files).
2. Wave log covering every `review:` file.
3. Refute table for every candidate (promote / kill / speculative).
4. Lifecycle imbalance lines explained (every delta>0).
5. `reviewer` or `/review` before SURFACE CLEAN or Critical/High.

Mechanical receipts the agent must quote (cannot fake in prose):

```bash
.cursor/skills/hunting-defects/scripts/census.sh <path...>
.cursor/skills/hunting-defects/scripts/class-seed-sweep.sh <path...>
.cursor/skills/auditing-resource-lifecycle/scripts/lifecycle-sweep.sh <path...>
.cursor/skills/walking-failure-paths/scripts/failure-path-sweep.sh <path...>
```

## Isolated checker

A hunt report that claims `SURFACE CLEAN` or any Critical/High **must** be
re-read by `reviewer` (readonly) or native `/review` before treating the list
as SoT. Same-session self-grade cannot raise speculative → proven and cannot
certify CLEAN.

## Project overlay

Consumer-owned, not in loadout. Survives `loadout update` as an extra file:

`.cursor/skills/hunting-defects/references/project-overlay.md`

Copy from [`overlay-template.md`](overlay-template.md). Extra grep seeds:
`references/project-seed-patterns.txt` (tab-separated `id<TAB>regex`).
