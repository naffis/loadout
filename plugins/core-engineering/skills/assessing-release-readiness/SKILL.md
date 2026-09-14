---
name: assessing-release-readiness
disable-model-invocation: true
description: >
  Make a go/no-go release call for a named change set. Use before promoting to production or cutting a release.
---

# Assessing release readiness

About to promote or cut a release.

## House contract

1. Scope the shipping set (since last release).
2. Run project gates. Tests-green is necessary, not sufficient — weigh blast radius and reversibility.
3. Every risky surface (migration, flag, contract change) must have a rollback.
4. Verdict: `GO` | `GO-WITH-CONDITIONS` (list them) | `NO-GO` (list blockers).
5. Don't bundle a risky migration with an urgent hotfix.

## Pairs with

- rules: `db-migration-safety`, `documentation-updates`
- skills: `reviewing-and-shipping`
- runbooks: `multi-plane-deploy`, `hotfix-and-rollback`
- workflows: `cut-a-release`, `ship-a-migration`
