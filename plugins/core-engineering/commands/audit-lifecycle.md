---
description: Hunt resource/lifecycle leaks — acquire vs release on every path.
---

Run the `auditing-resource-lifecycle` skill in full. Walk acquire versus
release on success, throw, early return, unmount, abort, and replay.

Quote the `lifecycle-sweep.sh` RECEIPT. Hits are seeds, not findings. Pair
every acquire. **Explain every `imbalance delta>0`.** Promote only when a named
path skips release.

If the user named a directory, run `census.sh` first. Default is **report only**.

Last — emit this fence and nothing after it. A `## Next` sentence is
incomplete:

```text
do-it-right: <promoted leak + enough context to act>

Specimen: <plan path / issue id — omit if none>
Root node: <file:symbol or layer — omit if a plan>
Class / slice: <siblings or smallest validating slice>
Out of scope: …
Do not implement a proximate patch. Follow the named skill in full.
```

Do not commit/push/PR unless explicitly asked.

Surface / notes: $ARGUMENTS
