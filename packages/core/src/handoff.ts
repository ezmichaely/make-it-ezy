import { join } from "node:path";
import { findProjectRoot } from "./find-project-root.js";
import type { ContractorRecommendation } from "./contractors.js";
import { isSkillInstalledLocally } from "./install.js";
import type { Brief, Exclusion, ResearchFinding } from "./brief-types.js";
import { planOutcome, preferRecommendItem } from "./plan.js";
import type { Requirement } from "./plan-types.js";
import type { RecommendItem } from "./recommend-types.js";
import type { SearchOptions } from "./search.js";
import type { HandoffReport, HandoffSkill, WorkflowStage } from "./handoff-types.js";

export type BuildHandoffOptions = SearchOptions & { cwd?: string; brief?: Brief };

export type HandoffItemInput = {
  capabilities?: string[];
  projectSummary?: string | null;
  recommended: RecommendItem[];
  optional: RecommendItem[];
  /** Covered requirement labels per skill name (lowercased key). */
  coversByName?: Map<string, string[]>;
  basis?: "brief" | "heuristic";
  research?: ResearchFinding[];
  uncovered?: Requirement[];
  excluded?: Exclusion[];
  /** Extra notes (e.g. plan notes) merged into handoff notes, deduped. */
  notes?: string[];
  contractors?: ContractorRecommendation[];
};

function summarizeForPrompt(project: {
  projectRoot: string | null;
  packageName: string | null;
  frameworks: string[];
}): string | null {
  if (!project.projectRoot) {
    return "no project markers (greenfield / empty)";
  }
  const parts = [project.packageName ?? project.projectRoot];
  if (project.frameworks.length) {
    parts.push(project.frameworks.join(", "));
  }
  return parts.join(" · ");
}

function skillPath(projectRoot: string, name: string): string {
  return join(projectRoot, ".agents", "skills", name);
}

function buildWorkflow(
  contractors: ContractorRecommendation[],
  skills: HandoffSkill[],
  uncovered: Requirement[],
  outcome: string,
): WorkflowStage[] {
  const stages: WorkflowStage[] = [];
  let order = 1;

  const primary = contractors[0];
  if (primary) {
    stages.push({
      type: "contractor",
      order: order++,
      task: outcome,
      reason: primary.reason,
      contractorName: primary.contractor.name,
      contractorSource: primary.contractor.source,
    });
  }

  for (const s of skills.filter((sk) => sk.bucket === "recommended")) {
    const task = s.covers.length > 0 ? `Address: ${s.covers.join(", ")}` : outcome;
    stages.push({
      type: "skill",
      order: order++,
      task,
      reason: s.reason,
      skillName: s.name,
      skillSource: s.source,
      installed: s.installed,
    });
  }

  for (const u of uncovered) {
    stages.push({
      type: "custom",
      order: order++,
      task: u.label,
      reason: u.rationale,
      instructions: `No catalog skill covers "${u.label}". Perform this work directly: ${u.rationale}`,
    });
  }

  return stages;
}

function appendWorkflowToPrompt(lines: string[], workflow: WorkflowStage[]): void {
  if (!workflow.length) return;

  lines.push("", "Workflow (run in order):");
  for (const stage of workflow) {
    if (stage.type === "contractor") {
      lines.push(
        `${stage.order}. Contractor ${stage.contractorName} (${stage.contractorSource}) — ${stage.reason}`,
      );
      lines.push(
        `   Route to the contractor as one unit. Load its skills under .agents/skills/ and follow its own process (e.g. brainstorming before implementation). Context: ${stage.task}`,
      );
    } else if (stage.type === "skill") {
      const install = stage.installed ? "" : " (install first)";
      lines.push(
        `${stage.order}. Skill ${stage.skillName} (${stage.skillSource})${install} — ${stage.task}`,
      );
    } else {
      lines.push(`${stage.order}. Uncovered — ${stage.task}: ${stage.instructions}`);
    }
  }
  lines.push(
    "",
    "Carry results from each stage forward. Do not treat the contractor as a single atomic skill install.",
  );
}

function buildPrompt(
  outcome: string,
  skills: HandoffSkill[],
  projectSummary?: string | null,
  research: ResearchFinding[] = [],
  uncovered: Requirement[] = [],
  workflow: WorkflowStage[] = [],
): string {
  const recommended = skills.filter((s) => s.bucket === "recommended");
  const optional = skills.filter((s) => s.bucket === "optional");

  const lines = [`Outcome: ${outcome}`];
  if (projectSummary) {
    lines.push("", `Project: ${projectSummary}`);
  }
  if (research.length) {
    lines.push("", "Research:");
    for (const r of research) {
      lines.push(`- ${r.kind} · ${r.finding}${r.source ? ` (${r.source})` : ""}`);
    }
  }

  appendWorkflowToPrompt(lines, workflow);

  lines.push("", "Use these skills (read each SKILL.md):");

  if (!recommended.length) {
    lines.push("- (none recommended yet)");
  } else {
    for (const s of recommended) {
      const loc = s.installed
        ? (s.path ?? "(path unknown)")
        : `${s.path ?? "(path unknown)"} (install first)`;
      lines.push(`- ${s.name} (${s.source}) — ${loc}`);
    }
  }

  if (optional.length) {
    lines.push("");
    lines.push("Optional (only if needed):");
    for (const s of optional) {
      const loc = s.installed
        ? (s.path ?? "(path unknown)")
        : `${s.path ?? "(path unknown)"} (install first)`;
      lines.push(`- ${s.name} (${s.source}) — ${loc}`);
    }
  }

  const withCovers = skills.filter((s) => s.covers.length);
  if (withCovers.length) {
    lines.push("");
    lines.push("Why these skills:");
    for (const s of withCovers) {
      lines.push(`- ${s.name} → ${s.covers.join(", ")}`);
    }
  }

  if (uncovered.length) {
    lines.push("");
    for (const u of uncovered) {
      lines.push(`Uncovered (handle directly): ${u.label} — ${u.rationale}`);
    }
  }

  lines.push("");
  lines.push("Follow each skill's SKILL.md. Prefer verified/low-risk; do not invent skills.");
  return lines.join("\n");
}

function dedupeItems(items: RecommendItem[]): RecommendItem[] {
  const byName = new Map<string, RecommendItem>();
  for (const item of items) {
    const key = item.hit.name.toLowerCase();
    const existing = byName.get(key);
    byName.set(key, existing ? preferRecommendItem(existing, item) : item);
  }
  return [...byName.values()];
}

function mapItems(
  items: RecommendItem[],
  bucket: "recommended" | "optional",
  cwd: string,
  projectRoot: string,
  coversByName: Map<string, string[]>,
): HandoffSkill[] {
  return dedupeItems(items).map((item) => {
    const installed = isSkillInstalledLocally(item.hit.name, cwd);
    return {
      name: item.hit.name,
      source: item.hit.source || "(unknown)",
      reason: item.reason,
      installed,
      path: skillPath(projectRoot, item.hit.name),
      bucket,
      covers: coversByName.get(item.hit.name.toLowerCase()) ?? [],
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
  const contractors = items.contractors ?? [];

  if (!trimmed) {
    return {
      outcome: "",
      capabilities: [],
      skills: [],
      checklist: [],
      prompt: "",
      basis: "heuristic",
      research: [],
      uncovered: [],
      excluded: [],
      workflow: [],
      contractors: [],
      notes: [...BASE_NOTES, 'Provide an outcome, e.g. ezy next "Build a SaaS dashboard".'],
    };
  }

  const cwd = options.cwd ?? process.cwd();
  const projectRoot = findProjectRoot(cwd) ?? cwd;
  // Recommended wins if the same name also appears optional
  const optionalOnly = items.optional.filter(
    (o) => !items.recommended.some((r) => r.hit.name.toLowerCase() === o.hit.name.toLowerCase()),
  );
  const coversByName = items.coversByName ?? new Map<string, string[]>();
  const skills = [
    ...mapItems(items.recommended, "recommended", cwd, projectRoot, coversByName),
    ...mapItems(optionalOnly, "optional", cwd, projectRoot, coversByName),
  ];

  const uncovered = items.uncovered ?? [];
  const workflow = buildWorkflow(contractors, skills, uncovered, trimmed);

  const checklist: string[] = [];
  const seenInstall = new Set<string>();
  for (const s of skills) {
    if (s.bucket === "recommended" && !s.installed && !seenInstall.has(s.name)) {
      seenInstall.add(s.name);
      checklist.push(`ezy install ${s.name} --source ${s.source}`);
    }
  }
  if (workflow.length) {
    checklist.push("Follow the Workflow section in order (contractor → skills → uncovered)");
  }
  checklist.push("Paste the prompt below into your agent");

  return {
    outcome: trimmed,
    capabilities: items.capabilities ?? [],
    skills,
    checklist,
    prompt: buildPrompt(
      trimmed,
      skills,
      items.projectSummary,
      items.research ?? [],
      uncovered,
      workflow,
    ),
    notes: [...new Set([...BASE_NOTES, ...(items.notes ?? [])])],
    basis: items.basis ?? "heuristic",
    research: items.research ?? [],
    uncovered,
    excluded: items.excluded ?? [],
    workflow,
    contractors,
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
      projectSummary: summarizeForPrompt(plan.project),
      recommended: plan.recommended,
      optional: plan.optional,
      coversByName: new Map(plan.decisions.map((d) => [d.name.toLowerCase(), d.covers])),
      basis: plan.basis,
      research: plan.research,
      uncovered: plan.uncovered,
      excluded: plan.excluded,
      notes: plan.notes,
      contractors: plan.contractors,
    },
    { cwd },
  );
}