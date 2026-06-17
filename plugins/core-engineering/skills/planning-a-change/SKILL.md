---
name: planning-a-change
description: Explore, then plan, then implement a non-trivial change. Use before multi-file work, unfamiliar code, or anything with real trade-offs; skip for one-sentence diffs.
---

# Planning a change

## Trigger

A change that touches multiple files, modifies unfamiliar code, or has more than one reasonable approach. If you could describe the diff in one sentence, skip this and just do it.

## Workflow

1. **Classify the task.** Quick fix → implement directly. Enhancement/integration/ambiguous → plan first.
2. **Explore (read-only).** Read the relevant code and tests. Find the existing pattern to follow and the seams you'll touch. Note files with line numbers. Don't edit yet.
3. **Write the plan.** State the goal, the files that change, the approach, the risks, and an end-to-end verification step. Keep it to what's needed to act.
4. **Stress-test the plan.** Where will this break? What did exploration miss? Adjust before writing code.
5. **Implement** against the plan, smallest safe change first, following existing patterns.
6. **Verify** with the check named in the plan; show the evidence.

## Guardrails

- Separate research from implementation; don't let exploration silently turn into edits.
- If you correct course more than twice, stop and re-plan rather than pushing on.

## Pairs with

- rules: `no-shortcuts`, `size-limits`, `testing-conventions`
- skills: `reviewing-and-shipping`, `debugging-an-issue`
- workflows: `ship-a-feature`
