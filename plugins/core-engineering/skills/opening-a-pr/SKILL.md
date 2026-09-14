---
name: opening-a-pr
disable-model-invocation: true
description: >
  Create a branch, push, and open a PR. Use only when the user explicitly asks for a PR.
---

# Opening a PR

**Only** when the user explicitly asks. "Commit and push" / "ship" / "finish" / review-build → `committing-on-shared-trunk`. Never stash. Target the integration branch, not production. Don't self-merge.

Body: why + Verify-that + flags/rollback + ticket (`Fixes …`).

## Pairs with

- rules: `commit-and-pr-conventions`, `git-safety`, `shared-working-tree`, `no-stash`
- skills: `writing-commit-messages`, `committing-on-shared-trunk`, `making-a-pr-reviewable`
- workflows: `ship-a-feature`, `plan-then-build`, `clear-the-queue`
