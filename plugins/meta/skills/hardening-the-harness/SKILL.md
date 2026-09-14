---
name: hardening-the-harness
description: >
  Turn a real agent failure into a guard in the right layer, and prune stale ones. Use after a mistake you do not want repeated.
---

# Hardening the harness

## Trigger

The agent did something wrong — shipped broken/“finished” code, ran a destructive command, ignored a convention, derailed on a long task — and you want it to never happen again. Don't just retry; ratchet it.

## Workflow

1. **Name the failure precisely.** What did the agent do, and what should it have done? One sentence each. A vague failure can't be guarded.
2. **Pick the right layer** (encode the fix where it actually binds):
   - Missing convention / standing knowledge → a line in `AGENTS.md`, or a scoped `.mdc` rule (use `rule-author`).
   - Must-happen-every-time enforcement (block destructive cmd, run typecheck/lint after edit, approval before push) → a **hook** (see the `harness-hooks` runbook). Promote a rule to a hook if the agent keeps violating it.
   - A long/complex task that derailed → a planning step or a planner/executor split (`planning-a-change`).
   - "Finished" broken code → a verification gate (test/typecheck) wired into the loop, and/or a `reviewer` subagent check.
   - A review category the checker missed → add it to the `reviewer` / `security-reviewer` agent.
   - A repeatable procedure done ad hoc → a **skill** (use `skill-author`).
3. **Write the guard** in that layer. Keep it minimal and specific to the observed failure.
4. **Trace it:** the new rule/hook/check should map to this exact failure. If you can't justify it from a real mistake, don't add it.
5. **Prune first.** Smarter models need less prescription (Anthropic). If an old guard exists only for a mistake the current model no longer makes, **remove it** in the same change as any add. Harnesses move, not just grow. A lecture the model already knows is context rot, not a ratchet. Wortmann: keep a line only if it is failure-backed, tool-enforceable, decision-encoding, or triggerable — otherwise delete it. Unused skills still inject their **description** every turn; slash-only (`disable-model-invocation`) or delete them.

## Guardrails

- Add constraints from **observed** failures, not speculation. Litmus: *would removing this cause a mistake on today's model?* If not, cut it.
- Don't fix one failure by bloating an always-on rule; put enforcement in a hook, knowledge in a thin `AGENTS.md` line, procedure in a skill.
- Don't encode generic engineering (TDD, how to rebase, how to write a PR) as a skill. Those are model defaults now.

## Pairs with

- skills: `rule-author`, `skill-author`, `learning-from-chats`
- runbooks: `harness-setup`, `harness-hooks`
- docs: `agent-harness-engineering`
