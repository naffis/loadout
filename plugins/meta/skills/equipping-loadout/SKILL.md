---
name: equipping-loadout
description: >
  Install or refresh loadout from INSTALL.md. Use for "install loadout", "equip this project", or "update loadout".
---

# Equipping loadout

## Trigger

The user points at the loadout GitHub repo (or a checkout of it) and wants to **install**
it into their project, or **update** an existing install to match upstream.

Portable workflow adoption or update → `adopting-engineering`. That route uses only
engineering plan/apply/check and preserves project docs; do not run the flows below.

## Workflow

1. **Load the contract.** `INSTALL.md` is the single source of truth for commands and the
   starter set. Resolve it in order:
   1. Consumer project root `INSTALL.md` (vendored via `doc-install`)
   2. Else this loadout checkout's `INSTALL.md` (only when working inside the loadout repo)
   3. Else fetch `https://raw.githubusercontent.com/naffis/loadout/main/INSTALL.md`
      (swap `main` for a release tag when the user pinned one)
2. **Classify.** Install / use / equip → Flow A. Update / sync / "latest" → Flow B.
   "Any updates?" without apply → Flow B with `--check` only.
3. **Execute** the matching flow in `INSTALL.md` exactly — same detection rules, already-
   equipped short-circuit, starter ids, plugin/Remote Rules steps, and report-back shape.
   Do not invent an alternate install path (no wholesale clone into the consumer).
4. **Hand off.** After Flow A, point at `/start` / `getting-started` — do not re-explain the
   catalog. After Flow B, summarize updated / newly installed missing / current / conflicts.

## Guardrails

- Prefer native delivery (Claude plugins, Cursor Remote Rules) plus CLI for the rest.
- Starter seeds on first equip (`kits.starter`); `update` backfills their `uses:` closure and
  any starter seed still missing. Add more catalog ids only when the user asks.
- Never overwrite local edits silently — `update` uses three-way merge; surface conflicts.
- Treat skills/rules as trusted prompt text; pin with `npx github:naffis/loadout#<tag>` when
  supply chain matters (`audit-external-skills`).
- Do not confuse a loadout source checkout with the consumer project.

## Pairs with

- skills: `adopting-engineering`, `getting-started`, `hardening-the-harness`, `skill-author`, `rule-author`
- rules: `audit-external-skills`, `definition-of-done`
- commands: `start`
- docs: `doc-install`, `doc-usage`, `doc-catalog`, `harness-setup`, `bootstrap-project`
