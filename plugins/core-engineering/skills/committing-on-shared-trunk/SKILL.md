---
name: committing-on-shared-trunk
description: Checkpoint a coherent batch of ready files in a shared checkout. Use when the user asks to commit or push; preserves unrelated and unfinished work.
---

# Committing on shared trunk

Use only with explicit commit authority; push needs its own authority. Stay on
the existing authorized branch. No automatic branches, worktrees, PRs, or stashes.

1. Inventory the entire working tree **and index**. Identify ready paths, owners,
   dependencies, secrets, and unrelated WIP. Do not unstage pre-existing work or
   include it without understanding its intended batch.
2. The coordinator freezes a coherent set of ready files briefly. Include required
   code, tests, docs, generated output, and interface dependencies together.
   Leave unrelated/unfinished work in place. If one file mixes ready and unfinished
   work, coordinate with its owner before staging it.
3. Refuse secrets (.env, credential JSON, keys; committed examples excepted).
   Stage explicit reviewed paths. Inspect the complete staged diff and validate
   using the project's applicable batch checks; reuse matching existing evidence.
4. Write a conventional commit describing the staged batch. Honor hooks. A rejected
   commit needs a corrected new attempt; do not bypass hooks or amend by habit.
5. If asked to push, coordinate any synchronization first. Unfinished WIP must not
   be swept into a commit to make pulling convenient. If synchronization would
   disturb it, pause that operation. No routine rebase/squash cycle.
6. Report SHA, included paths, remaining WIP, and validation state. A dirty tree
   with unrelated work is expected. Required CI/release gates still apply; a
   checkpoint is not a deployment.

## Pairs with

- rules: `git-safety`, `shared-working-tree`, `no-stash`, `commit-and-pr-conventions`
- skills: `writing-commit-messages`, `reviewing-and-shipping`
- workflows: `ship-a-feature`, `plan-then-build`, `clear-the-queue`
