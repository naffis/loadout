---
name: verifying-a-claim
description: >
  Verify one named claim with baseline vs treatment evidence and return exactly
  one verdict: VERIFIED, NOT VERIFIED, or INCONCLUSIVE. Triggers on "verify
  this claim", "/verify-claim", baseline vs treatment, a single falsifiable
  assertion. Does not implement a fix. Anti-triggers: "test all the surfaces"
  / "prove this session works" → verifying-session-surfaces; diff code-review
  → native /review / /review-bugbot / /review-security; root-cause on an
  already-framed bug → root-cause-fix.
---

# Verifying a claim

Prove or disprove **one named claim** with repeatable evidence. Not a recap.
Not a session-surface inventory. Not a diff review.

## Trigger

The user names a single claim to check: "verify this claim: …", `/verify-claim`,
or a baseline vs treatment comparison.

Do **not** use this for "prove it works", "test all the surfaces", or
"prove this session works" — those are `verifying-session-surfaces`.
Do **not** use this for code-review of a diff — that is Cursor `/review`,
`/review-bugbot`, or `/review-security`.

## Neighbors

| Ask | Use instead |
| --- | --- |
| Session-wide inventory ("test all the surfaces") | `verifying-session-surfaces` |
| Diff / PR review | `/review` / `/review-bugbot` / `/review-security` |
| One framed bug, no named claim | `root-cause-fix` |
| UX heuristics | `reviewing-ui` |

## Workflow

1. Restate the claim as falsifiable: condition, metric, threshold. Empty or
   unfalsifiable → `INCONCLUSIVE` plus what evidence is missing. Do not invent
   a pass.
2. Pick the smallest local surface that can disprove it.
3. Capture **baseline** (old state) and **treatment** (changed state) with the
   same command, data, and environment.
4. Compare raw artifacts. Paste evidence. Redact secrets.
5. Return exactly one verdict.

## Verdicts

- `VERIFIED`: baseline and treatment differ in the predicted direction, by
  the claimed threshold, with no obvious confound.
- `NOT VERIFIED`: unchanged, moves the wrong way, or misses the threshold.
- `INCONCLUSIVE`: no valid baseline, noisy signal, failed measurement, or
  an environment difference invalidates the comparison.

## Output

```text
VERIFIED | NOT VERIFIED | INCONCLUSIVE
Claim: <falsifiable claim>

Evidence:
<metric/artifact>: baseline=<...>, treatment=<...>, delta=<...>, threshold=<...>

Reasoning:
<one tight paragraph naming the evidence and any confounds>
```

Do not soften `NOT VERIFIED`. Do not implement a fix. `NOT VERIFIED` hands
to `root-cause-fix`.

Keep evidence inline unless the user asks to write files.

## Next prompt

Last output: a `_shared/next-prompt.md` fence. Nothing after the closing fence.

- `NOT VERIFIED` → `root-cause-fix:`
- `VERIFIED` / `INCONCLUSIVE` → wrap or the user's next named skill

## Guardrails

- One claim, one verdict. No inventory table.
- No secrets, tokens, or PII in evidence.
- No production or unasked paid runs.
- Leave edits unstaged (`git-safety`).

## Pairs with

- skills: `verifying-session-surfaces`, `root-cause-fix`
- rules: `no-shortcuts`, `ui-evidence`
- commands: `verify-claim-cmd` (`/verify-claim`)
- workflows: `ship-a-feature`, `plan-then-build`
- refs: `_shared/next-prompt.md`
