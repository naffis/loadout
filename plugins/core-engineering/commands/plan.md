---
description: Produce a complete zero-shortcut implementation plan for the given task. Do not write implementation code.
---

Everything after this command is the task. Run the `create-plan` skill in full.
Do not write implementation code in this session.

Prefer **Plan Mode** (Shift+Tab in Cursor) so research stays read-only. Text after
the command name is the task.

## Ground rules

- Comprehensive means nothing left unresolved, not maximum length. No filler.
- Every claim about existing code must come from reading the file in this session. Cite the path (and line where it matters).
- No TBDs, no "decide later", no placeholder sections.
- If ambiguity would change the design, ask numbered clarifying questions and **stop until answered**. For minor ambiguity, proceed and log the assumption. Open questions must be empty when the plan is delivered — resolve or non-goal everything else.
- Prefer the simplest design that fully satisfies the requirements. Robust means handles failure well, not maximal scope.
- Follow `create-plan` + `no-shortcuts`: in-repo evidence first (list files read, trace data flow, check the package manifest), mandatory external research, EARS/ACs, mini-ADRs, executable tasks.

## If the task is missing

Ask one line: "What do you want planned?" Then stop until answered.

## After drafting

Prefer `/review-plan` (or "Review the plan") before implementation — especially for non-trivial work. Skip planning when the change is a one-sentence diff. For hard problems, run `/plan` across two models in parallel (worktrees) and merge the best plan.

Task: $ARGUMENTS
