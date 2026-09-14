---
name: writing-commit-messages
disable-model-invocation: true
description: >
  Write a conventional-commit message from the diff. Use when asked to write the commit message.
---

# Writing commit messages

`type(scope): summary` from the staged diff. Ticket id if present. No secrets.

If `shared-working-tree` / `committing-on-shared-trunk` are installed: the staged set is the **whole tree**. Do **not** unstage "unrelated" files. Dominant theme in the subject; other themes in the body. Split only if the user asks.

## Pairs with

- rules: `commit-and-pr-conventions`, `shared-working-tree`, `no-stash`
- skills: `committing-on-shared-trunk`, `reviewing-and-shipping`, `opening-a-pr`
- workflows: `ship-a-feature`, `plan-then-build`, `clear-the-queue`
