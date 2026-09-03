---
description: Verify one named claim with baseline vs treatment; return VERIFIED, NOT VERIFIED, or INCONCLUSIVE. Does not implement.
---

Run the `verifying-a-claim` skill in full. One named claim, pasted evidence,
exactly one verdict. Do **not** implement a fix.

This is not `verifying-session-surfaces` (session inventory), not Cursor
`/review` / `/review-bugbot` / `/review-security` (diff review), not
`root-cause-fix` (already-framed bug).

Do not commit/push/PR unless explicitly asked.

## Process (do not skip)

1. Restate the claim as falsifiable (condition, metric, threshold). Empty →
   `INCONCLUSIVE`.
2. Baseline vs treatment with the same command. Paste evidence. Redact secrets.
3. Exactly one verdict: `VERIFIED`, `NOT VERIFIED`, or `INCONCLUSIVE`.
4. `NOT VERIFIED` hands to `root-cause-fix`.
5. Short report, then **last** — emit this fence and nothing after it:

```text
<root-skill>: <committed leftover + enough context to act>

Specimen: <plan path / issue id — omit if none>
Root node: <file:symbol or layer — omit if wrap>
Class / slice: <siblings or none>
Out of scope: …
Do not implement a proximate patch. Follow the named skill in full.
```

Claim / notes: $ARGUMENTS
