---
name: simplifying-code
disable-model-invocation: true
description: >
  Simplify recently changed code for clarity and YAGNI without changing behavior. Use for a /simplify pass on the session diff.
---

# Simplify code

Behavior-preserving clarity pass on this session/branch diff. Slop-only →
`deslopping`. AI copy → `cleaning-ai-copy`. Planned extract → `refactoring-code`.
Audit, no edits → `reviewing-code-quality`.

## Workflow

1. **Scope** — `git diff <base>...HEAD` plus unstaged. This session/branch only.
   Named paths stay inside them.
2. **Characterization first** — prefer existing tests; if none and logic is
   non-trivial, add a thin characterization test before simplifying. Run
   affected tests; paste outcome.
3. **Simplify** — collapse one-use helpers, flatten nesting, reuse in-tree
   utils, delete **proven** dead branches. If behavior must change, **stop**.
4. **Verify** — touched-package tests + typecheck/lint. Paste output.
5. **Report** — what got simpler, what was left, gates run.

## Never do

- Delete error-handling or fail open
- Delete unproven dead code
- Touch unrelated files

Leave edits unstaged unless asked to commit.

## Pairs with

- skills: `deslopping`, `cleaning-ai-copy`, `refactoring-code`, `review-build`, `reviewing-code-quality`, `writing-tests`
- rules: `no-shortcuts`, `refactor-discipline`, `size-limits`
- commands: `simplify` (`/simplify`) — registry id `simplify-cmd`
