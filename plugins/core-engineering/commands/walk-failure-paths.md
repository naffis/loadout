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

Last — emit this fence and nothing after it. A `## Next` sentence is
incomplete:

```text
do-it-right: <promoted exit + enough context to act>

Specimen: <plan path / issue id — omit if none>
Root node: <file:symbol or layer — omit if a plan>
Class / slice: <siblings or smallest validating slice>
Out of scope: …
Do not implement a proximate patch. Follow the named skill in full.
```

Do not commit/push/PR unless explicitly asked.

Surface / notes: $ARGUMENTS
