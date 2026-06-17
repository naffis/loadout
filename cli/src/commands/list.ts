import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { c, err, heading, info } from "../lib/log.js";
import { findRepoRoot, tryReadJson } from "../lib/repo.js";
import type { Lockfile, Registry } from "../lib/types.js";

export function list(args: string[]): number {
  const installed = args.includes("--installed");

  if (installed) {
    const lockPath = join(process.cwd(), "loadout.lock.json");
    if (!existsSync(lockPath)) {
      info("No loadout.lock.json in this project. Nothing installed via the CLI.");
      return 0;
    }
    const lock = tryReadJson<Lockfile>(lockPath);
    if (!lock) {
      err("loadout.lock.json is not valid JSON.");
      return 1;
    }
    heading(`Installed (source ${lock.source}@${lock.ref})`);
    const entries = Object.entries(lock.installed ?? {});
    if (!entries.length) {
      info(c.dim("  (none)"));
      return 0;
    }
    for (const [id, e] of entries) {
      const drift = e.localHash !== e.baseHash ? c.yellow(" [local edits]") : "";
      const flag = e.managed ? "" : c.dim(" (unmanaged)");
      info(`  ${c.bold(id)}  ${c.dim(e.type)}  v${e.version}${flag}${drift}`);
      info(c.dim(`    → ${e.target}`));
    }
    return 0;
  }

  const root = findRepoRoot();
  if (!root) {
    err("Could not locate the loadout registry. Run inside a loadout checkout, or use --installed.");
    return 1;
  }
  const reg = tryReadJson<Registry>(join(root, "registry.json"));
  if (!reg) {
    err("registry.json is missing or invalid.");
    return 1;
  }
  heading(`Available assets (${reg.assets.length})`);
  if (!reg.assets.length) {
    info(c.dim("  (registry is empty)"));
    return 0;
  }
  for (const a of reg.assets) {
    const tools = a.tools?.length ? c.dim(` [${a.tools.join(", ")}]`) : "";
    info(`  ${c.bold(a.id)}  ${c.dim(a.type)}  v${a.version}${tools}`);
    if (a.workflows?.length) info(c.dim(`    workflows: ${a.workflows.join(", ")}`));
  }
  return 0;
}
