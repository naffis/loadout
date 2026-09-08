# Audit checklists

Use after the scanner RECEIPT. Mark pass / fail / n/a. Do not turn this
into a /100 score.

## Technical (T1)

- [ ] URL returns 200 for the canonical; HTTPS
- [ ] Title present, unique, matches the H1 intent
- [ ] Exactly one H1
- [ ] Meta description present and honest
- [ ] Canonical set; no conflicting `noindex` on a URL they want indexed
- [ ] Main text in the first HTML (scanner `source: url` or curl, not only the SPA)
- [ ] Internal links are `<a href>`
- [ ] Images that carry meaning have alt
- [ ] Sitemap lists the URL (or framework equivalent)
- [ ] `robots.txt` does not block Googlebot (or the named engine)

## Content (T1)

- [ ] Audience would use this page if they arrived directly
- [ ] Unique experience, data, or analysis (not a commodity rewrite)
- [ ] Question answered in the first screen, then depth
- [ ] Who / how / why is visible (byline, date, method, purpose)
- [ ] Claims have sources a stranger can open
- [ ] No date-bump without a real edit
- [ ] YMYL: identifiable expert, not anonymous advice

## Extractability (helps AEO + non-Google GEO; does not hurt Google)

- [ ] Definition or direct answer in the opening
- [ ] H2/H3 are questions or task names a person would ask
- [ ] Comparison data is a table, not a paragraph
- [ ] FAQ answers are self-contained sentences
- [ ] Last-updated date matches a real change

## Structured data (T1 for rich results, not required for AI Overviews)

- [ ] JSON-LD parses
- [ ] `@type` fits the page (Article, FAQPage, Product, Organization, …)
- [ ] Every property is visible on the page
- [ ] No fake reviews, ratings, or FAQs

## Other engines (only if named)

- [ ] Search/cite crawler allowed (`../../_shared/crawlers.md`)
- [ ] Optional `llms.txt` lists the real key URLs
- [ ] Pricing / specs readable without a login or JS wall
