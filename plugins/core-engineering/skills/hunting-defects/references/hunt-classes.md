# Hunt classes

Read the rows in scope. Skip a class only when the user named a different one.
If `references/project-overlay.md` exists, apply its writers / latches / authz / money
rows on top of these.

## Table of Contents

- [1. Lifecycle / leaks](#1-lifecycle--leaks)
- [2. Failure / edge paths](#2-failure--edge-paths)
- [3. Concurrency / races](#3-concurrency--races)
- [4. Contract / schema drift](#4-contract--schema-drift)
- [5. Trust / authz](#5-trust--authz)
- [6. Honesty / silent fallbacks](#6-honesty--silent-fallbacks)
- [7. Idempotency / replay](#7-idempotency--replay)
- [8. Latches / state machines](#8-latches--state-machines)

## 1. Lifecycle / leaks

Acquire without release on **every** path (success, throw, early return,
unmount, abort, replay). Dispatch `auditing-resource-lifecycle`.

## 2. Failure / edge paths

Empty, null, timeout, cancel, 4xx/5xx, retry, park, fail-closed vs fail-open.
Dispatch `walking-failure-paths`.

## 3. Concurrency / races

Fill `.cursor/skills/hunting-defects/references/concurrency-slice.md` for every
`class-seed-sweep` shared-mutable seed. Empty table + Map/Set/lock seeds →
**INCOMPLETE**. Do not "look for races" as a vibe.

## 4. Contract / schema drift

Schema / OpenAPI / Zod / protobuf / event payload at a boundary. Grep every
consumer of a changed type. A parse that `safeParse`s then ignores `.error` is
a candidate. Dual writers of the same contract must stay byte-identical where
the owning doc says they must.

## 5. Trust / authz

New read/write: tenant-scoped? owner session vs API key vs public token? IDOR
on an object id the client supplies. Secrets in logs or client bundles
(`no-secrets-in-code`). Overlay names the tenancy column / JWT claim.

## 6. Honesty / silent fallbacks

`no-shortcuts`: empty catch, `return null` that hides the failure, fallback
that invents data, `as any`, `@ts-ignore`, TODO-and-move-on. Shortcut-sweep
hits start here. Fail-open is legal only when the owning doc names it.
Unconfigured integrations skip or fail loudly — never stub success.

## 7. Idempotency / replay

Webhook, queue redelivery, debit key, exactly-once step. Re-delivery must not
double-charge, double-mint, or skip a latch. Handlers stay redelivery-safe.

## 8. Latches / state machines

Status fields, reserves, parks, drains. Every terminal must be reachable;
every resume must re-enter the same invariant. Draw the states if more than
three. Overlay names the machine.
