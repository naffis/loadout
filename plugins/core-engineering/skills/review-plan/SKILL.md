---
name: review-plan
description: >
  Extensively review and improve an existing implementation plan before coding.
  Use when the user says "Review the plan", "Review this plan", "review plan",
  "stress-test the plan", "go deeper on the plan", "improve the plan", or asks
  to re-check planning work. Runs multiple thorough passes: re-read session +
  plan + code, fresh external research, pre-mortem, adversarial critique, fix
  all shortcuts, update the plan in place, then review everything one more time.
  Anti-triggers: create a new plan from scratch → create-plan; implement now;
  ordinary code review → reviewing-and-shipping.
---

# Review a plan

## Trigger

An existing plan needs a hard review before implementation — especially after
`create-plan`, mid-session planning, or when the user wants confidence nothing
was missed or shortcut.

## Immediate action

1. Read the `review-plan` rule (`rules/review-plan.mdc`) end-to-end — it is the
   full standard.
2. Confirm the plan must meet the `create-plan` completeness bar / bans when
   you finish.
3. Execute every pass. **Edit the plan file** — chat-only critique is a failure.

## Workflow (mandatory multi-pass)

Do **not** write implementation code. Read, research, critique, and **update
the plan artifact**.

### Pass 0 — Locate and re-read everything

1. Find the plan (user path, `docs/plans/`, `.cursor/plans/`, or session plan).
2. Re-read the **entire** plan. Do not skim.
3. Re-read session decisions, todos, and files already touched.
4. Re-read live code/docs the plan claims to rely on; verify assumptions.

### Pass 1 — Spec-review gate (structured risk review)

| Dimension        | Pass criteria                                                       |
| ---------------- | ------------------------------------------------------------------- |
| **Scope**        | One clear problem; non-goals strong enough to block creep           |
| **Acceptance**   | Every AC binary-testable (Given/When/Then); no subjective language  |
| **Contracts**    | API/DB/job/UI contracts complete; compat + migration notes          |
| **Dependencies** | Each dependency named with fallback; no "TBD integration"           |
| **Operations**   | Rollout, monitoring/alerts, and **viable rollback** (esp. stateful) |
| **Traceability** | Every requirement → design → task → verification; no orphans        |
| **Shortcuts**    | No stubs, silent deferrals, or "decide during implementation"       |

For each item below, output **PASS or FAIL** with the evidence you checked
(file path, plan section, or command output):

- No TBDs, placeholders, "figure out later", or unresolved either/or options
- No unstated assumptions; every assumption is written down and safe
- Edge cases covered: empty/null input, concurrency, partial failure, retries, limits, permissions
- Failure modes and rollback addressed
- Security: authn/authz, input validation, secrets handling for anything new
- Data migration and backward compatibility addressed if data is touched
- Verification plan actually proves the requirements
- No simpler design that satisfies everything (if there is one, that is a finding)
- No conflict with existing code, conventions, or in-flight work you can see

**Block coding** when: rollback for stateful changes is missing; dependencies
unresolved; ACs untestable; scope ambiguous; security/privacy/tenancy open;
create-plan bans still present. A clean PASS across the board is acceptable
only when each item shows what you checked — "looks good" without evidence is
a failed review.

### Pass 2 — Fresh external research

Do **new** research (do not only trust the plan's citations):

1. Write 3–6 search questions aimed at holes (failure modes, migration hazards,
   SOTA alternatives, vendor footguns).
2. Read primary sources. Compare to the plan's approach.
3. Update the plan's research section + decisions: adopt / adapt / reject with
   citations.
4. If SOTA conflicts with repo invariants, document and choose explicitly.

### Pass 3 — Pre-mortem + adversarial critique

1. **Pre-mortem:** Assume failure in 3–6 months; write 3–5 concrete failure
   narratives; mitigate each in the plan.
2. **Adversarial lenses** (distinct): correctness, security/tenancy,
   reliability/idempotency, operability, simplicity, implementability.
3. **Falsify key decisions** — what evidence would prove them wrong?
4. **Alternative blindness** — name a serious alternative not chosen; keep or
   switch with rationale.

### Pass 4 — Apply fixes (the plan must change)

Incorporate **all** P0 and P1 into the plan file. Add a **Review changelog**.

| Level            | Meaning                                     | Action                                      |
| ---------------- | ------------------------------------------- | ------------------------------------------- |
| **P0 / BLOCKER** | Unsafe or impossible to implement correctly | Must fix before APPROVED                    |
| **P1**           | Likely rework or production pain            | Fix in this review                          |
| **P2**           | Quality / clarity                           | Fix if cheap; else Non-goals with rationale |

No undocumented conditions. Prefer fixing over conditioning.

### Pass 5 — One more time (mandatory final sweep)

Review everything one more time. Did we accomplish all that we needed? Look
through everything we've done in this session one more time and be very, very
thorough. Did we miss anything? Think through things again in detail. Review
everything in detail again. Make sure we didn't miss anything. Make 100% sure
we didn't take any shortcuts. Think deeply about the correct way to do all of
this and continue to update and fix.

If anything material remains, return to Pass 2–4 until the sweep is clean.

## Review report (reply)

```markdown
# Plan review: <plan name>

## Verdict

APPROVED | APPROVED WITH CONDITIONS | BLOCKED

## Passes completed

- Pass 0 re-read: …
- Pass 1 spec gate: … (blockers found / cleared)
- Pass 2 fresh research: … (sources added)
- Pass 3 pre-mortem + adversarial: …
- Pass 4 fixes applied: …
- Pass 5 final sweep: clean | findings → fixed again

## Blockers found → resolved

## P1 fixes applied

## Fresh sources consulted

| Source | URL | Takeaway |

## Pre-mortem failure narratives → mitigations

## Review changelog (plan edits)

## Conditions (only if APPROVED WITH CONDITIONS)

## Still blocked on (user choice required) — or "none"
```

## What "done" means

- Plan file updated in place; P0/P1 gone
- create-plan bans absent; open questions empty (or true Non-goals only)
- ≥3 full passes + clean final sweep
- Verdict explicit; review report in the reply
- No implementation unless the user asks after approval

## Never do

- Rubber-stamp or single-pass skim
- Leave TBD/stubs/shortcuts in the plan
- Skip fresh external research
- Approve with unresolved in-scope open questions
- Chat-only critique without editing the plan

## Pairs with

- skills: `create-plan`, `complete-the-build`, `review-build`, `planning-a-change`,
  `writing-an-adr`, `researching-a-dependency`
- rules: `review-plan-rule`, `create-plan-rule`, `no-shortcuts`, `definition-of-done`
- commands: `plan` (`/plan`), `review-plan-cmd` (`/review-plan`),
  `complete-the-build-cmd` (`/complete-the-build`),
  `review-build-cmd` (`/review-build`)
- workflows: `ship-a-feature`, `plan-then-build`, `run-autonomous-loop`
