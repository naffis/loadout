---
description: Investigate a seed until one committed recommendation — do not implement.
---

Run the `deep-dive` skill in full. The user wants the **best solution** to
the underlying problem, not a fix in this turn.

This is not `do-it-right` (implement after Chosen Fix) and not
`recommending-next-steps` (session recap). Do **not** edit production code.

## Process (do not skip)

1. Frame the seed — idea / feature / bug / problem. Underlying problem first.
2. Investigate repo then world. Force real alternatives. One self-critique.
3. Commit one recommendation. Kill criteria. Out of scope.
4. One self-review pass, then the deep-dive report.
5. Last — emit this fence and nothing after it. A `## Next` sentence is
   incomplete:

```text
create-plan: <committed recommendation + enough context to act>

Specimen: <plan path / issue id — omit if none>
Root node: <file:symbol or layer — omit if a plan>
Class / slice: <siblings or smallest validating slice>
Out of scope: …
Do not implement a proximate patch. Follow the named skill in full.
```

Do not commit/push/PR unless explicitly asked.

Seed / notes: $ARGUMENTS
