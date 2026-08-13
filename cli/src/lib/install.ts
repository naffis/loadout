import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { c, err, info, ok, warn } from "./log.js";
import { baseCachePath, hashPath } from "./lockfile.js";
import {
  copyInto,
  mergeMcp,
  planTargets,
  projectRuleIntoClaudeMd,
  type Tools,
} from "./project.js";
import { getAsset } from "./source.js";
import type { Lockfile, Registry, RegistryAsset } from "./types.js";

const PROTECTED_ROOT_FILES = new Set(["AGENTS.md", "CLAUDE.md"]);

export type VendorResult = "installed" | "skipped" | "failed";

export interface VendorContext {
  sourceRoot: string;
  projectRoot: string;
  registry: Registry;
  tools: Tools;
  lock: Lockfile;
  force?: boolean;
  /** Quieter labels when called from `update` (e.g. "installed missing"). */
  missingLabel?: boolean;
}

/** Vendor one registry asset into the project and record it in `ctx.lock`. */
export function vendorAsset(id: string, ctx: VendorContext): VendorResult {
  const asset = getAsset(ctx.registry, id);
  if (!asset) {
    err(`unknown asset '${id}'`);
    return "failed";
  }
  const srcAbs = join(ctx.sourceRoot, asset.source);
  if (!existsSync(srcAbs)) {
    err(`'${id}': source not found at ${asset.source}`);
    return "failed";
  }
  if (ctx.lock.installed[id] && !ctx.force) {
    warn(`'${id}' is already installed — run 'loadout update' to refresh, or add --force to reinstall.`);
    return "skipped";
  }

  const primaryTarget = applyVendorActions(id, asset, srcAbs, ctx);
  if (!primaryTarget) return "failed";

  copyInto(srcAbs, baseCachePath(ctx.projectRoot, id));
  ctx.lock.installed[id] = {
    type: asset.type,
    version: asset.version,
    managed: asset.managed,
    target: primaryTarget,
    baseHash: hashPath(srcAbs),
    localHash: hashPath(join(ctx.projectRoot, primaryTarget)),
  };
  return "installed";
}

function applyVendorActions(
  id: string,
  asset: RegistryAsset,
  srcAbs: string,
  ctx: VendorContext,
): string | null {
  let primaryTarget: string | null = null;
  let copied = false;

  for (const action of planTargets(asset, ctx.tools, ctx.projectRoot)) {
    switch (action.kind) {
      case "copyFile":
      case "copyDir": {
        const targetAbs = join(ctx.projectRoot, action.target);
        if (PROTECTED_ROOT_FILES.has(action.target) && existsSync(targetAbs) && !ctx.force) {
          warn(`${action.target} already exists; not overwriting (use --force). Merge its content manually.`);
          break;
        }
        copyInto(srcAbs, targetAbs);
        primaryTarget ??= action.target;
        copied = true;
        if (ctx.missingLabel) ok(`installed missing ${c.bold(id)} → ${action.target}`);
        else ok(`vendored ${c.bold(id)} → ${action.target}`);
        break;
      }
      case "projectRule": {
        projectRuleIntoClaudeMd(join(ctx.projectRoot, action.target), id, readFileSync(srcAbs, "utf8"));
        info(c.dim(`  projected ${id} into ${action.target}`));
        break;
      }
      case "mergeMcp": {
        const res = mergeMcp(join(ctx.projectRoot, action.target), readFileSync(srcAbs, "utf8"));
        primaryTarget ??= action.target;
        copied = true;
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

  if (!copied && !primaryTarget) {
    err(`'${id}': no installable target for detected tools`);
    return null;
  }
  return primaryTarget;
}
