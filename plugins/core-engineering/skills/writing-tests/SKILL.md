---
name: writing-tests
disable-model-invocation: true
description: >
  Add tests for new or changed behavior, including error paths. Use when asked to write tests. Strict TDD loop → test-driven.
---

# Writing tests

Bug fixes **require** fail-on-revert (`regression-test`). Hard loop (no prod code before pasted RED) → `test-driven` (`/tdd`). Mock only network/clock/fs/SDK (`testing-conventions`).

## Pairs with

- rules: `testing-conventions`, `test-coverage`, `regression-test`
- skills: `test-driven`, `improving-test-coverage`, `triaging-flaky-tests`,
  `debugging-an-issue`
- workflows: `ship-a-feature`, `plan-then-build`, `debug-production`, `security-pass`,
  `safe-refactor`, `ship-a-migration`, `dependency-bump`, `clear-the-queue`
