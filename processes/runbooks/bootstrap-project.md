# Bootstrap a project

Equip a new or under-harnessed repo with loadout without dumping the entire library on day
one. Work backwards from behaviour (`harness-setup`): each piece must earn its context cost.
This runbook is the first-day path; `harness-setup` and `harness-hooks` are the progression
after that.

**Agents:** if the user pasted the loadout repo and said *use this* / *update to latest*,
follow repo-root `INSTALL.md` (or `equipping-loadout`) instead of improvising from this
runbook. That path vendors `ship-a-feature` + its full `uses:` block, plus
`equipping-loadout`, `definition-of-done`, and `doc-install`. This runbook is the
slower, progressive human path (baselines first, fewer assets on day one).

## Preconditions

- You have a git repo (or are creating one) and permission to add files.
- You know whether the team uses **Cursor**, **Claude Code**, or both.
- Pin consumers to a loadout **release tag**, not floating `main`, once you care about
  reproducibility.

## Path A — vendor with the CLI (most projects)

1. **Init**
   ```bash
   cd your-project
   npx github:naffis/loadout init
   ```
   This detects Cursor/Claude, scaffolds dirs, installs the SessionStart notify hook, and
   writes `loadout.lock.json`.
2. **Baseline memory** — add the thin pilot's checklist, not a style encyclopedia:
   ```bash
   npx github:naffis/loadout add template-agents-md
   # If Claude Code is in play:
   npx github:naffis/loadout add template-claude-md
   ```
   Fill in stack, commands, conventions, and hard do-nots for *this* repo.
3. **Always-on rules (short list)** — start with constraints that prevent real damage:
   ```bash
   npx github:naffis/loadout add \
     no-shortcuts size-limits regression-test no-secrets-in-code definition-of-done
   ```
   Add language-specific auto-attached rules only when the stack matches (e.g. `no-any`,
   `no-floating-promises`, `typescript-exhaustive-switch` for TypeScript).
   Optional **shared trunk kit** when multiple agents share one local checkout (no per-agent
   branches/worktrees/stashes; commit-all on ask):
   ```bash
   npx github:naffis/loadout add \
     git-safety no-stash shared-working-tree committing-on-shared-trunk
   ```
   Name the integration trunk in `AGENTS.md`.
4. **Starter workflow kit** — enough to ship the first real change:
   ```bash
   npx github:naffis/loadout add \
     getting-started ship-a-feature \
     planning-a-change review-build writing-tests reviewing-and-shipping \
     writing-commit-messages opening-a-pr updating-docs \
     review-build-cmd review-build-rule \
     testing-conventions test-coverage commit-and-pr-conventions documentation-updates
   ```
   If the first change is high-stakes/unfamiliar, equip the full `plan-then-build` kit
   (note: plan/build **rules** use registry ids `*-rule`, separate from the skill ids):
   ```bash
   npx github:naffis/loadout add \
     plan-then-build \
     create-plan review-plan review-build agentic-loop \
     writing-tests updating-docs reviewing-and-shipping \
     writing-commit-messages opening-a-pr making-a-pr-reviewable \
     plan review-plan-cmd review-build-cmd \
     create-plan-rule review-plan-rule review-build-rule \
     no-shortcuts size-limits testing-conventions test-coverage \
     regression-test documentation-updates definition-of-done \
     commit-and-pr-conventions
   ```
   Then use `/plan` → `/review-plan` → implement → `/review-build`.
5. **Orient** — run the `onboard-to-codebase` workflow (or add it and ask the agent to follow
   it) so the first session learns architecture, change patterns, and gate commands.
6. **Doctor**
   ```bash
   npx github:naffis/loadout doctor
   ```
   Fix errors before declaring bootstrap done.
7. **First kickoff** — `/start` (Claude) or *"I want to build X — what should I do?"* so
   `getting-started` emits a paste-ready prompt with the real gate command.

## Path B — native distribution (less vendoring)

- **Claude Code:** `/plugin marketplace add naffis/loadout` then
  `/plugin install core-engineering@loadout` (and `meta` when authoring skills/rules).
- **Cursor rules:** Settings → Rules → Remote Rule (GitHub) → `https://github.com/naffis/loadout`
  pointed at `rules/`.
- Still vendor **workflows / runbooks / templates** you want in-repo via `loadout add`, or
  keep them as reference and paste kickoff prompts from `docs/catalog.md`.

## What not to install on day one

- Full hook suites — add from `harness-hooks` when a must-happen-every-time failure appears.
- Autonomous loops — pass `loop-preflight` and get a **manual** run reliable first.
- Every skill in the catalog — add when a workflow you actually run needs it (`loadout add`
  does not auto-pull a workflow's `uses:` block; equip deliberately).
- Domain/vertical plugins that aren't generalized — loadout intentionally omits them.

## Verify bootstrap

- [ ] `AGENTS.md` (and `CLAUDE.md` if needed) exist and name real commands
- [ ] `loadout.lock.json` present; `loadout doctor` clean (or warnings understood)
- [ ] Gate command known and runnable (`test` / `lint` / `typecheck`)
- [ ] One workflow chosen for the first task; kickoff prompt written
- [ ] No secrets in repo config; MCP additions audited (`audit-external-skills`) before trust

## Next rungs (after the first ship)

Follow `harness-setup`: MCP → hooks → subagents → planning/verification → loops →
self-improving (`hardening-the-harness`, `learning-from-chats`). Each rung is a response to
a felt failure mode, not a checklist to binge.
