---
name: writing-an-adr
disable-model-invocation: true
description: >
  Write an architecture decision record for a locked choice. Use when asked for an ADR.
---

# Writing an ADR

`docs/adr/NNNN-short-title.md`. Never edit a decided ADR's meaning — supersede. Link from the code/PR that implements it.

```markdown
# NNNN. <decision title>

- Status: proposed | accepted | superseded by NNNN
- Date: YYYY-MM-DD

## Context
## Decision
## Consequences
## Alternatives considered
```

## Pairs with

- rules: `documentation-updates`
- skills: `updating-docs`, `planning-a-change`, `create-plan`
- workflows: `plan-then-build`
