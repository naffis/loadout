# Methodology: Agentic Coding Patterns

> The patterns behind loadout's agentic assets. This is the **catalog of practices** —
> what each pattern is, when it applies, its failure mode, and which loadout asset
> encodes it. It is the "why" doc; the skills and rules are the "how."
>
> **Scope / no overlap:** [`external-practices.md`](./external-practices.md) covers
> authoring conventions (SKILL/rule frontmatter, progressive disclosure).
> [`loop-engineering.md`](./loop-engineering.md) covers the *economics* of operating a loop
> (should you loop at all) and this project's harvest decision log.
> [`agent-harness-engineering.md`](./agent-harness-engineering.md) covers the harness
> layers. **This doc** is the coding-pattern catalog. Cross-link; don't restate.

---

## 0. The shift

The leverage in agentic coding moved from *writing one good prompt* to *designing the
loop that prompts, acts, and verifies itself across many turns*. A coding agent is
`model + harness`; these patterns are the harness-level moves that make a long-horizon
task reliable instead of a hopeful one-shot. They come from a small set of primary
sources plus field practice, mapped here onto concrete loadout assets.

---

## 1. The pattern catalog

### 1.1 Workflows vs. agents (know which you're building)

A **workflow** is a fixed, predefined path (prompt chaining, routing, parallelization).
An **agent** dynamically decides its own steps and tool use. Prefer the simplest thing
that works: a deterministic workflow beats an autonomous agent when the path is known,
because it's cheaper and more predictable. Reach for autonomy only when the path can't be
hard-coded. Anthropic's five composable patterns — prompt chaining, routing,
parallelization, orchestrator-workers, evaluator-optimizer — are the vocabulary.

- **Encoded by:** loadout's `processes/workflows/*` (fixed recipes) vs. the
  `running-a-dev-cycle` skill (dynamic routing) and `agentic-loop` skill (autonomous
  in-task loop).

### 1.2 The outer loop + a stop condition written as a contract

Every non-trivial task is an outer loop: find the work → do one unit → verify against a
contract → record → decide the next unit → repeat until a *verifiable* done. The single
most important artifact is the **acceptance contract** written before editing: end state,
evidence (the objective command/artifact that proves it), constraints, and a budget
(a hard ceiling of edit→verify cycles). Without it, the loop stops when it *feels* done —
exactly when it's most likely wrong.

- **Encoded by:** `agentic-loop` skill + `agentic-loop.mdc` rule;
  `references/verification-and-stop-conditions.md`; workflow `stop_condition`/`gate` fields.

### 1.3 Evaluator-optimizer, and a checker that isn't the maker

One pass generates; a separate, independent pass evaluates against the contract and feeds
back; iterate until clean. It works when the criteria are clear and feedback demonstrably
improves the result — the case for code with tests. The guardrail: **the maker must not
be the sole checker.** The model that wrote the code rationalizes its own diff, so a fresh
context (a review sub-agent) grades shippable work.

- **Encoded by:** the `reviewer` / `security-reviewer` agents (the checker);
  `root-cause-fix` and `agentic-loop`'s maker-checker step;
  `references/subagents-and-parallelism.md`.

### 1.4 Context engineering (attention is a finite, decaying budget)

Context is finite with diminishing returns — models develop *context rot* as the window
fills. The goal is the **smallest set of high-signal tokens** that gets the job done, via:
**just-in-time retrieval** (keep light identifiers, pull content on demand) over
front-loading; **compaction** (summarize decisions/open-bugs/next-step, continue from the
summary) as the first lever for long-horizon coherence; **structured note-taking** (state
outside the window so a fresh context resumes); and **sub-agent isolation** (bulk
exploration burns tokens in a sub-agent that returns a 1–2k-token distilled summary).

- **Encoded by:** `agentic-loop/references/context-engineering.md`; the `explorer` agent;
  the `STATE.md` template.

### 1.5 Orchestrator-workers + parallelism + worktrees

A central agent decomposes a task and delegates units to workers — useful when subtasks
aren't known up front. Independent units run in parallel (sectioning); genuinely uncertain
changes can run as best-of-N (voting). File-level isolation via **git worktrees** lets
parallel agents edit without collisions. The ceiling is **your review bandwidth**: ten
parallel diffs you can't review is worse than two you can. Match concurrency to it, cap it
hard, and serialize the risky step (landing/merge).

- **Encoded by:** `orchestrating-parallel-agents` skill;
  `references/subagents-and-parallelism.md`.

### 1.6 Spec / contract-driven development

Write the intended behavior as a checkable spec/contract *before* generating, then hold
the output to it. This is the same instinct as the stop-condition contract, scaled to a
feature: the spec is the shared artifact the maker builds to and the checker verifies
against. It turns "looks done" into "meets the spec."

- **Encoded by:** `planning-a-change` (the plan is the spec),
  `agentic-loop`'s acceptance contract, `definition-of-done.mdc` (the outer contract).

### 1.7 Plan-first (separate deciding from doing)

For ambiguous or large work, produce a read-only plan and get it right before any edit.
It surfaces trade-offs and unknowns while they're cheap, and gives the executor a spec to
build to. Skip it for one-liners; it's a tax on trivial work.

- **Encoded by:** `planning-a-change`, `running-a-dev-cycle` (PLAN phase), `getting-started`.

### 1.8 Progressive disclosure (skills load lean, expand on demand)

A skill's metadata is the first disclosure level — just enough for the agent to know when
to use it. The body loads on trigger; references load only when needed. Many installed
skills stay cheap because detail is deferred. Keep the always-read part lean; push depth
into one-level-deep references.

- **Encoded by:** every loadout `SKILL.md` + `references/`; enforced by `skill-author` and
  `loadout doctor`.

### 1.9 The agent-computer interface (tool design is prompt engineering)

A tool is a contract between deterministic code and a non-deterministic agent. Its name,
description, params, and **result shape** are loaded into context every turn and steer
behavior — give them system-prompt-level attention. Fewer, higher-signal tools;
namespacing; semantic identifiers over cryptic ones; token-efficient results; errors that
steer toward a fix. Small description refinements yield outsized gains.

- **Encoded by:** `agent-tool-design` skill; `no-regex-for-semantics.mdc`.

### 1.10 Root cause over symptom (prove the cause, fix the class)

The line that throws is rarely the root. Descend the causal chain until you reach a
controllable node whose correct fix kills the whole *class* of failure, prove it explains
100% of the behavior, then fix at that layer and lock it with a regression test that fails
before and passes after. Reject bandaids (special-casing, threshold nudges, swallowed
errors, fixing the gate not the code).

- **Encoded by:** `root-cause-fix` skill + `references/{root-cause-descent,
  solution-selection}.md`; `debugging-an-issue`; `regression-test.mdc`, `no-shortcuts.mdc`.

### 1.11 Observability-first (runtime evidence before source)

For a production/staging issue, read the logs and traces before reading code: get
correlation ids, query for the error/latency signal, decode the error body, then narrow to
the code path. Runtime evidence beats guessing at the source.

- **Encoded by:** `debugging-with-observability` skill; `observability-first.mdc`.

### 1.12 Research-before-integrate

Before adopting an unfamiliar API/library, research it from primary sources
(official docs → examples → changelog → vetted community), distill it into an
implementation-ready reference with versions and gotchas, and cite sources with an access
date. A future session (or teammate) then builds without re-researching.

- **Encoded by:** `researching-a-dependency` skill; `documentation-updates.mdc`.

---

## 2. The failure modes to design against

### 2.1 The "Ralph"/self-declared-done loop

An agentic loop executes a tool, evaluates the result, and decides the next move — but if
the completion signal is the *agent's own judgment*, it emits "done" before the work is
done. You're running one if you lack a real (external) verifier, your done-metric is the
model's opinion, or you have no hard caps. Fixes: an objective external gate, a separate
model/agent deciding completion, and hard budget/iteration caps.

- **Guarded by:** the stop-condition contract + budget (`agentic-loop`), the independent
  checker (`reviewer`), and `loop-preflight`'s Ralph-Wiggum self-test.

### 2.2 Goal drift

Over a long loop, "do not touch" constraints fade from attention (they drift out of the
window by turn ~N). Fix: re-read the base spec/contract each iteration; keep constraints in
a durable file, not just the conversation.

- **Guarded by:** `STATE.md`, compaction, and re-reading the contract each cycle.

### 2.3 Comprehension debt & cognitive surrender

The faster the loop ships code you didn't hand-write, the wider the gap between the repo
and your understanding — and the stronger the pull to stop forming an opinion. Read every
diff; don't merge what you can't explain; periodically break code on purpose to prove the
gates still catch it.

- **Guarded by:** the "risks the loop does NOT remove" section of `agentic-loop`; human
  review stays in the path for anything that ships.

### 2.4 Skills/tools as injection vectors

An installed skill or MCP is instructions the agent will follow — malicious text can hide
in a description. Treat inbound assets as untrusted: read them, pin to tags, review diffs.

- **Guarded by:** `audit-external-skills.mdc`; `loadout doctor`'s injection lint.

### 2.5 Over-parallelization

Concurrency beyond your review bandwidth converts speed into unreviewed risk. Cap it;
serialize merges.

- **Guarded by:** `orchestrating-parallel-agents`' hard concurrency cap + serial landing.

---

## 3. Pattern → asset map

| Pattern | Primary loadout asset(s) |
|---|---|
| Workflows vs agents | `processes/workflows/*`, `running-a-dev-cycle`, `agentic-loop` |
| Outer loop + stop contract | `agentic-loop` (+ rule), `verification-and-stop-conditions` |
| Evaluator-optimizer / maker≠checker | `reviewer`, `security-reviewer`, `root-cause-fix` |
| Context engineering | `context-engineering` ref, `explorer`, `STATE.md` |
| Orchestrator-workers / parallel / worktrees | `orchestrating-parallel-agents`, `subagents-and-parallelism` |
| Spec/contract-driven | `planning-a-change`, `definition-of-done` |
| Plan-first | `planning-a-change`, `running-a-dev-cycle`, `getting-started` |
| Progressive disclosure | every `SKILL.md`, `skill-author`, `doctor` |
| ACI / tool design | `agent-tool-design`, `no-regex-for-semantics` |
| Root cause over symptom | `root-cause-fix`, `debugging-an-issue`, `regression-test` |
| Observability-first | `debugging-with-observability`, `observability-first` |
| Research-before-integrate | `researching-a-dependency`, `documentation-updates` |
| Self-declared-done guard | `loop-preflight`, `agentic-loop`, `reviewer` |

---

## 4. Sources

Primary sources behind these patterns (accessed 2026-07-01):

- Anthropic, "Building effective agents" — the five workflow patterns, agents vs
  workflows, and the agent-computer interface appendix.
  <https://www.anthropic.com/research/building-effective-agents>
- Anthropic, "Effective context engineering for AI agents" — compaction, just-in-time
  retrieval, minimal high-signal tokens, context rot, note-taking, sub-agent isolation.
  <https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents>
- Anthropic, "Equipping agents for the real world with Agent Skills" — progressive
  disclosure; SKILL.md metadata as the first disclosure level.
  <https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills>
- Claude Platform Docs, "Agent Skills" — the SKILL.md format and on-demand loading.
  <https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview>
- Geoffrey Huntley, "Ralph Wiggum as a software engineer" and "everything is a ralph
  loop" — the agentic loop and the self-declared-done failure mode.
  <https://ghuntley.com/ralph/> · <https://ghuntley.com/loop/>
- GitHub, "spec-kit" — spec-driven development toolkit.
  <https://github.com/github/spec-kit>
- Addy Osmani, "The Code Agent Orchestra," and Augment, "Git Worktrees for Parallel AI
  Agent Execution" — parallel agents, worktree isolation, diff-first review, matching
  parallelism to review bandwidth.
  <https://addyosmani.com/blog/code-agent-orchestra/> ·
  <https://www.augmentcode.com/guides/git-worktrees-parallel-ai-agent-execution>
