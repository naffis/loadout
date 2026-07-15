---
name: create-plan
description: >
  Create a complete, zero-shortcut implementation plan before coding. Use when
  the user says "Create a plan for X", "plan for", "write a plan", "plan out",
  "implementation plan", "technical plan", "design plan", runs `/plan`, or asks
  to plan a feature/change thoroughly. Requires extensive in-repo AND external
  research (best practices, common practice, state of the art, official docs).
  Produces a fully decided plan — no TBD, stubs, placeholders, or deferred
  decisions. Anti-triggers: user already asked to implement/build now;
  one-sentence diffs (use planning-a-change or just implement); pure Q&A with
  no plan requested.
---

# Create a plan

## Trigger

The user wants a thorough plan for X before coding — especially multi-file work,
unfamiliar domains, real trade-offs, or anything where a shallow sketch would
leave decisions to implementation time.

## Workflow

### 1. Perceive — ground in *this* repo first

Do not invent the system. Before writing the plan:

1. Read `AGENTS.md`, README, and relevant `docs/` / project spine files.
2. Search and read the live code that will change or be reused — modules,
   schemas, routes, jobs, tests, callers, callees, configs, and migrations.
   **List each file read** in the plan with one line on why it is relevant.
3. Inventory **existing** primitives to extend. Prefer reuse over new
   abstraction.
4. Check the package manifest before proposing a new dependency; prefer what
   is already installed.
5. Trace the affected data flow end to end (entry → persistence → output) and
   write it down.
6. Flag anything in the code that contradicts the task as stated.
7. Note hard constraints from project rules and invariants (tenancy, money,
   jobs, migrations, feature gates, public API surfaces, etc. as documented).

Evidence precedence: **live code > project docs > AGENTS.md > labeled
assumption**. Never present an assumption as a fact.

### 2. Research externally — best practices, norms, state of the art

**Mandatory.** Do not lock a design until you have surveyed what the wider
industry does for this problem class. In-repo fit constrains the solution;
external research informs what "correct" looks like.

Use web search, official docs, RFCs, vendor API references, academic/industry
papers when relevant, and high-signal engineering sources. Prefer **primary
sources** (official docs, specs, maintainer guides) over SEO roundups.

Cover, as applicable to X:

| Lens | What to find |
| --- | --- |
| **State of the art** | Current recommended approaches (last ~2 years when the field moves fast); what leading systems do now |
| **Common practice** | De-facto defaults in this stack/domain |
| **Best practice / pitfalls** | Established do/don'ts, failure modes, security/privacy footguns |
| **Standards & specs** | RFCs, W3C, language/API standards, compliance expectations |
| **Reference implementations** | How mature OSS or vendor systems solved the same shape of problem |
| **API / product contracts** | Official behavior of third parties we integrate |
| **UX / domain conventions** | Expected interaction patterns if users will touch this |

Minimum bar:

1. Write 3–6 concrete search questions derived from X (not one vague query).
2. Run them. Open and read the strongest sources — do not stop at titles/snippets.
3. Extract competing approaches, tradeoffs, and anti-patterns.
4. Note dates and applicability; call out conflicts with project invariants.
5. Record citations (title + URL + takeaway) in the plan.

If external consensus **conflicts** with repo invariants, document the conflict
and choose explicitly: adapt or reject with rationale. Skipping external
research because "we know the codebase" is not allowed.

### 3. Frame — lock the problem

- **Problem** — what is wrong or missing today
- **Outcome** — what will be true when this ships
- **In scope** / **Non-goals** (each non-goal with why)
- **Success metrics** — measurable or binary
- If a requirement is ambiguous and the ambiguity would change the design, ask
  numbered clarifying questions and **stop until answered**. For minor ambiguity,
  proceed and log the assumption. Comprehensive means nothing left unresolved —
  not maximum length.

### 4. Decide — deep design, not the first idea

For every non-trivial fork:

1. List **≥2 real alternatives** — include at least one from external
   common/SOTA practice when such a practice exists.
2. Evaluate against project invariants, failure modes, and external tradeoffs.
3. Pick one. Mini-ADR: context, options, decision, consequences, sources.
4. If only one option is viable, say why others are disqualified.

Prefer the **correct** design over the convenient one.

### 5. Specify — make behavior unambiguous

Requirements use **EARS** (one behavior per requirement):

| Pattern | Form |
| --- | --- |
| Ubiquitous | The `<system>` SHALL `<response>` |
| Event | WHEN `<trigger>`, the `<system>` SHALL `<response>` |
| State | WHILE `<state>`, the `<system>` SHALL `<response>` |
| Unwanted | IF `<condition>`, THEN the `<system>` SHALL `<response>` |
| Optional | WHERE `<feature>`, the `<system>` SHALL `<response>` |

Acceptance criteria: **Given / When / Then**, binary-testable. Ban vague words
(`fast`, `reliable`, `user-friendly`, `robust`, `as needed`, `should`).

Cover: happy path; validation/authz failures; empty/boundary/idempotent/
concurrent/partial-failure; migrations; observability.

### 6. Decompose — executable tasks with proof

Each task: logical unit of work; files/modules; dependencies; acceptance;
verification; wiring (routes, exports, migrations, env, flags). Tests and docs
required by `definition-of-done` are tasks in **this** plan — not follow-ups.

### 7. Self-critique

Before delivery, fix every miss. Checklist:

- [ ] External research performed (searches + sources read) and cited
- [ ] Competing external approaches considered in decisions
- [ ] Conflicts between SOTA and repo invariants made explicit
- [ ] Files read listed; data flow traced; package manifest checked before new deps
- [ ] No banned language; no empty sections; open questions empty
- [ ] Tasks cover tests, wiring, migrations, docs in this change
- [ ] Bidirectional trace: every requirement → ≥1 task; every task → a requirement
      (orphan requirement = gap; orphan task = scope creep — cut or justify)
- [ ] Verification plan proves the requirements, not just that tests pass
- [ ] Nothing vague enough that two engineers would implement it differently

Fix what you find, then present the plan. End with a short note on what the
self-critique changed. If it changed nothing, list the checks you ran.

## Required plan artifact

Write the plan to a durable path and summarize in the reply:

- **Default:** `docs/plans/YYYY-MM-DD-<slug>.md` (create `docs/plans/` if needed)
- **Cursor Plan Mode:** if the session already saved a plan under `.cursor/plans/`,
  update that file in place (or copy the final content into `docs/plans/` when
  the plan should live with the repo)

Every section populated; use `N/A — <reason>` only when truly inapplicable.

```markdown
# Plan: <precise name>

## 1. Summary
- Problem:
- Outcome:
- Approach (1 paragraph):

## 2. Scope
### In scope
### Non-goals (with rationale)
### Assumptions (labeled; must not block implementation)
### Open questions
<!-- Must be EMPTY at delivery. Ask design-changing questions and stop; resolve or non-goal everything else. -->

## 3. Current state (in-repo, evidence-based)
- Files read (path — why relevant):
- What exists today:
- Data flow (entry → persistence → output):
- Gaps / constraints / contradictions with the task:
- Reusable components / deps already installed:

## 4. External research
### Questions investigated
### Sources consulted
| Source | URL | Takeaway |
| --- | --- | --- |
### State of the art / common practice
### Pitfalls & anti-patterns to avoid
### Implications for this plan
<!-- adopt / adapt / reject — and why -->

## 5. Requirements
### Functional (EARS, R-01…)
### Non-functional
### Acceptance criteria (Given/When/Then, AC-01…)
### Edge cases & error paths

## 6. Design decisions (mini-ADRs)
### D-01: <title>
- Context / Options / Decision / Informed by / Consequences:

## 7. Technical design
### Architecture / data flow
### Data model & migrations
### APIs / jobs / UI surfaces
### Failure modes & retries / idempotency
### Feature flags / env (if any)
### Security, privacy, tenancy notes

## 8. Implementation tasks
### T-01: <title>
- Depends on / Touch / Do / Acceptance / Verify:

## 9. Test plan
- Tests to add or extend:
- Regression cases (fails-before / passes-after) if fixing a bug:
- Gate commands expected green:
- Manual / smoke checks (only what automation cannot cover):

## 10. Rollout & rollback
- Ship steps / Rollback (incl. data) / Monitoring signals:

## 11. Risk register
| Risk | Likelihood | Impact | Mitigation |

## 12. Definition of done
- [ ] All ACs pass
- [ ] Project gate green (typecheck + lint + test + build as documented)
- [ ] Docs / surfaces registered in the SAME change
- [ ] No stubs, TODOs, or deferred dependencies left in-scope
- [ ] External research recorded and reflected in decisions
```

## Guardrails

- Do **not** start implementation unless the user explicitly asks.
- Do **not** commit/push/PR unless the user explicitly asks.
- If blocked on a product choice only the user can make, ask **one batch** of
  A/B/C options with a recommendation — then finish the plan. Never leave the
  choice blank.
- Out of scope → **Non-goals** with rationale. Never "defer" an in-scope decision.

## After drafting

Prefer running `review-plan` (`/review-plan` or "Review the plan") before
implementation — especially for non-trivial work. After implementation, close
the loop with `review-build` (`/review-build`).

## Never do

- Ship a plan with `TBD` / stubs / "figure out during implementation"
- Claim "best practice" without a citation
- Skip external research
- Plan a shortcut that violates `no-shortcuts` or project invariants

## Pairs with

- skills: `review-plan`, `review-build`, `planning-a-change`, `writing-an-adr`,
  `researching-a-dependency`, `running-a-dev-cycle`, `writing-tests`
- rules: `no-shortcuts`, `definition-of-done`, `regression-test`,
  `testing-conventions`, `db-migration-safety`, `commit-and-pr-conventions`
- commands: `plan` (`/plan`), `review-plan-cmd` (`/review-plan`),
  `review-build-cmd` (`/review-build`)
- workflows: `ship-a-feature`, `plan-then-build`, `onboard-to-codebase`, `run-autonomous-loop`
