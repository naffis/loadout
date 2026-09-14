---
name: cleaning-ai-copy
description: >
  Rewrite user-facing prose so it no longer reads like a model. Use for "deslop copy", "AI voice", or /deslop-copy. Code slop → deslopping.
---

# Cleaning AI copy

## Trigger

Named paths or the session prose diff still sound like a landing page or a
chatbot. Docs, changelog, UI strings, recaps.

## Workflow

1. **Scope.** Named paths, or `*.md` / `*.mdx` in the session diff. Do not
   glob all `ts` / `tsx`.
2. **Scan.** Run the script beside this `SKILL.md`:

   `node scripts/scan-ai-copy.mjs [--report-only] [paths…]`

   Vendored: `.cursor/skills/cleaning-ai-copy/scripts/scan-ai-copy.mjs`.
   Quote the RECEIPT. No RECEIPT → not done.
3. **Rewrite** RED and ORANGE hits. Keep the claimed meaning.
   - Taxonomy + invariant: add you or a concrete noun; keep the promise;
     replace "the value" with the key / the secret / it.
   - Not-X-but-Y → one claim.
   - Leftover cite or chat tokens → delete.
   - Cluster / promo / dangling `-ing` → a plain sentence.
4. YELLOW (em dash density, even rhythm) only when the user asked for a full
   pass or the same paragraph already has RED/ORANGE.
5. **Re-scan.** Quote the second RECEIPT. Exit 0 on RED/ORANGE is the stop.
   One more rewrite if new RED appeared. If a hit cannot be removed without
   changing meaning, stop and ask.
6. Close with `_shared/plain-english-brief.md`. Catalog:
   `_shared/ai-copy-tells.md`.

Do not paste the measured-word list into this file. Do not print a "% AI"
score. Do not call a detector API.

## Suggested Checks

- Both RECEIPT blocks are in the reply.
- Meaning of each edited sentence is unchanged.
- No leftover cite tokens remain in the scoped files.

## Guardrails

- Code-only slop → `deslopping`.
- YAGNI / flatten → `simplifying-code`.
- `/deslop` is not this command. This command is `/deslop-copy`.
- Default scan excludes the catalog, fixtures, `.cursor/plans/`, and
  `.loadout/tasks/`. `--include-self` to scan those.
- If a sibling has the same prose file open, stop and ask.

## Pairs with

- rules: `copy-voice`
- skills: `deslopping`, `simplifying-code`
- commands: `deslop-copy` (`/deslop-copy`) — registry id `deslop-copy-cmd`
