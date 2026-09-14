---
name: updating-docs
disable-model-invocation: true
description: >
  Update every doc surface a code change affects, in the same change. Use when behavior, API, or procedure changed.
---

# Updating docs

Same change. No "docs later" ticket.

| Change | Surface |
| --- | --- |
| how to use | README / how-to |
| public API | reference + docstrings (`docstrings-current`) |
| config / flags | setup doc + example env |
| procedure | runbook |
| hard-to-reverse decision | `writing-an-adr` |
| user/operator-visible | changelog |

Grep the old name. Delete stale docs. Voice: `copy-voice` / `cleaning-ai-copy`.

## Pairs with

- rules: `documentation-updates`, `docstrings-current`, `copy-voice`
- skills: `writing-an-adr`, `auditing-doc-freshness`, `reviewing-and-shipping`,
  `cleaning-ai-copy`
- workflows: `ship-a-feature`, `plan-then-build`, `ship-a-migration`, `safe-refactor`
