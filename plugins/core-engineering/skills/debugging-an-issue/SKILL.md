---
name: debugging-an-issue
description: Evidence-first root-cause debugging loop. Use for a failing test, runtime error, or unexpected behavior that isn't a one-line obvious fix.
---

# Debugging an issue

## Trigger

A bug, failing test, or behavior that doesn't match expectation, where the cause isn't obvious.

## Workflow

1. **Read the actual error** in full. Don't skim.
2. **State expected vs actual** in one sentence each.
3. **Gather evidence first** (per `observability-first`): logs, traces, the failing test output. Correlate with a request/run id. Quote the signal.
4. **Minimal reproduction.** Shrink to the smallest case that still fails.
5. **At least two hypotheses.** For each, predict what you'd see if true, then try to *falsify* it with evidence — don't confirm the first guess.
6. **Smallest fix** that addresses the root cause, not the symptom.
7. **Regression test** that fails before the fix and passes after.

## Symptom shortcuts

- Type error → read the full type, narrow from `unknown`, don't cast.
- Flaky/intermittent → see `triaging-flaky-tests`.
- 4xx/5xx from an API → decode the error body before changing code.

## Guardrails

- A cause isn't proven until evidence points at it. No "should be fixed now" without a check.

## Pairs with

- rules: `observability-first`, `regression-test`, `no-shortcuts`
- skills: `triaging-flaky-tests`, `fixing-ci`
- agents: `explorer`
