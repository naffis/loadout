# Concurrency slice

Do not "look for races." Fill this table for every shared-mutable seed from
`class-seed-sweep.sh` (and any module-level `let` / `Map` / `Set` you read).
An empty table on a surface that has those seeds → hunt **INCOMPLETE**.

## Procedure

For each seed:

1. **Name the state** — variable, row, React state, lock token, in-memory `Map`.
2. **Name every writer** — HTTP handler, queue worker, cron, webhook, effect.
   Overlay lists product-specific writers when present.
3. **Interleave** — can two writers run without a lock / CAS / queue?
   TOCTOU between read and write? Double-settle? Lost update on resume?
4. **Verdict** — safe (cite the serializing mechanism) | candidate | speculative.

Read the enclosing functions of **both** writers, not the declaration site only.

## Required artifact

```
## Shared mutable
| State | Location | Writers | Serializing mechanism | Interleave? | Verdict |
| --- | --- | --- | --- | --- | --- |
```

`Interleave?` must be yes/no with a one-line reason. "Probably fine" is
speculative, not safe.
