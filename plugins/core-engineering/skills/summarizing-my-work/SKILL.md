---
name: summarizing-my-work
disable-model-invocation: true
description: >
  Summarize authored commits for a standup note. Use for "what did I get done". Structured week → weekly-review.
---

# Summarizing my work

Ad-hoc window. Structured weekly/retro → `weekly-review`.

```bash
git log --author="$(git config user.email)" --since="<date>" --pretty="%h %s" --no-merges
```

Outcomes, not a commit dump. No customer/PII. Voice: `copy-voice` / `cleaning-ai-copy`.

## Pairs with

- skills: `weekly-review`
- rules: `copy-voice`
