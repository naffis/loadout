---
description: Hunt resource/lifecycle leaks — acquire vs release on every path.
---

Run the `auditing-resource-lifecycle` skill in full. Walk acquire versus
release on success, throw, early return, unmount, abort, and replay.

Quote the `lifecycle-sweep.sh` RECEIPT. Hits are seeds, not findings. Pair
every acquire. **Explain every `imbalance delta>0`.** Promote only when a named
path skips release.

If the user named a directory, run `census.sh` first. Default is **report only**.

Do not commit/push/PR unless explicitly asked.

Surface / notes: $ARGUMENTS
