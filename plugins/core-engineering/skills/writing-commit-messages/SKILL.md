---
name: writing-commit-messages
description: Generate a clear conventional-commit message from a diff. Use when committing staged changes or asked to write a commit message.
---

# Writing commit messages

## Trigger

About to commit, or asked to draft a commit message for staged changes.

## Workflow

1. Read the staged diff (`git diff --staged`) and infer the nature of the change.
2. Pick the type: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `perf`. "add" = new feature, "update/improve" = enhancement to existing, "fix" = bug fix.
3. Write `type(scope): summary` in the imperative, under ~70 chars. Add a body explaining the *why* when the change isn't self-evident. Include the ticket id if there is one.
4. One logical change per commit — if the diff spans unrelated changes, stage and commit them separately.

## Examples

```
feat(auth): add refresh-token rotation

Tokens were valid until logout; rotate on each refresh so a leaked
token has a short blast radius. Closes PROJ-142.
```
```
fix(reports): use UTC consistently in date grouping
```

## Guardrails

- Describe what changed and why, not how. No "various fixes".
- Never put secrets or customer data in a message.

## Pairs with

- rules: `commit-and-pr-conventions`
- skills: `reviewing-and-shipping`, `opening-a-pr`
- workflows: `ship-a-feature`, `plan-then-build`, `clear-the-queue`
