import { searchSkills, type SearchOptions } from "./search.js";
import { tokenizeQuery } from "./score-skill.js";
import type { SkillHit } from "./search-types.js";
import type { RecommendItem, RecommendReport } from "./recommend-types.js";

const BODY_CAP = 6;
const RECOMMENDED_MAX = 3;
const STRONG_SCORE = 6;

function reasonFor(hit: SkillHit): string {
  const parts: string[] = [];
  if (hit.installedLocally || hit.sourceKind === "local") {
    parts.push("already installed locally");
  } else {
    parts.push("skills.sh candidate");
  }
  if (hit.score >= STRONG_SCORE) {
    parts.push("strong match");
  } else if (hit.score > 0) {
    parts.push("partial match");
  }
  if (hit.installs != null && hit.installs >= 1000) {
    parts.push("high installs");
  }
  return parts.join("; ");
}

function notNeededForQuery(query: string, leftoverNames: string[]): string[] {
  const tokens = new Set(tokenizeQuery(query));
  const designish = ["frontend", "design", "ui", "ux"].some((t) => tokens.has(t));
  const hints: string[] = [];
  if (designish) {
    hints.push("multi-agent swarm — overkill for a focused UI/design task");
    hints.push("vector database — not required for skill discovery/recommendation");
  }
  for (const name of leftoverNames) {
    hints.push(`${name} — weak match for this query`);
  }
  if (!hints.length) {
    return ["(none from this candidate set)"];
  }
  return hints;
}

export async function recommendSkills(
  query: string,
  options: SearchOptions = {},
): Promise<RecommendReport> {
  const search = await searchSkills(query, { ...options, limit: options.limit ?? 12 });
  const baseNotes = [
    "Discovery only — nothing was installed.",
    "Popularity is not safety. Heuristic ranking, not a model.",
    "Next: ezy inspect <name> before use.",
  ];

  if (!search.query) {
    return {
      query: search.query,
      recommended: [],
      optional: [],
      notNeeded: [],
      notes: [...baseNotes, "Provide a search query, e.g. ezy recommend \"frontend design\"."],
    };
  }

  const body = search.hits.slice(0, BODY_CAP);
  const recommended: RecommendItem[] = [];
  const optional: RecommendItem[] = [];

  for (const hit of body) {
    const item = { hit, reason: reasonFor(hit) };
    const strong = hit.score >= STRONG_SCORE || hit.installedLocally || hit.sourceKind === "local";
    if (strong && recommended.length < RECOMMENDED_MAX) {
      recommended.push(item);
    } else {
      optional.push(item);
    }
  }

  const leftovers = search.hits.slice(BODY_CAP).map((h) => h.name);
  const notNeeded = notNeededForQuery(search.query, leftovers);

  const notes = [...baseNotes];
  if (search.remoteError) {
    notes.push(`Remote skills.sh search unavailable: ${search.remoteError}`);
  }
  if (options.localOnly) {
    notes.push("Local-only mode: skills.sh was not queried.");
  }
  if (!body.length) {
    notes.push("No skills matched — try a different query or install skills locally.");
  }

  return {
    query: search.query,
    recommended,
    optional,
    notNeeded,
    notes,
  };
}
