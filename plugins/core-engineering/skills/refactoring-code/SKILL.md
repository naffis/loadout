---
name: refactoring-code
disable-model-invocation: true
description: >
  Restructure existing code without changing behavior, behind a test net. Use when asked to refactor.
---

# Refactoring code

Test net first or refuse (`refactor-discipline`). No bugfix/feature mid-refactor. Public API + call sites in the same step. Leave unstaged unless asked — do **not** commit the refactor on your own.

## Pairs with

- rules: `refactor-discipline`, `size-limits`, `testing-conventions`, `git-safety`
- skills: `reviewing-code-quality`, `writing-a-migration`
- workflows: `safe-refactor`
