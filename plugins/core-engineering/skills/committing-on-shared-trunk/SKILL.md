---
name: committing-on-shared-trunk
description: >
  Commit the entire shared trunk working tree — no branches, stashes, or session-scoped staging. Use when the user asks to commit or push on a shared-tree checkout.
---

# Committing on shared trunk

## Trigger

User **explicitly** asked to commit and/or push. Load before any `git add` /
`git commit`.

## Preconditions

1. Confirm the message authorizes commit (and push if pushing). If not → stop.
2. Trunk from `AGENTS.md` (or current branch if it already is trunk). Other
   branch without an ask → stop and ask. Do not create a branch.
3. **Never** `git stash` (any form). Never invent a branch, worktree, or PR.

## Workflow

```
Commit Progress:
- [ ] Inventory full working tree
- [ ] Secret scan
- [ ] Stage ALL eligible files
- [ ] Message covers whole tree
- [ ] Commit
- [ ] Pull without stash (if pushing)
- [ ] Push (only if asked)
- [ ] Verify clean tree (ignored files OK)
```

### 1. Inventory the full tree

`git status` and `git diff`. List **every** modified and untracked path — not
"files I touched this session." Half-written, conflict markers, or in-progress
edits you should not land → **stop and ask**. Leave the tree untouched.

### 2. Secret scan

Refuse `.env`, `.env.*` (except committed examples), credential JSON, key
files. Leave secrets unstaged / gitignored; warn; continue with the rest if
safe. `.gitignore` is the boundary.

### 3. Stage everything eligible

`git add -A`. Do not unstage "other agents' files." Only exclusions: secrets
and paths the user named to skip.

### 4. Message covers all agents

Read the **full** staged diff. `type(scope): summary` for the combined change.
Other themes as body bullets — do not omit them. One commit of the whole tree
unless they asked to split.

### 5. Commit

If a hook rejects: fix, stage with the rest, **new** commit — do not amend
unless amend rules all pass.

### 6. Pull / push (only if asked to push)

Commit-first so the dirty tree is never stashed:

```bash
git pull --ff-only origin <trunk>
# If ff-only fails after commit: git pull --rebase origin <trunk>
# If that still fails: STOP and ask. Never stash.
git push origin <trunk>
```

Wait for CI/staging green when the project requires it.

### 7. Done

`git status` clean (ignored OK). Report SHA and that **all** previously dirty
eligible files were included.

## Anti-patterns

| Anti-pattern | Do instead |
| --- | --- |
| `git add path/only/mine` | `git add -A` |
| `git stash` then pull | Commit all first, then pull |
| `git checkout -b …` for this commit | Stay on trunk |
| Message that ignores other agents' files | Body lists every theme staged |
| "Focused commit" leaving sibling WIP | Land the whole tree |
| Open a PR because a skill mentioned PRs | Push trunk unless user asked for a PR |

## Pairs with

- rules: `git-safety`, `shared-working-tree`, `no-stash`, `commit-and-pr-conventions`
- skills: `writing-commit-messages` (message shape only; scope = whole tree here),
  `reviewing-and-shipping`
- workflows: `ship-a-feature`, `plan-then-build`, `clear-the-queue`
