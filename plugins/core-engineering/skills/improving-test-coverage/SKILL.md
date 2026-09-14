---
name: improving-test-coverage
disable-model-invocation: true
description: >
  Add real behavior tests for untested critical paths. Use when asked to raise coverage — do not game the metric.
---

# Improving test coverage

Coverage is a guide (`test-coverage`). Rank gaps by **risk**, not size. Don't game the number (exclusions, assertion-free tests). Patch-coverage ratchet never goes down. Flaky new tests are regressions (`triaging-flaky-tests`). Add real tests via `writing-tests`.

## Pairs with

- rules: `test-coverage`, `testing-conventions`, `regression-test`
- skills: `writing-tests`, `triaging-flaky-tests`
