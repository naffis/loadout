---
name: resolving-merge-conflicts
description: >
  Resolve git merge or rebase conflicts semantically, regenerate lockfiles,
  stage resolved paths, and run the project gate before continue. Use when
  conflict markers are present or the user asks to fix merge/rebase conflicts.
  disable-model-invocation: do not auto-run. Invoke via /resolving-merge-conflicts
  or from rebasing-a-branch. Anti-triggers: ordinary rebase without conflicts
  → rebasing-a-branch; commit/push → git-safety (ask first).
disable-model-invocation: true
---

# Resolving merge conflicts

Semantic resolution of merge or rebase conflicts. Not mechanical "take ours".
Not a commit or push.

Invoke explicitly: `/resolving-merge-conflicts`, or when `rebasing-a-branch`
hits conflicts. Plugin palette may hide this skill; that is intended.

## Trigger

Unresolved conflict markers, or the user asked to resolve merge/rebase
conflicts. If mutating git is not the explicit task, stop and ask (`git-safety`).

## Workflow

1. **Inventory** conflicted paths (`git status`, conflict markers).
2. **Per file:** resolve semantically. Prefer preserving both sides when safe.
   Otherwise choose the variant that compiles and keeps public behavior stable.
   Do not refactor while resolving.
3. **Lockfiles:** refuse a hand-merge. Regenerate per `lockfile-conflicts`.
4. **Stage** resolved paths (`git add` the resolved files). Do not leave
   markers in any file.
5. **Gate:** run the project's test / typecheck (or the command the rebase
   / merge is blocked on). Must be green before continue.
6. **Continue** the merge or rebase (`git rebase --continue` / equivalent).
   Summarize files resolved and notable choices.

## Guardrails

- No stash. No force-push of trunk.
- No commit, push, or tag unless the user already made that the task
  (`git-safety`).
- Do not invent a `/resolve-conflicts` command file; this skill is enough.

## Pairs with

- skills: `rebasing-a-branch`
- rules: `lockfile-conflicts`, `git-safety`, `no-stash`
- workflows: `clear-the-queue`
