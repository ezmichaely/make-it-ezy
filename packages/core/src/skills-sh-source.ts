import { searchSkillsSh } from "./search-remote.js";
import type { SkillSource, SourceResult, SourceState } from "./skill-source.js";

export class SkillsShSource implements SkillSource {
  readonly name = "skills.sh";

  async discover(
    query: string,
    options?: { limit?: number; fetchImpl?: typeof fetch },
  ): Promise<SourceResult> {
    const limit = options?.limit ?? 10;
    const result = options?.fetchImpl
      ? await searchSkillsSh(query, { limit, fetchImpl: options.fetchImpl })
      : await searchSkillsSh(query, { limit });
    let state: SourceState = "available";
    if (result.error) {
      const msg = result.error.toLowerCase();
      if (msg.includes("401") || msg.includes("403") || msg.includes("auth")) {
        state = "authentication_required";
      } else if (msg.includes("429") || msg.includes("rate")) {
        state = "rate_limited";
      } else if (msg.includes("fetch is unavailable") || msg.includes("network") || msg.includes("aborted")) {
        state = "unavailable";
      } else if (/http 5\d\d/.test(msg) || /http 4\d\d/.test(msg)) {
        // treat any non-2xx HTTP as unavailable-ish; 401/403/429 handled above
        state = "unavailable";
      } else {
        state = "error";
      }
    }
    return { source: this.name, state, hits: result.hits, error: result.error };
  }
}
