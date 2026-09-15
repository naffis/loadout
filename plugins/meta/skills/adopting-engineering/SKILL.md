---
name: adopting-engineering
description: Adopt or update loadout's portable engineering workflow in an existing project. Use for "adopt engineering" or "adopt the portable workflow"; preserves project docs and required gates.
---

# Adopting engineering

Implement adoption in the current project. This is separate from starter installation.

1. Use the user's full loadout commit; otherwise use the reviewed default
   `2f539afbdf4a724c0542f1c03c69ef46af036cb1`. Keep that revision throughout.
2. Obtain that source in a temporary directory outside the consumer. Read its
   `docs/adopt-portable-engineering-prompt.md`, `docs/portable-engineering.md`, and
   `templates/engineering/WORKFLOW.md`. Follow the adoption instructions in full.
   If unavailable, report the retrieval failure; never silently use a floating ref.
3. Inspect root/nested/native instructions, skills, docs, hooks, CI, and unrelated WIP.
   Reconcile redundant process at its source; preserve architecture, security,
   public contracts, scope, and required gates. Report unresolved conflicts.
4. Run the pinned CLI's `engineering plan`, then `engineering apply` after findings
   are resolved, from the consumer's Git tree. Select codex,grok,claude,cursor on
   first adoption unless the user narrows the clients. For updates, retain the
   recorded tool selection. Never use legacy init, starter installation, or update.
5. Populate project-owned `project.json` with actual documentation paths, argv
   commands by validation tier, maxWriters 1 by default, and source repo/full SHA.
   Run `engineering check`, inspect discovery where available, and review the diff.
   Report changed files, commands/checks, preserved constraints, conflicts, and
   whether adoption is complete. Commit/push only under existing authority.

## Pinned CLI

Use an existing verified checkout of the revision if available. Otherwise clone
outside the consumer, check out the exact commit, and build once. The following
uses the default pin; substitute the user's commit consistently when provided:

```bash
loadout_source="$(mktemp -d "${TMPDIR:-/tmp}/loadout-engineering.XXXXXX")"
git clone --no-checkout https://github.com/naffis/loadout.git "$loadout_source"
git -C "$loadout_source" checkout --detach 2f539afbdf4a724c0542f1c03c69ef46af036cb1
git -C "$loadout_source" rev-parse HEAD
(cd "$loadout_source" && npm ci)
# Run from the consumer, without changing its checkout:
node "$loadout_source/dist/index.js" engineering plan --tools codex,grok,claude,cursor
node "$loadout_source/dist/index.js" engineering apply --tools codex,grok,claude,cursor
node "$loadout_source/dist/index.js" engineering check
```

Execute plan, review its findings, then apply; do not paste the block as an
unconditional script. Read the source instructions before running the commands.
`npm ci` builds via prepare; if it fails, diagnose instead of applying from stale
dist. `npx --yes --package='github:naffis/loadout#<SHA>' loadout engineering ...`
is an alternative; if npm cannot pack the Git dependency, use the checkout path.
These commands install process files; they do not execute project validation.

## Pairs with

- skills: `equipping-loadout`, `skill-author`, `rule-author`
- docs: `doc-portable-engineering`, `doc-adopt-portable-engineering`
