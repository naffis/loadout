---
name: writing-a-migration
disable-model-invocation: true
description: >
  Write a reversible expand/contract database migration. Use when changing schema or backfilling data.
---

# Writing a migration

House shape: **expand → backfill → dual-read → contract** across deploys. No in-place type/rename. Never `db:reset` or destructive against a remote/shared DB.

## Pairs with

- rules: `db-migration-safety`, `testing-conventions`
- skills: `reviewing-and-shipping`
- workflows: `ship-a-migration`
- runbooks: `multi-plane-deploy`, `hotfix-and-rollback`
