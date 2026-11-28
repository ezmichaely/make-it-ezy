import { findProjectRoot } from "./find-project-root.js";
import { loadLocalSkills } from "./load-local-skills.js";
import type { SearchReport, SkillHit } from "./search-types.js";
import type { SourceState } from "./skill-source.js";
import { SkillsShSource } from "./skills-sh-source.js";
import { GitHubSkillSource } from "./github-skill-source.js";

export type SearchOptions = {
  cwd?: string;
  /** Skip remote skill discovery. */
  localOnly?: boolean;
  /** Skip local .agents/skills. */
  remoteOnly?: boolean;
  limit?: number;
  fetchImpl?: typeof fetch;
  /** Sources to use. Defaults to skills.sh + github. */
  sources?: import("./skill-source.js").SkillSource[];
};

function mergeHits(local: SkillHit[], remote: SkillHit[]): SkillHit[] {
  const byKey = new Map<string, SkillHit>();

  for (const hit of local) {
    byKey.set(`${hit.source}/${hit.name}`.toLowerCase(), hit);
  }

  for (const hit of remote) {
    const key = `${hit.source}/${hit.name}`.toLowerCase();
    const existing = byKey.get(key);
    if (existing) {
      byKey.set(key, {
        ...existing,
        installs: hit.installs ?? existing.installs,
        url: existing.url ?? hit.url,
        score: Math.max(existing.score, hit.score) + 1,
        description: existing.description || hit.description,
      });
    } else {
      byKey.set(key, hit);
    }
  }

  return [...byKey.values()].sort(
    (a, b) => b.score - a.score || (b.installs ?? 0) - (a.installs ?? 0) || a.name.localeCompare(b.name),
  );
}

export async function searchSkills(query: string, options: SearchOptions = {}): Promise<SearchReport> {
  const trimmed = query.trim();
  const notes: string[] = [
    "Discovery only — nothing was installed.",
    "Inspect a skill before use. Popularity is not safety.",
  ];

  if (!trimmed) {
    return {
      query: trimmed,
      hits: [],
      localCount: 0,
      remoteCount: 0,
      remoteError: null,
      sourceStates: {},
      notes: [...notes, "Provide a search query, e.g. ezy search \"frontend design\"."],
    };
  }

  const cwd = options.cwd ?? process.cwd();
  const projectRoot = findProjectRoot(cwd) ?? cwd;
  const limit = options.limit ?? 12;

  const local = options.remoteOnly ? [] : loadLocalSkills(projectRoot, trimmed);
  let remote: SkillHit[] = [];
  const sourceStates: Record<string, SourceState> = {};
  let remoteError: string | null = null;

  if (!options.localOnly) {
    const sources = options.sources ?? [new SkillsShSource(), new GitHubSkillSource()];
    const results = await Promise.all(
        sources.map((s) =>
          options.fetchImpl
            ? s.discover(trimmed, { limit, fetchImpl: options.fetchImpl })
            : s.discover(trimmed, { limit }),
        ),
    );
    for (const r of results) {
      sourceStates[r.source] = r.state;
      remote = remote.concat(r.hits);
      if (r.error) {
        notes.push(`${r.source} search: ${r.state} (${r.error})`);
        remoteError ??= r.error;
      }
    }
  } else {
    notes.push("Local-only mode: remote sources were not queried.");
  }

  // Mark remote hits that are also installed locally
  const localNames = new Set(local.map((h) => `${h.source}/${h.name}`.toLowerCase()));
  remote = remote.map((hit) => ({
    ...hit,
    installedLocally: localNames.has(`${hit.source}/${hit.name}`.toLowerCase()),
  }));

  const merged = mergeHits(local, remote).slice(0, limit);

  return {
    query: trimmed,
    hits: merged,
    localCount: local.length,
    remoteCount: remote.length,
    remoteError,
    sourceStates,
    notes,
  };
}

// Re-export for backward compatibility
export { searchSkillsSh } from "./search-remote.js";
