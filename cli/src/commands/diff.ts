import { spawnSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { c, err, heading, info, ok } from "../lib/log.js";
import { readLockfile } from "../lib/lockfile.js";
import { findSourceRoot, getAsset, loadRegistry } from "../lib/source.js";

export function diff(args: string[]): number {
  const id = args.find((a) => !a.startsWith("-"));
  if (!id) {
    err("usage: loadout diff <id>");
    return 1;
  }
  const projectRoot = process.cwd();
  const sourceRoot = findSourceRoot();
  const registry = loadRegistry(sourceRoot);
  const asset = getAsset(registry, id);
  if (!asset) {
    err(`unknown asset '${id}'`);
    return 1;
  }
  const srcAbs = join(sourceRoot, asset.source);
  const lock = readLockfile(projectRoot);
  const entry = lock?.installed[id];
  if (!entry) {
    err(`'${id}' is not installed in this project (no lockfile entry).`);
    return 1;
  }
  const targetAbs = join(projectRoot, entry.target);
  if (!existsSync(targetAbs)) {
    err(`installed target missing: ${entry.target}`);
    return 1;
  }

  heading(`diff ${id}  (local ${entry.target}  vs  upstream ${asset.source})`);
  const recursive = statSync(srcAbs).isDirectory();
  const res = spawnSync(
    "diff",
    [recursive ? "-ru" : "-u", targetAbs, srcAbs],
    { encoding: "utf8" },
  );
  if (res.status === 0) {
    ok("identical to upstream");
    return 0;
  }
  if (typeof res.stdout === "string" && res.stdout.length > 0) {
    info(res.stdout);
  } else {
    info(c.dim("(diff unavailable)"));
  }
  return 0;
}
