import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import matter from "gray-matter";
import { c, err, heading, info, ok, warn } from "../lib/log.js";
import { findRepoRoot, tryReadJson } from "../lib/repo.js";
import { findSourceRoot } from "../lib/source.js";
import type {
  Lockfile,
  Marketplace,
  PluginManifest,
  Registry,
  RegistryAsset,
  WorkflowFrontmatter,
} from "../lib/types.js";

interface Findings {
  errors: string[];
  warnings: string[];
}

const VALID_ASSET_TYPES = new Set([
  "skill",
  "cursor-rule",
  "command",
  "agent",
  "mcp",
  "template",
  "doc",
  "workflow",
]);

const ALWAYS_APPLY_SOFT_LIMIT = 1500; // chars; always-on rules are a per-request tax

function walk(dir: string, predicate: (file: string) => boolean): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".git") continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full, predicate));
    else if (predicate(full)) out.push(full);
  }
  return out;
}

function checkMarketplace(root: string, f: Findings): Set<string> {
  const pluginNames = new Set<string>();
  const path = join(root, ".claude-plugin", "marketplace.json");
  if (!existsSync(path)) {
    f.errors.push("Missing .claude-plugin/marketplace.json");
    return pluginNames;
  }
  const mp = tryReadJson<Marketplace>(path);
  if (!mp) {
    f.errors.push("marketplace.json is not valid JSON");
    return pluginNames;
  }
  if (!mp.name) f.errors.push("marketplace.json: missing 'name'");
  if (!mp.version) f.errors.push("marketplace.json: missing 'version'");
  if (!Array.isArray(mp.plugins)) {
    f.errors.push("marketplace.json: 'plugins' must be an array");
    return pluginNames;
  }

  for (const p of mp.plugins) {
    if (!p.name) {
      f.errors.push("marketplace.json: a plugin entry is missing 'name'");
      continue;
    }
    pluginNames.add(p.name);
    if (!p.source) {
      f.errors.push(`marketplace.json: plugin '${p.name}' is missing 'source'`);
      continue;
    }
    const srcDir = join(root, p.source);
    if (!existsSync(srcDir)) {
      f.errors.push(`marketplace.json: plugin '${p.name}' source not found: ${p.source}`);
      continue;
    }
    const manifestPath = join(srcDir, ".claude-plugin", "plugin.json");
    if (!existsSync(manifestPath)) {
      f.errors.push(`plugin '${p.name}': missing .claude-plugin/plugin.json`);
      continue;
    }
    const manifest = tryReadJson<PluginManifest>(manifestPath);
    if (!manifest) {
      f.errors.push(`plugin '${p.name}': plugin.json is not valid JSON`);
      continue;
    }
    if (manifest.name !== p.name) {
      f.warnings.push(
        `plugin '${p.name}': plugin.json name '${manifest.name}' does not match catalog`,
      );
    }
    if (manifest.version !== p.version) {
      f.warnings.push(
        `plugin '${p.name}': version mismatch — catalog ${p.version} vs plugin.json ${manifest.version}. ` +
          `Bump both when content changes.`,
      );
    }
  }
  return pluginNames;
}

function checkSkills(root: string, f: Findings): void {
  const skillFiles = walk(join(root, "plugins"), (file) => file.endsWith("SKILL.md"));
  for (const file of skillFiles) {
    const rel = relative(root, file);
    let parsed;
    try {
      parsed = matter(readFileSync(file, "utf8"));
    } catch {
      f.errors.push(`${rel}: unparseable frontmatter`);
      continue;
    }
    const fm = parsed.data as Record<string, unknown>;
    // Canonical SKILL.md frontmatter rules (Anthropic; see docs/external-practices.md §2.2).
    const name = fm.name;
    if (!name || typeof name !== "string") {
      f.errors.push(`${rel}: SKILL.md frontmatter missing 'name'`);
    } else {
      if (!/^[a-z0-9-]{1,64}$/.test(name)) {
        f.errors.push(`${rel}: skill name '${name}' must be lowercase letters/numbers/hyphens, <=64 chars`);
      }
      if (/anthropic|claude/i.test(name)) {
        f.errors.push(`${rel}: skill name '${name}' must not contain reserved words "anthropic"/"claude"`);
      }
    }
    const desc = fm.description;
    if (!desc || typeof desc !== "string") {
      f.errors.push(`${rel}: SKILL.md frontmatter missing 'description'`);
    } else {
      if (desc.length > 1024) {
        f.errors.push(`${rel}: skill description exceeds 1024 chars (${desc.length})`);
      }
      if (/^\s*(i |i'|you |you'|we )/i.test(desc)) {
        f.warnings.push(`${rel}: write the description in third person ("Generates…/Use when…"), not first/second person`);
      }
    }
    const bodyLines = parsed.content.split("\n").length;
    if (bodyLines > 500) {
      f.warnings.push(`${rel}: SKILL.md body is ${bodyLines} lines (>500). Split detail into one-level-deep reference files.`);
    }
    if (!/##\s*Pairs with/i.test(parsed.content)) {
      f.warnings.push(`${rel}: missing a '## Pairs with' section (composition convention 3.3)`);
    }
  }
}

function checkRules(root: string, f: Findings): void {
  const ruleFiles = walk(join(root, "rules"), (file) => file.endsWith(".mdc"));
  for (const file of ruleFiles) {
    const rel = relative(root, file);
    let parsed;
    try {
      parsed = matter(readFileSync(file, "utf8"));
    } catch {
      f.errors.push(`${rel}: unparseable frontmatter`);
      continue;
    }
    const fm = parsed.data as Record<string, unknown>;
    if (!fm.description) {
      f.errors.push(`${rel}: .mdc frontmatter missing 'description' (required for agent-requested mode)`);
    }
    if (fm.globs !== undefined && !Array.isArray(fm.globs)) {
      f.errors.push(`${rel}: .mdc 'globs' must be an array when present`);
    }
    if (fm.alwaysApply !== undefined && typeof fm.alwaysApply !== "boolean") {
      f.errors.push(`${rel}: .mdc 'alwaysApply' must be a boolean`);
    }
    if (fm.alwaysApply === true && parsed.content.length > ALWAYS_APPLY_SOFT_LIMIT) {
      f.warnings.push(
        `${rel}: alwaysApply rule is long (${parsed.content.length} chars). ` +
          `Always-on tokens load on every request — keep it short.`,
      );
    }
  }
}

function workflowIds(root: string): Set<string> {
  const ids = new Set<string>();
  const dir = join(root, "processes", "workflows");
  if (!existsSync(dir)) return ids;
  for (const file of readdirSync(dir)) {
    if (file.endsWith(".md")) ids.add(file.replace(/\.md$/, ""));
  }
  return ids;
}

function checkWorkflows(root: string, f: Findings, assetIds: Set<string>, reg: Registry | null): void {
  const dir = join(root, "processes", "workflows");
  if (!existsSync(dir)) return;

  // Map rules/<basename>.mdc → registry id so we can catch the equip trap where
  // uses.rules lists a basename that also names a skill (e.g. create-plan vs create-plan-rule).
  const ruleIdByBasename = new Map<string, string>();
  for (const a of reg?.assets ?? []) {
    if (a.type !== "cursor-rule" || !a.source) continue;
    const m = /^rules\/(.+)\.mdc$/.exec(a.source);
    if (m) ruleIdByBasename.set(m[1], a.id);
  }

  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".md")) continue;
    const rel = join("processes", "workflows", file);
    let parsed;
    try {
      parsed = matter(readFileSync(join(dir, file), "utf8"));
    } catch {
      f.errors.push(`${rel}: unparseable frontmatter`);
      continue;
    }
    const fm = parsed.data as Partial<WorkflowFrontmatter>;
    if (!fm.name) f.errors.push(`${rel}: workflow frontmatter missing 'name'`);
    const uses = fm.uses ?? {};
    const referenced = [
      ...(uses.skills ?? []),
      ...(uses.commands ?? []),
      ...(uses.agents ?? []),
    ];
    for (const ref of referenced) {
      if (!assetIds.has(ref)) {
        f.errors.push(`${rel}: references unknown asset '${ref}' in 'uses'`);
      }
    }
    for (const ref of uses.rules ?? []) {
      if (!assetIds.has(ref) && !ruleExists(root, ref)) {
        f.errors.push(`${rel}: references unknown rule '${ref}' in 'uses.rules'`);
      }
      const canonical = ruleIdByBasename.get(ref);
      if (canonical && canonical !== ref) {
        f.warnings.push(
          `${rel}: uses.rules '${ref}' resolves via rules/${ref}.mdc but registry id is '${canonical}' — use '${canonical}' so \`loadout add\` installs the rule (not a same-named skill)`,
        );
      }
    }
    // Optional loop primitives must be strings when present (docs/loop-engineering.md).
    for (const field of ["gate", "stop_condition", "state"] as const) {
      const val = (fm as Record<string, unknown>)[field];
      if (val !== undefined && typeof val !== "string") {
        f.errors.push(`${rel}: workflow '${field}' must be a string when present`);
      }
    }
  }
}

// "Skills as injection vectors" (inbound-trust lint). Warn-only: legitimate content can
// legitimately discuss these phrases, so this surfaces for review rather than failing CI.
const INJECTION_PATTERNS: Array<{ re: RegExp; label: string }> = [
  { re: /ignore (all )?previous instructions/i, label: "prompt-injection phrase" },
  { re: /disregard (the )?(system|above) (prompt|instructions)/i, label: "prompt-injection phrase" },
  { re: /\bcurl\b[^\n]*\|\s*(sh|bash)/i, label: "pipe-to-shell download" },
  { re: /(AKIA[0-9A-Z]{16}|sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,})/, label: "hardcoded credential" },
  { re: /process\.env\.[A-Z_]+[^\n]{0,40}(fetch|http|curl|post)/i, label: "env var exfiltration" },
];

function checkInjection(root: string, f: Findings): void {
  const files = [
    ...walk(join(root, "plugins"), (file) => file.endsWith("SKILL.md")),
    ...walk(join(root, "rules"), (file) => file.endsWith(".mdc")),
  ];
  for (const file of files) {
    const rel = relative(root, file);
    let body: string;
    try {
      body = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    for (const { re, label } of INJECTION_PATTERNS) {
      if (re.test(body)) {
        f.warnings.push(`${rel}: possible ${label} — review before shipping (injection lint)`);
      }
    }
  }
}

function checkRegistry(root: string, f: Findings, workflows: Set<string>): void {
  const path = join(root, "registry.json");
  if (!existsSync(path)) {
    f.errors.push("Missing registry.json");
    return;
  }
  const reg = tryReadJson<Registry>(path);
  if (!reg) {
    f.errors.push("registry.json is not valid JSON");
    return;
  }
  if (!Array.isArray(reg.assets)) {
    f.errors.push("registry.json: 'assets' must be an array");
    return;
  }

  const ids = new Set<string>();
  for (const a of reg.assets) {
    if (!a.id) {
      f.errors.push("registry.json: an asset is missing 'id'");
      continue;
    }
    if (ids.has(a.id)) f.errors.push(`registry.json: duplicate asset id '${a.id}'`);
    ids.add(a.id);
    validateAsset(root, a, f);
  }

  // Composition references resolve to known assets / rules / workflows.
  for (const a of reg.assets) {
    for (const ref of a.pairs_with ?? []) {
      if (!ids.has(ref) && !ruleExists(root, ref)) {
        f.errors.push(`registry.json: '${a.id}'.pairs_with references nothing: '${ref}'`);
      }
    }
    for (const wf of a.workflows ?? []) {
      if (!workflows.has(wf)) {
        f.errors.push(`registry.json: '${a.id}'.workflows references missing workflow: '${wf}'`);
      }
    }
  }

  if (!reg.kits || typeof reg.kits !== "object" || Array.isArray(reg.kits)) {
    f.errors.push("registry.json: missing kits object (kits.starter drives update backfill)");
  } else {
    for (const [kitName, kitIds] of Object.entries(reg.kits)) {
      if (!Array.isArray(kitIds)) {
        f.errors.push(`registry.json: kits.${kitName} must be an array of asset ids`);
        continue;
      }
      for (const kitId of kitIds) {
        if (!ids.has(kitId)) {
          f.errors.push(`registry.json: kits.${kitName} references unknown asset '${kitId}'`);
        }
      }
    }
    if (!Array.isArray(reg.kits.starter) || reg.kits.starter.length === 0) {
      f.errors.push("registry.json: kits.starter must be a non-empty array of asset ids");
    }
  }
}

function validateAsset(root: string, a: RegistryAsset, f: Findings): void {
  if (!a.type) f.errors.push(`registry.json: '${a.id}' missing 'type'`);
  else if (!VALID_ASSET_TYPES.has(a.type)) {
    f.errors.push(`registry.json: '${a.id}' has invalid type '${a.type}'`);
  }
  if (!a.version) f.warnings.push(`registry.json: '${a.id}' missing 'version'`);
  if (typeof a.managed !== "boolean") {
    f.errors.push(`registry.json: '${a.id}' 'managed' must be a boolean`);
  }
  if (!Array.isArray(a.tools)) {
    f.errors.push(`registry.json: '${a.id}' 'tools' must be an array`);
  }
  if (a.source) {
    const src = join(root, a.source);
    if (!existsSync(src)) {
      f.errors.push(`registry.json: '${a.id}' source path not found: ${a.source}`);
    }
  } else {
    f.errors.push(`registry.json: '${a.id}' missing 'source'`);
  }
}

function ruleExists(root: string, id: string): boolean {
  return existsSync(join(root, "rules", `${id}.mdc`));
}

// Orphaned files: skills/rules on disk that no registry asset points at.
function checkOrphans(root: string, reg: Registry | null, f: Findings): void {
  const sources = new Set((reg?.assets ?? []).map((a) => a.source));
  for (const file of walk(join(root, "rules"), (p) => p.endsWith(".mdc"))) {
    const rel = relative(root, file);
    if (!sources.has(rel)) f.warnings.push(`${rel}: rule is not listed in registry.json (orphaned)`);
  }
  for (const file of walk(join(root, "plugins"), (p) => p.endsWith("SKILL.md"))) {
    const rel = relative(root, dirname(file));
    if (!sources.has(rel)) f.warnings.push(`${rel}: skill is not listed in registry.json (orphaned)`);
  }
}

// Composition drift: a skill's registry `pairs_with` ids should be mentioned in its
// SKILL.md `## Pairs with` prose, so the two sources of truth stay aligned.
function checkComposition(root: string, reg: Registry | null, f: Findings): void {
  for (const a of reg?.assets ?? []) {
    if (a.type !== "skill" || !a.pairs_with?.length) continue;
    const skillPath = join(root, a.source, "SKILL.md");
    if (!existsSync(skillPath)) continue;
    const body = readFileSync(skillPath, "utf8");
    for (const ref of a.pairs_with) {
      if (!body.includes(ref)) {
        f.warnings.push(
          `${a.id}: registry pairs_with '${ref}' is not mentioned in its SKILL.md '## Pairs with' (drift)`,
        );
      }
    }
  }
}

// Docs ↔ registry count sync: catalog section headers must match registry counts so the
// hand-maintained reference can't silently drift.
function checkDocsSync(root: string, reg: Registry | null, f: Findings): void {
  const catalog = join(root, "docs", "catalog.md");
  if (!existsSync(catalog) || !reg) return;
  const text = readFileSync(catalog, "utf8");
  const counts: Record<string, number> = {};
  for (const a of reg.assets) counts[a.type] = (counts[a.type] ?? 0) + 1;
  const checks: Array<[RegExp, number, string]> = [
    [/^##\s*Skills\s*\((\d+)\)/m, counts.skill ?? 0, "Skills"],
    [/^##\s*Rules\s*\((\d+)\)/m, counts["cursor-rule"] ?? 0, "Rules"],
  ];
  for (const [re, actual, label] of checks) {
    const m = text.match(re);
    if (m && Number(m[1]) !== actual) {
      f.warnings.push(`docs/catalog.md: "${label} (${m[1]})" header disagrees with registry count ${actual}`);
    }
  }
}

// Lockfile integrity (only present in consumer projects).
function checkLockfile(root: string, f: Findings): void {
  const p = join(root, "loadout.lock.json");
  if (!existsSync(p)) return;
  const lock = tryReadJson<Lockfile>(p);
  if (!lock) {
    f.errors.push("loadout.lock.json is not valid JSON");
    return;
  }
  if (!lock.installed || typeof lock.installed !== "object") {
    f.errors.push("loadout.lock.json: missing 'installed' map");
    return;
  }
  for (const [id, e] of Object.entries(lock.installed)) {
    if (!e.target) {
      f.errors.push(`lockfile '${id}': missing target`);
      continue;
    }
    if (!existsSync(join(root, e.target))) {
      f.warnings.push(`lockfile '${id}': target missing on disk: ${e.target}`);
    }
    if (!/^sha256:/.test(e.baseHash ?? "")) {
      f.warnings.push(`lockfile '${id}': baseHash is not a sha256`);
    }
  }
}

export function doctor(): number {
  const root = findRepoRoot() ?? findSourceRoot();
  info(c.dim(`loadout doctor — ${root}`));

  const f: Findings = { errors: [], warnings: [] };
  const assetIds = new Set<string>();

  checkMarketplace(root, f);
  checkSkills(root, f);
  checkRules(root, f);
  checkInjection(root, f);

  // Collect registry asset ids first so workflow checks can resolve them.
  const reg = tryReadJson<Registry>(join(root, "registry.json"));
  if (reg && Array.isArray(reg.assets)) {
    for (const a of reg.assets) if (a.id) assetIds.add(a.id);
  }

  const workflows = workflowIds(root);
  checkWorkflows(root, f, assetIds, reg);
  checkRegistry(root, f, workflows);
  checkOrphans(root, reg, f);
  checkComposition(root, reg, f);
  checkDocsSync(root, reg, f);
  checkLockfile(root, f);

  heading("Results");
  if (f.warnings.length) {
    for (const w of f.warnings) warn(w);
  }
  if (f.errors.length) {
    for (const e of f.errors) err(e);
    info("");
    err(`${f.errors.length} error(s), ${f.warnings.length} warning(s).`);
    return 1;
  }
  ok(`Clean. ${f.warnings.length} warning(s).`);
  return 0;
}
