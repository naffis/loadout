---
name: auditing-doc-freshness
disable-model-invocation: true
description: >
  Sweep docs for drift against the current code and fix or flag each hit. Use before a release or after a large rename.
---

# Auditing doc freshness

Backstop. The real fix is same-change `documentation-updates` / `updating-docs`.

- Prefer deleting a wrong doc over leaving it confidently wrong.
- Don't style-edit (`copy-voice`).
- Ambiguous staleness → `file:line` list; don't invent.

## Pairs with

- rules: `documentation-updates`, `docstrings-current`
- skills: `updating-docs`
