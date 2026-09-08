#!/usr/bin/env node
/**
 * Mechanical AI-copy RECEIPT. Quote the RECEIPT block. Structural only.
 * Usage:
 *   node scan-ai-copy.mjs [--report-only] [--include-code] [--include-self] [paths…]
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const here = dirname(fileURLToPath(import.meta.url));
const PATTERNS_PATH = join(here, "..", "references", "ai-copy-patterns.json");

const CODE_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
const TEXT_EXT = new Set([".md", ".mdx", ".txt"]);
const BINARY_EXT = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".mp4",
  ".webm",
  ".mov",
  ".woff",
  ".woff2",
  ".ttf",
  ".ico",
  ".pdf",
  ".zip",
]);

const FINITE_VERBS = new Set([
  "is",
  "are",
  "can",
  "will",
  "does",
  "has",
  "have",
  "get",
  "gets",
  "store",
  "stores",
  "keep",
  "keeps",
  "let",
  "lets",
  "stop",
  "use",
  "uses",
]);

const IMPERATIVE_START = new Set([
  "retry",
  "never",
  "do",
  "don't",
  "dont",
  "run",
  "set",
  "add",
  "fix",
]);

const NOT_X_BUT_Y = [
  /\bit'?s\s+not\s+(?:just\s+)?[^,.]{1,80}[,.]\s*it'?s\s+/gi,
  /\bnot\s+[^,]{1,80},\s+but\s+/gi,
];

const SERVES_AS = /\bserves\s+as\b/i;
const STANDS_AS = /\bstands\s+as\b/i;
const BOASTS = /\bboasts\b/i;

function parseArgs(argv) {
  const flags = {
    reportOnly: false,
    includeCode: false,
    includeSelf: false,
  };
  const paths = [];
  for (const a of argv) {
    if (a === "--report-only") flags.reportOnly = true;
    else if (a === "--include-code") flags.includeCode = true;
    else if (a === "--include-self") flags.includeSelf = true;
    else if (a.startsWith("-")) continue;
    else paths.push(a);
  }
  return { flags, paths };
}

function gitRoot() {
  const r = spawnSync("git", ["rev-parse", "--show-toplevel"], {
    encoding: "utf8",
  });
  if (r.status === 0) return r.stdout.trim();
  return process.cwd();
}

function gitStatusPaths(root) {
  const r = spawnSync("git", ["status", "--porcelain"], {
    encoding: "utf8",
    cwd: root,
  });
  if (r.status !== 0 || !r.stdout) return [];
  const out = [];
  for (const line of r.stdout.split("\n")) {
    if (!line.trim()) continue;
    const rest = line.slice(3);
    const parts = rest.split(" -> ");
    out.push(parts[parts.length - 1]);
  }
  return out;
}

function posixify(p) {
  return p.split(sep).join("/");
}

function isExcluded(rel) {
  const p = posixify(rel);
  if (p.endsWith("ai-copy-tells.md") || p.includes("/ai-copy-tells.md"))
    return true;
  if (p.endsWith("ai-copy-patterns.json") || p.includes("/ai-copy-patterns.json"))
    return true;
  if (p.includes("cleaning-ai-copy/scripts/fixtures/")) return true;
  if (p.includes(".cursor/plans/") || p.startsWith(".cursor/plans/")) return true;
  if (p.includes(".loadout/tasks/") || p.startsWith(".loadout/tasks/"))
    return true;
  return false;
}

function extOf(p) {
  const i = p.lastIndexOf(".");
  return i === -1 ? "" : p.slice(i).toLowerCase();
}

function isTextPath(p, includeCode) {
  if (BINARY_EXT.has(extOf(p))) return false;
  const ext = extOf(p);
  if (CODE_EXT.has(ext)) return includeCode;
  if (TEXT_EXT.has(ext)) return true;
  return false;
}

function loadPatterns() {
  return JSON.parse(readFileSync(PATTERNS_PATH, "utf8"));
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function lineNumber(text, index) {
  let n = 1;
  for (let i = 0; i < index && i < text.length; i++) {
    if (text.charCodeAt(i) === 10) n++;
  }
  return n;
}

function wordCount(s) {
  const m = s.trim().match(/\S+/g);
  return m ? m.length : 0;
}

function firstWord(s) {
  const m = s.trim().match(/^[^\s]+/);
  return m ? m[0].replace(/[^a-zA-Z']/g, "").toLowerCase() : "";
}

function hasFiniteVerb(s) {
  const words = s.toLowerCase().match(/[a-z']+/g) ?? [];
  return words.some((w) => FINITE_VERBS.has(w));
}

function splitSentences(text) {
  const parts = [];
  const re = /[^.!?\n]+[.!?]?/g;
  let m;
  while ((m = re.exec(text))) {
    const raw = m[0];
    if (!raw.trim()) continue;
    parts.push({ text: raw.trim(), index: m.index });
  }
  return parts;
}

function splitParagraphs(text) {
  const parts = [];
  const re = /[^\n]+(?:\n(?!\n)[^\n]+)*/g;
  let m;
  while ((m = re.exec(text))) {
    parts.push({ text: m[0], index: m.index });
  }
  return parts;
}

function addHit(hits, tier, pattern, line, file) {
  hits.push({ tier, pattern, line, file });
}

function scanText(text, file, patterns, hits) {
  const red = patterns.red;
  const orange = patterns.orange;
  const yellow = patterns.yellow;

  for (const art of red.artifacts) {
    const re = new RegExp(escapeRe(art), "gi");
    let m;
    while ((m = re.exec(text))) {
      addHit(hits, "RED", art, lineNumber(text, m.index), file);
    }
  }
  for (const src of red.artifactRegex) {
    const re = new RegExp(src, "gi");
    let m;
    while ((m = re.exec(text))) {
      addHit(hits, "RED", `artifactRegex:${src}`, lineNumber(text, m.index), file);
    }
  }
  for (const ph of red.phrases) {
    const re = new RegExp(escapeRe(ph), "gi");
    let m;
    while ((m = re.exec(text))) {
      addHit(hits, "RED", ph, lineNumber(text, m.index), file);
    }
  }
  for (const w of red.words) {
    const re = new RegExp(`\\b${escapeRe(w)}\\b`, "gi");
    let m;
    while ((m = re.exec(text))) {
      addHit(hits, "RED", w, lineNumber(text, m.index), file);
    }
  }
  for (const vp of red.verbPhrases ?? []) {
    const re = new RegExp(escapeRe(vp), "gi");
    let m;
    while ((m = re.exec(text))) {
      addHit(hits, "RED", vp, lineNumber(text, m.index), file);
    }
  }

  for (const re of NOT_X_BUT_Y) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text))) {
      addHit(hits, "RED", "notXbutY", lineNumber(text, m.index), file);
    }
  }
  {
    const re = new RegExp(SERVES_AS.source, "gi");
    let m;
    while ((m = re.exec(text))) {
      addHit(hits, "RED", "servesAs", lineNumber(text, m.index), file);
    }
  }
  {
    const re = new RegExp(STANDS_AS.source, "gi");
    let m;
    while ((m = re.exec(text))) {
      addHit(hits, "RED", "standsAs", lineNumber(text, m.index), file);
    }
  }
  {
    const re = new RegExp(BOASTS.source, "gi");
    let m;
    while ((m = re.exec(text))) {
      addHit(hits, "RED", "boasts", lineNumber(text, m.index), file);
    }
  }

  const sentences = splitSentences(text);
  const consumedInvariant = new Set();
  for (let i = 1; i < sentences.length; i++) {
    const prev = sentences[i - 1].text.replace(/[.!?]+$/, "").trim();
    const cur = sentences[i].text;
    const wc = wordCount(prev);
    const start = firstWord(prev);
    if (wc === 0 || wc > 12) continue;
    if (!/\bfor\b/i.test(prev)) continue;
    if (hasFiniteVerb(prev)) continue;
    if (IMPERATIVE_START.has(start)) continue;
    const invHit = (orange.solemnInvariant ?? []).some((p) =>
      new RegExp(escapeRe(p), "i").test(cur),
    );
    if (!invHit) continue;
    addHit(
      hits,
      "RED",
      "taxonomyInvariant",
      lineNumber(text, sentences[i - 1].index),
      file,
    );
    consumedInvariant.add(i);
  }

  for (const ph of orange.solemnInvariant ?? []) {
    const re = new RegExp(escapeRe(ph), "gi");
    let m;
    while ((m = re.exec(text))) {
      const sentIdx = sentences.findIndex(
        (s) => m.index >= s.index && m.index < s.index + s.text.length,
      );
      if (sentIdx !== -1 && consumedInvariant.has(sentIdx)) continue;
      addHit(hits, "ORANGE", "solemnInvariant", lineNumber(text, m.index), file);
    }
  }

  const paras = splitParagraphs(text);
  const parasWithInvariant = new Set();
  for (const para of paras) {
    const hasInv =
      (orange.solemnInvariant ?? []).some((p) =>
        new RegExp(escapeRe(p), "i").test(para.text),
      ) ||
      hits.some(
        (h) =>
          h.file === file &&
          h.pattern === "taxonomyInvariant" &&
          h.line >= lineNumber(text, para.index) &&
          h.line <= lineNumber(text, para.index + para.text.length),
      );
    if (hasInv) parasWithInvariant.add(para.index);
  }

  for (const leak of orange.schemaLeakWithInvariant ?? []) {
    const re = new RegExp(escapeRe(leak), "gi");
    let m;
    while ((m = re.exec(text))) {
      const para = paras.find(
        (p) => m.index >= p.index && m.index < p.index + p.text.length,
      );
      if (!para || !parasWithInvariant.has(para.index)) continue;
      addHit(hits, "ORANGE", "schemaLeak", lineNumber(text, m.index), file);
    }
  }

  const threshold = orange.clusterThreshold ?? 2;
  for (const para of paras) {
    const found = [];
    for (const w of orange.clusterWords ?? []) {
      if (new RegExp(`\\b${escapeRe(w)}\\b`, "i").test(para.text)) found.push(w);
    }
    if (found.length >= threshold) {
      addHit(
        hits,
        "ORANGE",
        `cluster:${found.join(",")}`,
        lineNumber(text, para.index),
        file,
      );
    }
  }

  for (const w of orange.promo ?? []) {
    const re = new RegExp(escapeRe(w), "gi");
    let m;
    while ((m = re.exec(text))) {
      addHit(hits, "ORANGE", w, lineNumber(text, m.index), file);
    }
  }
  for (const w of orange.danglingIng ?? []) {
    const re = new RegExp(`\\b${escapeRe(w)}\\b`, "gi");
    let m;
    while ((m = re.exec(text))) {
      addHit(hits, "ORANGE", w, lineNumber(text, m.index), file);
    }
  }

  if (yellow.emDash) {
    const chars = yellow.emDashChars ?? ["\u2014", "\u2013"];
    for (const ch of chars) {
      let idx = 0;
      while ((idx = text.indexOf(ch, idx)) !== -1) {
        addHit(hits, "YELLOW", "emDash", lineNumber(text, idx), file);
        idx += ch.length;
      }
    }
  }
}

function collectFiles(root, requested, flags) {
  let raw = requested.slice();
  if (raw.length === 0) {
    raw = gitStatusPaths(root).filter((p) => {
      const ext = extOf(p);
      return TEXT_EXT.has(ext);
    });
  }
  const out = [];
  for (const p of raw) {
    const abs = p.startsWith("/") ? p : join(root, p);
    const rel = posixify(relative(root, abs) || p);
    if (!flags.includeSelf && isExcluded(rel)) continue;
    if (!existsSync(abs)) continue;
    if (!isTextPath(abs, flags.includeCode)) continue;
    out.push({ abs, rel });
  }
  return out;
}

function main(argv = process.argv.slice(2)) {
  const { flags, paths } = parseArgs(argv);
  const root = gitRoot();
  const patterns = loadPatterns();
  const files = collectFiles(root, paths, flags);
  const hits = [];

  console.log("RECEIPT");
  if (files.length === 0) {
    console.log("note: no files");
    console.log("hits_red: 0");
    console.log("hits_orange: 0");
    console.log("hits_yellow: 0");
    console.log("END");
    return 0;
  }

  for (const f of files) {
    console.log(`file: ${f.rel}`);
    const text = readFileSync(f.abs, "utf8");
    scanText(text, f.rel, patterns, hits);
  }

  for (const h of hits) {
    console.log(`tier: ${h.tier}`);
    console.log(`pattern: ${h.pattern}`);
    console.log(`line: ${h.line}`);
    console.log(`file: ${h.file}`);
  }

  const hits_red = hits.filter((h) => h.tier === "RED").length;
  const hits_orange = hits.filter((h) => h.tier === "ORANGE").length;
  const hits_yellow = hits.filter((h) => h.tier === "YELLOW").length;
  console.log(`hits_red: ${hits_red}`);
  console.log(`hits_orange: ${hits_orange}`);
  console.log(`hits_yellow: ${hits_yellow}`);
  console.log("END");
  void flags.reportOnly;
  return hits_red > 0 || hits_orange > 0 ? 1 : 0;
}

export { main, scanText, isExcluded, loadPatterns, parseArgs };

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exit(main());
}
