import type { SkillHit } from "./search-types.js";
import { scoreSkillText, tokenizeQuery } from "./score-skill.js";

type SkillsShHit = {
  id?: string;
  source?: string;
  skillId?: string;
  name?: string;
  installs?: number;
};

type SkillsShResponse = {
  query?: string;
  skills?: SkillsShHit[];
};

export type RemoteSearchResult = {
  hits: SkillHit[];
  error: string | null;
};

/**
 * Query the public skills.sh search API.
 * Network is optional — failures become soft errors, never crashes.
 */
export async function searchSkillsSh(
  query: string,
  options: { limit?: number; fetchImpl?: typeof fetch; timeoutMs?: number } = {},
): Promise<RemoteSearchResult> {
  const limit = options.limit ?? 10;
  const timeoutMs = options.timeoutMs ?? 8000;
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  if (typeof fetchImpl !== "function") {
    return { hits: [], error: "fetch is unavailable in this runtime" };
  }

  const url = `https://skills.sh/api/search?q=${encodeURIComponent(query)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const res = await fetchImpl(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      return { hits: [], error: `skills.sh HTTP ${res.status}` };
    }
    const data = (await res.json()) as SkillsShResponse;
    const tokens = tokenizeQuery(query);
    const hits: SkillHit[] = [];

    for (const item of data.skills ?? []) {
      const name = item.name ?? item.skillId ?? "unknown";
      const source = item.source ?? "unknown";
      const installs = typeof item.installs === "number" ? item.installs : null;
      const description = `${name} from ${source}`;
      const base = scoreSkillText(tokens, name, description);
      const installBoost = installs ? Math.min(3, Math.log10(installs + 1)) : 0;
      hits.push({
        id: item.id ?? `skills.sh:${source}/${name}`,
        name,
        description: `Catalog hit from ${source}`,
        source,
        sourceKind: "skills.sh",
        path: null,
        installs,
        score: base + installBoost,
        installedLocally: false,
        url: `https://skills.sh/${source}/${name}`,
      });
    }

    return {
      hits: hits.sort((a, b) => b.score - a.score || (b.installs ?? 0) - (a.installs ?? 0)).slice(0, limit),
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { hits: [], error: message };
  } finally {
    clearTimeout(timer);
  }
}
