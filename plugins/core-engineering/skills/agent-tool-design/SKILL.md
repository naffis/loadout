---
name: agent-tool-design
description: >
  Design tools a product's agent calls. Use when adding or reviewing agent/MCP tools, not when running this coding agent's loop (agentic-loop).
---

# Designing agent-facing tools

The *dev* agent's task loop is `agentic-loop`, not this. Public ACI lectures stay in Anthropic's docs — do not restate them here.

House contract:

- Registration/wiring is **project-specific**. Removing or merging a tool → `capability-removal`.
- Classifying meaning (intent, category) → an LLM, not a regex (`no-regex-for-semantics`).
- Long prompt strings → `prompt-extraction`.

## Pairs with

- skills: `agentic-loop`
- rules: `no-regex-for-semantics`, `capability-removal`, `prompt-extraction`
- docs: `agentic-patterns`
