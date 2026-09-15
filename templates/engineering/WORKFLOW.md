# Shared-checkout engineering

Loadout-managed process. Project choices live in the adjacent `project.json`;
architecture and domain rules stay in the project's own documentation.
Applies only after deliberate adoption. Existing project/nested requirements,
session authorization, and enforced protections remain applicable. If they
conflict with this process, identify the exact rule and resolve that conflict
before the affected operation. This file does not grant additional permissions.

## Start and route

- Work in the existing development checkout and reuse its running services.
  Do not create per-task branches, worktrees, PRs, or full-CI cycles by habit.
- Use one writer initially. Additional writers require authorized parallel work,
  disjoint file ownership, and agreement on any shared interfaces. The project's
  `maxWriters` is a ceiling, not an instruction to spawn agents.
- Read architecture docs when changing component boundaries, data flow, or domain
  behavior; read development docs when running or changing project commands.
  Use the pointers in `AGENTS.md` and `project.json`; don't load every doc each turn.
- For one agent, coordination is implicit. Across CLI sessions, record a task ID,
  owner/session, owned files, dependencies, and readiness in the agreed shared
  task mechanism. One coordinator writes that record. If none exists, use one
  writer until a concrete handoff mechanism is established.
- A pane marked idle or a model saying done is not a completed task. Handoff must
  state changed paths, behavior, checks, and outstanding dependencies.

## Shared resources

- One owner per whole file, including formatting, generated output, snapshots,
  and deletions. Reread before editing; reconcile unexpectedly changed content.
- Treat APIs, schemas, exported types, and shared config as dependencies even
  when separate files are involved. Sequence coupled changes or make compatible
  additions first. Don't invent a new interface independently in two sessions.
- Only the coordinator mutates the Git index/refs or synchronizes the active
  checkout. Writers leave edits unstaged and report readiness.
- Assign dependency installation, code generation, dev-server control, and
  database/port/browser-profile ownership. Use isolated test state when needed.
- Do not fix another writer's incomplete code opportunistically. Do not stash,
  reset, clean, globally format, or kill shared processes as housekeeping.
- Ownership is cooperative. Neither this document, the installer, Herdr, nor an
  agent's skill metadata provides filesystem isolation. If writers cannot honor
  ownership, sequence work or use explicitly approved isolation.

## Checkpoints

- Respect the project's existing commit/push authority. Development authorization
  alone does not change a repository rule that requires an explicit commit ask.
- When authorized, checkpoint a dependency-complete set of ready files. The
  coordinator briefly freezes those files, stages explicit paths, inspects the
  staged diff, and commits. Check for pre-existing staged content first.
- Unrelated unfinished work stays out. Whole-tree staging rules in a legacy kit
  must be deliberately reconciled before using this ready-batch convention.
- Keep checkpoints as commits; no routine squash/rebase lifecycle. Synchronize
  with remote changes only when active writers are coordinated.
- A checkpoint/push is not a deployment. Keep backup, validation, and release
  triggers distinct where the project permits it.

## Validation

- Use warm incremental diagnostics and the smallest meaningful reproducer or
  focused test while editing. Add tests for useful behavioral coverage, not to
  mirror implementation or satisfy a count.
- `project.json` lists argv arrays for feedback, batch, and release checks. Empty
  lists mean not configured, not success. Existing documented requirements remain
  in force. These lists do not install or run a scheduler.
- Before an expensive check, look for an existing applicable run/result. Request
  the project's single validation runner; if there is none, the coordinator runs
  a documented check once. No duplicate full suites from individual workers.
- Validate completed batches on an immutable commit in a separate temporary
  validation workspace. A test against the moving development tree is feedback,
  not authoritative evidence about a release candidate.
- Select affected tasks from the last successful applicable baseline, including
  dependent components and changed config/fixtures/dependencies. If selection is
  unreliable, broaden to the subsystem or required suite.
- Cache only deterministic results with matching inputs, tests, toolchain,
  environment, and policy. An old commit's pass does not validate new edits.
- Let an active substantial run finish; keep the newest pending ordinary batch.
  Pinned release candidates must not be starved by new development. This scheduling
  behavior requires a real runner; do not claim it exists just from this policy.
- Retain required release checks. Never weaken assertions, skip failures, or use
  bypass flags to appear green. Label incomplete, cancelled, or failed runs.
- Continue unrelated development during background validation. Assign a failure
  to one owner; pause dependent work when the failure invalidates its assumptions.

## Finish and hand off

Report behavior and relevant evidence concisely. Distinguish implemented,
focused-checks-passed, batch-validated, and release-validated. If independent
review is required by the project or requested for this task, use its existing
checker on the fixed candidate; do not duplicate an already satisfied review.
Release the specified validated artifact under existing authority. Keep durable
architecture decisions in project docs and temporary coordination in local state.
