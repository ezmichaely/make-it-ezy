import { join } from "node:path";
import { findProjectRoot } from "./find-project-root.js";
import { isSkillInstalledLocally } from "./install.js";
import { planOutcome } from "./plan.js";
import type { RecommendItem } from "./recommend-types.js";
import type { SearchOptions } from "./search.js";
import type { HandoffReport, HandoffSkill } from "./handoff-types.js";

export type BuildHandoffOptions = SearchOptions & { cwd?: string };

export type HandoffItemInput = {
  capabilities?: string[];
  recommended: RecommendItem[];
  optional: RecommendItem[];
};

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
    lines.push("- (none recommended yet)");
  } else {
    for (const s of recommended) {
      const loc = s.installed
        ? (s.path ?? "(path unknown)")
        : `${s.path ?? "(path unknown)"} (install first)`;
      lines.push(`- ${s.name} — ${loc}`);
    }
  }

  if (optional.length) {
    lines.push("");
    lines.push("Optional (only if needed):");
    for (const s of optional) {
      const loc = s.installed
        ? (s.path ?? "(path unknown)")
        : `${s.path ?? "(path unknown)"} (install first)`;
      lines.push(`- ${s.name} — ${loc}`);
    }
  }

  lines.push("");
  lines.push("Follow each skill's SKILL.md. Prefer verified/low-risk; do not invent skills.");
  return lines.join("\n");
}

function mapItems(
  items: RecommendItem[],
  bucket: "recommended" | "optional",
  cwd: string,
  projectRoot: string,
): HandoffSkill[] {
  return items.map((item) => {
    const installed = isSkillInstalledLocally(item.hit.name, cwd);
    return {
      name: item.hit.name,
      reason: item.reason,
      installed,
      path: skillPath(projectRoot, item.hit.name),
      bucket,
    };
  });
}

const BASE_NOTES = [
  "Handoff only — does not install or run skills.",
  "Paste the prompt into your agent after installing any missing recommended skills.",
];

/** Build handoff from an already-chosen recommend/plan shortlist (e.g. install --query). */
export function composeHandoffFromItems(
  outcome: string,
  items: HandoffItemInput,
  options: { cwd?: string } = {},
): HandoffReport {
  const trimmed = outcome.trim();
  if (!trimmed) {
    return {
      outcome: "",
      capabilities: [],
      skills: [],
      checklist: [],
      prompt: "",
      notes: [...BASE_NOTES, 'Provide an outcome, e.g. ezy next "Build a SaaS dashboard".'],
    };
  }

  const cwd = options.cwd ?? process.cwd();
  const projectRoot = findProjectRoot(cwd) ?? cwd;
  const skills = [
    ...mapItems(items.recommended, "recommended", cwd, projectRoot),
    ...mapItems(items.optional, "optional", cwd, projectRoot),
  ];

  const checklist: string[] = [];
  for (const s of skills) {
    if (s.bucket === "recommended" && !s.installed) {
      checklist.push(`ezy install ${s.name}`);
    }
  }
  checklist.push("Paste the prompt below into your agent");

  return {
    outcome: trimmed,
    capabilities: items.capabilities ?? [],
    skills,
    checklist,
    prompt: buildPrompt(trimmed, skills),
    notes: [...BASE_NOTES],
  };
}

export async function buildHandoff(
  outcome: string,
  options: BuildHandoffOptions = {},
): Promise<HandoffReport> {
  const cwd = options.cwd ?? process.cwd();
  const { cwd: _ignored, ...searchOpts } = options;
  const plan = await planOutcome(outcome, { ...searchOpts, cwd });

  if (!plan.outcome) {
    return composeHandoffFromItems("", { recommended: [], optional: [] }, { cwd });
  }

  return composeHandoffFromItems(
    plan.outcome,
    {
      capabilities: plan.capabilities,
      recommended: plan.recommended,
      optional: plan.optional,
    },
    { cwd },
  );
}
