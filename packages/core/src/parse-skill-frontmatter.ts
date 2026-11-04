/**
 * Minimal YAML-ish frontmatter reader for Agent Skills SKILL.md files.
 * Only extracts simple `key: value` / folded `key: >` blocks we need for search.
 */
export type SkillFrontmatter = {
  name: string | null;
  description: string | null;
};

export function parseSkillFrontmatter(raw: string): SkillFrontmatter {
  if (!raw.startsWith("---")) {
    return { name: null, description: null };
  }

  const end = raw.indexOf("\n---", 3);
  if (end === -1) {
    return { name: null, description: null };
  }

  const block = raw.slice(3, end).trim();
  let name: string | null = null;
  let description: string | null = null;

  const lines = block.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    const nameMatch = /^name:\s*(.*)$/.exec(line);
    if (nameMatch) {
      name = stripQuotes(nameMatch[1] ?? "").trim() || null;
      continue;
    }

    const descMatch = /^description:\s*(.*)$/.exec(line);
    if (descMatch) {
      const rest = (descMatch[1] ?? "").trim();
      if (rest === ">" || rest === "|") {
        const collected: string[] = [];
        for (let j = i + 1; j < lines.length; j++) {
          const next = lines[j] ?? "";
          if (/^[a-zA-Z0-9_-]+:\s*/.test(next) && !/^\s/.test(next)) {
            break;
          }
          collected.push(next.replace(/^\s{2}/, ""));
          i = j;
        }
        description = collected.join(" ").replace(/\s+/g, " ").trim() || null;
      } else {
        description = stripQuotes(rest).trim() || null;
      }
    }
  }

  return { name, description };
}

function stripQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}
