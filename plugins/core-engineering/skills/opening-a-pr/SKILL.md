---
name: opening-a-pr
description: Create a branch, push, and open a pull request with a validation-first description. Use when starting tracked work or turning a finished change into a PR.
---

# Opening a PR

## Trigger

Starting work that should land as a PR, or a finished change needs one. Only run git/PR steps when that is the explicit task.

## Workflow

1. **Branch.** From an up-to-date base, create a branch. Use the ticket's generated branch name if one exists.

```bash
git checkout <base> && git pull
git checkout -b <branch>
```

2. **Do the work** (see `planning-a-change`), committing focused changes.
3. **Push** with upstream tracking: `git push -u origin HEAD`.
4. **Open the PR** targeting the integration branch (not production). Body = summary + why + concrete "Verify that…" steps + screenshots for UI + migration/flag/rollback notes. Reference the ticket ("Fixes PROJ-142").

```bash
gh pr create --title "..." --body "$(cat <<'EOF'
## Summary
...
## Test plan
- [ ] Verify that ...
EOF
)"
```

## Guardrails

- PRs target the integration branch; never open directly against production.
- Don't self-merge or mark the ticket done unless that's the workflow.

## Pairs with

- rules: `commit-and-pr-conventions`
- skills: `writing-commit-messages`, `making-a-pr-reviewable`
- workflows: `ship-a-feature`
