---
name: fixing-ci
disable-model-invocation: true
description: >
  Classify and fix failing CI checks. Use when a PR's checks are red.
---

# Fixing CI

CI is red. Inspect the failing candidate/run and logs once; classify, then fix the cause.
One owner investigates a failure. Check existing runs before requesting another.
Retry a demonstrated transient infrastructure failure within a bounded budget;
never rerun unchanged failures hoping for green. Continue independent work while
required CI runs; keep dependent landing blocked when its assumptions are invalid.

| Class | Do |
| --- | --- |
| env/infra | Retry or escalate. Don't "fix" code. |
| flake | `triaging-flaky-tests`. Don't paper over. |
| real | Reproduce with the same command CI runs. Fix the root. |

Never disable, skip, or delete a failing test. Don't loosen lint/types to get green (`no-shortcuts`).

```bash
gh pr checks --json name,bucket,state,workflow,link
gh run view <run-id> --log-failed
```

## Pairs with

- rules: `no-shortcuts`, `regression-test`
- skills: `triaging-flaky-tests`, `debugging-an-issue`
- agents: `ci-watcher`
- workflows: `fix-ci-until-green`, `dependency-bump`
