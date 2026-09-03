# Task: adopt-2026-cursor-practice

## Outcome

Four named assets ship (`context-hygiene`, `agents-md-hygiene`, `verifying-a-claim`, `resolving-merge-conflicts`), `no-inline-imports` is glob-attached, CLI projects only `alwaysApply: true` rules into `CLAUDE.md` and unprojects the rest, catalog/usage point at Cursor-native review/loop skills, `npm test` + `npm run build` + `npm run doctor` exit 0.

## Spec pointer

- Plan: [.cursor/plans/2026-09-02-adopt-2026-cursor-practice.md](../../plans/2026-09-02-adopt-2026-cursor-practice.md)
- Request: create-plan adopt 2026 Cursor practice (shrink always-on, fill four holes)
- Review: P0 Claude projection + pairs_with lock; see plan Review changelog

## Topology

- Choice: single-loop
- Escalation test 1 (disjoint files / no data dep): FAIL — catalog, registry, usage, getting-started, plugin manifests, and CLI projection files are shared across every slice
- Escalation test 2 (independent verifiers): FAIL — doctor requires every new `source` and `pairs_with` id to exist; a partial add fails the full-suite verifier
- Rationale: default single-loop. Graph/pipeline would fight shared docs and a single doctor gate.

## Shared contract

- Path: N/A for single-loop
- Editor: `decompose` only (implement-node units import/consume; never edit)

## Full-suite verifier

`npm test && npm run build && npm run doctor`

## Units

<!-- single-loop: omit -->

## Merge order

1. Single loop implements T-01 through T-05 in order (T-02 now includes CLI projection)

## Isolation mode

- shared-trunk
- Reason: this repo's operating model is one checkout; user did not ask for worktrees

## Notes / failures

- `recommending-next-steps` is on HEAD (`7b17890`); keep those rows when editing catalog/usage/registry/getting-started/fence test
- `pairs_with` must not include `next-prompt`
- Do not add new skills to workflow `uses:`
