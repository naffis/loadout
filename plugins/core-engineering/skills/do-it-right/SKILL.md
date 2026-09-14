---
name: do-it-right
icon: search
color: purple
description: >
  Re-diagnose before implementing an approved fix. Use for "yes, fix it", "do it correctly", or "dig deeper".
---

# Do it right

Do **not** implement the approved shallow proposal. Gateway — then hand off. `dig deeper` stays here. `dig in:` is `deep-dive`.

## Trigger

"yes, fix it" / "do it correctly" / "dig deeper" / "don't bandaid" / "properly" / user approved a proximate patch. About to ask "Want me to tighten/exclude/carve-out …?" — **stop**, run this instead.

Read `rules/do-it-right.mdc` plus `references/diagnosis-gate.md` and `references/solution-gate.md`. **No production edits** until **Chosen Fix** + **Rejected** are printed. No commit/push/PR unless asked.

## When to use vs neighbours

| Situation                                                              | Skill                                    |
| ---------------------------------------------------------------------- | ---------------------------------------- |
| "Yes / fix it / do it correctly" after a shallow diagnosis or proposal | **This skill** (then handoff)            |
| Proven class root; implement class-kill + regression                   | `root-cause-fix`                         |
| Everyday local bug with clear repro                                    | `debugging-an-issue`                     |
| Investigate only, no fix commitment                                    | `debugging-with-observability`           |
| Seed thought / "deep dive:" / "dig in:" (recommend, don't implement)   | `deep-dive`                              |
| Mid-build after Chosen Fix — still on the class path?                  | `deep-flight`                            |
| Session wrap / shipping checklist                                      | `reviewing-and-shipping` / `post-flight` |

## Workflow

### Phase 0–2 — Frame, diagnose, choose (no edits)

Hold: **Symptom** · prior proposal as `DRAFT — not committed` · trigger ≠ class root. Run `references/diagnosis-gate.md` then `references/solution-gate.md` — do not reprint them.

**Multi-issue hunt (mandatory):** what else would produce this class of wrongness? Walk callers, sibling surfaces, inverse false-negatives. "Only one issue" is earned.

≥2 distinct-layer solutions. Auto-reject the bandaid catalog (heuristic tighten, keyword carve-out, threshold nudge, satisfy-the-audit waiver). Print **Chosen Fix** + **Rejected** (one-line why). If the winner is still the prior shallow proposal, keep going.

### Phase 3 — Implement via the right owner

| Issue class                                    | Hand off to                                                             |
| ---------------------------------------------- | ----------------------------------------------------------------------- |
| Non-trivial defect class / production bug      | `root-cause-fix` (re-confirm Phase 1 exits)                             |
| Everyday local bug with clear repro            | `debugging-an-issue` steps 4–7 (hypotheses already done)                |
| UI / product heuristic / blur / naming / flags | Implement here under `no-shortcuts` + regression test; still class-kill |

Implement **all** confirmed Phase 1 issues this pass when they share a root or are cheap siblings.

After a non-trivial implement: `deep-flight` (`_shared/flight-family.md`). Quote a shortcut-sweep RECEIPT. Launch `flight-checker` (readonly, no `resume`). Same-session self-grade cannot close.

### Phase 4 — Report

Write `_shared/plain-english-brief.md`. Scorecard and rejected alternatives stay off-page unless they ask.

## Never do

- Implement the first proposal because the user said "yes"; ask "Want me to tighten…?"
- Skip the multi-issue hunt, or ship one issue and leave siblings as "follow-up"
- Present one solution; ship a keyword/heuristic exception when a structured signal exists

Worked shape: `references/worked-examples.md`.

## Pairs with

- rules: `do-it-right-rule`, `no-shortcuts`, `regression-test`,
  `definition-of-done`
- skills: `root-cause-fix`, `debugging-an-issue`, `deep-flight`, `agentic-loop`,
  `reviewing-and-shipping`, `post-flight`, `recommending-next-steps`
- agents: `flight-checker`, `reviewer`
- commands: `do-it-right-cmd` (`/do-it-right`)
- refs: `references/diagnosis-gate.md`, `references/solution-gate.md`,
  `references/worked-examples.md`, `_shared/plain-english-brief.md`
