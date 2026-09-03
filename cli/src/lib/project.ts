import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join } from "node:path";
import type { RegistryAsset } from "./types.js";

export interface Tools {
  cursor: boolean;
  claude: boolean;
}

/** Detect which agent tools a project uses. Defaults to both when neither is present. */
export function detectTools(projectRoot: string): Tools {
  const cursor =
    existsSync(join(projectRoot, ".cursor")) ||
    existsSync(join(projectRoot, ".cursor", "rules"));
  const claude =
    existsSync(join(projectRoot, ".claude")) ||
    existsSync(join(projectRoot, "CLAUDE.md"));
  if (!cursor && !claude) return { cursor: true, claude: true };
  return { cursor, claude };
}

export type TargetAction =
  | { kind: "copyFile"; target: string }
  | { kind: "copyDir"; target: string }
  | { kind: "projectRule"; target: string } // append rule body into CLAUDE.md block
  | { kind: "mergeMcp"; target: string }
  | { kind: "note"; message: string };

/**
 * Resolve where an asset lands in a project, given the tools it uses.
 * Returns one action per target; an asset can land in multiple places (e.g. a rule in
 * both .cursor/rules and CLAUDE.md).
 */
export function planTargets(
  asset: RegistryAsset,
  tools: Tools,
  projectRoot: string,
): TargetAction[] {
  const actions: TargetAction[] = [];
  const src = asset.source;
  switch (asset.type) {
    case "skill":
      if (tools.cursor)
        actions.push({
          kind: "copyDir",
          target: join(".cursor", "skills", asset.id),
        });
      if (tools.claude)
        actions.push({
          kind: "note",
          message: `skill '${asset.id}' for Claude Code is delivered via the plugin: /plugin install <plugin>@loadout`,
        });
      break;
    case "cursor-rule": {
      // Vendor by source basename so registry aliases (`create-plan-rule` →
      // rules/create-plan.mdc) land as one file, not a second `*-rule.mdc`.
      const ruleFile = basename(asset.source);
      const canonical = tools.cursor
        ? join(".cursor", "rules", ruleFile)
        : join(".loadout", "rules", ruleFile);
      actions.push({ kind: "copyFile", target: canonical });
      if (tools.claude)
        actions.push({ kind: "projectRule", target: "CLAUDE.md" });
      break;
    }
    case "command": {
      // Slash command name comes from the source basename (e.g. review-plan.md →
      // /review-plan) so registry ids can stay unique when a skill shares the name
      // (skill review-plan + command review-plan-cmd → still vendors as review-plan.md).
      const cmdFile = basename(asset.source);
      if (tools.cursor)
        actions.push({
          kind: "copyFile",
          target: join(".cursor", "commands", cmdFile),
        });
      if (tools.claude)
        actions.push({
          kind: "copyFile",
          target: join(".claude", "commands", cmdFile),
        });
      break;
    }
    case "agent":
      // Both tools load custom subagent personas from a per-tool agents dir.
      if (tools.cursor)
        actions.push({
          kind: "copyFile",
          target: join(".cursor", "agents", `${asset.id}.md`),
        });
      if (tools.claude)
        actions.push({
          kind: "copyFile",
          target: join(".claude", "agents", `${asset.id}.md`),
        });
      break;
    case "mcp":
      if (tools.cursor)
        actions.push({ kind: "mergeMcp", target: join(".cursor", "mcp.json") });
      if (tools.claude) actions.push({ kind: "mergeMcp", target: ".mcp.json" });
      break;
    case "template":
      actions.push({ kind: "copyFile", target: templateTarget(asset) });
      break;
    case "hook":
      if (tools.cursor) {
        actions.push({ kind: "copyDir", target: join(".cursor", "hooks") });
        actions.push({
          kind: "note",
          message:
            "merge hooks/cursor-safety/hooks.fragment.json into .cursor/hooks.json (keep existing format hooks; do not mark afterFileEdit)",
        });
      } else {
        actions.push({
          kind: "note",
          message:
            "cursor-safety hooks are Cursor project hooks; Claude Code: see harness-hooks.md PreToolUse equivalents",
        });
      }
      break;
    case "doc":
    case "workflow":
      // Preserve the source's repo-relative path (docs/…, processes/…).
      actions.push({ kind: "copyFile", target: src });
      break;
    default: {
      const _never: never = asset.type;
      actions.push({
        kind: "note",
        message: `unknown asset type ${String(_never)}`,
      });
    }
  }
  return actions;
}

function templateTarget(asset: RegistryAsset): string {
  if (asset.id === "template-agents-md") return "AGENTS.md";
  if (asset.id === "template-claude-md") return "CLAUDE.md";
  if (asset.id === "template-bugbot") return join(".cursor", "BUGBOT.md");
  return join("docs", "loadout", basename(asset.source));
}

// --- copy helpers -----------------------------------------------------------

export function copyInto(srcAbs: string, targetAbs: string): void {
  mkdirSync(dirname(targetAbs), { recursive: true });
  const st = statSync(srcAbs);
  if (st.isDirectory()) cpSync(srcAbs, targetAbs, { recursive: true });
  else cpSync(srcAbs, targetAbs);
}

export function readContent(absPath: string): string {
  if (!existsSync(absPath)) return "";
  if (statSync(absPath).isDirectory()) {
    // Concatenate files for display/diff purposes (stable order).
    const parts: string[] = [];
    const walk = (dir: string): void => {
      for (const entry of readdirSync(dir).sort()) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) walk(full);
        else parts.push(readFileSync(full, "utf8"));
      }
    };
    walk(absPath);
    return parts.join("\n");
  }
  return readFileSync(absPath, "utf8");
}

// --- rule projection into CLAUDE.md -----------------------------------------

const RULE_BLOCK_START = "<!-- loadout:managed:cursor-rules:start -->";
const RULE_BLOCK_END = "<!-- loadout:managed:cursor-rules:end -->";

/** Append/replace a rule's body inside the managed block in CLAUDE.md. Idempotent per rule. */
export function projectRuleIntoClaudeMd(
  claudeMdAbs: string,
  ruleId: string,
  ruleBody: string,
): void {
  const marker = `<!-- rule:${ruleId} -->`;
  const entry = `${marker}\n${stripFrontmatter(ruleBody).trim()}\n`;

  let doc = existsSync(claudeMdAbs) ? readFileSync(claudeMdAbs, "utf8") : "";
  if (!doc.includes(RULE_BLOCK_START)) {
    doc += `\n${RULE_BLOCK_START}\n${RULE_BLOCK_END}\n`;
  }
  const start = doc.indexOf(RULE_BLOCK_START) + RULE_BLOCK_START.length;
  const end = doc.indexOf(RULE_BLOCK_END);
  let block = doc.slice(start, end);

  if (block.includes(marker)) {
    // Replace this rule's existing projection.
    const re = new RegExp(`${escapeRe(marker)}[\\s\\S]*?(?=<!-- rule:|$)`);
    block = block.replace(re, `${entry}\n`);
  } else {
    block = `${block.replace(/\s+$/, "")}\n\n${entry}\n`;
  }
  const next = `${doc.slice(0, start)}\n${block.trim()}\n${doc.slice(end)}`;
  mkdirSync(dirname(claudeMdAbs), { recursive: true });
  writeFileSync(claudeMdAbs, next);
}

function stripFrontmatter(md: string): string {
  if (md.startsWith("---")) {
    const end = md.indexOf("\n---", 3);
    if (end !== -1) return md.slice(md.indexOf("\n", end + 1) + 1);
  }
  return md;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// --- MCP merge (never overwrite; merge by key) ------------------------------

export interface McpMergeResult {
  added: string[];
  collisions: string[];
}

export function mergeMcp(
  targetAbs: string,
  incomingJson: string,
): McpMergeResult {
  const incoming = JSON.parse(incomingJson) as {
    mcpServers?: Record<string, unknown>;
  };
  const existing: { mcpServers?: Record<string, unknown> } = existsSync(
    targetAbs,
  )
    ? JSON.parse(readFileSync(targetAbs, "utf8"))
    : {};
  existing.mcpServers ??= {};
  const added: string[] = [];
  const collisions: string[] = [];
  for (const [name, cfg] of Object.entries(incoming.mcpServers ?? {})) {
    if (name in existing.mcpServers) {
      collisions.push(name); // leave existing (and any local secrets) in place
    } else {
      existing.mcpServers[name] = cfg;
      added.push(name);
    }
  }
  mkdirSync(dirname(targetAbs), { recursive: true });
  writeFileSync(targetAbs, `${JSON.stringify(existing, null, 2)}\n`);
  return { added, collisions };
}
