---
name: ship-a-feature
uses:
  rules: [no-shortcuts, size-limits, testing-conventions, test-coverage, commit-and-pr-conventions, regression-test, documentation-updates]
  skills: [planning-a-change, reviewing-and-shipping, writing-tests, writing-commit-messages, opening-a-pr, making-a-pr-reviewable, updating-docs]
  agents: [reviewer]
gate: "<project test + lint command>"
stop_condition: "tests and lint pass, reviewer reports no correctness/intent gaps, PR opened"
state: ".loadout/state/ship-a-feature.md"
---

# Ship a feature

End-to-end recipe for landing a non-trivial change.

1. **Plan** — `planning-a-change`: explore the code, write and stress-test a short plan.
2. **Implement** — smallest safe change first, following existing patterns.
3. **Test** — `writing-tests`: cover the new behavior, edge cases, and error paths (not just lines — `test-coverage`); bug fixes get a failing-then-passing test (`regression-test`).
4. **Verify** — run the `gate` command; show the evidence.
5. **Update docs in the same change** — `updating-docs`: README/API/docstrings/config/changelog for anything the change altered (`documentation-updates`).
6. **Review (maker ≠ checker)** — dispatch the `reviewer` agent on the diff vs the plan. Fix correctness/intent gaps; ignore over-engineering suggestions.
7. **Commit & PR** — `writing-commit-messages`, then `opening-a-pr` with a validation-first description. For a noisy or large diff, `making-a-pr-reviewable` first (tidy history, reviewer guidance).

Run each step as a verified loop (`agentic-loop`): write the stop contract, verify against ground truth, keep edits unstaged. Hand-off: planning-a-change produces the plan the reviewer checks against. The state file records what's done so a resumed run continues cleanly.
