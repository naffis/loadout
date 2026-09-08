import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import {
  formatReceipt,
  hasHeadingSkip,
  parseScanArgs,
  robotsBlocksCiteBot,
  scanHtml,
  scanMarkdown,
  scanPaths,
  scanRobots,
  scanUrls,
} from "./scan-search-visibility.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const fixtures = join(here, "fixtures");

function load(name) {
  return readFileSync(join(fixtures, name), "utf8");
}

test("good html has no blockers", () => {
  const hits = [];
  scanHtml(load("good.html"), "good.html", hits);
  assert.equal(
    hits.filter((h) => h.sev === "blocker").length,
    0,
    JSON.stringify(hits),
  );
});

test("bad html fails title, h1, and json-ld", () => {
  const hits = [];
  scanHtml(load("bad.html"), "bad.html", hits);
  const codes = hits.filter((h) => h.sev === "blocker").map((h) => h.code);
  assert.ok(codes.includes("missing-title"));
  assert.ok(codes.includes("multiple-h1"));
  assert.ok(codes.some((c) => c.startsWith("json-ld-invalid")));
});

test("blocked robots flags wildcard disallow", () => {
  const hits = [];
  scanRobots(load("blocked-robots.txt"), "robots.txt", hits);
  assert.ok(hits.some((h) => h.code.includes("user-agent:* disallow:/")));
});

test("ok robots does not flag training-only CCBot deny", () => {
  const hits = robotsBlocksCiteBot(load("ok-robots.txt"));
  assert.deepEqual(hits, []);
});

test("markdown with title and one h1 is clean of blockers", () => {
  const hits = [];
  scanMarkdown(load("good.md"), "good.md", hits);
  assert.equal(
    hits.filter((h) => h.sev === "blocker").length,
    0,
    JSON.stringify(hits),
  );
});

test("heading skip detects h1 to h3", () => {
  assert.equal(hasHeadingSkip([1, 3]), true);
  assert.equal(hasHeadingSkip([1, 2, 3]), false);
});

test("scanPaths + RECEIPT on good fixture exits with zero blockers", () => {
  const { files, hits } = scanPaths(fixtures, [
    join(fixtures, "good.html"),
    join(fixtures, "ok-robots.txt"),
  ]);
  const { text, blockers } = formatReceipt(files, hits);
  assert.match(text, /RECEIPT scan-search-visibility/);
  assert.match(text, /END/);
  assert.equal(blockers, 0);
});

test("scanPaths on bad html reports blockers", () => {
  const { files, hits } = scanPaths(fixtures, [join(fixtures, "bad.html")]);
  const { blockers } = formatReceipt(files, hits);
  assert.ok(blockers > 0);
});

test("framework tsx without first-response HTML is a blocker, not a clean receipt", () => {
  const { files, hits } = scanPaths(fixtures, [join(fixtures, "page.tsx")]);
  const codes = hits.filter((h) => h.sev === "blocker").map((h) => h.code);
  assert.ok(files.length >= 1, "tsx must be collected");
  assert.ok(
    codes.includes("not-first-html"),
    `expected not-first-html, got ${JSON.stringify(hits)}`,
  );
});

test("client shell HTML is a blocker", () => {
  const hits = [];
  scanHtml(load("empty-shell.html"), "empty-shell.html", hits);
  assert.ok(
    hits.some((h) => h.sev === "blocker" && h.code === "client-shell"),
    JSON.stringify(hits),
  );
});

test("missing path is a blocker, not a clean empty receipt", () => {
  const { files, hits } = scanPaths(fixtures, [
    join(fixtures, "does-not-exist.html"),
  ]);
  assert.equal(files.length, 0);
  assert.ok(
    hits.some((h) => h.sev === "blocker" && h.code === "missing-path"),
    JSON.stringify(hits),
  );
});

test("noindex is a warning, not a blocker", () => {
  const hits = [];
  scanHtml(load("noindex.html"), "noindex.html", hits);
  assert.ok(hits.some((h) => h.code === "has-noindex" && h.sev === "warn"));
  assert.equal(hits.filter((h) => h.sev === "blocker").length, 0);
});

test("parseScanArgs accepts bare https and --url", () => {
  assert.deepEqual(parseScanArgs(["app/page.tsx", "https://example.com/a"]), {
    paths: ["app/page.tsx"],
    urls: ["https://example.com/a"],
  });
  assert.deepEqual(parseScanArgs(["--url", "http://127.0.0.1/"]), {
    paths: [],
    urls: ["http://127.0.0.1/"],
  });
});

test("named live URL scans first-response HTML", async () => {
  const html = load("good.html");
  const server = createServer((req, res) => {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(html);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  try {
    const { documents, hits } = await scanUrls([
      `http://127.0.0.1:${port}/refunds`,
    ]);
    assert.equal(documents[0].status, 200);
    assert.equal(
      hits.filter((h) => h.sev === "blocker").length,
      0,
      JSON.stringify(hits),
    );
  } finally {
    server.close();
  }
});

test("live URL 404 is a blocker", async () => {
  const server = createServer((_req, res) => {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("missing");
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  try {
    const { hits } = await scanUrls([`http://127.0.0.1:${port}/gone`]);
    assert.ok(hits.some((h) => h.code === "http-status:404"), JSON.stringify(hits));
  } finally {
    server.close();
  }
});
