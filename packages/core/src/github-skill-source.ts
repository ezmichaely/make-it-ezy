import { sanitizeText } from "./brief.js";
import type { SkillHit } from "./search-types.js";
import type { SkillSource, SourceResult } from "./skill-source.js";

type GhCodeItem = {
  path?: string;
  html_url?: string;
  repository?: { full_name?: string };
};

type GhSearchResponse = { items?: GhCodeItem[] };

export class GitHubSkillSource implements SkillSource {
  readonly name = "github";

  async discover(
    query: string,
    options?: { limit?: number; fetchImpl?: typeof fetch },
  ): Promise<SourceResult> {
    const limit = options?.limit ?? 10;
    const fetchImpl = options?.fetchImpl ?? globalThis.fetch;
    if (typeof fetchImpl !== "function") {
      return { source: this.name, state: "unavailable", hits: [], error: "fetch is unavailable" };
    }
    const url = `https://api.github.com/search/code?q=${encodeURIComponent(query)}+filename:SKILL.md&per_page=${limit}`;
    try {
      const res = await fetchImpl(url, {
        headers: { Accept: "application/vnd.github+json", "User-Agent": "make-it-ezy" },
      });
      if (res.status === 401 || res.status === 403) {
        return { source: this.name, state: "authentication_required", hits: [], error: `GitHub HTTP ${res.status}` };
      }
      if (res.status === 429) {
        return { source: this.name, state: "rate_limited", hits: [], error: `GitHub HTTP 429` };
      }
      if (!res.ok) {
        return { source: this.name, state: "unavailable", hits: [], error: `GitHub HTTP ${res.status}` };
      }
      const data = (await res.json()) as GhSearchResponse;
      const hits: SkillHit[] = [];
      for (const item of data.items ?? []) {
        const repo = sanitizeText(item.repository?.full_name ?? "unknown");
        const path = sanitizeText(item.path ?? "");
        const parts = path.split("/");
        const candidate = parts.length > 1 ? (parts[parts.length - 2] ?? "unknown") : (parts[0] ?? "unknown");
        const name = sanitizeText(candidate);
        hits.push({
          id: `github:${repo}/${path}`,
          name,
          description: `GitHub SKILL.md in ${repo}`,
          source: repo,
          sourceKind: "github",
          path: path || null,
          installs: null,
          score: 1,
          installedLocally: false,
          url: item.html_url ?? null,
        });
      }
      return { source: this.name, state: "available", hits: hits.slice(0, limit), error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { source: this.name, state: "unavailable", hits: [], error: message };
    }
  }
}