---
description: Walk every failure, empty, cancel, retry, and park path in a module.
---

Run the `walking-failure-paths` skill in full. The happy path is not the
audit. Name every exit; trace empty, timeout, cancel, retry, and fail-closed
vs fail-open.

Quote the `failure-path-sweep.sh` RECEIPT. Name every exit; trace empty,
timeout, cancel, retry, `safeParse` errors, and `Promise.all`. Swallowed
`catch` / silent `return null` are honesty findings unless the owning doc
names fail-open.

If the user named a directory, run `census.sh` first. Default is **report only**.

Do not commit/push/PR unless explicitly asked.

Surface / notes: $ARGUMENTS
