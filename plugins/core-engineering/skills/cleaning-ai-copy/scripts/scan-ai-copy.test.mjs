import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import assert from "node:assert/strict";
import { test } from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
const script = join(here, "scan-ai-copy.mjs");
const fixtures = join(here, "fixtures");

function run(args) {
  return spawnSync(process.execPath, [script, ...args], {
    encoding: "utf8",
    cwd: join(here, "..", "..", "..", "..", ".."),
  });
}

function parseReceipt(stdout) {
  const red = Number((stdout.match(/^hits_red: (\d+)/m) ?? [])[1] ?? -1);
  const orange = Number((stdout.match(/^hits_orange: (\d+)/m) ?? [])[1] ?? -1);
  const yellow = Number((stdout.match(/^hits_yellow: (\d+)/m) ?? [])[1] ?? -1);
  const patterns = [...stdout.matchAll(/^pattern: (.+)$/gm)].map((m) => m[1]);
  const tiers = [...stdout.matchAll(/^tier: (.+)$/gm)].map((m) => m[1]);
  return { red, orange, yellow, patterns, tiers, stdout };
}

test("AC-01 slop fixture is RED and exit 1", () => {
  const r = run(["--include-self", join(fixtures, "slop.md")]);
  const rec = parseReceipt(r.stdout);
  assert.equal(r.status, 1);
  assert.ok(rec.red > 0);
  assert.ok(rec.patterns.includes("delve"));
  assert.ok(rec.patterns.includes("notXbutY"));
  assert.ok(rec.patterns.includes("oaicite"));
  assert.ok(rec.patterns.includes("servesAs"));
});

test("AC-02 clean fixture is exit 0", () => {
  const r = run(["--include-self", join(fixtures, "clean.md")]);
  const rec = parseReceipt(r.stdout);
  assert.equal(r.status, 0);
  assert.equal(rec.red, 0);
  assert.equal(rec.orange, 0);
});

test("AC-03 cluster of two Juzek words is ORANGE and exit 1", () => {
  const r = run(["--include-self", join(fixtures, "cluster.md")]);
  const rec = parseReceipt(r.stdout);
  assert.equal(r.status, 1);
  assert.equal(rec.red, 0);
  assert.ok(rec.orange > 0);
  assert.ok(rec.patterns.some((p) => p.startsWith("cluster:")));
});

test("AC-04 one em dash is YELLOW and exit 0", () => {
  const r = run(["--include-self", join(fixtures, "dash-only.md")]);
  const rec = parseReceipt(r.stdout);
  assert.equal(r.status, 0);
  assert.equal(rec.red, 0);
  assert.equal(rec.orange, 0);
  assert.ok(rec.yellow > 0);
  assert.ok(rec.patterns.includes("emDash"));
});

test("AC-11 taxonomy pair is RED taxonomyInvariant", () => {
  const r = run(["--include-self", join(fixtures, "taxonomy.md")]);
  const rec = parseReceipt(r.stdout);
  assert.equal(r.status, 1);
  assert.ok(rec.patterns.includes("taxonomyInvariant"));
  assert.ok(rec.tiers.includes("RED"));
});

test("AC-12 schema value field is not a hit", () => {
  const r = run(["--include-self", join(fixtures, "schema-value.md")]);
  const rec = parseReceipt(r.stdout);
  assert.equal(r.status, 0);
  assert.ok(!rec.patterns.includes("schemaLeak"));
  assert.equal(rec.red, 0);
  assert.equal(rec.orange, 0);
});

test("AC-13 Never commit .env. is not solemnInvariant", () => {
  const r = run(["--include-self", join(fixtures, "never-commit.md")]);
  const rec = parseReceipt(r.stdout);
  assert.equal(r.status, 0);
  assert.ok(!rec.patterns.includes("solemnInvariant"));
});

test("AC-14 default exclude skips catalog without --include-self", () => {
  const dir = mkdtempSync(join(tmpdir(), "ai-copy-"));
  const catalog = join(dir, "ai-copy-tells.md");
  writeFileSync(catalog, "Please delve into the tapestry of this realm.\n");
  const skipped = run([catalog]);
  const recSkip = parseReceipt(skipped.stdout);
  assert.match(skipped.stdout, /note: no files/);
  assert.equal(skipped.status, 0);
  assert.equal(recSkip.red, 0);

  const included = run(["--include-self", catalog]);
  const recInc = parseReceipt(included.stdout);
  assert.equal(included.status, 1);
  assert.ok(recInc.red > 0);
});

test("AC-16 Retry for 429 is not RED taxonomyInvariant", () => {
  const r = run(["--include-self", join(fixtures, "retry-for.md")]);
  const rec = parseReceipt(r.stdout);
  assert.ok(!rec.patterns.includes("taxonomyInvariant"));
  assert.ok(rec.patterns.includes("solemnInvariant"));
  assert.equal(r.status, 1);
});

test("R-18 bare underscore is not a hit; verb phrase is RED", () => {
  const bare = run(["--include-self", join(fixtures, "underscore-bare.md")]);
  const recBare = parseReceipt(bare.stdout);
  assert.equal(bare.status, 0);
  assert.equal(recBare.red, 0);
  assert.ok(!recBare.patterns.includes("underscore"));

  const verb = run(["--include-self", join(fixtures, "underscore-verb.md")]);
  const recVerb = parseReceipt(verb.stdout);
  assert.equal(verb.status, 1);
  assert.ok(recVerb.patterns.includes("underscore the"));
});

test("R-19 ASCII hyphen is not YELLOW", () => {
  const r = run(["--include-self", join(fixtures, "hyphen-only.md")]);
  const rec = parseReceipt(r.stdout);
  assert.equal(r.status, 0);
  assert.equal(rec.yellow, 0);
  assert.ok(!rec.patterns.includes("emDash"));
});

test("code files are skipped unless --include-code", () => {
  const skipped = run(["--include-self", join(fixtures, "code-skip.ts")]);
  assert.match(skipped.stdout, /note: no files/);
  assert.equal(skipped.status, 0);

  const included = run([
    "--include-self",
    "--include-code",
    join(fixtures, "code-skip.ts"),
  ]);
  const rec = parseReceipt(included.stdout);
  assert.equal(included.status, 1);
  assert.ok(rec.patterns.includes("delve"));
});

test("empty path list prints note: no files", () => {
  const r = spawnSync(process.execPath, [script], {
    encoding: "utf8",
    cwd: mkdtempSync(join(tmpdir(), "ai-copy-empty-")),
  });
  assert.match(r.stdout, /note: no files/);
  assert.equal(r.status, 0);
});
