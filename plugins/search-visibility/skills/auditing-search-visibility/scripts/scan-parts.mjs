/** Structural HTML / markdown / robots checks for the search-visibility RECEIPT. */

export const CITE_BOTS = [
  "googlebot",
  "bingbot",
  "chatgpt-user",
  "oai-searchbot",
  "perplexitybot",
];

const MOUNT_IDS = /id=["'](?:root|__next|app)["']/i;

export function countTag(html, tag) {
  const re = new RegExp(`<${tag}\\b[^>]*>`, "gi");
  return (html.match(re) || []).length;
}

export function metaContent(html, name) {
  const re = new RegExp(
    `<meta\\b[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["'][^>]*>`,
    "i",
  );
  const m = html.match(re);
  if (m) return m[1];
  const re2 = new RegExp(
    `<meta\\b[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["'][^>]*>`,
    "i",
  );
  const m2 = html.match(re2);
  return m2 ? m2[1] : "";
}

export function titleOf(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? m[1].replace(/\s+/g, " ").trim() : "";
}

export function canonicalOf(html) {
  const m = html.match(
    /<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i,
  );
  return m ? m[1] : "";
}

export function jsonLdBlocks(html) {
  const out = [];
  const re =
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) out.push(m[1].trim());
  return out;
}

export function headingLevels(html) {
  const levels = [];
  const re = /<h([1-6])\b/gi;
  let m;
  while ((m = re.exec(html))) levels.push(Number(m[1]));
  return levels;
}

export function mdHeadings(body) {
  const levels = [];
  for (const line of body.split("\n")) {
    const m = /^(#{1,6})\s+\S/.exec(line);
    if (m) levels.push(m[1].length);
  }
  return levels;
}

export function imgsMissingAlt(html) {
  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  return imgs.filter((tag) => !/\balt\s*=/.test(tag)).length;
}

export function hasHeadingSkip(levels) {
  if (levels.length === 0) return false;
  let prev = levels[0];
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > prev + 1) return true;
    prev = levels[i];
  }
  return false;
}

export function looksLikeHtmlDocument(text) {
  return /<html[\s>]|<title[\s>]|<h1[\s>]|application\/ld\+json/i.test(text);
}

export function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isClientShell(html) {
  return MOUNT_IDS.test(html) && visibleText(html).length < 40;
}

export function hasNoindex(html) {
  const content = `${metaContent(html, "robots")} ${metaContent(html, "googlebot")}`;
  return /\bnoindex\b/i.test(content);
}

export function parseFrontmatter(text) {
  if (!text.startsWith("---")) return { data: {}, body: text };
  const end = text.indexOf("\n---", 3);
  if (end === -1) return { data: {}, body: text };
  const raw = text.slice(4, end);
  const data = {};
  for (const line of raw.split("\n")) {
    const m = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (!m) continue;
    data[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
  return { data, body: text.slice(end + 4) };
}

export function scanHtml(text, rel, hits) {
  const title = titleOf(text);
  const h1 = countTag(text, "h1");
  const desc = metaContent(text, "description");
  const canonical = canonicalOf(text);
  const levels = headingLevels(text);
  const missingAlt = imgsMissingAlt(text);
  const blocks = jsonLdBlocks(text);

  if (!title) hits.push({ sev: "blocker", code: "missing-title", file: rel });
  if (h1 === 0) hits.push({ sev: "blocker", code: "missing-h1", file: rel });
  if (h1 > 1) hits.push({ sev: "blocker", code: "multiple-h1", file: rel });
  if (isClientShell(text)) {
    hits.push({ sev: "blocker", code: "client-shell", file: rel });
  }
  if (!desc) hits.push({ sev: "warn", code: "missing-description", file: rel });
  if (!canonical) hits.push({ sev: "warn", code: "missing-canonical", file: rel });
  if (hasNoindex(text)) {
    hits.push({ sev: "warn", code: "has-noindex", file: rel });
  }
  if (missingAlt > 0) {
    hits.push({
      sev: "warn",
      code: `img-missing-alt:${missingAlt}`,
      file: rel,
    });
  }
  if (hasHeadingSkip(levels)) {
    hits.push({ sev: "warn", code: "heading-skip", file: rel });
  }
  for (const [i, block] of blocks.entries()) {
    try {
      JSON.parse(block);
    } catch {
      hits.push({
        sev: "blocker",
        code: `json-ld-invalid:${i}`,
        file: rel,
      });
    }
  }
}

export function scanMarkdown(text, rel, hits) {
  const { data, body } = parseFrontmatter(text);
  const levels = mdHeadings(body);
  const h1 = levels.filter((n) => n === 1).length;
  const title = data.title || "";
  if (!title && h1 === 0) {
    hits.push({ sev: "blocker", code: "missing-title", file: rel });
  }
  if (h1 === 0 && title) {
    hits.push({ sev: "warn", code: "missing-h1", file: rel });
  }
  if (h1 > 1) hits.push({ sev: "blocker", code: "multiple-h1", file: rel });
  if (!data.description) {
    hits.push({ sev: "warn", code: "missing-description", file: rel });
  }
  if (hasHeadingSkip(levels)) {
    hits.push({ sev: "warn", code: "heading-skip", file: rel });
  }
}

export function parseRobots(text) {
  const records = [];
  let agents = [];
  let rules = [];
  const flush = () => {
    if (agents.length) records.push({ agents, rules });
    agents = [];
    rules = [];
  };
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, "").trim();
    if (!line) continue;
    const m = /^(user-agent|allow|disallow)\s*:\s*(.*)$/i.exec(line);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const val = m[2].trim();
    if (key === "user-agent") {
      if (rules.length) flush();
      agents.push(val.toLowerCase());
    } else {
      rules.push({ kind: key, path: val || "/" });
    }
  }
  flush();
  return records;
}

export function robotsBlocksCiteBot(text) {
  const records = parseRobots(text);
  const hits = [];
  for (const rec of records) {
    const sitewide = rec.rules.some(
      (r) => r.kind === "disallow" && (r.path === "/" || r.path === "/*"),
    );
    if (!sitewide) continue;
    for (const a of rec.agents) {
      if (a === "*") {
        hits.push("user-agent:* disallow:/");
        continue;
      }
      if (CITE_BOTS.includes(a)) hits.push(a);
    }
  }
  return hits;
}

export function scanRobots(text, rel, hits) {
  for (const bot of robotsBlocksCiteBot(text)) {
    hits.push({ sev: "blocker", code: `robots-blocks:${bot}`, file: rel });
  }
}

export function scanSitemap(text, rel, hits) {
  if (!/<urlset\b/i.test(text) && !/<sitemapindex\b/i.test(text)) {
    hits.push({ sev: "warn", code: "sitemap-not-xml-index", file: rel });
  }
}
