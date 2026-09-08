# search-visibility

Skills and rules for public-page discovery: search engine optimization (SEO),
answer-engine / AI-overview work (AEO / AIO), and generative-engine citation
work (GEO).

This kit is for agents editing sites, docs, and marketing pages. It is not a
ranking guarantee and it does not treat vendor GEO "hacks" as house doctrine.

## When to use

- Audit a page or site for crawl, extractability, and people-first quality
- Write or rewrite public content so humans and answer engines can use it
- Implement metadata, structured data, robots, and server-rendered HTML

## How it is split

| Kind | Id | Job |
| --- | --- | --- |
| Skill | `auditing-search-visibility` | Report-only audit. RECEIPT is for first-response HTML, markdown, or robots (files or live URLs). |
| Skill | `writing-citable-content` | Write or rewrite public prose. |
| Skill | `optimizing-for-discovery` | Implement technical and on-page fixes. |
| Rule | `people-first-content` | Unique, helpful, people-first. No commodity pages. |
| Rule | `no-search-spam` | Never scaled content, cloaking, fake schema, keyword stuffing. |
| Rule | `search-technical` | Crawlable HTML, honest metadata, schema matches the page. |

## Evidence

Read `skills/_shared/evidence.md` before applying a tactic. Google Search
Central is the default for Google surfaces. Other engines get their own
caveats. Princeton GEO (2023) and C-SEO Bench (2025) disagree on whether
"GEO methods" work. Do not promise citations.

## Install

Not in `kits.starter`. Add explicitly:

```bash
npx github:naffis/loadout add search-visibility
# or individual ids:
npx github:naffis/loadout add auditing-search-visibility optimizing-for-discovery writing-citable-content
npx github:naffis/loadout add people-first-content no-search-spam search-technical
```

Or install the Claude plugin `search-visibility@loadout`.
