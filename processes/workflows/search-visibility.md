---
name: search-visibility
uses:
  rules:
    - people-first-content
    - no-search-spam
    - search-technical
    - copy-voice
    - no-shortcuts
  skills:
    - auditing-search-visibility
    - writing-citable-content
    - optimizing-for-discovery
    - cleaning-ai-copy
  commands:
    - audit-search-cmd
    - optimize-discovery-cmd
  agents:
    - reviewer
gate: "scanner RECEIPT blockers: 0 on scoped files + reviewer SAFE on the metadata/content diff"
stop_condition: "named pages are crawlable, people-first, and schema-honest; no citation promise remains; leftovers have a next-prompt fence"
---

# Search visibility

Audit, write, and implement public-page discovery (SEO / AIO / GEO) without
spam or invented scores.

1. **Audit.** `/audit-search` on named paths or live URLs. Quote the
   scanner RECEIPT (`source: url` when a URL was named). Use
   `auditing-search-visibility`. Report only until asked to fix.
2. **Write.** Unique, extractable prose via `writing-citable-content`.
   Then `cleaning-ai-copy` on the prose files.
3. **Implement.** `/optimize-discovery` for metadata, SSR text, robots,
   and honest JSON-LD. Re-scan. Blockers must be 0 on scoped files.
4. **Check.** Dispatch `reviewer` on the diff. Do not self-grade.

Stop if the user asked for a banned tactic (`no-search-spam`) or if the
page has no audience other than "rank this."
