# Efficient development with agents

Research and adoption review, 2026-09-15. These are loadout's design decisions;
the adopted process itself lives in `.loadout/engineering/WORKFLOW.md`.

## Recommendation

Keep feedback close to editing, validate small coherent batches, and preserve
release gates. Start with one writer and a warm environment. Treat duplicate
validation and unnecessary handoffs as costs to measure and remove.

The reported 5% building / 95% waiting is a useful symptom, not a measured baseline
for this repository. We inspected its instructions and CI; we have not measured
the user's other projects or proven a particular speedup.

## Evidence and decisions

| Topic | What the sources establish | Loadout decision |
| --- | --- | --- |
| Fast feedback | DORA recommends reliable automated feedback within ten minutes, with fast tests complementing end-to-end coverage. [Test automation](https://dora.dev/capabilities/test-automation/), [continuous integration](https://dora.dev/capabilities/continuous-integration/) | Focused checks during edits; required broader checks at the completed batch/release boundary. Treat ten minutes as an improvement target, never permission to kill or skip a gate. |
| Batch size | DORA connects small batches with better delivery and AI outcomes, and warns against regrouping small changes into large delayed releases. [Small batches](https://dora.dev/capabilities/working-in-small-batches/) | A batch is a small dependency-complete change. Do not collect an entire queue or week's work just to save CI runs. |
| Agent complexity | Anthropic recommends simple, composable systems and adding orchestration when it improves outcomes enough to justify cost. [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) | One writer initially; extra workers need independent work, ownership, authorization, and available validation/review capacity. This is a house default, not an empirically optimal universal writer count. |
| Verification | Claude Code guidance emphasizes observable evidence; reviewers can inspect existing evidence rather than rerunning it blindly. [Best practices](https://code.claude.com/docs/en/best-practices) | Keep meaningful tests and required independent review. Reuse matching evidence across skill handoffs; do not stack several equivalent reviewers on the same candidate. |
| Context | Anthropic describes context as a limited resource and supports retrieving relevant information as needed. [Context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) | Keep invariants and task-to-document routing in AGENTS.md; move detailed guidance to project docs and narrowly triggered skills. |
| Native discovery | Codex loads scoped instruction files, supports overrides, and discovers skills separately. [AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [skills](https://learn.chatgpt.com/docs/build-skills) | Preserve root/nested scope; use native adapters and inspect actual discovery. A Markdown link alone does not prove automatic loading. |
| Other clients | Cursor documents rule loading modes and skill discovery; Claude documents native skills. [Cursor rules](https://cursor.com/docs/rules), [Cursor skills](https://cursor.com/docs/skills), [Claude skills](https://code.claude.com/docs/en/skills) | Keep client adapters thin and inspect duplicate native/plugin skill names. Do not copy the full process into each client rule. |
| CI concurrency | GitHub can limit concurrent runs and retain only the newest pending run by default; cancelling active runs is a separate choice. [Concurrency](https://docs.github.com/en/actions/concepts/workflows-and-actions/concurrency) | For future authorized CI tuning, let substantial active validation finish and coalesce ordinary pending work; keep pinned releases from starvation. This adoption installs no scheduler. |
| Required checks | GitHub documents that filtering out required workflows can leave checks pending; skipped jobs have different semantics. [Required checks](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks) | Never casually add path filters, skip flags, or cancellation to required gates. Preserve check identities and merge/release requirements. |
| Caching | GitHub dependency caches restore matching keys and versions, with fallback behavior. [Dependency caching](https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching) | A dependency cache hit is not proof that tests passed. Test-result reuse needs matching source, tests, config, dependencies, toolchain, environment, and policy. |
| Flakes | Fowler's longstanding analysis identifies isolation, async behavior, remote services, time, and resource leaks as causes. [Non-determinism](https://martinfowler.com/articles/nonDeterminism.html) | Classify failures and fix causes. A retry that passes does not erase the original failure. Any quarantine needs existing project authority and an owner; adoption does not weaken gates. |

## Audit findings and source changes

- There was no active root AGENTS.md/CLAUDE.md or nested project instruction file;
  the existing versions under templates/ were distributed examples. Added a small
  project entry point and preserved the distribution/CLI architecture in existing docs.
- Shared-tree rules required all dirty files in a commit, coupling unrelated work.
  Updated the rule, commit skill, templates, and callers to coherent ready batches.
- `integrate` required a full suite after each unit and again at the end. It now
  checks affected interfaces between units and runs the full suite for the completed
  batch, preserving any stricter project-specific requirement.
- Generic loop guidance required a fresh checker for every shippable unit. It now
  distinguishes ordinary development from required/requested review and material
  risk. Specialized security, migration, release, and explicitly invoked review
  contracts retain their gates; equivalent completed evidence can be reused.
- Task topology required a durable file even for an obvious single loop. Durable
  coordination remains required for pipelines, graphs, and real handoffs.
- CI runs validation on push and pull_request; main also triggers release. These
  can produce overlapping work, but the adoption request excludes CI trigger changes.
  The existing release/version mechanism and all hooks remain unchanged.

## Measure before adding machinery

For a representative week in each pilot project, record active edit time, time to
first useful feedback, queue/setup/run time, duplicate heavy runs per candidate,
flake/retry rate, review waiting, batch size, and escaped defects. Use existing
runner timestamps or a small task note. Compare medians and slow-tail times before
and after adoption; faster code generation alone is not delivery improvement.

Suggested investigation order: redundant skill gates → cold setup → duplicate CI
events → slowest test groups → flakes → unsafe test-impact selection. Fix the largest
observed cost first. Sharding, affected-test graphs, caching services, and schedulers
are separate implementation decisions with their own evidence and authorization.

## Adoption record

- Managed process revision: `2f539afbdf4a724c0542f1c03c69ef46af036cb1` from
  `https://github.com/naffis/loadout`. Project commands: [usage](usage.md).
- This checkout predates that CLI; the pinned source was built outside the project.
  Local npm's Git-package execution failed with `GitFetcher requires an Arborist
  constructor to pack a tarball`; the source-checkout route worked.
- Repo installation and client discovery results are recorded after verification
  below. Global settings and cached plugins are outside this adoption's edit scope.

### Verification and remaining conflicts

- Pinned `engineering plan`, `apply`, and `check` succeeded. Managed hashes and
  exact equality with the pinned WORKFLOW.md were independently checked.
- `npm run build`, all **81 tests** (about 3.9 seconds for the test runner), and
  `node dist/index.js doctor` passed; doctor reported zero warnings. This is local
  development evidence for the unstaged tree, not a remote CI or release pass.
- Skill Creator's validator passed for `adopting-engineering`. Project JSON,
  documentation paths, actual argv mappings, relative Markdown links in changed
  files, and `git diff --check` passed. No application/CLI code, dependencies, CI,
  hooks, branch protections, or Git staging were changed.
- Codex `debug prompt-input` from root and `cli/src` includes the new project
  instructions, managed process pointer, and `working-agentically` skill.
- Grok 1.0.30 `inspect --json`, at both locations, reports `projectTrusted: false`
  and no project instructions or project workflow skill. The adapter files exist;
  activation needs the user's normal Grok trust decision. No permissions changed.
- Grok also discovers the user-level
  `~/.cursor/skills/committing-on-shared-dev/SKILL.md` and installed plugin copy
  `~/.claude/plugins/marketplaces/loadout/plugins/core-engineering/skills/committing-on-shared-trunk/SKILL.md`.
  Both still require whole-tree staging and conflict with ready-batch checkpoints.
  Resolve those sources before using their commit workflows: update the plugin
  from a reviewed release and deliberately reconcile the user-owned skill.
- Claude's plugin inventory confirms installed core-engineering 0.22.0 and meta
  0.3.0. These are not this unstaged revision. Claude/Cursor end-to-end prompt
  discovery was not certified; their adapters were checked on disk. Refreshing
  global plugins/settings is outside this adoption. No remote protection query,
  CI run, release, or legacy scratch-init smoke test was performed.

**Status:** repository installation and instruction migration are complete.
Cross-client activation and downstream rollout remain partial because of the
global conflicts and trust state above. The new command is available from the
updated meta plugin after publication/installation, or by directing an agent to
the local skill file now. No commit, push, plugin publication, or release was requested.

### Changed files

- `.agents/skills/working-agentically/SKILL.md`
- `.claude/skills/working-agentically/SKILL.md`
- `.cursor/rules/loadout-engineering.mdc`
- `.grok/skills/working-agentically/SKILL.md`
- `.loadout/engineering/WORKFLOW.md`
- `.loadout/engineering/install.json`
- `.loadout/engineering/project.json`
- `AGENTS.md`
- `CLAUDE.md`
- `INSTALL.md`
- `README.md`
- `docs/adopt-portable-engineering-prompt.md`
- `docs/agentic-patterns.md`
- `docs/catalog.md`
- `docs/efficient-agent-development.md`
- `docs/external-practices.md`
- `docs/portable-engineering.md`
- `docs/usage.md`
- `plugins/core-engineering/agents/ci-watcher.md`
- `plugins/core-engineering/skills/_shared/flight-family.md`
- `plugins/core-engineering/skills/agentic-loop/SKILL.md`
- `plugins/core-engineering/skills/agentic-loop/references/subagents-and-parallelism.md`
- `plugins/core-engineering/skills/agentic-loop/references/verification-and-stop-conditions.md`
- `plugins/core-engineering/skills/committing-on-shared-trunk/SKILL.md`
- `plugins/core-engineering/skills/fixing-ci/SKILL.md`
- `plugins/core-engineering/skills/getting-started/SKILL.md`
- `plugins/core-engineering/skills/integrate/SKILL.md`
- `plugins/core-engineering/skills/orchestrating-parallel-agents/SKILL.md`
- `plugins/core-engineering/skills/reviewing-and-shipping/SKILL.md`
- `plugins/core-engineering/skills/running-a-dev-cycle/SKILL.md`
- `plugins/core-engineering/skills/task-topology/SKILL.md`
- `plugins/core-engineering/skills/task-topology/references/task-file.md`
- `plugins/core-engineering/skills/task-topology/references/worked-example.md`
- `plugins/core-engineering/skills/triaging-review-feedback/SKILL.md`
- `plugins/core-engineering/skills/writing-commit-messages/SKILL.md`
- `plugins/meta/commands/adopt-engineering.md`
- `plugins/meta/skills/adopting-engineering/SKILL.md`
- `plugins/meta/skills/equipping-loadout/SKILL.md`
- `plugins/meta/skills/skill-author/SKILL.md`
- `processes/workflows/build-as-graph.md`
- `processes/workflows/clear-the-queue.md`
- `processes/workflows/fix-ci-until-green.md`
- `processes/workflows/safe-refactor.md`
- `processes/workflows/ship-a-feature.md`
- `registry.json`
- `rules/agentic-loop.mdc`
- `rules/commit-and-pr-conventions.mdc`
- `rules/definition-of-done.mdc`
- `rules/git-safety.mdc`
- `rules/no-stash.mdc`
- `rules/shared-working-tree.mdc`
- `rules/testing-conventions.mdc`
- `templates/AGENTS.md`
- `templates/CLAUDE.md`
