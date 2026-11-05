import { join } from "node:path";
import { findProjectRoot } from "./find-project-root.js";
import { isSkillInstalledLocally } from "./install.js";
import { planOutcome } from "./plan.js";
import type { SearchOptions } from "./search.js";
import type { HandoffReport, HandoffSkill } from "./handoff-types.js";

export type BuildHandoffOptions = SearchOptions & { cwd?: string };

function skillPath(projectRoot: string, name: string): string {
  return join(projectRoot, ".agents", "skills", name);
}

function buildPrompt(outcome: string, skills: HandoffSkill[]): string {
  const recommended = skills.filter((s) => s.bucket === "recommended");
  const optional = skills.filter((s) => s.bucket === "optional");

  const lines = [
    `Outcome: ${outcome}`,
    "",
    "Use these skills (read each SKILL.md):",
  ];

  if (!recommended.length) {
    lines.push("- (none recommended yet — install skills first if checklist says so)");
  } else {
    for (const s of recommended) {
      const loc = s.installed && s.path ? s.path : "(not installed)";
      lines.push(`- ${s.name} — ${loc}`);
    }
  }

  if (optional.length) {
    lines.push("");
    lines.push("Optional (only if needed):");
    for (const s of optional) {
      const loc = s.installed && s.path ? s.path : "(not installed)";
      lines.push(`- ${s.name} — ${loc}`);
    }
  }

  lines.push("");
  lines.push("Follow each skill's SKILL.md. Prefer verified/low-risk; do not invent skills.");
  return lines.join("\n");
}

export async function buildHandoff(
  outcome: string,
  options: BuildHandoffOptions = {},
): Promise<HandoffReport> {
  const cwd = options.cwd ?? process.cwd();
  const { cwd: _ignored, ...searchOpts } = options;
  const plan = await planOutcome(outcome, { ...searchOpts, cwd });
  const notes = [
    "Handoff only — does not install or run skills.",
    "Paste the prompt into your agent after installing any missing recommended skills.",
  ];

  if (!plan.outcome) {
    return {
      outcome: "",
      capabilities: [],
      skills: [],
      checklist: [],
      prompt: "",
      notes: [...notes, 'Provide an outcome, e.g. ezy next "Build a SaaS dashboard".'],
    };
  }

  const projectRoot = findProjectRoot(cwd) ?? cwd;
  const skills: HandoffSkill[] = [];

  for (const item of plan.recommended) {
    const installed = isSkillInstalledLocally(item.hit.name, cwd);
    skills.push({
      name: item.hit.name,
      reason: item.reason,
      installed,
      path: installed ? skillPath(projectRoot, item.hit.name) : null,
      bucket: "recommended",
    });
  }
  for (const item of plan.optional) {
    const installed = isSkillInstalledLocally(item.hit.name, cwd);
    skills.push({
      name: item.hit.name,
      reason: item.reason,
      installed,
      path: installed ? skillPath(projectRoot, item.hit.name) : null,
      bucket: "optional",
    });
  }

  const checklist: string[] = [];
  for (const s of skills) {
    if (s.bucket === "recommended" && !s.installed) {
      checklist.push(`ezy install ${s.name}`);
    }
  }
  checklist.push("Paste the prompt below into your agent");

  return {
    outcome: plan.outcome,
    capabilities: plan.capabilities,
    skills,
    checklist,
    prompt: buildPrompt(plan.outcome, skills),
    notes,
  };
}
