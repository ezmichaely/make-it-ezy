import { extractCapabilities } from "./capabilities.js";
import { recommendSkills } from "./recommend.js";
import type { RecommendItem } from "./recommend-types.js";
import type { SearchOptions } from "./search.js";
import type { PlanReport } from "./plan-types.js";

const RECOMMENDED_MAX = 4;
const OPTIONAL_MAX = 4;
const TOTAL_CAP = 8;

/** Prefer local / higher score / more installs — same skill name from many sources collapses to one. */
export function preferRecommendItem(a: RecommendItem, b: RecommendItem): RecommendItem {
  if (a.hit.installedLocally !== b.hit.installedLocally) {
    return a.hit.installedLocally ? a : b;
  }
  if (a.hit.sourceKind !== b.hit.sourceKind) {
    return a.hit.sourceKind === "local" ? a : b;
  }
  if (a.hit.score !== b.hit.score) {
    return a.hit.score > b.hit.score ? a : b;
  }
  if ((a.hit.installs ?? 0) !== (b.hit.installs ?? 0)) {
    return (a.hit.installs ?? 0) > (b.hit.installs ?? 0) ? a : b;
  }
  return a;
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

function defaultNotNeeded(capabilities: string[]): string[] {
  const joined = capabilities.join(" ").toLowerCase();
  const hints = [
    "multi-agent swarm — start with the minimum skill set first",
    "vector database — not required for planning/discovery",
  ];
  if (/frontend|ui\/ux|video|media/.test(joined)) {
    hints.push("full autonomous research pipeline — overkill for this outcome");
  }
  return hints;
}

export async function planOutcome(
  outcome: string,
  options: SearchOptions = {},
): Promise<PlanReport> {
  const trimmed = outcome.trim();
  const baseNotes = [
    "Discovery only — nothing was installed or executed.",
    "Heuristic planning, not a model.",
    "Installation / run = Phase 4 (suggest-then-go).",
  ];

  if (!trimmed) {
    return {
      outcome: "",
      capabilities: [],
      recommended: [],
      optional: [],
      notNeeded: [],
      notes: [...baseNotes, 'Provide an outcome, e.g. ezy plan "Create a promotional video".'],
    };
  }

  const capabilities = extractCapabilities(trimmed);
  const queries = capabilities.length ? capabilities : [trimmed];

  const collected: RecommendItem[] = [];
  const extraNotes: string[] = [];

  for (const query of queries.slice(0, 4)) {
    const report = await recommendSkills(query, {
      ...options,
      limit: options.limit ?? 8,
    });
    collected.push(...report.recommended, ...report.optional);
    for (const n of report.notes) {
      if (n.includes("unavailable") && !extraNotes.includes(n)) {
        extraNotes.push(n);
      }
    }
  }

  const merged = mergeItems(collected).slice(0, TOTAL_CAP);
  const recommended = merged.slice(0, RECOMMENDED_MAX);
  const optional = merged.slice(RECOMMENDED_MAX, RECOMMENDED_MAX + OPTIONAL_MAX);

  const notes = [...baseNotes, ...extraNotes];
  if (options.localOnly) {
    notes.push("Local-only mode: skills.sh was not queried.");
  }
  if (!merged.length) {
    notes.push(
      "No matching skills found — try installing relevant skills locally or broaden the outcome.",
    );
  }

  return {
    outcome: trimmed,
    capabilities,
    recommended,
    optional,
    notNeeded: defaultNotNeeded(capabilities),
    notes,
  };
}
