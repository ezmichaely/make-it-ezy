import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseSkillFrontmatter } from "./parse-skill-frontmatter.js";
import type { SkillHit } from "./search-types.js";
import { scoreSkillText, tokenizeQuery } from "./score-skill.js";

type SkillsLock = {
  skills?: Record<
    string,
    {
      source?: string;
      skillPath?: string;
    }
  >;
};

export function loadSkillsLock(projectRoot: string): SkillsLock {
  const path = join(projectRoot, "skills-lock.json");
  if (!existsSync(path)) {
    return {};
  }
  try {
    return JSON.parse(readFileSync(path, "utf8")) as SkillsLock;
  } catch {
    return {};
  }
}

export function loadLocalSkills(projectRoot: string, query: string): SkillHit[] {
  const skillsDir = join(projectRoot, ".agents", "skills");
  if (!existsSync(skillsDir)) {
    return [];
  }

  const lock = loadSkillsLock(projectRoot);
  const tokens = tokenizeQuery(query);
  const hits: SkillHit[] = [];

  for (const entry of readdirSync(skillsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }
    const skillMd = join(skillsDir, entry.name, "SKILL.md");
    if (!existsSync(skillMd)) {
      continue;
    }

    let raw = "";
    try {
      raw = readFileSync(skillMd, "utf8");
    } catch {
      continue;
    }

    const fm = parseSkillFrontmatter(raw);
    const name = fm.name ?? entry.name;
    const description = fm.description ?? "";
    const lockMeta = lock.skills?.[entry.name] ?? lock.skills?.[name];
    const source = lockMeta?.source ?? "local";
    const score = scoreSkillText(tokens, name, description);
    if (tokens.length > 0 && score <= 0) {
      continue;
    }

    hits.push({
      id: `local:${source}/${name}`,
      name,
      description,
      source,
      sourceKind: "local",
      path: skillMd,
      installs: null,
      score: score + 1.5, // slight boost: already installed / inspectable
      installedLocally: true,
      url: source.includes("/") ? `https://github.com/${source}` : null,
    });
  }

  return hits.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}
