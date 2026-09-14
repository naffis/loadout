---
name: test-driven
description: >
  Strict red→green→refactor for one slice. Use when the user says TDD or "test first". Tests after the fact → writing-tests.
---

# Test-driven development

Models already know red→green→refactor. This skill is the **hard stop**: no production edit until RED is pasted for the right reason.

1. Name one Given/When/Then slice.
2. Write the test. **Paste RED.** If it passes, it does not bite.
3. Smallest green. Paste GREEN. One red at a time — no five-reds-then-rewrite.
4. Don't weaken or delete the assertion to get green. Don't mock the unit under test.
5. Leave unstaged unless asked.

After-the-fact tests → `writing-tests`. Coverage → `improving-test-coverage`. Bug fix still red-first (`regression-test`).

## Pairs with

- skills: `writing-tests`, `improving-test-coverage`, `simplifying-code`,
  `debugging-an-issue`, `triaging-flaky-tests`
- rules: `regression-test`, `testing-conventions`, `test-coverage`, `no-shortcuts`
- commands: `tdd` (`/tdd`) — registry id `tdd-cmd`
- workflows: `ship-a-feature`, `plan-then-build`, `safe-refactor`
