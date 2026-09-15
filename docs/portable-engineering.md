# Portable engineering for existing projects

One shared process, project-owned architecture, and small adapters for each CLI.
Herdr can run the terminals; the same setup works without it.

For a project agent to perform the migration, use the
[reusable adoption prompt](./adopt-portable-engineering-prompt.md). Pilot it in one
project, then reuse the same reviewed loadout commit in the remaining projects.

## Adopt without replacing AGENTS.md

Use a pinned loadout checkout/ref with these commands from a project's Git tree:

```bash
loadout engineering plan --tools codex,grok,claude,cursor
loadout engineering apply --tools codex,grok,claude,cursor
loadout engineering check
```

`plan` is read-only. `apply` is an explicit, additive adoption action: it adds one
marked reference block to the existing `AGENTS.md` (and `CLAUDE.md` for Claude),
copies only the profile's files and skill adapters, and records their hashes.
Original instruction text stays byte-for-byte intact. It neither invokes `init`
nor installs the legacy starter/whole-tree kit. Omit `--tools` to select all four
on first install; subsequent invocations reuse the recorded selection.

From a loadout source checkout, build once with `npm run build`, then run
`node /absolute/path/to/loadout/dist/index.js engineering plan` from the consumer.
For a GitHub install, pin a reviewed commit/tag, e.g. use the npm Git spec syntax
`github:naffis/loadout#<reviewed-ref>` in place of an unpinned source. No new release
tag or npm publication is implied by this change.

The installer refuses known possible instruction conflicts, Gitignored profile paths, unexpected files,
edited managed content, malformed markers, and symlinked target paths. It has no
force option. Root `AGENTS.override.md` and ambiguous root filename casing require
deliberate integration instead of creating a second competing instruction file.
Heuristic conflict detection is not a proof: inspect global/client rules, nested
instructions, hooks, CI, and enforced protections before adopting changed behavior.

`check` checks installation integrity and available profile updates. It does not
run tests, verify model compliance, or certify the application's release readiness.
The check's command-mapping warnings are meaningful: empty check lists are not passes.

## Separate content by ownership and change cadence

| Content | Owner and location | Loading rule |
| --- | --- | --- |
| Critical invariants and task-to-doc routing | Project `AGENTS.md` | Small always-loaded entry point. |
| Architecture, tenancy/data boundaries, service relationships | Project architecture docs and ADRs | Read for changes to those areas. |
| Actual setup/dev/test commands and side effects | Project development docs | Read when running or changing those commands. |
| Shared coordination and validation process | `.loadout/engineering/WORKFLOW.md` | Loaded for the adopted workflow; updated by this installer. |
| Project command mapping and writer ceiling | `.loadout/engineering/project.json` | Project-owned; updates/removal retain it. |
| Native discovery | Root reference blocks and per-client skill adapters | Thin pointers into the same policy. |
| Temporary tasks and validation evidence | Existing task runner or local ignored state | Runtime state, not stable instructions. |

An existing project could evolve toward this entry point:

```markdown
# Project instructions

Never cross tenant boundaries. Preserve public API compatibility.

- Architecture/data changes: read docs/architecture.md and relevant ADRs.
- Running or changing commands: read docs/development.md.
- Package-specific work: read the applicable nested instructions.

<!-- loadout:engineering:start -->
For the adopted engineering workflow, read .loadout/engineering/WORKFLOW.md
and .loadout/engineering/project.json. Preserve applicable project and nested
instructions; report conflicts instead of silently overriding them.
<!-- loadout:engineering:end -->
```

The tenant/API statements are illustrative; keep the project's actual invariants.
Do not blindly move every rule into a file that may never be read. A reference is
a direction to retrieve context, not a universal automatic-import mechanism.

### Migrate existing content deliberately

1. Inventory root/nested/native instructions, hooks, and existing project docs.
2. Identify architectural knowledge, local commands, process, and critical invariants.
3. Reuse existing documents. Move a section without changing meaning; replace it
   with a task-specific pointer. Verify every reference resolves.
4. Reconcile actual contradictions in their authoritative source. For example,
   migrating whole-tree commits to ready batches requires changing the old rule;
   appending a second opposing rule is not a migration.
5. Preview the final diff and confirm client discovery from root and relevant
   subdirectories. Resume work with the revised instruction context.

The installer performs none of these semantic relocations. Moving an existing
project's architecture/process sections is a separate, authorized project edit.
It also does not change native global settings or bypass protected branches.

## CLI adapters

| Client | What this profile installs | Notes |
| --- | --- | --- |
| Codex CLI | Root `AGENTS.md` reference + `.agents/skills/working-agentically/SKILL.md` | Never create an override file to hide existing instructions. |
| Grok Build | Root `AGENTS.md` reference + `.grok/skills/working-agentically/SKILL.md` | Verify discovery with `grok inspect`; other third-party Grok CLIs need their own adapter. |
| Claude Code | `CLAUDE.md` reference + `.claude/skills/working-agentically/SKILL.md` | Preserves existing `CLAUDE.md`; review duplicate skill names if the native plugin also supplies it. |
| Cursor | Root reference + `.cursor/rules/loadout-engineering.mdc` + `.agents/skills/working-agentically/SKILL.md` | Shares the skill file with Codex; the always-on rule is only a short pointer. |
| Herdr | No extra policy copy or machine configuration | Launch any of the installed CLIs in panes pointing at the same project. |

All skill copies have identical content and are tracked by this profile's own
manifest. This command adds cross-client distribution for this profile only;
legacy `init/add/update` retain their existing Cursor/Claude targeting behavior.
Generalizing all legacy assets is a separate change, not silently included here.
Some clients also discover compatibility directories and native plugins. Inspect
duplicate skill names in the actual client; all profile-owned copies agree, but
an older plugin or separately installed skill may differ. Installation checks
cannot certify client discovery or precedence.

Use the chosen agent's native authentication, model configuration, and permission
controls. Do not add `--yolo`, change `CODEX_HOME`, or change sandbox settings just
to make the workflow portable. No model is prescribed for a coordination role.

Codex documents root-to-working-directory instruction discovery, with an override
file replacing the normal file at that level. Grok documents different native
rule discovery and its own skill directory. These are adapters, not one universal
precedence implementation. [Codex instructions](https://learn.chatgpt.com/docs/agent-configuration/agents-md),
[Codex skills](https://learn.chatgpt.com/docs/build-skills),
[Grok instructions](https://docs.x.ai/build/features/project-rules),
[Grok skills](https://docs.x.ai/build/features/skills-plugins-marketplaces),
[Claude skills](https://code.claude.com/docs/en/skills),
[Cursor skills](https://cursor.com/docs/skills),
[Cursor rules](https://cursor.com/docs/rules).

Herdr's documented role is managing agent terminals and their state; it can keep
sessions running when a client detaches. A machine restart does not preserve the
original processes. Do not treat pane status as a file lock or test result.
[Herdr documentation](https://github.com/herdrdev/herdr).

## The working loop

Implement in one checkout with warm services. Use one writer initially; add a
writer only with disjoint file ownership and stable shared interfaces. Have one
coordinator own Git mutations, shared processes, and readiness. This role can be
the main agent, not a permanent extra manager or approval stage.

Run focused checks while editing. When authorized, checkpoint coherent ready
files without scooping up unrelated WIP. Validate a fixed candidate separately
while development continues. Reuse matching evidence and finish the active heavy
run before consuming the newest pending batch. Release a specific proven artifact
under existing authority and gates.

The workflow is shipped as policy and adoption tooling. This version does **not**
provide a validation daemon, test-impact graph, file-claim service, cache service,
release automation, or filesystem sandbox. Use the project's existing runner, or
let the coordinator execute a documented check once until a runner exists.
Do not spend time building a scheduler if focused checks and a warm environment
already remove the bottleneck.

## Project configuration

The project owns `project.json`. Populate documentation paths with existing files;
don't invent a missing architecture document simply to satisfy a convention.
Validation tiers contain arrays of argv arrays, for example a project's actual
`["npm", "run", "test:unit"]` command if it exists. Arguments are data, not shell
snippets; the profile installer never executes these commands.

- **feedback**: smallest useful checks during iteration.
- **batch**: affected/integration checks for completed commits.
- **release**: required production-candidate checks, keeping existing gates intact.

Unknown or unmapped scope means inspect the actual scripts and broaden checks
where necessary. Never interpret an empty list or a zero-test match as success.
`maxWriters` is advisory until a real coordinator/runtime enforces it. It grants no
permission to spawn agents, commit, push, or deploy.

## Update and remove

Use the same pinned CLI's `engineering plan`, then `engineering apply`, to update
this profile. Generic `loadout update` does not mutate these separately managed
files or their reference blocks. Active sessions may retain older instructions;
start a new session or use the client's supported context refresh and verify it.

```bash
loadout engineering remove --dry-run
loadout engineering remove
```

Removal deletes only unchanged owned files and the exact installed reference
fragments. It retains project config and all surrounding user text, including
edits made before or after a managed block. It removes a newly created instruction
file only if no project text was subsequently added. Edited or missing managed
content causes a preflight refusal; it is not discarded.

Install/remove operations use a local installer lock and checked atomic file
writes. Pause editing first: the lock coordinates this installer, not arbitrary
editors. This is not a cross-file filesystem transaction; an I/O failure or outside
writer race can leave a partial operation that must be inspected before retrying.
Do not use this profile as a security boundary.
