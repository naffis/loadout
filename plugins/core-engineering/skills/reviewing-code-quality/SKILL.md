---
name: reviewing-code-quality
disable-model-invocation: true
description: >
  Audit maintainability (size, nesting, duplication, naming). Use for a health check, not a defect hunt.
---

# Reviewing code quality

Assessment, not a rewrite. Flag `file:line` + why + a concrete move. Must-fix vs nice-to-have. Skip linter nits. Act via `refactoring-code`.

Anti-triggers: `hunting-defects`, `reviewing-and-shipping`, `deslopping`, `reviewer`.

## Pairs with

- rules: `size-limits`, `refactor-discipline`, `no-shortcuts`
- skills: `refactoring-code`, `deslopping`, `hunting-defects`
- agents: `reviewer`
- workflows: `safe-refactor`
