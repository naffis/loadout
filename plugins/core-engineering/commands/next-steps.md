---
description: Recap this session from evidence, deep-dive the leftover, emit one paste-ready next prompt.
---

Run the `recommending-next-steps` skill in full. Reconstruct this chat from
git + asks (not memory), run `deep-dive` or `debugging-an-issue` on the leftover
(`do-it-right` Phases 0–2 if they already approved a shallow fix), then emit
**one** paste-ready next prompt.

This is not `getting-started` (no work yet), not `session-handoff` (packet),
not `post-flight` (wrap + fix), not a bare `deep-dive`.

Do **not** implement. Do not write a handoff file unless asked.

## Process (do not skip)

1. Reconstruct — `git status --porcelain`, `git diff --stat`, `git log -5
--oneline`. Quote them. Asks / accomplished (path or receipt) / leftover
   (one sentence) / failed attempts.
2. Route — read and run the owning skill on the leftover (`deep-dive` /
   `debugging-an-issue` / `do-it-right` 0–2 / skip if already proven this chat).
3. Commit one next skill. Kill criteria. Out of scope. `DECISION:` if needed.
4. One self-review pass (skip LIGHT).
5. Short recap, then **last** — emit this fence and nothing after it. A
   `## Next` sentence is incomplete:

```text
<root-skill>: <committed leftover + enough context to act>

Specimen: <plan path / issue id — omit if none>
Root node: <file:symbol or layer — omit if a plan>
Class / slice: <siblings or smallest validating slice>
Out of scope: …
Do not implement a proximate patch. Follow the named skill in full.
```

Focus / leftover: $ARGUMENTS
