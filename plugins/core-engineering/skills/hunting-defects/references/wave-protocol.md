# Wave protocol

Completeness is per **wave**, not one gulp at the end. Models that batch the
whole census into a single reply skip the tail.

## Size

Use `waves_needed` / `wave_size` from the census RECEIPT (default 30 `review`
files). Do not raise the size to finish faster.

`test:` files are a **separate optional wave**, only when walking failure-paths
or when the user asked to hunt tests. `docs:` / `style:` are not defect-hunted
unless asked.

## Assign

Before reading, print:

```
Wave W/K
- path/a.ts
- path/b.ts
…
```

Every census `review:` line appears in exactly one wave. Parent keeps the list;
subagents do not invent extra files.

## After each wave (required)

1. Candidates → refute (promote / kill / speculative).
2. Emit a **partial** findings block (can be short).
3. Then start the next wave.

Do not wait until wave K to write findings. Stopping after wave 1 because
"enough issues" → hunt is **INCOMPLETE**.

## Subagents

Wave ≥ 15 `review` files: dispatch `explorer` (Cursor Task `explore`) with
[`hunter-brief.md`](hunter-brief.md) and **only that wave's paths**. Parent
refutes. Hunter severity is discarded.

## Read depth

For each seed in the wave, read the **enclosing function** (signature through
closing brace), not ±3 lines around the grep hit.
