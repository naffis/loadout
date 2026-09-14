---
name: reviewing-and-shipping
description: >
  Wrap a finished change for ship. Use for "reviewing and shipping" or "wrap this up to ship". Plan-vs-diff → review-build.
---

# Reviewing and shipping

| Prefer instead | When |
| --- | --- |
| `verifying-session-surfaces` | Live surfaces not exercised |
| `review-build` | Came from a written plan / high stakes |
| `hunting-defects` | Named package, no single known bug |

Commit only if asked. Shared-trunk → whole tree (`committing-on-shared-trunk`); don't leave sibling WIP unstaged. PR only if asked (`opening-a-pr`). Show gate evidence. `git-safety` / `no-stash`.

## Pairs with

- rules: `git-safety`, `shared-working-tree`, `no-stash`, `commit-and-pr-conventions`,
  `regression-test`, `testing-conventions`, `no-shortcuts`
- skills: `review-build`, `post-flight`, `verifying-session-surfaces`, `writing-commit-messages`, `committing-on-shared-trunk`, `opening-a-pr`,
  `deslopping`, `hunting-defects`
- agents: `reviewer`, `security-reviewer`
- commands: `review-build-cmd` (`/review-build`), `verifying-session-surfaces-cmd` (`/verify-surfaces`)
- workflows: `ship-a-feature`, `plan-then-build`, `cut-a-release`, `run-autonomous-loop`,
  `debug-production`, `security-pass`, `clear-the-queue`, `safe-refactor`, `ship-a-migration`,
  `dependency-bump`
