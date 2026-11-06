import { analyzeProject } from "./analyze.js";
import { loadLocalSkills } from "./load-local-skills.js";
import type { Brief, Exclusion } from "./brief-types.js";
import { extractRequirements } from "./requirements.js";
import type { RecommendItem } from "./recommend-types.js";
import { coverageReason, preferHit, scoreCandidates, selectCapabilities, type Candidate } from "./select.js";
import { searchSkills, type SearchOptions } from "./search.js";
import type { SkillHit } from "./search-types.js";
import {
  EMPTY_PLAN_PROJECT,
  type CapabilityDecision,
  type PlanProjectSummary,
  type PlanReport,
  type Requirement,
} from "./plan-types.js";

const MAX_QUERIES = 10;

export type PlanOptions = SearchOptions & { brief?: Brief };

/** Prefer local / higher score / more installs — same skill name from many sources collapses to one. */
export function preferRecommendItem(a: RecommendItem, b: RecommendItem): RecommendItem {
  return preferHit(a.hit, b.hit) === a.hit ? a : b;
}

function summarizeProject(
  analysis: ReturnType<typeof analyzeProject>,
  localSkills: string[],
): PlanProjectSummary {
  return {
    projectRoot: analysis.projectRoot,
    packageName: analysis.packageJson.name,
    language: analysis.language,
    frameworks: analysis.frameworks
      .filter((f) => f.id !== "typescript")
      .map((f) => f.label),
    localSkills,
  };
}

function emptyReport(notes: string[]): PlanReport {
  return {
    outcome: "",
    capabilities: [],
    requirements: [],
    project: EMPTY_PLAN_PROJECT,
    decisions: [],
    recommended: [],
    optional: [],
    notNeeded: [],
    notes,
    basis: "heuristic",
    taskType: null,
    research: [],
    uncovered: [],
    excluded: [],
  };
}

export async function planOutcome(
  outcome: string,
  options: PlanOptions = {},
): Promise<PlanReport> {
  const trimmed = outcome.trim();
  const cwd = options.cwd ?? process.cwd();
  const brief = options.brief;
  const baseNotes = [
    "Discovery only — nothing was installed or executed.",
    brief
      ? "Basis: agent brief."
      : "Basis: heuristic fallback — run ezy brief for a researched plan.",
    "Installation uses suggest-then-go (ezy install).",
  ];

  if (!trimmed) {
    return emptyReport([
      ...baseNotes,
      'Provide an outcome, e.g. ezy plan "Create a promotional video".',
    ]);
  }

  const analysis = analyzeProject({ cwd });
  const projectRoot = analysis.projectRoot ?? cwd;
  const localSkills = loadLocalSkills(projectRoot, "").map((h) => h.name);
  const project = summarizeProject(analysis, localSkills);

  let requirements: Requirement[];
  let exclusions: Exclusion[];
  if (brief) {
    requirements = brief.requirements.map((r) => ({
      id: r.id,
      label: r.label,
      rationale: r.why,
      priority: r.priority,
      searchTerms: r.searchTerms,
    }));
    exclusions = brief.exclusions;
  } else {
    const extracted = extractRequirements(trimmed, analysis);
    requirements = extracted.requirements;
    exclusions = extracted.exclusions;
  }

  const ordered = [
    ...requirements.filter((r) => r.priority === "required"),
    ...requirements.filter((r) => r.priority === "optional"),
  ].slice(0, MAX_QUERIES);
  const queries = ordered.length
    ? ordered.map((r) => (r.searchTerms?.length ? r.searchTerms : [r.label]).join(" "))
    : [trimmed];

  const hits: SkillHit[] = [];
  const extraNotes: string[] = [];
  for (const query of queries) {
    const report = await searchSkills(query, { ...options, cwd, limit: options.limit ?? 12 });
    hits.push(...report.hits);
    for (const n of report.notes) {
      if (n.includes("unavailable") && !extraNotes.includes(n)) extraNotes.push(n);
    }
  }

  const selection = selectCapabilities(scoreCandidates(hits, requirements), requirements, exclusions);
  const toItem = (c: Candidate): RecommendItem => ({
    hit: c.hit,
    reason: coverageReason(c, requirements),
  });
  const decide = (c: Candidate, optional: boolean): CapabilityDecision => ({
    name: c.hit.name,
    source: c.hit.source,
    decision: optional
      ? "optional"
      : c.hit.installedLocally || c.hit.sourceKind === "local"
        ? "use"
        : "install",
    reason: coverageReason(c, requirements),
    covers: c.covers,
  });
  const decisions = [
    ...selection.recommended.map((c) => decide(c, false)),
    ...selection.optional.map((c) => decide(c, true)),
  ];
  const recommended = selection.recommended.map(toItem);
  const optional = selection.optional.map(toItem);

  const notNeeded = selection.excluded.map((e) => `${e.label} — ${e.why}`);
  if (selection.filteredCount > 0) {
    notNeeded.push(`low relevance: ${String(selection.filteredCount)} candidates filtered`);
  }

  const notes = [...baseNotes, ...extraNotes];
  if (brief && brief.outcome.trim().toLowerCase() !== trimmed.toLowerCase()) {
    notes.push("Brief outcome differs from CLI outcome; using CLI outcome.");
  }
  if (options.localOnly) {
    notes.push("Local-only mode: skills.sh was not queried.");
  }
  if (project.projectRoot) {
    notes.push(
      `Project-aware plan for ${project.packageName ?? project.projectRoot}` +
        (project.frameworks.length ? ` (${project.frameworks.join(", ")})` : "") +
        ".",
    );
  } else {
    notes.push("No project markers — planning from outcome only.");
  }
  if (!recommended.length && !optional.length) {
    notes.push(
      "No matching skills found — try installing relevant skills locally or broaden the outcome.",
    );
  }

  return {
    outcome: trimmed,
    capabilities: [
      ...requirements.filter((r) => r.priority === "required").map((r) => r.label),
      ...requirements.filter((r) => r.priority === "optional").map((r) => r.label),
    ],
    requirements,
    project,
    decisions,
    recommended,
    optional,
    notNeeded,
    notes,
    basis: brief ? "brief" : "heuristic",
    taskType: brief?.taskType ?? null,
    research: brief?.research ?? [],
    uncovered: selection.uncovered,
    excluded: selection.excluded,
  };
}
