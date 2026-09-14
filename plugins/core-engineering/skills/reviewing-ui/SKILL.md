---
name: reviewing-ui
description: >
  Multi-cycle UI review-and-fix through first-time and expert lenses. Use for a UX review. Visual recreation → recreating-a-design.
disable-model-invocation: true
---

# Reviewing UI

Judge the **rendered** product (`references/ui-evidence.md`). `UI-REVIEW.md`
is the decision log — resume from it. Expect 2–4 cycles; **hard cap 5**.
Phases 0–1 first cycle only.

## Cycle

**0 Context (first cycle).** Derive from the app; don't ask. In
`UI-REVIEW.md`, mark each **observed** or **inferred**: Product, Primary
user, Top 3 jobs, What "powerful" means, Scope (exclusions + reason),
Constraints (design system / brand).

**1 Inventory (first cycle).** Screen map: every route's one-sentence
purpose + how reached; primary actions; nav; states (default, loading,
empty, error, success, edge). Unstatable purpose = finding #1. Present
brief + map at end of Phase 1.

**2 Cold walkthrough.** Drive the running app through the top 3 jobs
(first-time, then power user). Friction log: hesitation, mystery label,
dead end, missing feedback, repetitive-task tax.

**3 Expert audit.** Grade solid / needs work / broken: information
architecture, hierarchy, consistency, feedback and status, error
prevention and recovery, states, clarity of copy, efficiency,
accessibility floor, responsive behavior.

**4 Prioritize.** Merge 2–3 into `UI-REVIEW.md`. Per finding: location,
what's wrong, why it matters (which lens), proposed fix, effort S/M/L,
severity:

- **P0** core job blocked or user misled
- **P1** significant core-path friction
- **P2** secondary / polish
- **P3** nice to have

Present for approval, or autonomously take all P0s + highest-leverage P1s
(max ~8). Do not fix yet. Where multiple fixes are viable, recommend one.

**5 Fix the batch.** Approved batch only. Log each change. New
discoveries → findings, not drive-bys.

**6 Verify and re-enter.** Re-walk touched flows **through the rendered
UI**. Update severities. Shippable batch → fresh-context `reviewer`
(maker ≠ checker). Next cycle at Phase 2 (revisit 0–1 only if surface or
brief changed).

## Stop / resume

Stop when a full Phase 2 of all top-3 jobs has zero P0/P1 **and** Phase 3
is solid or has accepted logged exceptions — or a plateau cycle — or cap
5. Then: what changed, what was left and why, P2/P3 backlog.

Existing `UI-REVIEW.md`: approved batch unfixed → Phase 5; batch just
fixed → Phase 6; else Phase 2. Never invent P2s to justify another loop;
never verify a fix by re-reading the diff.

## Pairs with

- skills: `agentic-loop` (loop discipline), `root-cause-fix` (defects found here),
  `exercising-the-product` (behavior-level loop; UI findings from there land in this log),
  `recreating-a-design` (matching a specific visual target)
- rules: `ui-evidence`, `no-shortcuts`, `definition-of-done`
- agents: `reviewer` (maker-checker on fix batches), `explorer`
- workflows: `run-quality-loop`
