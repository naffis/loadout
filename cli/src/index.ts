#!/usr/bin/env node
import { add } from "./commands/add.js";
import { diff } from "./commands/diff.js";
import { doctor } from "./commands/doctor.js";
import { init } from "./commands/init.js";
import { list } from "./commands/list.js";
import { update } from "./commands/update.js";
import { c, info } from "./lib/log.js";

const HELP = `${c.bold("loadout")} — equip projects with skills, rules, docs, and workflows.

${c.bold("Usage:")} loadout <command> [options]

${c.bold("Commands:")}
  init                 Bootstrap a project (Phase 2)
  add <id...>          Vendor assets into the project (Phase 2)
  list [--installed]   Show available assets, or what is installed locally
  update [--check]     Pull latest and three-way merge managed assets (Phase 3)
  diff <id>            Show upstream vs local for one asset (Phase 3)
  doctor               Validate manifests, frontmatter, and composition refs
  help                 Show this message

${c.dim("Docs: README.md, docs/usage.md")}`;

function main(argv: string[]): number {
  const [cmd, ...rest] = argv;
  switch (cmd) {
    case "doctor":
      return doctor();
    case "list":
      return list(rest);
    case "init":
      return init(rest);
    case "add":
      return add(rest);
    case "update":
      return update(rest);
    case "diff":
      return diff(rest);
    case undefined:
    case "help":
    case "--help":
    case "-h":
      info(HELP);
      return 0;
    default:
      info(`Unknown command: ${cmd}\n`);
      info(HELP);
      return 1;
  }
}

try {
  process.exit(main(process.argv.slice(2)));
} catch (e) {
  const msg = e instanceof Error ? e.message : String(e);
  process.stderr.write(`\u001b[31m✗\u001b[0m ${msg}\n`);
  process.exit(1);
}
