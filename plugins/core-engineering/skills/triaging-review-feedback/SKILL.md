---
name: triaging-review-feedback
disable-model-invocation: true
description: >
  Sort review comments into fix / discuss / defer and apply them under house git. Use when addressing review feedback.
---

# Triaging review feedback

Bucket: must-fix / should-fix / discuss / out-of-scope. Reply vs silently comply. Don't resolve others' threads. No drive-by refactors.

Do **not** commit unless asked. If commit is authorized and `shared-working-tree` is installed → whole tree (`committing-on-shared-trunk`), not "focused commits."

## Pairs with

- rules: `commit-and-pr-conventions`, `git-safety`, `shared-working-tree`
- skills: `reviewing-and-shipping`, `committing-on-shared-trunk`
- agents: `reviewer`
