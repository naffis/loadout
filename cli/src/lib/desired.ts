import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { getAsset } from "./source.js";
import type { Registry, WorkflowFrontmatter } from "./types.js";

/** Asset ids listed in a workflow's `uses:` frontmatter (rules/skills/commands/agents). */
export function workflowUsesIds(sourceRoot: string, workflowSource: string): string[] {
  const abs = join(sourceRoot, workflowSource);
  if (!existsSync(abs)) return [];
  let data: Partial<WorkflowFrontmatter>;
  try {
    data = matter(readFileSync(abs, "utf8")).data as Partial<WorkflowFrontmatter>;
  } catch {
    return [];
  }
  const uses = data.uses ?? {};
  return [
    ...(uses.rules ?? []),
    ...(uses.skills ?? []),
    ...(uses.commands ?? []),
    ...(uses.agents ?? []),
  ];
}

/**
 * Ids that should be present in a project that already has some loadout install:
 * registry `kits.starter` seeds ∪ currently installed ∪ `uses:` of every installed
 * (and newly required) workflow, closed to a fixed point.
 */
export function resolveDesiredIds(
  registry: Registry,
  sourceRoot: string,
  installedIds: Iterable<string>,
): string[] {
  const desired = new Set<string>(installedIds);
  for (const id of registry.kits?.starter ?? []) desired.add(id);

  let grew = true;
  while (grew) {
    grew = false;
    for (const id of [...desired]) {
      const asset = getAsset(registry, id);
      if (!asset || asset.type !== "workflow") continue;
      for (const ref of workflowUsesIds(sourceRoot, asset.source)) {
        if (!desired.has(ref) && getAsset(registry, ref)) {
          desired.add(ref);
          grew = true;
        }
      }
    }
  }

  return [...desired].sort();
}

/** Ids in `desired` that are not yet in the lockfile. */
export function missingFromInstalled(
  desiredIds: Iterable<string>,
  installedIds: Iterable<string>,
): string[] {
  const have = new Set(installedIds);
  return [...desiredIds].filter((id) => !have.has(id)).sort();
}
