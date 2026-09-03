# Failure-path matrix

Walk every row that applies to the function. Skip only when the type system
makes the case impossible **and** the default/unknown arm is handled.

## Input shape

| Exit                          | Probe                                                            |
| ----------------------------- | ---------------------------------------------------------------- |
| Empty string / `[]` / omitted | Distinct from zero / false?                                      |
| `null` vs `undefined`         | Optional JSON fields; schema `.optional()` vs `.nullable()`      |
| Zero / `$0` / `0`             | Off-by-one; "empty" check that treats 0 as missing               |
| Oversized                     | Caps — 400 vs silent truncate                                    |
| Wrong union member            | Exhaustive switch; `default` must fail-closed or be unreachable  |

## Time and control

| Exit            | Probe                                                        |
| --------------- | ------------------------------------------------------------ |
| Timeout         | `AbortSignal.timeout`; hanging downstream; fake timers       |
| Abort / unmount | In-flight fetch; `setState` after unmount; EventSource close |
| Cancel          | User cancel vs infra cancel; both must journal terminal      |
| Retry           | Same idempotency key; no double debit; no skipped latch      |
| Replay          | Webhook, queue job — second delivery                         |

## Downstream

| Exit                | Probe                                             |
| ------------------- | ------------------------------------------------- |
| 4xx                 | Body decoded; not retried as infra                |
| 5xx / network       | Retry budget; fail loudly, never stub success     |
| Unconfigured vendor | Skip or fail closed — never invent a success      |

## Honesty

| Smell                                    | Treat as                                 |
| ---------------------------------------- | ---------------------------------------- |
| `catch { }` / `catch { return null }`    | Finding unless documented fail-open      |
| `?? []` / `\|\| []` hiding a failed load | Finding if caller thinks it is real data |
| Fallback that invents facts / money      | Fail closed — never invent               |
| `safeParse` ignoring `.error`            | Invalid input treated as success         |
| `Promise.all` vs `allSettled`            | One reject drops sibling work silently   |
| `void fetch(` / unawaited then           | Late write after unmount; lost 4xx       |
| `@ts-ignore` / `as any`                  | Honesty + type hole                      |
| TODO / handle later                      | Incomplete behavior (`no-shortcuts`)     |

## Tests

A path is **pinned** only if deleting the branch fails a test. "We have a test
file" is not pinning. Sibling variation of the same exit belongs in the same
test file.
