---
name: debugging-an-issue
description: >
  Evidence-first debug of a local, already-framed bug. Use for a failing test or unexpected local behavior. Approved shallow fix → do-it-right; no local repro → debugging-with-observability.
---

# Debugging an issue

Everyday local bug. Models already know how to read errors and form hypotheses. This skill is the **router and stop**.

## Trigger / route

| Situation | Use |
| --- | --- |
| User approved a shallow proposal / said "do it correctly" | `do-it-right` first |
| Proven class root | `root-cause-fix` |
| Prod/staging, no local repro | `debugging-with-observability` |
| Named surface, no single bug | `hunting-defects` |
| Flaky / intermittent | `triaging-flaky-tests` |

## House contract

- Quote the failing signal before changing behavior.
- **Stop after two failed fixes.** Escalate to `root-cause-fix` rather than a third guess.
- Regression must fail on revert (`regression-test`).
- Don't touch prod data, rotate a secret, or disable a gate without asking.

## Pairs with

- rules: `observability-first`, `regression-test`, `no-shortcuts`
- skills: `root-cause-fix`, `do-it-right`, `triaging-flaky-tests`, `fixing-ci`,
  `debugging-with-observability`, `hunting-defects`
- agents: `explorer`
- workflows: `fix-ci-until-green`, `debug-production`
