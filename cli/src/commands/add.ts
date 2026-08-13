import { err, info } from "../lib/log.js";
import { emptyLockfile, readLockfile, writeLockfile } from "../lib/lockfile.js";
import { vendorAsset } from "../lib/install.js";
import { detectTools } from "../lib/project.js";
import { findSourceRoot, loadRegistry, resolveSourceRef } from "../lib/source.js";

export function add(args: string[]): number {
  const force = args.includes("--force");
  const ids = args.filter((a) => !a.startsWith("-"));
  if (ids.length === 0) {
    err("usage: loadout add <id...> [--force]");
    return 1;
  }

  const sourceRoot = findSourceRoot();
  const registry = loadRegistry(sourceRoot);
  const projectRoot = process.cwd();
  const tools = detectTools(projectRoot);
  const lock =
    readLockfile(projectRoot) ?? emptyLockfile(registry.source, resolveSourceRef(registry));

  let failed = 0;
  for (const id of ids) {
    const result = vendorAsset(id, { sourceRoot, projectRoot, registry, tools, lock, force });
    if (result === "failed") failed++;
  }

  writeLockfile(projectRoot, lock);
  info("");
  info(`Lockfile updated: ${Object.keys(lock.installed).length} asset(s) tracked.`);
  return failed > 0 ? 1 : 0;
}
