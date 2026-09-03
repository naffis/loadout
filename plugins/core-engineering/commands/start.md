---
description: Shortcut to decide how to proceed on a goal and get a ready-to-run kickoff prompt.
---

Run the `getting-started` skill for the user's goal: $ARGUMENTS

1. If no goal was given, ask one line: "What do you want to build or do?"
2. Follow `getting-started`: clarify the goal (interview briefly only if vague), orient with `onboard-to-codebase` if the repo is unfamiliar, classify the work, route to the right workflow + supporting skills/rules, and decide manual vs autonomous loop via `loop-preflight`.
3. Output a short recommendation, then emit this fence and nothing after it:

```text
<root-skill>: <goal + enough context to start>

Gate: <typecheck / test / lint command>
Done when: <done-condition>
Out of scope: …
Follow the named skill in full.
```

Keep it brief — this is an entry point, not the work itself.
