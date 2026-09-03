---
description: Write or resume a durable session handoff for a fresh chat.
---

Run the `session-handoff` skill in full.

If the user is ending work or context is full → **write** a handoff to
`.cursor/handoffs/<date>-<slug>.md` (local; do not commit unless asked).
Use `docs/dev/handoffs/` only when the user wants a shared/committed packet.

If the user wants to continue → **resume** the newest (or named) handoff,
drift-check against git, restate Next step, and ask before large execution.

No secrets in the packet.

Last — emit this fence and nothing after it. A `## Next` sentence is
incomplete:

```text
<root-skill from the packet Next step>: <enough context to resume>

Specimen: <handoff path / issue id — omit if none>
Root node: <file:symbol or layer — omit if a plan>
Class / slice: <siblings or smallest validating slice>
Out of scope: …
Do not implement a proximate patch. Follow the named skill in full.
```

Focus / path: $ARGUMENTS
