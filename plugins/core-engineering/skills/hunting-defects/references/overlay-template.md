# Project overlay template

Loadout ships a **generic** hunt. Product writers, tenancy columns, money
keys, and leak hotspots belong in the **consumer**, not this skill.

Copy this file to `references/project-overlay.md` in the vendored skill
directory. `loadout update` leaves extra files in place (they are not in
upstream). Do not edit this template in place — a copy named
`project-overlay.md` is the SoT the hunt reads.

Optional extra grep seeds (tab-separated `id<TAB>regex`, `#` comments):

`references/project-seed-patterns.txt`

```markdown
# Defect-hunt overlay — <project>

Do not duplicate the eight hunt classes. Name what this repo uniquely has.

## Writers (concurrency)

- HTTP route vs queue handler vs cron vs webhook vs UI effect
- What serializes them (row lock, singleton key, ledger idempotency, mutex)

## Money / latches

- How a debit/reserve settles, refunds, or parks
- Status machine (every terminal reachable?)
- What must never be charged / minted twice

## Authz / tenancy

- Tenant column or claim on every read/write
- Public vs session vs API-key surfaces
- IDOR ids the client supplies

## Leak hotspots

- Long-lived listeners (SSE, websocket, worker isolate)
- Acquire APIs that are easy to forget on unmount / abort / replay

Optional extra leak map (same survival rule as this overlay):
`auditing-resource-lifecycle/references/platform-leaks.md`
```
