import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { findProjectRoot } from "./find-project-root.js";
import type { InspectFinding, SkillInspection } from "./inspect-types.js";
import { loadSkillsLock } from "./load-local-skills.js";
import { parseSkillFrontmatter } from "./parse-skill-frontmatter.js";
import { searchSkillsSh } from "./search-remote.js";

type LockEntry = {
  source?: string;
  skillPath?: string;
  computedHash?: string;
  installMode?: string;
};

function listSkillFiles(skillDir: string, max = 40): string[] {
  const out: string[] = [];

  const walk = (dir: string) => {
    if (out.length >= max) {
      return;
    }
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (out.length >= max) {
        break;
      }
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === ".git") {
          continue;
        }
        walk(full);
      } else if (entry.isFile()) {
        out.push(relative(skillDir, full));
      }
    }
  };

  walk(skillDir);
  return out.sort();
}

function scanFindings(skillDir: string, files: string[], rawSkillMd: string): InspectFinding[] {
  const findings: InspectFinding[] = [];
  const lowerMd = rawSkillMd.toLowerCase();

  const scripts = files.filter((f) => /\.(sh|bash|zsh|ps1|bat|cmd)$/i.test(f) || f.startsWith("scripts/"));
  if (scripts.length) {
    findings.push({
      id: "scripts-present",
      level: "medium",
      detail: `Contains script-like files (${scripts.slice(0, 5).join(", ")}${scripts.length > 5 ? ", …" : ""}). Inspect before running.`,
    });
  }

  if (/\b(curl|wget|fetch\(|http\.|https:\/\/|child_process|exec\(|spawn\()/i.test(rawSkillMd)) {
    findings.push({
      id: "network-or-exec-mentions",
      level: "medium",
      detail: "SKILL.md mentions network or process execution. Treat as untrusted until reviewed.",
    });
  }

  if (/\b(password|secret|api[_-]?key|token|credential)\b/i.test(rawSkillMd)) {
    findings.push({
      id: "secret-mentions",
      level: "high",
      detail: "SKILL.md mentions secrets/credentials. Do not run blindly.",
    });
  }

  if (lowerMd.includes("sudo ") || lowerMd.includes("rm -rf")) {
    findings.push({
      id: "destructive-commands",
      level: "high",
      detail: "SKILL.md mentions potentially destructive shell commands.",
    });
  }

  // package.json inside skill = dependency surface
  if (files.some((f) => f === "package.json" || f.endsWith("/package.json"))) {
    findings.push({
      id: "package-json",
      level: "medium",
      detail: "Skill directory includes package.json — review dependencies before install/use.",
    });
  }

  if (!findings.length) {
    findings.push({
      id: "no-obvious-red-flags",
      level: "low",
      detail: "No obvious high-risk patterns in a shallow scan. This is not a security audit.",
    });
  }

  return findings;
}

function resolveLocalSkillDir(projectRoot: string, query: string): string | null {
  const skillsDir = join(projectRoot, ".agents", "skills");
  if (!existsSync(skillsDir)) {
    return null;
  }

  const needle = query.trim().toLowerCase();
  const entries = readdirSync(skillsDir, { withFileTypes: true }).filter((e) => e.isDirectory());

  const exact = entries.find((e) => e.name.toLowerCase() === needle);
  if (exact) {
    return join(skillsDir, exact.name);
  }

  // match frontmatter name
  for (const entry of entries) {
    const skillMd = join(skillsDir, entry.name, "SKILL.md");
    if (!existsSync(skillMd)) {
      continue;
    }
    try {
      const fm = parseSkillFrontmatter(readFileSync(skillMd, "utf8"));
      if ((fm.name ?? "").toLowerCase() === needle) {
        return join(skillsDir, entry.name);
      }
    } catch {
      // skip unreadable
    }
  }

  // partial directory name match if unique
  const partial = entries.filter((e) => e.name.toLowerCase().includes(needle));
  const only = partial[0];
  if (partial.length === 1 && only) {
    return join(skillsDir, only.name);
  }

  return null;
}

export type InspectOptions = {
  cwd?: string;
  skipRemote?: boolean;
  fetchImpl?: typeof fetch;
};

export async function inspectSkill(query: string, options: InspectOptions = {}): Promise<SkillInspection> {
  const trimmed = query.trim();
  const notes = [
    "Inspection only — nothing was installed or executed.",
    "Shallow scan ≠ security audit. Read the skill before trusting it.",
  ];

  const empty = (extra: string[]): SkillInspection => ({
    found: false,
    query: trimmed,
    name: null,
    description: null,
    source: null,
    sourcePath: null,
    skillMdPath: null,
    contentHash: null,
    installMode: null,
    url: null,
    installedLocally: false,
    files: [],
    findings: [],
    remoteInstalls: null,
    remoteError: null,
    notes: [...notes, ...extra],
    bodyPreview: null,
  });

  if (!trimmed) {
    return empty(['Provide a skill name, e.g. ezy inspect ponytail']);
  }

  const cwd = options.cwd ?? process.cwd();
  const projectRoot = findProjectRoot(cwd) ?? cwd;
  const skillDir = resolveLocalSkillDir(projectRoot, trimmed);

  let remoteInstalls: number | null = null;
  let remoteError: string | null = null;

  if (!options.skipRemote) {
    const remote = await searchSkillsSh(trimmed, {
      limit: 5,
      ...(options.fetchImpl ? { fetchImpl: options.fetchImpl } : {}),
    });
    remoteError = remote.error;
    const match = remote.hits.find((h) => h.name.toLowerCase() === trimmed.toLowerCase()) ?? remote.hits[0];
    if (match?.installs != null) {
      remoteInstalls = match.installs;
    }
    if (remoteError) {
      notes.push(`skills.sh lookup unavailable: ${remoteError}`);
    }
  }

  if (!skillDir) {
    const result = empty([
      `No local skill named "${trimmed}" under .agents/skills.`,
      "Try: ezy search \"" + trimmed + "\" then install only after approval.",
    ]);
    result.remoteInstalls = remoteInstalls;
    result.remoteError = remoteError;
    return result;
  }

  const dirName = skillDir.split(/[/\\]/).pop() ?? trimmed;
  const skillMdPath = join(skillDir, "SKILL.md");
  let raw: string;
  try {
    raw = readFileSync(skillMdPath, "utf8");
  } catch {
    return empty([`Skill directory found (${dirName}) but SKILL.md is missing.`]);
  }
  const fm = parseSkillFrontmatter(raw);
  const lock = loadSkillsLock(projectRoot);
  const lockEntry = (lock.skills?.[dirName] ?? lock.skills?.[fm.name ?? ""] ?? {}) as LockEntry;
  const source = lockEntry.source ?? "local";
  const files = listSkillFiles(skillDir);
  const findings = scanFindings(skillDir, files, raw);

  // body preview: first non-frontmatter lines
  let bodyPreview: string | null = null;
  const fmEnd = raw.indexOf("\n---", 3);
  if (fmEnd !== -1) {
    bodyPreview = raw
      .slice(fmEnd + 4)
      .trim()
      .split("\n")
      .slice(0, 12)
      .join("\n");
  }

  return {
    found: true,
    query: trimmed,
    name: fm.name ?? dirName,
    description: fm.description,
    source,
    sourcePath: lockEntry.skillPath ?? null,
    skillMdPath,
    contentHash: lockEntry.computedHash ?? null,
    installMode: lockEntry.installMode ?? null,
    url: source.includes("/") ? `https://github.com/${source}` : null,
    installedLocally: true,
    files,
    findings,
    remoteInstalls,
    remoteError,
    notes,
    bodyPreview,
  };
}
