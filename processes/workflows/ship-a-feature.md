---
name: ship-a-feature
uses:
  rules:
    [
      no-shortcuts,
      size-limits,
      testing-conventions,
      test-coverage,
      commit-and-pr-conventions,
      regression-test,
      documentation-updates,
      review-build-rule,
    ]
  skills:
    [
      planning-a-change,
      deep-flight,
      review-build,
      post-flight,
      verifying-session-surfaces,
      reviewing-and-shipping,
      writing-tests,
      writing-commit-messages,
      opening-a-pr,
      making-a-pr-reviewable,
      updating-docs,
    ]
  agents: [reviewer, flight-checker]
  commands:
    [
      deep-flight-cmd,
      review-build-cmd,
      post-flight-cmd,
      verifying-session-surfaces-cmd,
    ]
gate: "<project test + lint command>"
stop_condition: "applicable batch checks pass, required review satisfied, docs match behavior; commit/PR only if asked"
state: ".loadout/state/ship-a-feature.md"
---

# Ship a feature

End-to-end recipe for landing a non-trivial but well-understood change. For high-stakes,
unfamiliar, or decision-heavy work, use `plan-then-build` instead (`/plan` →
`/review-plan` → implement → `/review-build`).

1. **Frame** — use a short acceptance contract; plan only to resolve uncertainty.
   Keep the existing checkout and warm services. Default to one writer.
2. **Implement and test** — cover changed behavior and meaningful failure paths;
   bug fixes get regression proof. Use focused tests and diagnostics while editing.
3. **Validate the batch** — run the applicable project gate once when the coherent
   change is ready. Reuse matching results from the same inputs. Broaden checks
   for shared interfaces, config/dependencies, uncertain impact, or required gates.
4. **Exercise relevant surfaces** — for changed UI/API/CLI behavior, obtain evidence
   through the relevant surface. Use `verifying-session-surfaces` for a requested
   session-wide exercise or changes spanning several surfaces; do not expand every
   local fix into a full product audit.
5. **Update docs** — change matching docs/changelog when behavior or procedures change.
6. **Review once at the appropriate scope** — satisfy required independent review.
   Use `review-build` for plan compliance or material risk. Use `deep-flight` when
   correcting actual mid-build drift, and `post-flight` when requested or warranted
   by accumulated gaps. A matching completed checker/review satisfies overlapping
   handoffs; retain specialized security or other project-required reviews.
7. **Hand off** — report behavior, evidence, and remaining required gates. Commit,
   push, or PR only when explicitly authorized. Use a coherent ready batch via
   `committing-on-shared-trunk` when applicable; unrelated WIP stays out.

A workflow step does not create another full-test/reviewer cycle by itself. The
adopted `.loadout/engineering/WORKFLOW.md` and `project.json` route coordination
and validation; actual project CI/release gates remain required.
