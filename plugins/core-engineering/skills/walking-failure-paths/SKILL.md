---
name: walking-failure-paths
description: >
  Exhaustive walk of every failure, empty, timeout, cancel, retry, park, and
  idempotency path in a named module. Finds swallowed errors, silent fallbacks,
  fail-open that should fail-closed, untested branches, and edge cases the happy
  path hides. Triggers: "walk failure paths", "edge cases", "error path audit",
  "what happens on empty", "cancel path", "retry safety", "untested branches",
  "/walk-failure-paths". Anti-triggers: known red test → debugging-an-issue;
  leak-only → auditing-resource-lifecycle; whole-surface hunt → hunting-defects
  (dispatches this pass).
---

# Walking failure paths

The happy path is the part everyone already ran. This skill walks **every other
exit**: empty, null, throw, timeout, 4xx/5xx, cancel, retry, park, replay.

Dispatched by `hunting-defects` or used standalone. Routing:
`.cursor/skills/hunting-defects/references/family.md`. Matrix:
[`references/path-matrix.md`](references/path-matrix.md).

## Trigger

User asks for edge cases, error-path audit, empty/cancel/retry behavior, or
"what if this fails" on a named module.

## Workflow

### 0. Census if the user named a directory

```bash
.cursor/skills/hunting-defects/scripts/census.sh <path...>
```

Quote it. Walk every `review:` export; do not sample.

### 1. Sweep (required receipt)

```bash
.cursor/skills/walking-failure-paths/scripts/failure-path-sweep.sh <path...>
```

Quote the `RECEIPT`. Hits are seeds.

Also run shortcut-sweep on the same paths — swallowed catches are this class:

```bash
.cursor/skills/_shared/scripts/shortcut-sweep.sh <path...>
```

If shortcut-sweep is missing, say so; the failure-path sweep still covers
empty `catch`.

### 2. Inventory exits

For each exported function / handler / effect in scope, list exits from
[`references/path-matrix.md`](references/path-matrix.md). If you cannot name
an exit, you have not read the function. Inventory exports with
`rg -n "^export " <path>` when the module is not tiny.

`safeParse` whose `.error` is ignored, `Promise.all` that should be
`allSettled`, and `void fetch(` are seeds from the sweep — trace them.

### 3. Trace, don't guess

For each non-happy exit:

1. Read the branch (or the missing branch).
2. Name the user-visible or invariant result.
3. Check a test exists that **fails if the branch is deleted**. No test →
   candidate (test-net gap), not automatically a product bug.
4. `catch` that returns `null` / `[]` / `undefined` without a structured event
   is a **honesty** finding (`no-shortcuts`) unless the owning doc names
   fail-open.

### 4. Retry and cancel

- Retry: idempotent? debit key stable? does it skip a latch?
- Cancel: in-flight fetch aborted? UI not `setState` after unmount?
- Replay (webhook / queue job): second delivery safe?

### 5. Refute and siblings

Use `.cursor/skills/hunting-defects/references/refute-protocol.md`. One swallowed
`catch` → grep remaining `catch (` in the census.

## Output

```markdown
# Failure-path walk — <surface>

Sweep RECEIPT: (paste)

## Missing or dishonest exits

- [Critical|High|Medium] `file:line` exit=`empty|timeout|cancel|…`
  **Happens:** …
  **Should:** …
  **Test:** none | `path` (does not pin this exit)

## Covered exits

- `fn` / `empty` — tested in `…`

## Speculative

- …
```

## Guardrails

- An untested happy-path-adjacent branch is Medium until you prove user harm.
- Fail-open is legal only when the owning doc says so — cite it or promote.
- Do not implement unless asked. `do-it-right` then `root-cause-fix`.
- Do not invent exits the types make impossible (exhaustive union already
  handled) — still check the `default` / `unknown` arm.

## Pairs with

- skills: `hunting-defects`, `auditing-resource-lifecycle`, `writing-tests`,
  `improving-test-coverage`, `debugging-an-issue`
- rules: `no-shortcuts`, `regression-test`
- commands: `walk-failure-paths-cmd` (`/walk-failure-paths`)
- workflows: `defect-hunt`
- docs: `doc-defect-hunt-family`
