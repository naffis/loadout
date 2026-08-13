export type AssetType =
  | "skill"
  | "cursor-rule"
  | "command"
  | "agent"
  | "mcp"
  | "template"
  | "doc"
  | "workflow";

export type AssetLayer =
  | "baseline"
  | "rule"
  | "skill"
  | "command"
  | "agent"
  | "mcp"
  | "doc"
  | "workflow";

export interface RegistryAsset {
  id: string;
  type: AssetType;
  source: string;
  version: string;
  managed: boolean;
  tools: string[];
  layer?: AssetLayer;
  pairs_with?: string[];
  workflows?: string[];
  provenance?: {
    source_repo?: string;
    harvested?: string;
  };
}

export interface Registry {
  version: string;
  source: string;
  /**
   * Named asset-id lists. `starter` is the seed set `update` keeps complete
   * (plus the `uses:` closure of every installed workflow).
   */
  kits?: {
    starter?: string[];
    [name: string]: string[] | undefined;
  };
  assets: RegistryAsset[];
}

export interface MarketplacePlugin {
  name: string;
  source: string;
  version: string;
  keywords?: string[];
}

export interface Marketplace {
  name: string;
  owner?: { name?: string };
  version: string;
  description?: string;
  plugins: MarketplacePlugin[];
}

export interface PluginManifest {
  name: string;
  version: string;
  author?: { name?: string };
  description?: string;
}

export interface WorkflowFrontmatter {
  name: string;
  uses?: {
    rules?: string[];
    skills?: string[];
    commands?: string[];
    agents?: string[];
  };
  // Optional loop primitives (docs/loop-engineering.md).
  gate?: string;
  stop_condition?: string;
  state?: string;
}

export interface LockfileEntry {
  type: AssetType;
  version: string;
  managed: boolean;
  target: string;
  baseHash: string;
  localHash: string;
}

export interface Lockfile {
  source: string;
  ref: string;
  installed: Record<string, LockfileEntry>;
}
