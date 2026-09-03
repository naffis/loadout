# Lifecycle catalog — acquire / release pairs

Seeds come from `lifecycle-sweep.sh`. Pair on **all** paths.

## DOM / browser

| Acquire                                                        | Release                       | Miss pattern                       |
| -------------------------------------------------------------- | ----------------------------- | ---------------------------------- |
| `addEventListener`                                             | `removeEventListener` same fn | Arrow recreated each render        |
| `setInterval`                                                  | `clearInterval`               | Effect deps change; old id dropped |
| stored `setTimeout`                                            | `clearTimeout`                | Navigates away; still `setState`   |
| `EventSource`                                                  | `.close()`                    | New session without closing old    |
| `WebSocket`                                                    | `.close()`                    | Error path leaves socket open      |
| `URL.createObjectURL`                                          | `revokeObjectURL`             | Blob URL kept in gallery state     |
| `requestAnimationFrame`                                        | `cancelAnimationFrame`        | Loop after unmount                 |
| `MutationObserver` / `IntersectionObserver` / `ResizeObserver` | `.disconnect()`               | Missing effect cleanup             |

## Async / network

| Acquire                        | Release                              | Miss pattern                      |
| ------------------------------ | ------------------------------------ | --------------------------------- |
| `fetch`                        | `AbortSignal` / `controller.abort()` | Stale response writes state       |
| `AbortController`              | `abort()` on replace                 | Second request; first still lands |
| `ReadableStream` / file handle | `.cancel()` / `.close()`             | Error before close                |

## Jobs / workers

| Acquire              | Release                            | Miss pattern                      |
| -------------------- | ---------------------------------- | --------------------------------- |
| Queue job / cron     | complete or fail; redelivery-safe  | Side effect twice on redelivery   |
| In-memory handler map| delete on settle                   | Isolate grows across jobs         |
| Hanging promise      | bound timeout or abort             | Unbounded work keeps the process  |

## React

Effect acquire **must** return a cleanup. Strict Mode mounts twice — cleanup
must be idempotent. `useSyncExternalStore` subscribe must unsubscribe.

## Python

| Acquire                                | Release                           | Miss pattern               |
| -------------------------------------- | --------------------------------- | -------------------------- |
| `aiohttp.ClientSession` / httpx client | `async with` / `.aclose()`        | Session left open on raise |
| `open()`                               | `with` or `.close()` in `finally` | Error path skips close     |
| subprocess                             | `.wait()` / `.kill()` on abort    | Zombie on timeout          |

## Money (generic)

| Acquire             | Release                     | Miss pattern                 |
| ------------------- | --------------------------- | ---------------------------- |
| Debit / reserve     | settle, refund, or park     | Replay double-charges        |
| Idempotency key     | same key on retry           | Second delivery mints again  |

Product-specific money rows belong in `hunting-defects/references/project-overlay.md`.

## Gold pairing

Correct: same function reference in effect cleanup — `addEventListener` /
`removeEventListener` of a named function in the `useEffect` return. Do **not**
promote that shape.

Incorrect: `addEventListener("click", () => …)` inside render with no cleanup,
or a new arrow every render so `removeEventListener` cannot match.
