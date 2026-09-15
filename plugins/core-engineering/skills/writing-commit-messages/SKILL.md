---
name: writing-commit-messages
disable-model-invocation: true
description: >
  Write a conventional-commit message from the diff. Use when asked to write the commit message.
---

# Writing commit messages

`type(scope): summary` from the staged diff. Ticket id if present. No secrets.

If `shared-working-tree` / `committing-on-shared-trunk` are installed: describe the coordinator's **coherent ready batch**. Inspect existing staged content; do not change staging ownership to fit a message. Unfinished or unrelated WIP stays out.

## Pairs with

- rules: `commit-and-pr-conventions`, `shared-working-tree`, `no-stash`
- skills: `committing-on-shared-trunk`, `reviewing-and-shipping`, `opening-a-pr`
- workflows: `ship-a-feature`, `plan-then-build`, `clear-the-queue`
