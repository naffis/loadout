# Adopt the workflow in an existing project

Run `/adopt-engineering` (meta plugin) or invoke `adopting-engineering`. The skill
implements the prompt below and defaults to reviewed commit
`2f539afbdf4a724c0542f1c03c69ef46af036cb1`; pass a different reviewed SHA to update.
The prompt below is retained from that revision; its floating-dev fallback applies
only when using the prompt directly without a pin, not to the skill.

Pilot one project first. Give subsequent projects the same reviewed loadout commit
from that pilot, so every project adopts the same process version. Each project
keeps its own architecture, development commands, and required gates.

Paste the following into that project's agent. If you provide a loadout commit
alongside it, the agent should use that commit. Otherwise it resolves `dev` once.

```text
Adopt the portable engineering workflow from https://github.com/naffis/loadout
in this existing project. Implement the documentation/configuration changes;
do not stop at a proposal. Preserve the project's architecture and behavior.

Use the loadout commit I supplied. If none was supplied, resolve dev once, record
its full commit SHA, and use that exact revision throughout. Read its
docs/portable-engineering.md and templates/engineering/WORKFLOW.md first.
Use the dedicated engineering commands; do not run the legacy init, starter
install, or generic update as part of this adoption.

1. Inspect before editing.
Read the applicable root/nested AGENTS.md files, overrides, native CLI rules and
skills, existing loadout installation, architecture/ADR/development docs, scripts,
hooks, and CI configuration. Note unrelated WIP and coordinate with any active
writers before modifying their instruction context. Do not stash or reset WIP.

2. Separate ownership with minimal edits.
Keep AGENTS.md as the project's entry point: essential invariants, routing, and
a short pointer to the adopted process. Reuse existing architecture and development
docs. If AGENTS.md contains substantial architecture or command reference sections,
you may move them into project-owned docs without changing their meaning or scope,
and replace them with explicit "read this when ..." pointers. Keep critical safety,
security, tenancy, compatibility, and domain constraints visible in the applicable
always-loaded instructions. Preserve nested scope. Do not invent architectural
decisions, rename existing docs unnecessarily, or rewrite application code.

The shared process belongs in .loadout/engineering/WORKFLOW.md. Local documentation
paths, command mappings, and writer limits belong in the project-owned
.loadout/engineering/project.json. Do not put local architectural facts or commands
into the managed workflow, and do not copy the entire workflow into AGENTS.md.

3. Adopt the process deliberately.
Default to the existing checkout with one writing agent and warm services. Extra
writers need authorized parallel work, explicit file/resource ownership, and one
coordinator for Git/shared processes. Use focused feedback during development and
coherent batch validation; no automatic per-task PR/worktree/full-suite/squash cycle.
Retain the project's actual required quality, review, CI, and release gates.

Replace redundant procedural defaults only where this adoption authorizes it and
their role is clear. Do not append contradictory instructions or claim the new
file overrides everything. If a requirement cannot be reconciled without changing
an architectural decision, enforced protection, required gate, permission, or an
unclear project constraint, leave that area unchanged and report the exact conflict
with a minimal proposed resolution. Complete other safe preparation work.

4. Install and configure.
From this project's Git tree, use the pinned loadout CLI's engineering plan,
then engineering apply once its findings are resolved. Target Codex CLI, Grok Build,
Claude Code, and Cursor unless I specified a smaller set. Herdr is the terminal
host; it needs no separate process copy. Preserve existing instruction text outside
the installer-owned reference blocks. Do not bypass installer refusals or replace
existing instruction files wholesale.

Populate project.json using real existing documentation paths and actual command
argv arrays for feedback, batch, and release. Start maxWriters at 1 unless the
project already has an established coordination mechanism. Leave unknown checks
explicitly unmapped and report them; never invent scripts or treat empty lists as
passing. Record the adopted source repository and commit in project.json as
project-owned provenance. Do not edit the installer's hash manifest by hand.

This adoption does not authorize changes to application code, dependencies, CI
triggers, hooks, branch protections, global agent settings, permissions, or deployment.
Do not build a scheduler or claim Markdown enforces locks, caching, or test selection.
Follow the existing session/repository authority for commits and pushes.

5. Verify and hand off.
Run engineering check. Inspect the final diff, validate JSON and local references,
and check that every moved instruction preserves its meaning and loading scope.
Inspect actual client discovery where the clients are available, including nested
contexts and duplicate native/plugin skills. Report unavailable checks honestly.
Use the smallest relevant documentation/config checks; run broader checks only
where an existing requirement or concrete risk calls for them.

Finish with the pinned loadout SHA, changed files, preserved project constraints,
adopted process changes, mapped validation commands, checks actually performed,
and any unresolved conflicts. State whether adoption is complete or blocked.
Explain how to update the managed process later without rewriting project docs.
```

For a later rollout update, give the agent a new reviewed commit and ask it to run
`engineering plan` / `engineering apply`, retaining `project.json` and project
documentation. Update the project-owned provenance only after that succeeds.
Avoid floating automatic updates to all active projects at once.
