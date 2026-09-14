---
name: walking-failure-paths
description: >
  Walk every failure, empty, cancel, and retry path in a named module. Use for "walk failure paths" or /walk-failure-paths.
---

# Walking failure paths

Dispatched by `hunting-defects` or standalone. Routing:
`.cursor/skills/hunting-defects/references/family.md`. Exits:
[`references/path-matrix.md`](references/path-matrix.md). Do not implement
unless asked (`do-it-right` then `root-cause-fix`). Fail-open is legal
only when the owning doc says so. Untested adjacent branch is Medium
until you prove user harm.

## Workflow

### 0–1. Census + sweep (required receipts)

If the user named a directory, census first — walk every `review:`
export; do not sample. Sweep always:

```bash
.cursor/skills/hunting-defects/scripts/census.sh <path...>
.cursor/skills/walking-failure-paths/scripts/failure-path-sweep.sh <path...>
.cursor/skills/_shared/scripts/shortcut-sweep.sh <path...>
```

Quote each `RECEIPT`. Hits are seeds. If shortcut-sweep is missing, say
so; the failure-path sweep still covers empty `catch`.

### 2. Inventory exits

For each exported function / handler / effect, list exits from
`references/path-matrix.md`. Cannot name an exit → you have not read the
function. `rg -n "^export " <path>` when the module is not tiny.
`safeParse` ignoring `.error`, `Promise.all` vs `allSettled`, `void fetch(`
are seeds — trace them.

### 3. Trace

For each non-happy exit: read the branch (or the missing one); name the
user-visible or invariant result; check a test that **fails if the
branch is deleted**. No test → candidate (**test-net gap ≠ product
bug**). `catch` that returns `null` / `[]` / `undefined` without a
structured event is an **honesty** finding (`no-shortcuts`) unless the
owning doc names fail-open.

### 4. Refute and siblings

`.cursor/skills/hunting-defects/references/refute-protocol.md`. One
swallowed `catch` → grep remaining `catch (` in the census.

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

## Pairs with

- skills: `hunting-defects`, `auditing-resource-lifecycle`, `writing-tests`,
  `improving-test-coverage`, `debugging-an-issue`
- rules: `no-shortcuts`, `regression-test`
- commands: `walk-failure-paths-cmd` (`/walk-failure-paths`)
- workflows: `defect-hunt`
- docs: `doc-defect-hunt-family`
