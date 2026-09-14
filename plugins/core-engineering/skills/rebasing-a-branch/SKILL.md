---
name: rebasing-a-branch
description: >
  Rebase a branch onto its base with semantic conflict review. Slash-only. Use when a branch is behind before merge.
disable-model-invocation: true
---

# Rebasing a branch

Only when this is the **explicit** task. Never rebase or force-push a shared/integration trunk. Never stash.

Conflicts → `resolving-merge-conflicts`. Lockfiles → regenerate (`lockfile-conflicts`); never hand-merge.

Force-with-lease on **your own feature branch only**. Confusing rebase → `git rebase --abort`.

## Pairs with

- rules: `lockfile-conflicts`, `testing-conventions`, `git-safety`, `no-stash`
- skills: `reviewing-and-shipping`, `resolving-merge-conflicts`
- workflows: `clear-the-queue`
