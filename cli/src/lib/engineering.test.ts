import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { chmodSync, cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test, type TestContext } from "node:test";
import { applyFileChanges, INSERT } from "./engineering-files.js";
import { ignoredProfilePaths, parseTools, planEngineering, planEngineeringRemoval } from "./engineering.js";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const CONFIG = ".loadout/engineering/project.json";
const POLICY = ".loadout/engineering/WORKFLOW.md";
const MANIFEST = ".loadout/engineering/install.json";
const SKILL = ".agents/skills/working-agentically/SKILL.md";

function fixture(t: TestContext): string {
  const root = mkdtempSync(join(tmpdir(), "loadout-engineering-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return root;
}
function write(root: string, path: string, value: string | Buffer): void {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), value);
}
function read(root: string, path: string): string { return readFileSync(join(root, path), "utf8"); }
function install(root: string): void {
  const plan = planEngineering(root, source);
  assert.deepEqual(plan.findings, []);
  applyFileChanges(root, plan.changes);
}
function cli(root: string, ...args: string[]) {
  return spawnSync(process.execPath, ["--import", join(source, "node_modules/tsx/dist/loader.mjs"), join(source, "cli/src/index.ts"), "engineering", ...args], { cwd: root, encoding: "utf8" });
}

test("plan is read-only; adoption and removal preserve original instruction bytes and permissions", (t) => {
  const root = fixture(t);
  const agents = "# Existing project\r\nKeep the public API stable.\r\nNo final newline";
  const claude = "";
  write(root, "AGENTS.md", agents);
  write(root, "CLAUDE.md", claude);
  chmodSync(join(root, "AGENTS.md"), 0o640);
  const plan = planEngineering(root, source);
  assert.equal(read(root, "AGENTS.md"), agents);
  assert.equal(existsSync(join(root, ".loadout")), false);
  applyFileChanges(root, plan.changes);
  assert.equal(read(root, "AGENTS.md"), agents + INSERT);
  assert.equal(lstatSync(join(root, "AGENTS.md")).mode & 0o777, 0o640);
  for (const dir of [".agents", ".grok", ".claude"]) {
    assert.equal(read(root, `${dir}/skills/working-agentically/SKILL.md`), read(source, "plugins/core-engineering/skills/working-agentically/SKILL.md"));
  }
  assert.ok(planEngineering(root, source).changes.every((change) => change.before === change.after));
  applyFileChanges(root, planEngineeringRemoval(root).changes);
  assert.equal(read(root, "AGENTS.md"), agents);
  assert.equal(read(root, "CLAUDE.md"), claude);
  assert.equal(existsSync(join(root, POLICY)), false);
  assert.equal(existsSync(join(root, CONFIG)), true);
});

test("process updates preserve project configuration, architecture and edits surrounding reference blocks", (t) => {
  const root = fixture(t);
  install(root);
  const userText = "\nProject additions after adoption.\n";
  write(root, "AGENTS.md", "Project preamble." + read(root, "AGENTS.md") + userText);
  write(root, "docs/architecture.md", "Existing architectural decisions.\n");
  const config = JSON.parse(read(root, CONFIG));
  config.maxWriters = 2;
  config.documentation.architecture = ["docs/architecture.md"];
  config.validation.feedback = [["npm", "run", "typecheck"]];
  const projectConfig = JSON.stringify(config, null, 4);
  write(root, CONFIG, projectConfig);
  const nextSource = fixture(t);
  cpSync(join(source, "templates/engineering"), join(nextSource, "templates/engineering"), { recursive: true });
  cpSync(join(source, "plugins/core-engineering/skills/working-agentically"), join(nextSource, "plugins/core-engineering/skills/working-agentically"), { recursive: true });
  write(nextSource, "templates/engineering/WORKFLOW.md", read(source, "templates/engineering/WORKFLOW.md") + "\nA reviewed process revision.\n");
  const plan = planEngineering(root, nextSource);
  assert.deepEqual(plan.changes.filter((c) => c.before !== c.after).map((c) => c.path), [POLICY, MANIFEST]);
  applyFileChanges(root, plan.changes);
  assert.equal(read(root, CONFIG), projectConfig);
  assert.equal(read(root, "docs/architecture.md"), "Existing architectural decisions.\n");
  assert.equal(read(root, "AGENTS.md"), "Project preamble." + INSERT + userText);
  applyFileChanges(root, planEngineeringRemoval(root).changes);
  assert.equal(read(root, "AGENTS.md"), "Project preamble." + userText);
  assert.equal(existsSync(join(root, "CLAUDE.md")), false);
  assert.equal(read(root, CONFIG), projectConfig);
});

test("locally edited managed files and reference blocks stop update and removal before writes", (t) => {
  for (const path of [POLICY, SKILL, "AGENTS.md"]) {
    const root = fixture(t);
    install(root);
    const original = read(root, path);
    const modified = path === "AGENTS.md" ? original.replace("adopted engineering", "custom engineering") : original + "local edit";
    write(root, path, modified);
    assert.throws(() => planEngineering(root, source), /local edits|block was edited/);
    assert.throws(() => planEngineeringRemoval(root), /changed or removed|block was edited/);
    assert.equal(read(root, path), modified);
    assert.ok(existsSync(join(root, MANIFEST)));
  }
});

test("untracked blocks, occupied skill files, and invalid encodings are not seized", (t) => {
  for (const [path, value, message] of [
    ["AGENTS.md", INSERT, /untracked or malformed/],
    [SKILL, "My custom skill", /already exists/],
    ["CLAUDE.md", Buffer.from([0xff, 0xfe]), /not UTF-8/],
  ] as const) {
    const root = fixture(t);
    write(root, path, value);
    assert.throws(() => planEngineering(root, source), message);
    assert.equal(existsSync(join(root, MANIFEST)), false);
    assert.deepEqual(readFileSync(join(root, path)), Buffer.from(value));
  }
});

test("symlink targets, parents, and dangling links cannot redirect installation", (t) => {
  for (const path of ["AGENTS.md", ".agents", ".loadout"]) {
    const root = fixture(t);
    const outside = fixture(t);
    symlinkSync(join(outside, "missing"), join(root, path));
    assert.throws(() => planEngineering(root, source), /Symlink/);
    assert.equal(existsSync(join(outside, "missing")), false);
  }
});

test("instruction discovery hazards and legacy process conflicts are reported without editing them", (t) => {
  const root = fixture(t);
  write(root, "AGENTS.override.md", "Root override.");
  write(root, "Agents.md", "Different casing.");
  write(root, "packages/service/AGENTS.md", "Run the full test suite for every change.\n");
  write(root, ".cursor/rules/old.mdc", "Stage all eligible dirty files.\n");
  const findings = planEngineering(root, source).findings;
  assert.deepEqual(findings.map((finding) => finding.path).sort(), [".cursor/rules/old.mdc", "AGENTS.override.md", "Agents.md", "packages/service/AGENTS.md"].sort());
  assert.equal(existsSync(join(root, MANIFEST)), false);
  assert.equal(read(root, "packages/service/AGENTS.md"), "Run the full test suite for every change.\n");
});

test("preflight refuses stale plans and an occupied installer lock without changing files", (t) => {
  const root = fixture(t);
  const plan = planEngineering(root, source);
  write(root, "CLAUDE.md", "An editor created this since planning.");
  assert.throws(() => applyFileChanges(root, plan.changes), /changed since planning/);
  assert.equal(existsSync(join(root, POLICY)), false);
  assert.equal(existsSync(join(root, "AGENTS.md")), false);
  mkdirSync(join(root, ".loadout/engineering-install.lock"));
  assert.throws(() => applyFileChanges(root, planEngineering(root, source).changes), /Another engineering install/);
  assert.equal(existsSync(join(root, POLICY)), false);
  assert.equal(existsSync(join(root, ".loadout/engineering-install.lock")), true);
});

test("missing managed files, duplicate markers and manifest traversal do not permit removal", (t) => {
  const root = fixture(t);
  install(root);
  const manifest = read(root, MANIFEST);
  const value = JSON.parse(manifest);
  value.files["../outside.md"] = value.files[POLICY];
  delete value.files[POLICY];
  write(root, MANIFEST, JSON.stringify(value));
  assert.throws(() => planEngineeringRemoval(root), /unexpected paths/);
  write(root, MANIFEST, manifest);
  const agents = read(root, "AGENTS.md");
  write(root, "AGENTS.md", agents + INSERT);
  assert.throws(() => planEngineeringRemoval(root), /duplicated/);
  write(root, "AGENTS.md", agents);
  rmSync(join(root, SKILL));
  assert.throws(() => planEngineeringRemoval(root), /changed or removed/);
  assert.equal(existsSync(join(root, POLICY)), true);
});

test("CLI resolves the project from a nested directory, honors adapter selection and checks installation", (t) => {
  const root = fixture(t);
  execFileSync("git", ["init", "--quiet", root]);
  const cwd = join(root, "packages/service");
  mkdirSync(cwd, { recursive: true });
  write(root, "AGENTS.md", "Original project text.");
  assert.equal(cli(cwd, "plan", "--tools", "grok,codex").status, 0);
  assert.equal(existsSync(join(root, MANIFEST)), false);
  const apply = cli(cwd, "apply", "--tools", "grok,codex");
  assert.equal(apply.status, 0, apply.stdout + apply.stderr);
  assert.ok(existsSync(join(root, SKILL)));
  assert.equal(existsSync(join(root, ".claude")), false);
  assert.equal(existsSync(join(root, ".cursor")), false);
  assert.equal(existsSync(join(cwd, "AGENTS.md")), false);
  const check = cli(cwd, "check");
  assert.equal(check.status, 0, check.stdout + check.stderr);
  assert.match(check.stdout + check.stderr, /commands not mapped/);
  assert.match(check.stdout, /not a test run/);
  assert.equal(cli(cwd, "apply", "--tools", "claude").status, 1);
  assert.equal(cli(cwd, "remove", "--dry-run").status, 0);
  assert.ok(existsSync(join(root, MANIFEST)));
  assert.equal(cli(cwd, "remove").status, 0);
  assert.equal(read(root, "AGENTS.md"), "Original project text.");
  assert.equal(cli(cwd, "check").status, 1);
  assert.throws(() => parseTools("herdr"), /Herdr runs these CLIs/);
});

test("CLI refuses ignored adapter paths and known conflicts without touching project instructions", (t) => {
  const root = fixture(t);
  execFileSync("git", ["init", "--quiet", root]);
  write(root, ".gitignore", ".grok/\n");
  assert.deepEqual(ignoredProfilePaths(root, [SKILL, ".grok/skills/working-agentically/SKILL.md"]), [".grok/skills/working-agentically/SKILL.md"]);
  const ignored = cli(root, "apply", "--tools", "grok");
  assert.equal(ignored.status, 1);
  assert.match(ignored.stdout + ignored.stderr, /Git ignores/);
  assert.equal(existsSync(join(root, "AGENTS.md")), false);
  write(root, "AGENTS.md", "Commit the entire dirty tree.\n");
  const conflict = cli(root, "apply", "--tools", "codex");
  assert.equal(conflict.status, 1);
  assert.match(conflict.stdout + conflict.stderr, /whole-tree staging/);
  assert.equal(read(root, "AGENTS.md"), "Commit the entire dirty tree.\n");
  assert.equal(existsSync(join(root, MANIFEST)), false);
});
