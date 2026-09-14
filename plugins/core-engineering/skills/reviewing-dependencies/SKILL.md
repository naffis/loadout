---
name: reviewing-dependencies
disable-model-invocation: true
description: >
  Review a dependency add or bump for risk. Use on a bump PR.
---

# Reviewing dependencies

Lockfile is regenerated, not hand-edited (`lockfile-conflicts`). Don't treat green CI as enough for a major — read breaking notes. Security first; majors one at a time.

## Pairs with

- rules: `lockfile-conflicts`, `dependency-version-management`
- skills: `reviewing-and-shipping`, `researching-a-dependency`
- workflows: `dependency-bump`
