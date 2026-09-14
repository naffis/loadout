---
name: resolving-merge-conflicts
description: >
  Resolve merge or rebase conflicts semantically, then run the gate. Slash-only. Use when conflict markers are present.
disable-model-invocation: true
---

# Resolving merge conflicts

Explicit invoke only (`/resolving-merge-conflicts` or from `rebasing-a-branch`). Palette hide is intended.

Lockfiles → regenerate (`lockfile-conflicts`); never hand-merge. Stage resolved paths. Gate green, then continue. No stash. No force-push of trunk. No commit/push/tag unless already the task (`git-safety`).

## Pairs with

- skills: `rebasing-a-branch`
- rules: `lockfile-conflicts`, `git-safety`, `no-stash`
- workflows: `clear-the-queue`
