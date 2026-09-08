# Structured data

JSON-LD in the HTML (or the framework equivalent that emits it into the
first response). Must match visible content. Google: useful for rich
results, not required for generative AI features.

## Choose a type that fits

| Page | `@type` |
| --- | --- |
| Article / blog | `Article` or `BlogPosting` |
| FAQ section that is on the page | `FAQPage` |
| How-to with real steps | `HowTo` |
| Product | `Product` (plus Offer if price is visible) |
| Org / brand home | `Organization` |
| Software / SaaS | `SoftwareApplication` only if it fits |

Prefer one `@graph` with `@id` links over disconnected scripts that
disagree.

## Required honesty

- `headline` / `name` = visible title
- `datePublished` / `dateModified` = real dates
- `author` = a real person or org with a URL you own
- FAQ `acceptedAnswer` text appears on the page
- Ratings and reviews are collected, not invented

## Example (article)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Visible H1 goes here",
  "datePublished": "2026-09-08",
  "dateModified": "2026-09-08",
  "author": {
    "@type": "Person",
    "name": "Name on the byline",
    "url": "https://example.com/authors/name"
  }
}
</script>
```

Validate with [Rich Results Test](https://search.google.com/test/rich-results)
and [Schema Markup Validator](https://validator.schema.org/) when the URL
is reachable. The local scanner checks JSON parse on first-response HTML.
