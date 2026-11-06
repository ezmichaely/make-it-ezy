import { analyzeProject } from "./analyze.js";
import { loadLocalSkills } from "./load-local-skills.js";
import { recommendSkills } from "./recommend.js";
import { extractRequirements } from "./requirements.js";
import type { RecommendItem } from "./recommend-types.js";
import { preferHit } from "./select.js";
import type { SearchOptions } from "./search.js";
import {
  EMPTY_PLAN_PROJECT,
  type CapabilityDecision,
  type PlanProjectSummary,
  type PlanReport,
} from "./plan-types.js";

const RECOMMENDED_MAX = 4;
const OPTIONAL_MAX = 4;
const TOTAL_CAP = 8;

/** Prefer local / higher score / more installs — same skill name from many sources collapses to one. */
export function preferRecommendItem(a: RecommendItem, b: RecommendItem): RecommendItem {
  return preferHit(a.hit, b.hit) === a.hit ? a : b;
}

function mergeItems(items: RecommendItem[]): RecommendItem[] {
  const byName = new Map<string, RecommendItem>();
  for (const item of items) {
    const key = item.hit.name.toLowerCase();
    const existing = byName.get(key);
    byName.set(key, existing ? preferRecommendItem(existing, item) : item);
  }
  return [...byName.values()].sort(
    (a, b) =>
      b.hit.score - a.hit.score ||
      (b.hit.installs ?? 0) - (a.hit.installs ?? 0) ||
      a.hit.name.localeCompare(b.hit.name),
  );
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

function shouldSkipSkill(name: string, skipHints: string[]): string | null {
  const n = name.toLowerCase();
  if (n.includes("graphify") && skipHints.some((h) => h.toLowerCase().includes("graphify"))) {
    return "Skipped — Graphify not needed for this outcome/project.";
  }
  if (
    n.includes("superpowers") &&
    skipHints.some((h) => {
      const lower = h.toLowerCase();
      return lower.includes("swarm") || lower.includes("small ui");
    })
  ) {
    return "Skipped — heavyweight workflow not needed for this outcome.";
  }
  return null;
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
  };
}

export async function planOutcome(
  outcome: string,
  options: SearchOptions = {},
): Promise<PlanReport> {
  const trimmed = outcome.trim();
  const cwd = options.cwd ?? process.cwd();
  const baseNotes = [
    "Discovery only — nothing was installed or executed.",
    "Heuristic planning, not a model.",
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
  const { requirements, skipHints } = extractRequirements(trimmed, analysis);

  const queries = requirements.length
    ? requirements.filter((r) => r.priority === "required").map((r) => r.label)
    : [trimmed];
  const searchQueries = queries.length ? queries : [trimmed];

  const collected: RecommendItem[] = [];
  const extraNotes: string[] = [];

  for (const query of searchQueries.slice(0, 4)) {
    const report = await recommendSkills(query, {
      ...options,
      cwd,
      limit: options.limit ?? 8,
    });
    collected.push(...report.recommended, ...report.optional);
    for (const n of report.notes) {
      if (n.includes("unavailable") && !extraNotes.includes(n)) {
        extraNotes.push(n);
      }
    }
  }

  const merged = mergeItems(collected);
  const decisions: CapabilityDecision[] = [];
  const recommended: RecommendItem[] = [];
  const optional: RecommendItem[] = [];
  const skippedNames = new Set<string>();

  for (const item of merged) {
    const skipReason = shouldSkipSkill(item.hit.name, skipHints);
    if (skipReason) {
      decisions.push({
        name: item.hit.name,
        source: item.hit.source,
        decision: "skip",
        reason: skipReason,
      });
      skippedNames.add(item.hit.name.toLowerCase());
      continue;
    }

    const useOrInstall =
      item.hit.installedLocally || item.hit.sourceKind === "local" ? "use" : "install";

    if (recommended.length < RECOMMENDED_MAX && recommended.length + optional.length < TOTAL_CAP) {
      // Prefer local/strong into recommended
      const strong =
        item.hit.score >= 6 || item.hit.installedLocally || item.hit.sourceKind === "local";
      if (strong && recommended.length < RECOMMENDED_MAX) {
        recommended.push(item);
        decisions.push({
          name: item.hit.name,
          source: item.hit.source,
          decision: useOrInstall,
          reason: item.reason,
        });
      } else if (optional.length < OPTIONAL_MAX) {
        optional.push(item);
        decisions.push({
          name: item.hit.name,
          source: item.hit.source,
          decision: "optional",
          reason: item.reason,
        });
      }
    }
  }

  // Fill recommended from remaining if still empty but we have optional-quality matches
  if (!recommended.length && optional.length) {
    const promoted = optional.splice(0, Math.min(RECOMMENDED_MAX, optional.length));
    for (const item of promoted) {
      recommended.push(item);
      const d = decisions.find((x) => x.name === item.hit.name && x.decision === "optional");
      if (d) {
        d.decision =
          item.hit.installedLocally || item.hit.sourceKind === "local" ? "use" : "install";
      }
    }
  }

  const notNeeded = [
    ...skipHints,
    ...[...skippedNames].map((n) => `${n} — filtered out for this project/outcome`),
  ];

  const notes = [...baseNotes, ...extraNotes];
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

  const capabilities = [
    ...requirements.filter((r) => r.priority === "required").map((r) => r.label),
    ...requirements.filter((r) => r.priority === "optional").map((r) => r.label),
  ];

  return {
    outcome: trimmed,
    capabilities,
    requirements,
    project,
    decisions,
    recommended: recommended.slice(0, RECOMMENDED_MAX),
    optional: optional.slice(0, OPTIONAL_MAX),
    notNeeded,
    notes,
  };
}
