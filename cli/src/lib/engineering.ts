import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { auditInstructions, type Finding } from "./engineering-audit.js";
import { hash, INSERT, START, END, readOptional, stripManaged, type FileChange } from "./engineering-files.js";

export const TOOLS = ["codex", "grok", "claude", "cursor"] as const;
export type EngineeringTool = typeof TOOLS[number];
const MANIFEST = ".loadout/engineering/install.json";
const CONFIG = ".loadout/engineering/project.json";
const WORKFLOW = ".loadout/engineering/WORKFLOW.md";
const skillSource = "plugins/core-engineering/skills/working-agentically/SKILL.md";
const skillTargets: Record<EngineeringTool, string> = {
  codex: ".agents/skills/working-agentically/SKILL.md",
  grok: ".grok/skills/working-agentically/SKILL.md",
  claude: ".claude/skills/working-agentically/SKILL.md",
  cursor: ".agents/skills/working-agentically/SKILL.md",
};
const cursorRule = ".cursor/rules/loadout-engineering.mdc";

interface Manifest {
  version: 1;
  tools: EngineeringTool[];
  files: Record<string, string>;
  blocks: Record<string, { fragment: string; created: boolean }>;
}
export interface EngineeringPlan {
  changes: FileChange[];
  findings: Finding[];
  notes: string[];
  installed: boolean;
}

export function parseTools(value: string): EngineeringTool[] {
  const selected = value.split(",");
  if (!selected.length || selected.some((tool) => !TOOLS.includes(tool as EngineeringTool))) {
    throw new Error(`Tools must be a comma-separated selection of ${TOOLS.join(",")}. Herdr runs these CLIs; it is not an instruction adapter.`);
  }
  return TOOLS.filter((tool) => selected.includes(tool));
}

/** Ask Git about proposed files, including those not created yet. Never edit ignores. */
export function ignoredProfilePaths(root: string, paths: string[]): string[] {
  try {
    return execFileSync("git", ["check-ignore", "--stdin", "-z"], {
      cwd: root, input: `${paths.join("\0")}\0`, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"],
    }).split("\0").filter(Boolean);
  } catch (error) {
    if ((error as { status?: number }).status === 1) return [];
    throw error;
  }
}

function blockPaths(tools: EngineeringTool[]): string[] {
  return ["AGENTS.md", ...(tools.includes("claude") ? ["CLAUDE.md"] : [])];
}
function filePaths(tools: EngineeringTool[]): string[] {
  return [...new Set([WORKFLOW, ...tools.map((tool) => skillTargets[tool]), ...(tools.includes("cursor") ? [cursorRule] : [])])];
}

function loadManifest(root: string): Manifest | null {
  const body = readOptional(root, MANIFEST);
  if (body === null) return null;
  const value = JSON.parse(body) as Manifest;
  if (value.version !== 1 || !Array.isArray(value.tools) || !value.tools.length || value.tools.some((tool) => !TOOLS.includes(tool)) || !value.files || !value.blocks) {
    throw new Error("Invalid engineering install manifest; preserve it and reconcile before proceeding.");
  }
  const files = filePaths(value.tools);
  const blocks = blockPaths(value.tools);
  if (Object.keys(value.files).length !== files.length || files.some((path) => !/^[a-f0-9]{64}$/.test(value.files[path] ?? "")) || Object.keys(value.blocks).length !== blocks.length || blocks.some((path) => value.blocks[path]?.fragment !== INSERT || typeof value.blocks[path]?.created !== "boolean")) {
    throw new Error("Engineering manifest has unexpected paths or fragments; refusing to use it for writes.");
  }
  return value;
}

function configNotes(root: string): string[] {
  const raw = readOptional(root, CONFIG);
  if (raw === null) return ["A project-owned config will be created; map real commands before automating validation."];
  const config = JSON.parse(raw) as Record<string, unknown>;
  if (config.schemaVersion !== 1 || config.workflow !== "shared-checkout" || !Number.isInteger(config.maxWriters) || (config.maxWriters as number) < 1) throw new Error(`${CONFIG}: expected schemaVersion 1, shared-checkout workflow, and positive integer maxWriters.`);
  const documentation = config.documentation as Record<string, unknown>;
  if (!documentation || ["architecture", "development"].some((kind) => !Array.isArray(documentation[kind]) || (documentation[kind] as unknown[]).some((path) => typeof path !== "string" || !path.trim()))) throw new Error(`${CONFIG}: documentation.architecture and documentation.development must be arrays of nonempty paths.`);
  const validation = config.validation as Record<string, unknown>;
  if (!validation || typeof validation !== "object") throw new Error(`${CONFIG}: validation must contain feedback, batch, and release argv lists.`);
  const notes: string[] = [];
  for (const tier of ["feedback", "batch", "release"]) {
    const commands = validation[tier];
    if (!Array.isArray(commands) || commands.some((argv) => !Array.isArray(argv) || !argv.length || argv.some((part) => typeof part !== "string" || part.length === 0))) throw new Error(`${CONFIG}: validation.${tier} must be an array of nonempty argv arrays.`);
    if (!commands.length) notes.push(`${tier}: commands not mapped; use existing project instructions and do not claim automated validation.`);
  }
  return notes;
}

/** Read-only plan. Pre-existing content outside our exact fragment is never rewritten. */
export function planEngineering(root: string, sourceRoot: string, requested?: EngineeringTool[]): EngineeringPlan {
  const previous = loadManifest(root);
  const selected = requested ?? previous?.tools ?? [...TOOLS];
  if (previous && selected.join(",") !== previous.tools.join(",")) throw new Error("Remove the installed adapters before changing the tool selection; project-owned config is retained.");
  const next: Manifest = { version: 1, tools: selected, files: {}, blocks: {} };
  const changes: FileChange[] = [];
  const notes = configNotes(root);
  const contents: Record<string, string> = { [WORKFLOW]: readFileSync(join(sourceRoot, "templates/engineering/WORKFLOW.md"), "utf8") };
  const skill = readFileSync(join(sourceRoot, skillSource), "utf8");
  for (const tool of selected) contents[skillTargets[tool]] = skill;
  if (selected.includes("cursor")) contents[cursorRule] = "---\ndescription: Load the explicitly adopted loadout engineering profile\nalwaysApply: true\n---\n\nRead .loadout/engineering/WORKFLOW.md and .loadout/engineering/project.json.\nPreserve applicable project and nested instructions; surface conflicts.\n";
  for (const [path, after] of Object.entries(contents)) {
    const before = readOptional(root, path);
    if (previous?.files[path] ? before === null || hash(before) !== previous.files[path] : before !== null) throw new Error(`${path} already exists or has local edits; refusing to overwrite it.`);
    changes.push({ path, before, after });
    next.files[path] = hash(after);
  }
  for (const path of blockPaths(selected)) {
    const before = readOptional(root, path);
    const oldBlock = previous?.blocks[path];
    let base = before ?? "";
    if (oldBlock) base = stripManaged(base, oldBlock.fragment);
    else if (base.includes(START) || base.includes(END)) throw new Error(`${path} has untracked or malformed engineering markers; reconcile them before installing.`);
    // On update preserve the original block location as well as all surrounding text.
    const after = oldBlock ? (before as string).replace(oldBlock.fragment, INSERT) : `${base}${INSERT}`;
    changes.push({ path, before, after });
    next.blocks[path] = { fragment: INSERT, created: oldBlock?.created ?? before === null };
  }
  if (readOptional(root, CONFIG) === null) changes.push({ path: CONFIG, before: null, after: readFileSync(join(sourceRoot, "templates/engineering/project.json"), "utf8") });
  changes.push({ path: MANIFEST, before: readOptional(root, MANIFEST), after: `${JSON.stringify(next, null, 2)}\n` });
  const findings = auditInstructions(root);
  // Gitignored instructions/skills may not be discovered by some clients.
  notes.push("Heuristic audit only: inspect global/native rules, hooks, CI and branch protections; a clean scan does not prove compatibility.");
  return { changes, findings, notes, installed: previous !== null };
}

export function planEngineeringRemoval(root: string): EngineeringPlan {
  const previous = loadManifest(root);
  if (!previous) return { changes: [], findings: [], notes: ["Engineering profile is not installed."], installed: false };
  const changes: FileChange[] = [];
  for (const [path, expected] of Object.entries(previous.files)) {
    const before = readOptional(root, path);
    if (before === null || hash(before) !== expected) throw new Error(`${path} was changed or removed; preserve it and reconcile before removal.`);
    changes.push({ path, before, after: null });
  }
  for (const [path, block] of Object.entries(previous.blocks)) {
    const before = readOptional(root, path);
    const after = stripManaged(before ?? "", block.fragment);
    changes.push({ path, before, after: block.created && !after ? null : after });
  }
  changes.push({ path: MANIFEST, before: readOptional(root, MANIFEST), after: null });
  return { changes, findings: [], notes: [`${CONFIG} is project-owned and will be retained.`], installed: true };
}
