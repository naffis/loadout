# Flight family — when to use which skill

Single routing table for thoroughness skills. Do not duplicate this table.

## The family

| When                                                                          | Skill                        | Job                                           | Edits?                |
| ----------------------------------------------------------------------------- | ---------------------------- | --------------------------------------------- | --------------------- |
| Mid-session "what's next" / recap + leftover dive — do not implement          | `recommending-next-steps`    | Reconstruct → dive leftover → one next prompt | No                    |
| Seed thought / "deep dive:" / "dig in:" — recommend, do not implement         | `deep-dive`                  | Investigate → committed recommendation        | No                    |
| User approved a shallow fix / "do it correctly" / about to ask "Want me to…?" | `do-it-right`                | Re-diagnose → Chosen Fix → class-kill         | Only after Chosen Fix |
| Mid-session after substantial edits — "are we still doing this right?"        | **`deep-flight`**            | In-flight course-correct                      | Yes — fix drift now   |
| Session wrap — "review everything we did" / "was the fix correct"             | `post-flight`                | Ask-vs-ship + sibling sweep + checker         | Yes — fix findings    |
| Session wrap — "test all the surfaces" / "ensure it works"                    | `verifying-session-surfaces` | Live-surface exercise + root-cause-fix        | Yes — fix BROKEN      |
| Claimed-done vs a written plan (prefer fresh chat)                            | `review-build`               | Adversarial plan/requirement grade            | Blockers/majors       |
| Open plan phases still Partial / Missing / Punted                             | `complete-the-build`         | Exhaust the gap matrix                        | Yes                   |
| Proven class root, implement + regression                                     | `root-cause-fix`             | Loop A/B → implement at pinned layer          | Yes after Loop A      |
| Everyday bug already framed                                                   | `debugging-an-issue`         | Repro → hypotheses → fix → lock               | Yes                   |
| Large named surface, no single known bug — leaks / edge cases / exhaustive    | `hunting-defects`            | Census → hunt classes → refute → report       | No (report)           |

`dig in:` = `deep-dive`. `dig deeper` = `do-it-right`. `deep-flight` is **not**
`deep-dive`. Mid-session recap + leftover dive is `recommending-next-steps`
(`/next-steps`). Last output of diagnose / audit / review is
`_shared/next-prompt.md`. Defect-hunt routing: `hunting-defects/references/family.md`.

## Isolated checker

Do **not** launch a `generalPurpose` Task with the maker's rationalizations.

1. **`flight-checker`** subagent — `readonly: true`, fresh, no `resume`.
2. Native Cursor `/review` / `reviewer` / `/review-bugbot` **in addition**.
3. Same-session degrade cannot yield CLEAN / ON-COURSE.

## Mechanical receipts

```bash
# From a consumer repo that vendored loadout skills:
.cursor/skills/_shared/scripts/shortcut-sweep.sh
# From this loadout checkout:
plugins/core-engineering/skills/_shared/scripts/shortcut-sweep.sh
```

Quote the `RECEIPT` block. A sweep with no receipt is skipped work.
