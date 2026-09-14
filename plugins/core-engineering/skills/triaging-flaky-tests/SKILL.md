---
name: triaging-flaky-tests
disable-model-invocation: true
description: >
  Isolate and fix or quarantine a flaky test. Use when a test fails intermittently.
---

# Triaging flaky tests

Pass/fail with no code change. Confirm with isolation + a loop. **No skip / retry / sleep** as the fix (`no-shortcuts`). If blocked: quarantine + ticket. Prove with a green loop.

## Pairs with

- rules: `testing-conventions`, `no-shortcuts`
- skills: `fixing-ci`, `debugging-an-issue`
