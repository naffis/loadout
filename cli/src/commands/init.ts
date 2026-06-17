import { chmodSync, copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { c, heading, info, ok, warn } from "../lib/log.js";
import { emptyLockfile, lockfilePath, writeLockfile } from "../lib/lockfile.js";
import { detectTools } from "../lib/project.js";
import { findSourceRoot, loadRegistry, resolveSourceRef } from "../lib/source.js";

export function init(args: string[]): number {
  const projectRoot = process.cwd();
  const sourceRoot = findSourceRoot();
  const registry = loadRegistry(sourceRoot);
  const tools = detectTools(projectRoot);

  heading(`loadout init — ${projectRoot}`);
  info(c.dim(`detected: ${tools.cursor ? "cursor " : ""}${tools.claude ? "claude" : ""}`.trim() || "none"));

  // Scaffold tool dirs.
  if (tools.cursor) {
    mkdirSync(join(projectRoot, ".cursor", "rules"), { recursive: true });
    mkdirSync(join(projectRoot, ".cursor", "skills"), { recursive: true });
  }
  if (tools.claude) mkdirSync(join(projectRoot, ".claude", "hooks"), { recursive: true });

  // AGENTS.md from the template if absent.
  const agentsTarget = join(projectRoot, "AGENTS.md");
  const agentsTemplate = join(sourceRoot, "templates", "AGENTS.md");
  if (!existsSync(agentsTarget) && existsSync(agentsTemplate)) {
    copyFileSync(agentsTemplate, agentsTarget);
    ok("wrote AGENTS.md from template");
  } else if (existsSync(agentsTarget)) {
    info(c.dim("AGENTS.md already present, left as-is"));
  }

  // Install the SessionStart notify hook (Claude Code).
  if (tools.claude) {
    const hookSrc = join(sourceRoot, "hooks", "check-plugin-updates.sh");
    const hookDest = join(projectRoot, ".claude", "hooks", "check-plugin-updates.sh");
    if (existsSync(hookSrc)) {
      copyFileSync(hookSrc, hookDest);
      chmodSync(hookDest, 0o755);
      wireSessionStartHook(projectRoot);
      ok("installed SessionStart update-notify hook + wired .claude/settings.json");
    } else {
      warn("notify hook not found in source; skipped");
    }
  }

  // Lockfile.
  if (!existsSync(lockfilePath(projectRoot))) {
    writeLockfile(projectRoot, emptyLockfile(registry.source, resolveSourceRef(registry)));
    ok("created loadout.lock.json");
  } else {
    info(c.dim("loadout.lock.json already present, left as-is"));
  }

  heading("Next steps");
  info("  loadout list                 # see available assets");
  info("  loadout add <id...>          # vendor assets into this project");
  if (tools.claude) info("  /plugin marketplace add naffis/loadout   # Claude Code plugins");
  if (tools.cursor) info("  Cursor → Settings → Rules → Remote Rule (GitHub): https://github.com/naffis/loadout");
  return 0;
}

function wireSessionStartHook(projectRoot: string): void {
  const settingsPath = join(projectRoot, ".claude", "settings.json");
  let settings: { hooks?: { SessionStart?: unknown[] } } = {};
  if (existsSync(settingsPath)) {
    try {
      settings = JSON.parse(readFileSync(settingsPath, "utf8"));
    } catch {
      warn(".claude/settings.json is not valid JSON; not modifying it");
      return;
    }
  }
  settings.hooks ??= {};
  const existing = Array.isArray(settings.hooks.SessionStart) ? settings.hooks.SessionStart : [];
  const command = '"$CLAUDE_PROJECT_DIR"/.claude/hooks/check-plugin-updates.sh';
  const already = JSON.stringify(existing).includes("check-plugin-updates.sh");
  if (!already) {
    existing.push({ hooks: [{ type: "command", command, timeout: 15 }] });
    settings.hooks.SessionStart = existing;
    writeFileSync(settingsPath, `${JSON.stringify(settings, null, 2)}\n`);
  }
}
