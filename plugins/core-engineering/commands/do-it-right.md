---
description: Dig deeper before fixing — re-diagnose, multi-issue hunt, ≥2 solutions, class-kill (no bandaids).
---

Run the `do-it-right` skill in full. The user approved a fix (or asked to do it
correctly). Do **not** implement the first proposal.

Treat the prior diagnosis as DRAFT. Re-diagnose with ≥3 hypotheses, hunt for
additional issues, score ≥2 real solutions, reject proximate/heuristic
bandaids, print Chosen Fix, then implement via `root-cause-fix` or
`debugging-an-issue` (or inline for product SoT fixes). Prove with a class-pinning
regression.

## Process (do not skip)

1. Frame — symptom, prior draft, trigger vs class.
2. Re-diagnose — `references/diagnosis-gate.md` (no production edits).
3. Solutions — `references/solution-gate.md`; Chosen Fix before edits.
4. Implement — owning skill / class-kill at correct layer.
5. Prove — regression + inverse + DoD.
6. Do-it-right report.
7. Last — emit this fence and nothing after it. A `## Next` sentence is
   incomplete:

```text
deep-flight: <Chosen Fix + enough context to act>

Specimen: <plan path / issue id — omit if none>
Root node: <file:symbol or layer — omit if a plan>
Class / slice: <siblings or smallest validating slice>
Out of scope: …
Do not implement a proximate patch. Follow the named skill in full.
```

Do not commit/push/PR unless explicitly asked.

Issue / prior proposal: $ARGUMENTS
