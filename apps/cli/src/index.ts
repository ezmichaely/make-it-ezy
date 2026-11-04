#!/usr/bin/env node
import {
  analyzeProject,
  buildInstallPreview,
  formatAnalysis,
  formatDoctor,
  formatInspect,
  formatInstallPreview,
  formatInstallResult,
  formatPlan,
  formatRecommend,
  formatSearch,
  inspectSkill,
  planOutcome,
  recommendSkills,
  runDoctor,
  runInstall,
  searchSkills,
} from "@make-it-ezy/core";
import { confirmYesNo, selectWithArrows, type SelectChoice } from "./select.js";

const HELP = `Make It Ezy — local-first AI capability discovery (Phase 4)

Usage:
  ezy --help
  ezy doctor
  ezy analyze
  ezy search <query> [--local-only]
  ezy inspect <skill> [--local-only]
  ezy recommend <query> [--local-only]
  ezy plan "<outcome>" [--local-only]
  ezy install <skill> [--yes] [--source owner/repo]
  ezy install --plan "<outcome>" [--yes]
  ezy install --query "<topic>" [--yes]

Commands:
  doctor      Check Node, pnpm, Git, OS, and project root
  analyze     Read-only project/environment inspection
  search      Discover skills (local + skills.sh). Never installs.
  inspect     Inspect a local skill (provenance, files, risk notes)
  recommend   Shortlist Recommended / Optional / Not needed. Never installs.
  plan        Outcome → capabilities + minimum skill set. Never installs/runs.
  install     Suggest-then-go install into .agents/skills (arrow-pick on TTY).

Flags:
  --local-only   Skip skills.sh network lookups (search/inspect/recommend/plan)
  --yes, -y      Approve install without interactive confirm
  --source       Explicit skills source (owner/repo)
  --plan         Build candidate list from ezy plan
  --query        Build candidate list from ezy recommend

Flow: DISCOVER → INSPECT → RECOMMEND → PLAN → INSTALL
Skill execution / outcome run is not in this slice.
`;

type InstallArgs = {
  yes: boolean;
  source?: string;
  plan?: string;
  query?: string;
  skill: string;
};

function parseInstallArgs(args: string[]): InstallArgs {
  let yes = false;
  let source: string | undefined;
  let plan: string | undefined;
  let query: string | undefined;
  const positional: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const a = args[i]!;
    if (a === "--yes" || a === "-y") {
      yes = true;
      continue;
    }
    if (a === "--source") {
      source = args[++i];
      continue;
    }
    if (a.startsWith("--source=")) {
      source = a.slice("--source=".length);
      continue;
    }
    if (a === "--plan") {
      plan = args[++i];
      continue;
    }
    if (a.startsWith("--plan=")) {
      plan = a.slice("--plan=".length);
      continue;
    }
    if (a === "--query") {
      query = args[++i];
      continue;
    }
    if (a.startsWith("--query=")) {
      query = a.slice("--query=".length);
      continue;
    }
    if (a.startsWith("--")) {
      continue;
    }
    positional.push(a);
  }

  return {
    yes,
    ...(source ? { source } : {}),
    ...(plan ? { plan } : {}),
    ...(query ? { query } : {}),
    skill: positional.join(" ").trim(),
  };
}

async function resolveInstallTarget(parsed: InstallArgs): Promise<{
  skillName: string;
  source?: string;
  code: number;
}> {
  if (parsed.skill) {
    return {
      skillName: parsed.skill,
      ...(parsed.source ? { source: parsed.source } : {}),
      code: 0,
    };
  }

  if (!parsed.plan && !parsed.query) {
    process.stderr.write(
      'Usage: ezy install <skill> [--yes] [--source owner/repo]\n' +
        '   or: ezy install --plan "<outcome>" [--yes]\n' +
        '   or: ezy install --query "<topic>" [--yes]\n',
    );
    return { skillName: "", code: 1 };
  }

  const choices: SelectChoice[] = [];
  const sourceByName = new Map<string, string>();

  if (parsed.plan) {
    const report = await planOutcome(parsed.plan);
    for (const item of [...report.recommended, ...report.optional]) {
      const label = `${item.hit.name} (${item.hit.sourceKind}) — ${item.reason}`;
      if (!choices.some((c) => c.value === item.hit.name)) {
        choices.push({ value: item.hit.name, label });
        if (item.hit.source) {
          sourceByName.set(item.hit.name, item.hit.source);
        }
      }
    }
  } else if (parsed.query) {
    const report = await recommendSkills(parsed.query);
    for (const item of [...report.recommended, ...report.optional]) {
      const label = `${item.hit.name} (${item.hit.sourceKind}) — ${item.reason}`;
      if (!choices.some((c) => c.value === item.hit.name)) {
        choices.push({ value: item.hit.name, label });
        if (item.hit.source) {
          sourceByName.set(item.hit.name, item.hit.source);
        }
      }
    }
  }

  if (!choices.length) {
    process.stderr.write("No install candidates found for that plan/query.\n");
    return { skillName: "", code: 1 };
  }

  const picked = await selectWithArrows("Select a skill to install:", choices);
  if (!picked) {
    // Non-TTY fallback: print list; require explicit name next time
    if (!process.stdin.isTTY) {
      process.stderr.write(
        "No TTY for arrow picker. Re-run with an explicit skill name, e.g.:\n",
      );
      for (const c of choices.slice(0, 8)) {
        process.stderr.write(`  ezy install ${c.value} --yes\n`);
      }
      return { skillName: "", code: 1 };
    }
    process.stderr.write("Cancelled.\n");
    return { skillName: "", code: 1 };
  }

  const fromMap = sourceByName.get(picked);
  return {
    skillName: picked,
    ...(parsed.source ? { source: parsed.source } : fromMap ? { source: fromMap } : {}),
    code: 0,
  };
}

async function handleInstall(args: string[]): Promise<number> {
  const parsed = parseInstallArgs(args);
  const target = await resolveInstallTarget(parsed);
  if (target.code !== 0 || !target.skillName) {
    return target.code || 1;
  }

  const preview = await buildInstallPreview(target.skillName, {
    ...(target.source || parsed.source
      ? { source: target.source ?? parsed.source }
      : {}),
  });

  process.stdout.write(formatInstallPreview(preview) + "\n\n");

  if (preview.alreadyInstalled) {
    process.stdout.write(formatInstallResult({
      ok: true,
      skillName: preview.skillName,
      destination: preview.destination,
      alreadyInstalled: true,
      skipped: true,
      stdout: "",
      stderr: "",
      error: null,
    }) + "\n");
    return 0;
  }

  if (preview.source === "(unresolved)") {
    process.stderr.write(
      "Cannot install: unresolved source. Pass --source owner/repo.\n",
    );
    return 1;
  }

  let approved = parsed.yes;
  if (!approved) {
    if (process.stdin.isTTY) {
      approved = await confirmYesNo("Install this skill?");
    } else {
      process.stderr.write("Pass --yes to install (non-interactive).\n");
      return 1;
    }
  }

  if (!approved) {
    process.stderr.write("Install declined.\n");
    return 1;
  }

  const result = await runInstall(preview);
  process.stdout.write(formatInstallResult(result) + "\n");
  if (result.stdout.trim()) {
    process.stdout.write(result.stdout.trim() + "\n");
  }
  return result.ok ? 0 : 1;
}

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

  if (command === "plan") {
    const flags = new Set(args.slice(1).filter((a) => a.startsWith("--")));
    const outcomeParts = args.slice(1).filter((a) => !a.startsWith("--"));
    const outcome = outcomeParts.join(" ").trim();
    if (!outcome) {
      process.stderr.write('Usage: ezy plan "<outcome>" [--local-only]\n');
      return 1;
    }
    const report = await planOutcome(outcome, {
      localOnly: flags.has("--local-only"),
    });
    process.stdout.write(formatPlan(report) + "\n");
    return 0;
  }

  if (command === "install") {
    return handleInstall(args.slice(1));
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
