#!/usr/bin/env node
/**
 * Mechanical search-visibility RECEIPT. Quote the RECEIPT block.
 * Valid only for crawler-visible documents: first-response HTML, markdown
 * content, or robots.txt. Framework sources without HTML cannot be clean.
 *
 * Usage:
 *   node scan-search-visibility.mjs [paths-or-https-urls…]
 *   node scan-search-visibility.mjs --url https://example.com/page
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import {
  CITE_BOTS,
  hasHeadingSkip,
  looksLikeHtmlDocument,
  scanHtml,
  scanMarkdown,
  scanRobots,
  scanSitemap,
} from "./scan-parts.mjs";

const SKIP_DIRS = new Set([
  ".git",
  ".next",
  "coverage",
  "dist",
  "node_modules",
  "vendor",
]);
const MAX_FILES = 200;
const FETCH_MS = 10_000;
const FETCH_MAX_BYTES = 2_000_000;
const SCAN_UA =
  "scan-search-visibility/0.1 (+https://github.com/naffis/loadout)";

function gitRoot() {
  const r = spawnSync("git", ["rev-parse", "--show-toplevel"], {
    encoding: "utf8",
  });
  if (r.status === 0) return r.stdout.trim();
  return process.cwd();
}

function posixify(p) {
  return p.split("\\").join("/");
}

export function parseScanArgs(argv) {
  const paths = [];
  const urls = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--url") {
      const next = argv[++i];
      if (next) urls.push(next);
      continue;
    }
    if (/^https?:\/\//i.test(a)) {
      urls.push(a);
      continue;
    }
    paths.push(a);
  }
  return { paths, urls };
}

function isRobotsName(base) {
  return /robots.*\.txt$/i.test(base);
}

function isSitemapName(base) {
  return /^sitemap.*\.(xml|txt)$/i.test(base);
}

function isCrawlableFile(abs) {
  const base = basename(abs);
  const ext = extname(abs).toLowerCase();
  if (isRobotsName(base)) return true;
  if (isSitemapName(base)) return true;
  return [".html", ".htm", ".md", ".mdx", ".tsx", ".jsx"].includes(ext);
}

function walkDir(abs, out) {
  if (out.length >= MAX_FILES) return;
  let entries = [];
  try {
    entries = readdirSync(abs, { withFileTypes: true });
  } catch {
    return;
  }
  for (const ent of entries) {
    if (out.length >= MAX_FILES) return;
    if (SKIP_DIRS.has(ent.name)) continue;
    const child = join(abs, ent.name);
    if (ent.isDirectory()) walkDir(child, out);
    else if (ent.isFile() && isCrawlableFile(child)) out.push(child);
  }
}

function collectFrom(root, requested, hits) {
  const abs = requested.startsWith("/") ? requested : join(root, requested);
  const rel = posixify(relative(root, abs) || requested);
  if (!existsSync(abs)) {
    hits.push({ sev: "blocker", code: "missing-path", file: rel });
    return [];
  }
  const st = statSync(abs);
  const absFiles = [];
  if (st.isDirectory()) {
    walkDir(abs, absFiles);
    if (absFiles.length === 0) {
      hits.push({
        sev: "blocker",
        code: "no-crawlable-documents",
        file: rel,
      });
    }
    if (absFiles.length >= MAX_FILES) {
      hits.push({ sev: "warn", code: "scan-capped", file: rel });
    }
  } else if (st.isFile()) {
    if (!isCrawlableFile(abs)) {
      hits.push({ sev: "blocker", code: "unscanned-type", file: rel });
      return [];
    }
    absFiles.push(abs);
  }
  return absFiles.map((fileAbs) => ({
    abs: fileAbs,
    rel: posixify(relative(root, fileAbs) || fileAbs),
  }));
}

export function scanFile(abs, rel, hits) {
  const text = readFileSync(abs, "utf8");
  const base = posixify(rel).split("/").pop() || rel;
  const ext = extname(abs).toLowerCase();
  if (isRobotsName(base)) {
    scanRobots(text, rel, hits);
    return;
  }
  if (isSitemapName(base)) {
    scanSitemap(text, rel, hits);
    return;
  }
  if (ext === ".html" || ext === ".htm") {
    scanHtml(text, rel, hits);
    return;
  }
  if (ext === ".md" || ext === ".mdx") {
    scanMarkdown(text, rel, hits);
    return;
  }
  if (ext === ".tsx" || ext === ".jsx") {
    if (looksLikeHtmlDocument(text)) scanHtml(text, rel, hits);
    else hits.push({ sev: "blocker", code: "not-first-html", file: rel });
    return;
  }
  hits.push({ sev: "blocker", code: "unscanned-type", file: rel });
}

export function scanPaths(root, paths) {
  const files = [];
  const hits = [];
  const seen = new Set();
  for (const p of paths) {
    for (const f of collectFrom(root, p, hits)) {
      if (seen.has(f.abs)) continue;
      seen.add(f.abs);
      files.push(f);
      scanFile(f.abs, f.rel, hits);
    }
  }
  return { files, hits };
}

export async function fetchDocument(url, fetchImpl = globalThis.fetch) {
  if (!/^https?:\/\//i.test(url)) {
    return { ok: false, error: "not-http-url", url };
  }
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), FETCH_MS);
  try {
    const res = await fetchImpl(url, {
      redirect: "follow",
      signal: ac.signal,
      headers: { "user-agent": SCAN_UA },
    });
    const buf = await res.arrayBuffer();
    if (buf.byteLength > FETCH_MAX_BYTES) {
      return { ok: false, error: "response-too-large", url, status: res.status };
    }
    const text = new TextDecoder("utf-8").decode(buf);
    return {
      ok: true,
      url,
      finalUrl: res.url || url,
      status: res.status,
      contentType: res.headers.get("content-type") || "",
      text,
    };
  } catch (err) {
    return { ok: false, error: err?.name === "AbortError" ? "timeout" : "fetch-failed", url };
  } finally {
    clearTimeout(timer);
  }
}

export function scanFetched(doc, hits) {
  const rel = doc.finalUrl || doc.url;
  if (!doc.ok) {
    hits.push({
      sev: "blocker",
      code: `fetch-failed:${doc.error || "unknown"}`,
      file: doc.url,
    });
    return;
  }
  if (doc.status < 200 || doc.status >= 300) {
    hits.push({
      sev: "blocker",
      code: `http-status:${doc.status}`,
      file: rel,
    });
  }
  const path = new URL(rel, "https://example.invalid").pathname;
  const base = path.split("/").pop() || path;
  if (isRobotsName(base) || /robots\.txt$/i.test(path)) {
    scanRobots(doc.text, rel, hits);
    return;
  }
  scanHtml(doc.text, rel, hits);
}

export async function scanUrls(urls, fetchImpl = globalThis.fetch) {
  const documents = [];
  const hits = [];
  for (const url of urls) {
    const doc = await fetchDocument(url, fetchImpl);
    documents.push(doc);
    scanFetched(doc, hits);
  }
  return { documents, hits };
}

export function formatReceipt(files, hits, documents = []) {
  const lines = ["RECEIPT scan-search-visibility"];
  if (files.length === 0 && documents.length === 0) {
    lines.push("note: no files");
  }
  for (const f of files) {
    lines.push(`source: file`);
    lines.push(`file: ${f.rel}`);
  }
  for (const d of documents) {
    lines.push(`source: url`);
    lines.push(`url: ${d.finalUrl || d.url}`);
    if (d.status != null) lines.push(`status: ${d.status}`);
  }
  const blockers = hits.filter((h) => h.sev === "blocker");
  const warns = hits.filter((h) => h.sev === "warn");
  for (const h of hits) {
    lines.push(`${h.sev}: ${h.code}`);
    lines.push(`file: ${h.file}`);
  }
  lines.push(`blockers: ${blockers.length}`);
  lines.push(`warns: ${warns.length}`);
  lines.push("END");
  return { text: lines.join("\n"), blockers: blockers.length };
}

async function main(argv = process.argv.slice(2)) {
  const root = gitRoot();
  const { paths, urls } = parseScanArgs(argv);
  const { files, hits } = scanPaths(root, paths);
  const { documents, hits: urlHits } = await scanUrls(urls);
  const allHits = hits.concat(urlHits);
  const { text, blockers } = formatReceipt(files, allHits, documents);
  console.log(text);
  return blockers > 0 ? 1 : 0;
}

export {
  CITE_BOTS,
  hasHeadingSkip,
  scanHtml,
  scanMarkdown,
  scanRobots,
};

export { parseRobots, robotsBlocksCiteBot } from "./scan-parts.mjs";

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().then((code) => process.exit(code));
}
