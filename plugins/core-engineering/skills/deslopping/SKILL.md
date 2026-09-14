---
name: deslopping
description: >
  Remove AI-generated slop from a code diff without changing behavior. Use after generating code, before review. Prose → cleaning-ai-copy.
---

# Deslopping

Branch **code** diff only. Prose / ChatGPT voice → `cleaning-ai-copy` (`/deslop-copy`, not `/deslop`). YAGNI / unused abstractions → `simplifying-code`.

Behavior stays identical unless you are fixing a real bug (then `regression-test`).

## Pairs with

- rules: `size-limits`, `no-any`, `copy-voice`
- skills: `reviewing-and-shipping`, `simplifying-code`, `cleaning-ai-copy`
- workflows: `safe-refactor`, `ship-a-feature`, `plan-then-build`
