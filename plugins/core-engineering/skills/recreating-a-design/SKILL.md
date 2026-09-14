---
name: recreating-a-design
description: >
  Recreate a visual target in HTML/CSS by iterating render→diff→fix. Use when matching a mockup or live site.
---

# Recreating a design

Closed loop: render → measure vs target → look at the diff → diagnose →
smallest fix → re-measure. Iterate until a stop condition. Keep the best
score; never ship a regression. VLMs cannot grade their own output — the
difference image is the measurer. Holistic UX → `reviewing-ui`. Product
behavior → `exercising-the-product`.

## Phase 0 — Target and measurer

- **Target:** one image per page/viewport (file, captured URL, or saved mock).
- **Measurer:** project harness if present; else Playwright + pixel diff —
  `references/diff-and-diagnosis.md`. Do not iterate unmeasured.
- **Thresholds** up front (score + overlay + no mobile overflow).
- **Preconditions:** render pipeline up before looping.

## The loop

```
1. BASELINE → render + measure vs target
2. LOOK     → Read the diff/overlay
3. DIAGNOSE → 1–3 biggest deviations (overlay taxonomy)
4. LOCUS    → instance or generator?
5. FIX      → smallest change that kills the biggest deviation
6. MEASURE  → fresh screenshot + re-diff (never cached)
7. COMPARE  → better? keep. worse? revert.
8. repeat 2–7 until a stop condition, then REPORT
```

One fix per round. Overlay taxonomy: `references/diff-and-diagnosis.md`.

## Fix locus: instance vs generator

- **Instance (default):** this page only — edit implementation, re-measure.
- **Generator:** systemic; same defect class on 2+ targets. Capture other
  fixture scores first; re-measure all after. Beyond a small tweak, ask first.

## Stop conditions (first that hits)

1. **Converged** — all thresholds + responsive invariant.
2. **Budget** — default 6 fix iterations per target.
3. **Plateau** — 2 consecutive rounds with no meaningful score step; switch
   tactic once, else stop.
4. **Blocked** — capture broken, missing keys, or a product decision.

Always keep the best-scoring version.

## Guardrails

Scores/overlays from artifacts, not impression. Semantic, responsive markup —
not absolute-positioned soup; check mobile and one mid width every few rounds.
Recreate layout with your own assets/copy unless the user owns the source.

Each round: score, what the diff showed, the one fix, overlay embedded. End:
score trajectory, artifacts path, remaining human decisions.

## Pairs with

- skills: `agentic-loop` (loop discipline), `reviewing-ui` (holistic UX after fidelity),
  `root-cause-fix` (systemic generator defects)
- rules: `ui-evidence`, `no-shortcuts`
- workflows: `run-quality-loop`
