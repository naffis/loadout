import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

/**
 * Walk up from `start` to locate the loadout repo root. The root is the first
 * ancestor that contains either the marketplace catalog or the registry.
 */
export function findRepoRoot(start: string = process.cwd()): string | null {
  let dir = resolve(start);
  for (;;) {
    if (
      existsSync(join(dir, ".claude-plugin", "marketplace.json")) ||
      existsSync(join(dir, "registry.json"))
    ) {
      return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

export function readJson<T = unknown>(path: string): T {
  const raw = readFileSync(path, "utf8");
  return JSON.parse(raw) as T;
}

export function tryReadJson<T = unknown>(path: string): T | null {
  if (!existsSync(path)) return null;
  try {
    return readJson<T>(path);
  } catch {
    return null;
  }
}
