---
name: defect-hunt
uses:
  skills:
    [
      hunting-defects,
      auditing-resource-lifecycle,
      walking-failure-paths,
      do-it-right,
      root-cause-fix,
    ]
  commands:
    [
      hunt-defects-cmd,
      audit-lifecycle-cmd,
      walk-failure-paths-cmd,
    ]
  agents: [explorer, reviewer]
  rules: [no-shortcuts, observability-first, regression-test]
gate: "census RECEIPT quoted; wave log covers every review: file; reviewer or /review before SURFACE CLEAN or Critical/High"
stop_condition: "hunt report is SURFACE CLEAN or ISSUES FOUND with every candidate refuted; unreviewed review files = 0; checker ran if CLEAN or Critical/High"
---

# Defect hunt

Exhaustive review of a **named surface** when there is no single known bug.
Completeness is a census receipt plus a wave log, not report length.

This is **report-only** unless the user said "and fix". Do not use this for a
diff wrap (`reviewing-and-shipping`), a maintainability grade
(`reviewing-code-quality`), or a known symptom (`debugging-an-issue`).

1. **Equip** — `loadout add defect-hunt` then `loadout update` so `uses:`
   closes. Optional: copy
   `.cursor/skills/hunting-defects/references/overlay-template.md` to
   `references/project-overlay.md` and add `references/project-seed-patterns.txt`.
2. **Run** — `/hunt-defects <path>` (or the `hunting-defects` skill). Quote
   `census.sh`. Partition into waves of 25–40 `review:` files. After each
   wave, refute and emit partial findings.
3. **Specialists** — lifecycle imbalances (`/audit-lifecycle`) and failure
   paths (`/walk-failure-paths`) are dispatched by the orchestrator; they
   can also run alone on a named module.
4. **Checker** — `reviewer` or `/review` before `SURFACE CLEAN` or any
   Critical/High. Same-session self-grade cannot certify CLEAN.
5. **Fix (only if asked)** — `do-it-right` then `root-cause-fix` on
   Critical/High, one class at a time.

Owning: `docs/defect-hunt-family.md`.
