import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readJson } from "./repo.js";
import type { Registry, RegistryAsset } from "./types.js";

/**
 * The "source root" is the loadout checkout/package the CLI is running from — it holds
 * registry.json and the asset files. When invoked via `npx github:naffis/loadout`, this is
 * the cloned repo; in local dev it's this repo. Distinct from the consumer project (cwd).
 */
export function findSourceRoot(): string {
  // Walk up from the compiled file location (dist/index.js) to the dir with registry.json.
  let dir = dirname(fileURLToPath(import.meta.url));
  for (;;) {
    if (existsSync(join(dir, "registry.json"))) return dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  // Fallback: cwd (running inside a loadout checkout).
  return resolve(process.cwd());
}

export function loadRegistry(sourceRoot: string): Registry {
  return readJson<Registry>(join(sourceRoot, "registry.json"));
}

export function getAsset(registry: Registry, id: string): RegistryAsset | undefined {
  return registry.assets.find((a) => a.id === id);
}

/** Read the pinned ref for the lockfile: the source repo's git tag/branch if resolvable. */
export function resolveSourceRef(registry: Registry): string {
  return registry.version ? `registry-${registry.version}` : "main";
}
