---
name: reviewing-and-shipping
description: Review the working tree for correctness and intent fit, run tests, and wrap up. Commit/push only when asked; with shared-working-tree, commit the whole trunk tree and open a PR only if explicitly requested.
---

# Reviewing and shipping

## Trigger

Work is functionally complete and you're about to wrap up. Prefer running
`review-build` (`/review-build`) first when the change came from a written plan or
the stakes are high — then use this skill.

## Workflow

1. **Gather context.** Diff against the integration trunk from `AGENTS.md`, list dirty files, recall the intent.

```bash
git status
git diff
```

2. **Run targeted tests** for the changed behavior. Add tests for new behavior or note the gap explicitly.
3. **Review the diff** for correctness, regressions, security, and fit with the stated intent. For large diffs, dispatch the `reviewer` agent on a fresh context. Fix critical issues and re-run affected tests.
4. **Self-deslop**: remove stray comments, dead code, `any` casts, and over-defensive scaffolding the change introduced.
5. **Commit only if the user asked.**
   - If `shared-working-tree` is installed → `committing-on-shared-trunk` (whole eligible tree, stay on trunk, no stash).
   - Otherwise → focused conventional commit(s) as usual.
6. **PR only if the user explicitly asked** for a PR — then `opening-a-pr`. Otherwise push the trunk when push was requested.

## Guardrails

- Ship only what you confirmed works; show the test/build evidence.
- With `shared-working-tree`, do **not** leave sibling-agent WIP unstaged to keep a commit "focused."
- Follow `git-safety` / `no-stash` / `commit-and-pr-conventions` — don't commit/push/branch unless explicitly asked.

## Pairs with

- rules: `git-safety`, `shared-working-tree`, `no-stash`, `commit-and-pr-conventions`,
  `regression-test`, `testing-conventions`, `no-shortcuts`
- skills: `review-build`, `post-flight`, `writing-commit-messages`, `committing-on-shared-trunk`, `opening-a-pr`,
  `deslopping`
- agents: `reviewer`, `security-reviewer`
- commands: `review-build-cmd` (`/review-build`)
- workflows: `ship-a-feature`, `plan-then-build`, `cut-a-release`, `run-autonomous-loop`,
  `debug-production`, `security-pass`, `clear-the-queue`, `safe-refactor`, `ship-a-migration`,
  `dependency-bump`
