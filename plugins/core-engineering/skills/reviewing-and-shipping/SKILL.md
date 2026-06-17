---
name: reviewing-and-shipping
description: Review the current branch for correctness and intent fit, run tests, commit focused work, and open or update a PR. Use when wrapping up a change before shipping.
---

# Reviewing and shipping

## Trigger

Work is functionally complete and you're about to commit/PR.

## Workflow

1. **Gather context.** Diff against the base branch, list changed files, recall the intent.

```bash
git fetch origin main
git diff origin/main...HEAD
git status
```

2. **Run targeted tests** for the changed behavior. Add tests for new behavior or note the gap explicitly.
3. **Review the diff** for correctness, regressions, security, and fit with the stated intent. For large diffs, dispatch the `reviewer` agent on a fresh context. Fix critical issues and re-run affected tests.
4. **Self-deslop**: remove stray comments, dead code, `any` casts, and over-defensive scaffolding the change introduced.
5. **Commit** focused files with a conventional message.
6. **Open or update the PR** with a validation-first description.

## Guardrails

- Ship only what you confirmed works; show the test/build evidence.
- Don't bundle unrelated changes into the same commit.
- Follow the repo's git rules — don't commit/push unless that's the explicit task.

## Pairs with

- rules: `commit-and-pr-conventions`, `regression-test`, `testing-conventions`
- skills: `writing-commit-messages`, `opening-a-pr`, `deslopping`
- agents: `reviewer`, `security-reviewer`
- workflows: `ship-a-feature`
