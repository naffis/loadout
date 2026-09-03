---
description: Exhaustive defect hunt over a large named surface — census, waves, refute, report.
---

Run the `hunting-defects` skill in full. There is **no single known bug**.
Review the named surface as if missing an issue is the failure.

Do **not** use `reviewing-and-shipping` (that is a diff wrap). Do **not**
sample a handful of files and call it done. Quote the `census.sh` RECEIPT.
Partition into waves of 25–40 files. Refute every candidate. Sibling-sweep
promoted findings.

Default is **report only**. Implement only if the user said "and fix" — then
`do-it-right` on Critical/High.

## Process (do not skip)

1. Frame surface + classes + FIX vs REPORT. Read `references/project-overlay.md` if present.
2. Census — `.cursor/skills/hunting-defects/scripts/census.sh` (quote RECEIPT;
   completeness = `review:` files, not docs/css).
3. Waves per `references/wave-protocol.md` — print the file list, partial
   findings after each wave. `explorer` / `explore` + `hunter-brief.md` when a
   wave ≥ 15.
4. Hunt — lifecycle (explain every imbalance delta>0) + failure-paths +
   `class-seed-sweep.sh` + concurrency slice table.
5. Refute-or-promote. No missing-path sentence → speculative. Never Critical.
6. Sibling sweep — callers and entry points first.
7. Report + required `reviewer`/`/review` before CLEAN or Critical/High.
8. Last — emit this fence and nothing after it. A `## Next` sentence is
   incomplete:

```text
do-it-right: <Critical/High class + enough context to act>

Specimen: <plan path / issue id — omit if none>
Root node: <file:symbol or layer — omit if a plan>
Class / slice: <siblings or smallest validating slice>
Out of scope: …
Do not implement a proximate patch. Follow the named skill in full.
```

Do not commit/push/PR unless explicitly asked.

Surface / notes: $ARGUMENTS
