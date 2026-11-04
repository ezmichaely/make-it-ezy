#!/usr/bin/env node
import {
  analyzeProject,
  formatAnalysis,
  formatDoctor,
  runDoctor,
} from "@make-it-ezy/core";

const HELP = `Make It Ezy — local-first AI capability discovery (Phase 1)

Usage:
  ezy --help
  ezy doctor
  ezy analyze

Commands:
  doctor     Check Node, pnpm, Git, OS, and project root
  analyze    Read-only project/environment inspection

Installation, skill search, and AI providers are still out of scope.
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
