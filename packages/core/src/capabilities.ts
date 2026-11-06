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
    match: ["stripe", "payment", "payments", "billing", "subscription", "subscriptions", "checkout", "invoice"],
    capabilities: ["payments"],
  },
  {
    match: ["webhook", "webhooks", "callback", "callbacks"],
    capabilities: ["webhooks"],
  },
  {
    match: ["database", "db", "prisma", "postgres", "sql", "migration", "schema"],
    capabilities: ["database / state"],
  },
  {
    match: ["auth", "login", "oauth", "session", "nextauth"],
    capabilities: ["authentication"],
  },
  {
    match: ["security", "permission", "authorization", "secret"],
    capabilities: ["security review"],
  },
  {
    match: ["offline", "pwa", "service-worker", "worker", "indexeddb", "sync"],
    capabilities: ["offline / PWA"],
  },
  {
    match: ["code", "refactor", "debug", "review", "codebase", "repo"],
    capabilities: ["code understanding", "implementation", "verification / testing"],
  },
];

const MAX_CAPABILITIES = 5;

export type CapabilityMatch = {
  label: string;
  /** Outcome tokens that activated the lexicon entry; empty for token fallbacks. */
  matched: string[];
};

/**
 * Map a freeform outcome to 2–5 capabilities, keeping the outcome tokens that
 * activated each lexicon entry. Falls back to token-derived labels on a miss.
 */
export function extractCapabilityMatches(outcome: string): CapabilityMatch[] {
  const tokens = tokenizeQuery(outcome);
  if (!tokens.length) {
    return [];
  }

  const tokenSet = new Set(tokens);
  const found: CapabilityMatch[] = [];
  const seen = new Set<string>();

  for (const entry of LEXICON) {
    const matched = entry.match.filter((m) => tokenSet.has(m));
    if (!matched.length) {
      continue;
    }
    for (const cap of entry.capabilities) {
      const key = cap.toLowerCase();
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      found.push({ label: cap, matched });
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
  return (fallback.length ? fallback : tokens.slice(0, 2)).map((label) => ({ label, matched: [] }));
}

/** Map a freeform outcome to 2–5 capability labels. */
export function extractCapabilities(outcome: string): string[] {
  return extractCapabilityMatches(outcome).map((m) => m.label);
}
