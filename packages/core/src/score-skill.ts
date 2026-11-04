export function tokenizeQuery(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^a-z0-9+]+/i)
    .map((t) => t.trim())
    .filter((t) => t.length > 1);
}

/** Simple keyword score: name matches outweigh description matches. */
export function scoreSkillText(queryTokens: string[], name: string, description: string): number {
  if (queryTokens.length === 0) {
    return 0;
  }

  const nameL = name.toLowerCase();
  const descL = description.toLowerCase();
  let score = 0;

  for (const token of queryTokens) {
    if (nameL === token) {
      score += 10;
    } else if (nameL.includes(token)) {
      score += 6;
    }
    if (descL.includes(token)) {
      score += 2;
    }
  }

  return score;
}
