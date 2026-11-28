#!/usr/bin/env node
import { realpathSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  analyzeProject,
  buildProjectSummary,
  formatBriefInstructions,
  loadBrief,
  type Brief,
  buildHandoff,
  buildInstallPreview,
  composeHandoffFromItems,
  findProjectRoot,
  formatAnalysis,
  formatBrainEnrichInstructions,
  computeFingerprint,
  formatBrainHuman,
  formatDoctor,
  formatHandoff,
  formatInspect,
  formatInstallPreview,
  formatInstallResult,
  formatPlan,
  formatRecommend,
  formatSearch,
  inspectSkill,
  isBrainStale,
  loadBrainFile,
  planOutcome,
  refreshBrainProject,
  recommendSkills,
  runDoctor,
  runInstall,
  searchSkills,
} from "@make-it-ezy/core";
import { confirmYesNo, selectWithArrows, type SelectChoice } from "./select.js";

const HELP = `Make It Ezy — local-first capability and context decision layer for coding tasks

Usage:
  ezy --help
  ezy doctor
  ezy analyze
  ezy search <query> [--local-only]
  ezy inspect <skill> [--local-only]
  ezy recommend <query> [--local-only]
  ezy brief "<outcome>"
  ezy brain
  ezy brain refresh
  ezy brain enrich
  ezy plan "<outcome>" [--brief <path>] [--local-only]
  ezy next "<outcome>" [--brief <path>] [--local-only]
  ezy install <skill> [--yes] [--source owner/repo] [--local-only]
  ezy install --plan "<outcome>" [--brief <path>] [--yes] [--local-only]
  ezy install --query "<topic>" [--yes] [--local-only]

Commands:
  doctor      Check Node, pnpm, Git, OS, and project root
  analyze     Read-only project/environment inspection
  search      Discover skills (local + skills.sh). Never installs.
  inspect     Inspect a skill (local files, provenance, risk; skills.sh lookup unless --local-only)
  recommend   Shortlist Recommended / Optional / Not needed. Never installs.
  brief       Print instructions for the agent to research and write .ezy/brief.json
  brain       Show .ezy/brain.json (machine slice + optional agent slice)
  brain refresh  Rewrite machine slice from analyze (preserves valid agent slice)
  brain enrich   Print instructions for the agent to maintain brain agent slice
  plan        Outcome + project → requirements + minimum skill set. Never installs/runs.
  next        Paste-ready checklist + agent prompt (does not install/run).
  install     Suggest-then-go install into .agents/skills (arrow-pick on TTY).

Flags:
  --local-only   Skip skills.sh network lookups (search/inspect/recommend/plan/next/install)
  --yes, -y      Approve install without interactive confirm
  --source       Explicit skills source (owner/repo)
  --brief        Use an agent-written brief (JSON) instead of heuristics
  --plan         Build candidate list from ezy plan
  --query        Build candidate list from ezy recommend

Flow: ANALYZE → REQUIREMENTS → DISCOVER → FILTER → PLAN → INSTALL → NEXT
Skill execution / outcome run is not in this slice.
`;

function extractBriefPath(args: string[]): { path?: string; missing: boolean; rest: string[] } {
  let path: string | undefined;
  let missing = false;
  const rest: string[] = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === undefined) continue;
    if (a === "--brief") {
      const next = args[i + 1];
      if (next === undefined || next.startsWith("--")) {
        missing = true;
      } else {
        path = next;
        i++;
      }
      continue;
    }
    if (a.startsWith("--brief=")) {
      const v = a.slice("--brief=".length);
      if (v) path = v;
      else missing = true;
      continue;
    }
    rest.push(a);
  }
  return { ...(path !== undefined ? { path } : {}), missing, rest };
}

function reportMissingBriefPath(): void {
  process.stderr.write("Invalid brief:\n- --brief requires a path\n");
}

/** Load a brief relative to cwd; prints errors and returns null on failure (exit 2). */
function loadBriefOrFail(path: string): { brief: Brief; notes: string[] } | null {
  const result = loadBrief(resolve(process.cwd(), path));
  if (!result.ok) {
    process.stderr.write("Invalid brief:\n" + result.errors.map((e) => `- ${e}`).join("\n") + "\n");
    return null;
  }
  return { brief: result.brief, notes: result.notes };
}

type InstallArgs = {
  brief?: Brief;
  briefNotes?: string[];
  yes: boolean;
  source?: string;
  plan?: string;
  query?: string;
  localOnly?: boolean;
  skill: string;
};

type ParseInstallArgsResult =
  | { ok: true; args: InstallArgs }
  | { ok: false; error: string };

function parseInstallArgs(args: string[]): ParseInstallArgsResult {
  let yes = false;
  let localOnly = false;
  let source: string | undefined;
  let plan: string | undefined;
  let query: string | undefined;
  const positional: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === undefined) {
      continue;
    }
    if (a === "--yes" || a === "-y") {
      yes = true;
      continue;
    }
    if (a === "--local-only") {
      localOnly = true;
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
      return { ok: false, error: `Unknown install flag: ${a}` };
    }
    positional.push(a);
  }

  return {
    ok: true,
    args: {
      yes,
      ...(localOnly ? { localOnly: true } : {}),
      ...(source ? { source } : {}),
      ...(plan ? { plan } : {}),
      ...(query ? { query } : {}),
      skill: positional.join(" ").trim(),
    },
  };
}

async function resolveInstallTarget(parsed: InstallArgs): Promise<{
  skillName: string;
  source?: string;
  code: number;
  planReport?: Awaited<ReturnType<typeof planOutcome>>;
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
      'Usage: ezy install <skill> [--yes] [--source owner/repo] [--local-only]\n' +
        '   or: ezy install --plan "<outcome>" [--brief <path>] [--yes] [--local-only]\n' +
        '   or: ezy install --query "<topic>" [--yes] [--local-only]\n',
    );
    return { skillName: "", code: 1 };
  }

  const choices: SelectChoice[] = [];
  const sourceByName = new Map<string, string>();
  let planReport: Awaited<ReturnType<typeof planOutcome>> | undefined;

  if (parsed.plan) {
    planReport = await planOutcome(parsed.plan, {
      ...(parsed.brief ? { brief: parsed.brief } : {}),
      ...(parsed.localOnly ? { localOnly: true } : {}),
    });
    for (const item of [...planReport.recommended, ...planReport.optional]) {
      const label = `${item.hit.name} (${item.hit.sourceKind}) — ${item.reason}`;
      if (!choices.some((c) => c.value === item.hit.name)) {
        choices.push({ value: item.hit.name, label });
        if (item.hit.source) {
          sourceByName.set(item.hit.name, item.hit.source);
        }
      }
    }
  } else if (parsed.query) {
    const report = await recommendSkills(parsed.query, {
      ...(parsed.localOnly ? { localOnly: true } : {}),
    });
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
    return { skillName: "", code: 1, ...(planReport ? { planReport } : {}) };
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
      return { skillName: "", code: 1, ...(planReport ? { planReport } : {}) };
    }
    process.stderr.write("Cancelled.\n");
    return { skillName: "", code: 1, ...(planReport ? { planReport } : {}) };
  }

  const fromMap = sourceByName.get(picked);
  return {
    skillName: picked,
    ...(parsed.source ? { source: parsed.source } : fromMap ? { source: fromMap } : {}),
    code: 0,
    ...(planReport ? { planReport } : {}),
  };
}

async function appendInstallHandoff(
  parsed: InstallArgs,
  planReport?: Awaited<ReturnType<typeof planOutcome>>,
): Promise<void> {
  if (parsed.plan) {
    const handoff = planReport
      ? composeHandoffFromItems(
          planReport.outcome,
          {
            capabilities: planReport.capabilities,
            projectSummary: planReport.project.projectRoot
              ? [planReport.project.packageName ?? planReport.project.projectRoot]
                  .concat(planReport.project.frameworks.length ? [planReport.project.frameworks.join(", ")] : [])
                  .join(" · ")
              : "no project markers (greenfield / empty)",
            recommended: planReport.recommended,
            optional: planReport.optional,
            coversByName: new Map(planReport.decisions.map((d) => [d.name.toLowerCase(), d.covers])),
            basis: planReport.basis,
            research: planReport.research,
            uncovered: planReport.uncovered,
            excluded: planReport.excluded,
            notes: planReport.notes,
            contractors: planReport.contractors,
          },
          { cwd: process.cwd() },
        )
      : await buildHandoff(parsed.plan, {
          ...(parsed.brief ? { brief: parsed.brief } : {}),
          ...(parsed.localOnly ? { localOnly: true } : {}),
        });
    if (parsed.briefNotes?.length) {
      handoff.notes.push(...parsed.briefNotes);
    }
    process.stdout.write("\n" + formatHandoff(handoff) + "\n");
    return;
  }
  if (parsed.query) {
    const rec = await recommendSkills(parsed.query, {
      ...(parsed.localOnly ? { localOnly: true } : {}),
    });
    const handoff = composeHandoffFromItems(parsed.query, {
      recommended: rec.recommended,
      optional: rec.optional,
    });
    process.stdout.write("\n" + formatHandoff(handoff) + "\n");
  }
}

export async function handleInstall(argv: string[]): Promise<number> {
  const { path: briefPath, missing, rest } = extractBriefPath(argv);
  if (missing) {
    reportMissingBriefPath();
    return 2;
  }
  const parsedResult = parseInstallArgs(rest);
  if (!parsedResult.ok) {
    process.stderr.write(parsedResult.error + "\n");
    return 1;
  }
  const parsed = parsedResult.args;
  if (briefPath !== undefined) {
    const loaded = loadBriefOrFail(briefPath);
    if (!loaded) return 2;
    parsed.brief = loaded.brief;
    parsed.briefNotes = loaded.notes;
  }
  const target = await resolveInstallTarget(parsed);
  if (target.code !== 0 || !target.skillName) {
    return target.code || 1;
  }

  const preview = await buildInstallPreview(target.skillName, {
    ...(target.source || parsed.source
      ? { source: target.source ?? parsed.source }
      : {}),
    ...(parsed.localOnly ? { localOnly: true } : {}),
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
    await appendInstallHandoff(parsed, target.planReport);
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
  if (result.ok) {
    await appendInstallHandoff(parsed, target.planReport);
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

  if (command === "brief") {
    const outcome = args.slice(1).filter((a) => !a.startsWith("--")).join(" ").trim();
    if (!outcome) {
      process.stderr.write('Usage: ezy brief "<outcome>"\n');
      return 1;
    }
    process.stdout.write(formatBriefInstructions(outcome, buildProjectSummary(process.cwd())) + "\n");
    return 0;
  }

  if (command === "brain") {
    const sub = args[1];
    const cwd = process.cwd();
    if (sub === "refresh") {
      const r = refreshBrainProject(cwd);
      if (!r.ok) {
        process.stderr.write(`brain refresh failed: ${r.reason}\n`);
        return 1;
      }
      process.stdout.write(formatBrainHuman(r.brain, { stale: false }) + "\n");
      return 0;
    }
    if (sub === "enrich") {
      process.stdout.write(formatBrainEnrichInstructions(buildProjectSummary(cwd)) + "\n");
      return 0;
    }
    if (sub !== undefined && sub !== "") {
      process.stderr.write("Usage: ezy brain | ezy brain refresh | ezy brain enrich\n");
      return 1;
    }
    const root = findProjectRoot(cwd);
    if (!root) {
      process.stderr.write("No project root found.\n");
      return 1;
    }
    const loaded = loadBrainFile(root);
    if (!loaded.ok) {
      process.stderr.write(`No brain file (${loaded.reason}). Run: ezy brain refresh\n`);
      return 1;
    }
    const stale = isBrainStale(loaded.brain, computeFingerprint(root));
    process.stdout.write(formatBrainHuman(loaded.brain, { stale }) + "\n");
    return 0;
  }

  if (command === "plan" || command === "next") {
    const { path: briefPath, missing, rest } = extractBriefPath(args.slice(1));
    if (missing) {
      reportMissingBriefPath();
      return 2;
    }
    const flags = new Set(rest.filter((a) => a.startsWith("--")));
    const outcome = rest.filter((a) => !a.startsWith("--")).join(" ").trim();
    if (!outcome) {
      process.stderr.write(`Usage: ezy ${command} "<outcome>" [--brief <path>] [--local-only]\n`);
      return 1;
    }
    let brief: Brief | undefined;
    let briefNotes: string[] = [];
    if (briefPath !== undefined) {
      const loaded = loadBriefOrFail(briefPath);
      if (!loaded) return 2;
      brief = loaded.brief;
      briefNotes = loaded.notes;
    }
    const opts = { localOnly: flags.has("--local-only"), ...(brief ? { brief } : {}) };
    if (command === "plan") {
      const report = await planOutcome(outcome, opts);
      if (briefPath !== undefined) report.briefPath = briefPath;
      report.notes.push(...briefNotes);
      process.stdout.write(formatPlan(report) + "\n");
    } else {
      const report = await buildHandoff(outcome, opts);
      report.notes.push(...briefNotes);
      process.stdout.write(formatHandoff(report) + "\n");
    }
    return 0;
  }

  if (command === "install") {
    return handleInstall(args.slice(1));
  }

  process.stderr.write(`Unknown command: ${command}\n\n${HELP}`);
  return 1;
}

function isCliEntrypoint(argv1: string | undefined): boolean {
  if (!argv1) return false;
  const argvHref = pathToFileURL(argv1).href;
  if (import.meta.url === argvHref) return true;
  try {
    return import.meta.url === pathToFileURL(realpathSync(argv1)).href;
  } catch {
    return false;
  }
}

if (isCliEntrypoint(process.argv[1])) {
  main(process.argv)
    .then((code) => {
      process.exitCode = code;
    })
    .catch((err: unknown) => {
      process.stderr.write(String(err instanceof Error ? err.stack ?? err.message : err) + "\n");
      process.exitCode = 1;
    });
}
