import { tokenizeQuery } from "./score-skill.js";

type LexiconEntry = {
  /** Outcome tokens that activate this entry (any match). */
  match: string[];
  capabilities: string[];
};

/** Small explicit lexicon — easy to extend; not scraped. */
const LEXICON: LexiconEntry[] = [
  {
    match: ["video", "promotional", "promo", "film", "youtube", "reel", "animation"],
    capabilities: ["video scripting", "media generation", "editing / review"],
  },
  {
    match: ["saas", "dashboard", "frontend", "ui", "ux", "landing", "website", "webapp"],
    capabilities: ["frontend", "UI/UX", "testing"],
  },
  {
    match: ["structural", "engineer", "engineering", "beam", "load", "seismic"],
    capabilities: ["domain analysis", "calculation / verification", "report writing"],
  },
  {
    match: ["seo", "search-engine", "serp"],
    capabilities: ["SEO research", "content optimization"],
  },
  {
    match: ["research", "report", "investigate", "survey"],
    capabilities: ["research", "synthesis / report"],
  },
  {
    match: ["code", "refactor", "debug", "review", "codebase", "repo"],
    capabilities: ["code understanding", "implementation", "verification / testing"],
  },
];

const MAX_CAPABILITIES = 5;

/**
 * Map a freeform outcome to 2–5 capability labels.
 * Falls back to token-derived labels when the lexicon misses.
 */
export function extractCapabilities(outcome: string): string[] {
  const tokens = tokenizeQuery(outcome);
  if (!tokens.length) {
    return [];
  }

  const tokenSet = new Set(tokens);
  const found: string[] = [];
  const seen = new Set<string>();

  for (const entry of LEXICON) {
    if (!entry.match.some((m) => tokenSet.has(m))) {
      continue;
    }
    for (const cap of entry.capabilities) {
      const key = cap.toLowerCase();
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      found.push(cap);
      if (found.length >= MAX_CAPABILITIES) {
        return found;
      }
    }
  }

  if (found.length) {
    return found;
  }

  // Fallback: use distinctive tokens as pseudo-capabilities (skip tiny glue).
  const skip = new Set(["the", "a", "an", "me", "my", "for", "with", "and", "or", "to", "of", "in", "on"]);
  const fallback = tokens.filter((t) => !skip.has(t) && t.length > 2).slice(0, 3);
  return fallback.length ? fallback : tokens.slice(0, 2);
}
