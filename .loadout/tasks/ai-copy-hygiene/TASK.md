# Task: ai-copy-hygiene

## Outcome

Prevention (`copy-voice` + `plain-english-brief` Words), guidelines (`ai-copy-tells.md`), filter (`scan-ai-copy.mjs` RECEIPT), and cleanup (`cleaning-ai-copy` + `/deslop-copy`) ship on shared trunk. `npm test`, `npm run build`, and `npm run doctor` are green. No new `alwaysApply: true`. No workflow `uses:` add. `kits.starter` unchanged.

## Spec pointer

- Plan: `.cursor/plans/2026-09-08-ai-copy-hygiene.md`
- CreatePlan: AI copy hygiene (Build UI)

## Topology

- Choice: single-loop
- Escalation test 1 (disjoint files / no data dep): FAIL — catalog, registry, usage, getting-started, plugin manifest, and neighbor `pairs_with` are shared across the scanner, rule, skill, and command slices.
- Escalation test 2 (independent verifiers): FAIL — `loadout doctor` must see every new source plus `pairs_with` in the same tree; the scanner test alone cannot certify docs/registry.
- Rationale: Same coupling as adopt-2026-cursor-practice. A graph would collide on `registry.json` and `docs/catalog.md`. Sequential tasks T-01→T-04 live in one implementer loop.

## Shared contract

- Path: N/A for single-loop
- Editor: `decompose` only (implement-node units import/consume; never edit)

## Full-suite verifier

`npm test && npm run build && npm run doctor`

## Units

<!-- single-loop: omit or leave empty -->

## Merge order

1. Single loop (T-01 → T-04 in the research plan)

## Isolation mode

- shared-trunk
- Reason: `shared-working-tree` is installed. User did not ask for a worktree.

## Notes / failures

- Do not edit `.cursor/plans/2026-09-02-adopt-2026-cursor-practice.md`.
- Leave sibling WIP in the tree. Touch `plain-english-brief.md` only in the Words section.
- `pairs_with` ids only; never `next-prompt`.
- Taxonomy + invariant (“X for Y. Z never happens.”) is a named scaffold. See research plan D-05, AC-11–AC-13, AC-16.
- Scanner default-excludes catalog/fixtures/plans (D-06, R-15). Brief must not paste `delve` / `tapestry` / `oaicite`.
- Bump `.claude-plugin/marketplace.json` root + `core-engineering` entry and `plugins/core-engineering/.claude-plugin/plugin.json` to 0.21.0 together.
