---
name: auditing-resource-lifecycle
description: >
  Hunt resource and lifecycle leaks by walking acquire versus release on every
  path — success, throw, early return, unmount, abort, replay. Covers listeners,
  timers, AbortController, EventSource/WebSocket, object URLs, streams, queue
  waiters, and subscriptions. Triggers: "find leaks", "lifecycle audit",
  "memory leak", "listener leak", "unsubscribe missing", "revokeObjectURL",
  "timer leak", "SSE leak", "/audit-lifecycle". Anti-triggers: known crash →
  debugging-an-issue; whole-surface hunt → hunting-defects (dispatches this
  pass); maintainability → reviewing-code-quality.
---

# Auditing resource lifecycle

A leak is an **acquire without a matching release on every path**, not only a
growing heap. Debits, EventSource, and React effects count.

Dispatched by `hunting-defects` or used standalone on a named path. Routing:
`.cursor/skills/hunting-defects/references/family.md`. Catalog:
[`references/lifecycle-catalog.md`](references/lifecycle-catalog.md).

## Trigger

User asks about leaks, cleanup, unsubscribe, abort, unmount, latches, or
unbounded waiters — or the orchestrator named this class.

## Workflow

### 0. Census if the user named a directory

```bash
.cursor/skills/hunting-defects/scripts/census.sh <path...>
```

Quote it. Completeness is `review:` files, not "we grepped." Skip this only when
the user named one file.

### 1. Sweep (required receipt)

```bash
.cursor/skills/auditing-resource-lifecycle/scripts/lifecycle-sweep.sh <path...>
```

Quote the `RECEIPT`. Hits are **seeds**, not findings. Every `imbalance: … delta>0`
line must be paired, killed, or listed as a candidate — ignoring delta is a
skipped hunt.

### 2. Pair every acquire

For each seed, read [`references/lifecycle-catalog.md`](references/lifecycle-catalog.md)
and pair. If `hunting-defects/references/project-overlay.md` exists, apply its
leak-hotspot rows too. If this skill directory has `references/platform-leaks.md`
(consumer extra), read that as well.

Read the **function**, not the line. Trace early returns and `catch`. Same
function-reference for add/remove. Fire-and-forget `setTimeout` is a leak only
if it `setState`s after unmount.

### 3. React / island effects

For every `useEffect` / `useLayoutEffect` that acquires:

- Cleanup function present?
- Cleanup uses the **same** listener reference?
- Strict-mode double-mount safe (subscribe → unsub → sub)?
- Dependency array does not re-acquire without releasing the prior instance?

### 4. Refute

Promote only when a named path skips release (error, unmount, replace, replay).
Kill when cleanup is in a `finally`, effect return, or abort signal that
covers that path. Use `.cursor/skills/hunting-defects/references/refute-protocol.md`.

### 5. Siblings

One confirmed leak → grep the census for the same acquire API. Refute each hit.

## Output

```markdown
# Lifecycle audit — <surface>

Sweep RECEIPT: (paste, including imbalance lines)

## Imbalances

- `addEventListener` delta=N → paired | candidate | kill: …

## Leaks (promoted)

- [Critical|High|Medium] `file:line` acquire=`…` missing path=`…` impact=`…`

## Paired (killed)

- `file:line` released in `…`

## Speculative

- `file:line` — unread callee / flag
```

## Guardrails

- Do not flag a listener that is removed with the same function reference.
- Do not flag fire-and-forget `setTimeout` of a one-shot UI tick unless it
  closes over unmounted state that setStates.
- Do not implement unless the user asked. Hand off to `do-it-right`.
- Unbounded growth in SSE / worker isolate / wallet is Critical.

## Pairs with

- skills: `hunting-defects`, `walking-failure-paths`, `root-cause-fix`
- rules: `no-shortcuts`
- commands: `audit-lifecycle-cmd` (`/audit-lifecycle`)
- workflows: `defect-hunt`
- docs: `doc-defect-hunt-family`
