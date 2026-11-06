import type { Exclusion } from "./brief-types.js";
import type { Requirement } from "./plan-types.js";
import { nameTokens, requirementRelevance, significantTokens } from "./score-skill.js";
import type { SkillHit } from "./search-types.js";

const RECOMMENDED_MAX = 4;
const TOTAL_CAP = 8;
const COVERED_AT = 4;

export type Candidate = { hit: SkillHit; covers: string[]; relevance: number; evidence: string[] };
export type Selection = {
  recommended: Candidate[];
  optional: Candidate[];
  excluded: Exclusion[];
  uncovered: Requirement[];
  filteredCount: number;
};

/** Prefer installed / local / higher score / more installs — same skill name from many sources collapses to one. */
export function preferHit(a: SkillHit, b: SkillHit): SkillHit {
  if (a.installedLocally !== b.installedLocally) {
    return a.installedLocally ? a : b;
  }
  if (a.sourceKind !== b.sourceKind) {
    return a.sourceKind === "local" ? a : b;
  }
  if (a.score !== b.score) {
    return a.score > b.score ? a : b;
  }
  if ((a.installs ?? 0) !== (b.installs ?? 0)) {
    return (a.installs ?? 0) > (b.installs ?? 0) ? a : b;
  }
  return a;
}

export function scoreCandidates(hits: SkillHit[], requirements: Requirement[]): Candidate[] {
  const byName = new Map<string, SkillHit>();
  for (const h of hits) {
    const key = h.name.toLowerCase();
    const existing = byName.get(key);
    byName.set(key, existing ? preferHit(existing, h) : h);
  }
  return [...byName.values()].map((h) => {
    const covers: string[] = [];
    const evidence: string[] = [];
    let relevance = 0;
    for (const r of requirements) {
      const rel = requirementRelevance(r.searchTerms ?? [r.label], h.name, h.description);
      if (rel.score < COVERED_AT) continue;
      covers.push(r.id);
      relevance += rel.score;
      const parts = [
        ...rel.nameHits.map((t) => `name matches "${t}"`),
        ...rel.descHits.map((t) => `description matches "${t}"`),
      ];
      evidence.push(parts.join("; "));
    }
    return { hit: h, covers, relevance, evidence };
  });
}

export function matchesExclusion(hit: SkillHit, exclusion: Exclusion): boolean {
  const wanted = significantTokens(exclusion.label);
  if (wanted.length === 0) return false;
  const have = new Set([...nameTokens(hit.name), ...significantTokens(hit.description)]);
  return wanted.every((t) => have.has(t));
}

function rank(a: Candidate, b: Candidate): number {
  const local = (c: Candidate): number => (c.hit.installedLocally || c.hit.sourceKind === "local" ? 1 : 0);
  return (
    local(b) - local(a) ||
    b.relevance - a.relevance ||
    (b.hit.installs ?? 0) - (a.hit.installs ?? 0) ||
    (a.hit.name < b.hit.name ? -1 : a.hit.name > b.hit.name ? 1 : 0)
  );
}

function greedy(pool: Candidate[], ids: Set<string>, limit: number): Candidate[] {
  const picked: Candidate[] = [];
  const remaining = new Set(ids);
  const rest = [...pool];
  while (picked.length < limit && remaining.size > 0) {
    let best: Candidate | undefined;
    let bestGain = 0;
    for (const c of rest) {
      const gain = c.covers.filter((id) => remaining.has(id)).length;
      if (gain === 0) continue;
      if (gain > bestGain || (gain === bestGain && best !== undefined && rank(c, best) < 0)) {
        best = c;
        bestGain = gain;
      }
    }
    if (!best) break;
    picked.push(best);
    rest.splice(rest.indexOf(best), 1);
    for (const id of best.covers) remaining.delete(id);
  }
  return picked;
}

export function selectCapabilities(
  candidates: Candidate[],
  requirements: Requirement[],
  exclusions: Exclusion[],
): Selection {
  const covering = candidates.filter((c) => c.covers.length > 0);
  const filteredCount = candidates.length - covering.length;

  const excluded: Exclusion[] = [];
  const seenLabels = new Set<string>();
  for (const e of exclusions) {
    const key = e.label.toLowerCase();
    if (seenLabels.has(key)) continue;
    seenLabels.add(key);
    excluded.push(e);
  }
  const pool: Candidate[] = [];
  for (const c of covering) {
    const hitBy = exclusions.find((e) => matchesExclusion(c.hit, e));
    if (hitBy) {
      excluded.push({ label: c.hit.name, why: `matches exclusion: ${hitBy.label}` });
    } else {
      pool.push(c);
    }
  }

  const requiredIds = new Set(requirements.filter((r) => r.priority === "required").map((r) => r.id));
  const recommended = greedy(pool, requiredIds, RECOMMENDED_MAX);
  const coveredByRec = new Set(recommended.flatMap((c) => c.covers));

  const stillRequired = new Set([...requiredIds].filter((id) => !coveredByRec.has(id)));
  const rest = pool.filter((c) => !recommended.includes(c));
  const optionalLimit = TOTAL_CAP - recommended.length;
  const optional = greedy(rest, stillRequired, optionalLimit);
  const coveredByOpt = new Set(optional.flatMap((c) => c.covers));
  const optionalIds = new Set(
    requirements
      .filter((r) => r.priority === "optional" && !coveredByRec.has(r.id) && !coveredByOpt.has(r.id))
      .map((r) => r.id),
  );
  optional.push(
    ...greedy(
      rest.filter((c) => !optional.includes(c)),
      optionalIds,
      optionalLimit - optional.length,
    ),
  );

  const covered = new Set([...coveredByRec, ...optional.flatMap((c) => c.covers)]);
  const uncovered = requirements.filter((r) => r.priority === "required" && !covered.has(r.id));
  return { recommended, optional, excluded, uncovered, filteredCount };
}

export function coverageReason(candidate: Candidate, requirements: Requirement[]): string {
  const labels = new Map(requirements.map((r) => [r.id, r.label]));
  const parts = candidate.covers.map(
    (id, i) => `covers ${id} (${labels.get(id) ?? id}): ${candidate.evidence[i] ?? ""}`,
  );
  const base = parts.join(" | ");
  return candidate.hit.installs == null ? base : `${base} · ${String(candidate.hit.installs)} installs`;
}
