#!/usr/bin/env node
import {
  analyzeProject,
  formatAnalysis,
  formatDoctor,
  formatInspect,
  formatRecommend,
  formatSearch,
  inspectSkill,
  recommendSkills,
  runDoctor,
  searchSkills,
} from "@make-it-ezy/core";

const HELP = `Make It Ezy — local-first AI capability discovery (Phase 2)

Usage:
  ezy --help
  ezy doctor
  ezy analyze
  ezy search <query> [--local-only]
  ezy inspect <skill> [--local-only]
  ezy recommend <query> [--local-only]

Commands:
  doctor      Check Node, pnpm, Git, OS, and project root
  analyze     Read-only project/environment inspection
  search      Discover skills (local + skills.sh). Never installs.
  inspect     Inspect a local skill (provenance, files, risk notes)
  recommend   Shortlist Recommended / Optional / Not needed. Never installs.

Flags:
  --local-only   Skip skills.sh network lookups

Discovery flow: DISCOVER → INSPECT → COMPARE → RECOMMEND
Installation and AI providers are still out of scope.
`;

async function main(argv: string[]): Promise<number> {
  const args = argv.slice(2);
  const command = args[0];

  if (!command || command === "--help" || command === "-h" || command === "help") {
    process.stdout.write(HELP);
    return 0;
  }

  if (command === "doctor") {
    const report = runDoctor();
    process.stdout.write(formatDoctor(report) + "\n");
    return report.ok ? 0 : 1;
  }

  if (command === "analyze") {
    const analysis = analyzeProject();
    process.stdout.write(formatAnalysis(analysis) + "\n");
    return 0;
  }

  if (command === "search") {
    const flags = new Set(args.slice(1).filter((a) => a.startsWith("--")));
    const queryParts = args.slice(1).filter((a) => !a.startsWith("--"));
    const query = queryParts.join(" ").trim();
    if (!query) {
      process.stderr.write("Usage: ezy search <query> [--local-only]\n");
      return 1;
    }
    const report = await searchSkills(query, {
      localOnly: flags.has("--local-only"),
    });
    process.stdout.write(formatSearch(report) + "\n");
    return 0;
  }

  if (command === "inspect") {
    const flags = new Set(args.slice(1).filter((a) => a.startsWith("--")));
    const nameParts = args.slice(1).filter((a) => !a.startsWith("--"));
    const name = nameParts.join(" ").trim();
    if (!name) {
      process.stderr.write("Usage: ezy inspect <skill> [--local-only]\n");
      return 1;
    }
    const report = await inspectSkill(name, {
      skipRemote: flags.has("--local-only"),
    });
    process.stdout.write(formatInspect(report) + "\n");
    return report.found ? 0 : 1;
  }

  if (command === "recommend") {
    const flags = new Set(args.slice(1).filter((a) => a.startsWith("--")));
    const queryParts = args.slice(1).filter((a) => !a.startsWith("--"));
    const query = queryParts.join(" ").trim();
    if (!query) {
      process.stderr.write("Usage: ezy recommend <query> [--local-only]\n");
      return 1;
    }
    const report = await recommendSkills(query, {
      localOnly: flags.has("--local-only"),
    });
    process.stdout.write(formatRecommend(report) + "\n");
    return 0;
  }

  process.stderr.write(`Unknown command: ${command}\n\n${HELP}`);
  return 1;
}

main(process.argv)
  .then((code) => {
    process.exitCode = code;
  })
  .catch((err) => {
    process.stderr.write(String(err instanceof Error ? err.stack ?? err.message : err) + "\n");
    process.exitCode = 1;
  });
