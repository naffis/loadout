---
name: debugging-with-observability
description: >
  Debug a production or staging failure from logs, traces, and metrics before reading source. Use when there is no local repro.
---

# Debugging with observability

Local repro exists → `debugging-an-issue`. This skill is for **runtime-only** failures (`observability-first`).

## House contract

1. **Anchor** on a correlation id (request / trace / job / session). Without one, don't pretend you have the story.
2. Query the project's real telemetry. Quote the proving log/span **before** any code change.
3. Hand off:
   - Local repro now possible → `debugging-an-issue`
   - Class fix needed → `root-cause-fix` (the signal is Loop A evidence)
4. Turn temporary debug logging back down. Never paste secrets / PII from telemetry.

## Pairs with

- rules: `observability-first`, `no-secrets-in-code`, `regression-test`
- skills: `debugging-an-issue`, `root-cause-fix`, `fixing-ci`
- agents: `explorer`
- workflows: `debug-production`
- runbooks: `hotfix-and-rollback`
