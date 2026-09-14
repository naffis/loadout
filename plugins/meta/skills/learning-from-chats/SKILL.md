---
name: learning-from-chats
description: >
  Extract a reusable lesson from a chat into the harness. Use when asked to learn from this session.
---

# Learning from chats

## Trigger

A recurring correction or preference has shown up across sessions, or the user asks to "learn" how they work.

## Workflow

1. **Gather signal:** review recent chats/corrections for patterns — things the user repeatedly asks for, fixes, or rejects.
2. **Distill** each into one durable statement of intent. Drop one-offs and project-specific noise.
3. **Classify** each via the decision test:
   - Persistent constraint, no steps → **rule** (or an `AGENTS.md` line if cross-tool baseline).
   - Invokable procedure → **skill**.
4. **Author** with `rule-author` / `skill-author`. Generalize: replace project specifics with placeholders.
5. **Sanitize:** never capture secrets, client names, or internal hosts into a public asset.
6. Register and run `loadout doctor`.

## Guardrails

- Capture intent, not transcripts. One clear statement beats a pile of quotes.
- Confirm with the user before promoting a contested preference to an always-on rule.

## Pairs with

- skills: `skill-author`, `rule-author`
- rules: `no-secrets-in-code`
