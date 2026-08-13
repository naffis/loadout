import { existsSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { c, err, heading, info, ok, warn } from "../lib/log.js";
import { missingFromInstalled, resolveDesiredIds } from "../lib/desired.js";
import { vendorAsset } from "../lib/install.js";
import {
  baseCachePath,
  hashPath,
  readLockfile,
  writeLockfile,
} from "../lib/lockfile.js";
import { copyInto, detectTools, mergeMcp, planTargets, projectRuleIntoClaudeMd } from "../lib/project.js";
import { threeWayMerge } from "../lib/merge.js";
import { findSourceRoot, getAsset, loadRegistry } from "../lib/source.js";
import type { LockfileEntry } from "../lib/types.js";

export function update(args: string[]): number {
  const check = args.includes("--check");
  const refreshOnly = args.includes("--refresh-only");
  const projectRoot = process.cwd();
  const sourceRoot = findSourceRoot();
  const registry = loadRegistry(sourceRoot);
  const lock = readLockfile(projectRoot);
  if (!lock || Object.keys(lock.installed).length === 0) {
    info("No loadout-managed assets in this project.");
    return 0;
  }

  const tools = detectTools(projectRoot);
  const updatesAvailable: string[] = [];
  const merged: string[] = [];
  const conflicts: string[] = [];
  const localDivergence: string[] = [];
  const orphaned: string[] = [];
  const newlyInstalled: string[] = [];

  for (const [id, entry] of Object.entries(lock.installed)) {
    const asset = getAsset(registry, id);
    if (!asset) {
      orphaned.push(id);
      continue;
    }
    const srcAbs = join(sourceRoot, asset.source);
    if (!existsSync(srcAbs)) {
      orphaned.push(id);
      continue;
    }
    const theirsHash = hashPath(srcAbs);

    // Unmanaged / MCP: never overwrite. Re-merge MCP into every target; else notify on version bump.
    if (!entry.managed || entry.type === "mcp") {
      if (theirsHash !== entry.baseHash) {
        if (check) {
          updatesAvailable.push(id);
        } else if (entry.type === "mcp") {
          for (const action of planTargets(asset, tools, projectRoot)) {
            if (action.kind !== "mergeMcp") continue;
            const res = mergeMcp(join(projectRoot, action.target), readFileSync(srcAbs, "utf8"));
            if (res.added.length) ok(`${id}: merged MCP servers [${res.added.join(", ")}] → ${action.target}`);
            if (res.collisions.length) warn(`${id}: existing MCP servers left as-is in ${action.target}: ${res.collisions.join(", ")}`);
          }
          entry.baseHash = theirsHash;
          entry.version = asset.version;
        } else {
          info(`${id}: upstream changed (unmanaged, v${asset.version}); not modifying.`);
          entry.version = asset.version;
        }
      }
      continue;
    }

    const targetAbs = join(projectRoot, entry.target);
    const baseAbs = baseCachePath(projectRoot, id);
    const oursHash = hashPath(targetAbs);

    if (oursHash !== entry.baseHash) localDivergence.push(id);
    if (theirsHash === entry.baseHash) continue; // upstream unchanged

    if (check) {
      updatesAvailable.push(id);
      continue;
    }

    const res = mergeAsset(targetAbs, baseAbs, srcAbs);
    if (res.conflict) conflicts.push(id);
    else merged.push(id);

    if (asset.type === "cursor-rule" && tools.claude) {
      projectRuleIntoClaudeMd(join(projectRoot, "CLAUDE.md"), id, readFileSync(targetAbs, "utf8"));
    }

    advanceBase(baseAbs, srcAbs);
    entry.baseHash = theirsHash;
    entry.localHash = hashPath(targetAbs);
    entry.version = asset.version;
    lock.installed[id] = entry as LockfileEntry;
  }

  // Keep kits.starter + installed workflow uses: complete (unless --refresh-only).
  let missing: string[] = [];
  if (!refreshOnly) {
    const desired = resolveDesiredIds(registry, sourceRoot, Object.keys(lock.installed));
    missing = missingFromInstalled(desired, Object.keys(lock.installed));
    if (check) {
      for (const id of missing) updatesAvailable.push(id);
    } else {
      for (const id of missing) {
        const result = vendorAsset(id, {
          sourceRoot,
          projectRoot,
          registry,
          tools,
          lock,
          missingLabel: true,
        });
        if (result === "installed") newlyInstalled.push(id);
      }
    }
  }

  if (check) {
    heading("Update check");
    for (const id of orphaned) warn(`${id}: no longer in registry`);
    const contentUpdates = updatesAvailable.filter((id) => !missing.includes(id));
    const missingUpdates = updatesAvailable.filter((id) => missing.includes(id));
    if (updatesAvailable.length === 0) {
      ok("Up to date.");
      return 0;
    }
    for (const id of contentUpdates) info(`  ${c.bold(id)}: update available`);
    for (const id of missingUpdates) info(`  ${c.bold(id)}: missing (will install)`);
    info("");
    info(`${updatesAvailable.length} update(s) available. Run 'loadout update'.`);
    return 1;
  }

  writeLockfile(projectRoot, lock);
  heading("Update");
  for (const id of merged) ok(`${id}: updated`);
  for (const id of localDivergence) info(c.dim(`${id}: had local edits (merged)`));
  for (const id of conflicts) err(`${id}: CONFLICT — markers written, resolve manually`);
  for (const id of orphaned) warn(`${id}: no longer in registry; left in place`);
  info("");
  info(
    `${merged.length} updated, ${newlyInstalled.length} installed missing, ${conflicts.length} conflict(s).`,
  );
  return conflicts.length > 0 ? 1 : 0;
}

interface MergeOutcome {
  conflict: boolean;
}

/** Three-way merge a file or a directory (per-file) from base→theirs onto ours. */
function mergeAsset(targetAbs: string, baseAbs: string, srcAbs: string): MergeOutcome {
  const srcIsDir = existsSync(srcAbs) && statSync(srcAbs).isDirectory();
  if (!srcIsDir) {
    const ours = existsSync(targetAbs) ? readFileSync(targetAbs, "utf8") : "";
    const base = existsSync(baseAbs) ? readFileSync(baseAbs, "utf8") : "";
    const theirs = readFileSync(srcAbs, "utf8");
    const { merged, conflict } = threeWayMerge(ours, base, theirs);
    mkdirSync(dirname(targetAbs), { recursive: true });
    writeFileSync(targetAbs, merged);
    return { conflict };
  }

  const rels = new Set<string>();
  for (const root of [srcAbs, baseAbs, targetAbs]) collectRel(root, root, rels);
  let conflict = false;
  for (const rel of rels) {
    const ours = readIf(join(targetAbs, rel));
    const base = readIf(join(baseAbs, rel));
    const theirs = readIf(join(srcAbs, rel));
    if (theirs === null && ours === null) continue;
    if (theirs === null && ours !== null) continue;
    const r = threeWayMerge(ours ?? "", base ?? "", theirs ?? "");
    if (r.conflict) conflict = true;
    const dest = join(targetAbs, rel);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, r.merged);
  }
  return { conflict };
}

function collectRel(root: string, dir: string, out: Set<string>): void {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) collectRel(root, full, out);
    else out.add(relative(root, full));
  }
}

function readIf(p: string): string | null {
  return existsSync(p) ? readFileSync(p, "utf8") : null;
}

function advanceBase(baseAbs: string, srcAbs: string): void {
  if (statSync(srcAbs).isDirectory() && existsSync(baseAbs)) {
    rmSync(baseAbs, { recursive: true, force: true });
  }
  copyInto(srcAbs, baseAbs);
}
