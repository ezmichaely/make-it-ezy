export function tokenizeQuery(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^a-z0-9+]+/i)
    .map((t) => t.trim())
    .filter((t) => t.length > 1);
}

export const STOPWORDS: ReadonlySet<string> = new Set(
  "add change update make build create fix new app use using the a an to for with my this our in on of and".split(" "),
);

/** Query tokens minus stopwords, deduped, order kept. */
export function significantTokens(text: string): string[] {
  return [...new Set(tokenizeQuery(text).filter((t) => !STOPWORDS.has(t)))];
}

/** Lowercased name split on - _ / . and whitespace. */
export function nameTokens(name: string): string[] {
  return name
    .toLowerCase()
    .split(/[-_/.\s]+/)
    .filter((t) => t.length > 0);
}

/** Strip one trailing "s" from tokens of length >= 4 (not "ss"-ending) so plurals match singulars. */
export function stemToken(token: string): string {
  return token.length >= 4 && token.endsWith("s") && !token.endsWith("ss") ? token.slice(0, -1) : token;
}

function descriptionWords(description: string): Set<string> {
  return new Set(description.toLowerCase().split(/[^a-z0-9+]+/i).filter((t) => t.length > 0));
}

function scoreTokens(
  tokens: string[],
  name: string,
  description: string,
): { score: number; nameHits: string[]; descHits: string[] } {
  const nameStem = nameTokens(name).map(stemToken).join("-");
  const parts = new Set(nameTokens(name).map(stemToken));
  const words = new Set([...descriptionWords(description)].map(stemToken));
  let score = 0;
  const nameHits: string[] = [];
  const descHits: string[] = [];

  for (const raw of tokens) {
    const token = stemToken(raw);
    if (nameStem === token) {
      score += 10;
      nameHits.push(raw);
    } else if (parts.has(token)) {
      score += 6;
      nameHits.push(raw);
    } else if (words.has(token)) {
      score += 2;
      descHits.push(raw);
    }
  }

  return { score, nameHits, descHits };
}

/** Whole-token keyword score: name matches outweigh description matches. */
export function scoreSkillText(queryTokens: string[], name: string, description: string): number {
  const tokens = queryTokens.filter((t) => !STOPWORDS.has(t));
  return scoreTokens(tokens, name, description).score;
}

export function requirementRelevance(
  terms: string[],
  name: string,
  description: string,
): { score: number; nameHits: string[]; descHits: string[] } {
  return scoreTokens(significantTokens(terms.join(" ")), name, description);
}
