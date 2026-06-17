import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { c, err, info, ok, warn } from "../lib/log.js";
import {
  baseCachePath,
  emptyLockfile,
  hashPath,
  readLockfile,
  writeLockfile,
} from "../lib/lockfile.js";
import {
  copyInto,
  detectTools,
  mergeMcp,
  planTargets,
  projectRuleIntoClaudeMd,
} from "../lib/project.js";
import { findSourceRoot, getAsset, loadRegistry, resolveSourceRef } from "../lib/source.js";
import type { LockfileEntry } from "../lib/types.js";

const PROTECTED_ROOT_FILES = new Set(["AGENTS.md", "CLAUDE.md"]);

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
    const asset = getAsset(registry, id);
    if (!asset) {
      err(`unknown asset '${id}'`);
      failed++;
      continue;
    }
    const srcAbs = join(sourceRoot, asset.source);
    if (!existsSync(srcAbs)) {
      err(`'${id}': source not found at ${asset.source}`);
      failed++;
      continue;
    }
    if (lock.installed[id] && !force) {
      warn(`'${id}' is already installed — run 'loadout update' to refresh, or add --force to reinstall.`);
      continue;
    }

    let primaryTarget: string | null = null;
    for (const action of planTargets(asset, tools, projectRoot)) {
      switch (action.kind) {
        case "copyFile":
        case "copyDir": {
          const targetAbs = join(projectRoot, action.target);
          if (PROTECTED_ROOT_FILES.has(action.target) && existsSync(targetAbs) && !force) {
            warn(`${action.target} already exists; not overwriting (use --force). Merge its content manually.`);
            break;
          }
          copyInto(srcAbs, targetAbs);
          primaryTarget ??= action.target;
          ok(`vendored ${c.bold(id)} → ${action.target}`);
          break;
        }
        case "projectRule": {
          projectRuleIntoClaudeMd(join(projectRoot, action.target), id, readFileSync(srcAbs, "utf8"));
          info(c.dim(`  projected ${id} into ${action.target}`));
          break;
        }
        case "mergeMcp": {
          const res = mergeMcp(join(projectRoot, action.target), readFileSync(srcAbs, "utf8"));
          primaryTarget ??= action.target;
          if (res.added.length) ok(`merged MCP servers [${res.added.join(", ")}] → ${action.target}`);
          if (res.collisions.length)
            warn(`MCP servers already present, left as-is: ${res.collisions.join(", ")}`);
          break;
        }
        case "note":
          info(c.dim(`  ${action.message}`));
          break;
        default: {
          const _never: never = action;
          warn(String(_never));
        }
      }
    }

    if (primaryTarget) {
      copyInto(srcAbs, baseCachePath(projectRoot, id)); // merge base
      const entry: LockfileEntry = {
        type: asset.type,
        version: asset.version,
        managed: asset.managed,
        target: primaryTarget,
        baseHash: hashPath(srcAbs),
        localHash: hashPath(join(projectRoot, primaryTarget)),
      };
      lock.installed[id] = entry;
    }
  }

  writeLockfile(projectRoot, lock);
  info("");
  info(`Lockfile updated: ${Object.keys(lock.installed).length} asset(s) tracked.`);
  return failed > 0 ? 1 : 0;
}
