import { existsSync } from "node:fs";
import { join } from "node:path";
import { spawn as defaultSpawn, type SpawnOptions } from "node:child_process";
import { findProjectRoot } from "./find-project-root.js";
import { searchSkills } from "./search.js";
import { isExactRemoteSkillMatch } from "./search-remote.js";
import type { InstallPreview, InstallResult } from "./install-types.js";

export type BuildInstallPreviewOptions = {
  cwd?: string;
  /** Explicit skills source, e.g. anthropics/skills */
  source?: string;
  fetchImpl?: typeof fetch;
  /** Skip skills.sh network lookups when resolving source. */
  localOnly?: boolean;
};

export type RunInstallOptions = {
  cwd?: string;
  spawnImpl?: typeof defaultSpawn;
};

const SKILLS_INSTALLER_PACKAGE = "skills@1.9.1";

function skillsDir(projectRoot: string): string {
  return join(projectRoot, ".agents", "skills");
}

export function isSkillInstalledLocally(skillName: string, cwd = process.cwd()): boolean {
  const root = findProjectRoot(cwd) ?? cwd;
  const dir = join(skillsDir(root), skillName);
  return existsSync(join(dir, "SKILL.md")) || existsSync(dir);
}

export function validateInstallSkillName(name: string): string | null {
  if (!name) return "Skill name is required";
  if (name.startsWith("-")) return `Invalid skill name "${name}": must not start with '-'`;
  if (name.includes("/") || name.includes("\\") || name.includes("..")) {
    return `Invalid skill name "${name}": must be a single skill name`;
  }
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(name)) {
    return `Invalid skill name "${name}": use letters, numbers, '.', '_', or '-'`;
  }
  return null;
}

export function validateInstallSource(source: string): string | null {
  if (!source) return "Source is required";
  if (source.startsWith("-")) return `Invalid source "${source}": must not start with '-'`;
  if (source.includes("\\") || /\s/.test(source)) {
    return `Invalid source "${source}": expected owner/repo`;
  }
  const parts = source.split("/");
  if (parts.length !== 2 || parts.some((p) => !p || p === "." || p === "..")) {
    return `Invalid source "${source}": expected owner/repo`;
  }
  if (!parts.every((p) => /^[A-Za-z0-9_.-]+$/.test(p))) {
    return `Invalid source "${source}": owner/repo may contain letters, numbers, '.', '_', or '-'`;
  }
  return null;
}

function buildCommand(source: string, skillName: string): { command: string; args: string[] } {
  // npx --yes skills@<pinned> add <source> --skill <name>
  return {
    command: "npx",
    args: ["--yes", SKILLS_INSTALLER_PACKAGE, "add", source, "--skill", skillName],
  };
}

/**
 * Resolve source + destination for an install preview.
 * Does not install.
 */
export async function buildInstallPreview(
  skillName: string,
  options: BuildInstallPreviewOptions = {},
): Promise<InstallPreview> {
  const name = skillName.trim();
  const cwd = options.cwd ?? process.cwd();
  const projectRoot = findProjectRoot(cwd) ?? cwd;
  const destination = join(skillsDir(projectRoot), name);
  const notes = [
    "Suggest-then-go install — requires explicit approval (--yes or confirm).",
    "Skill execution / outcome run is not in this slice.",
  ];
  const riskNotes: string[] = [
    "Review SKILL.md after install. Popularity is not safety.",
  ];

  const nameError = validateInstallSkillName(name);
  if (nameError) {
    notes.push(nameError);
    return {
      skillName: name,
      source: "(invalid)",
      destination,
      projectRoot,
      alreadyInstalled: false,
      command: "npx --yes skills@<pinned> add <source> --skill <skill>",
      commandArgs: ["--yes", SKILLS_INSTALLER_PACKAGE, "add", "<source>", "--skill", "<skill>"],
      riskNotes,
      notes,
      url: null,
    };
  }

  const alreadyInstalled = isSkillInstalledLocally(name, cwd);
  let source = options.source?.trim() ?? "";
  let url: string | null = null;

  if (source) {
    const sourceError = validateInstallSource(source);
    if (sourceError) {
      notes.push(sourceError);
      return {
        skillName: name,
        source: "(invalid)",
        destination,
        projectRoot,
        alreadyInstalled,
        command: `npx --yes ${SKILLS_INSTALLER_PACKAGE} add <source> --skill ${name}`,
        commandArgs: ["--yes", SKILLS_INSTALLER_PACKAGE, "add", "<source>", "--skill", name],
        riskNotes,
        notes,
        url: null,
      };
    }
  }

  if (!source) {
    const report = await searchSkills(name, {
      cwd: projectRoot,
      limit: 8,
      ...(options.localOnly ? { localOnly: true } : {}),
      ...(options.fetchImpl ? { fetchImpl: options.fetchImpl } : {}),
    });
    const hit = report.hits.find((h) => isExactRemoteSkillMatch(h.name, name));
    if (hit?.source) {
      source = hit.source;
      url = hit.url;
      if (hit.sourceKind === "local" || hit.installedLocally) {
        notes.push("Matched a local/catalog hit; source taken from search metadata.");
      }
    } else if (report.hits.length > 0) {
      notes.push(
        `Remote search returned no exact name match for "${name}"; pass --source owner/repo.`,
      );
    }
    if (report.remoteError) {
      notes.push(`skills.sh lookup unavailable: ${report.remoteError}`);
    }
  } else {
    url = source.includes("/") ? `https://github.com/${source}` : null;
  }

  if (source) {
    const sourceError = validateInstallSource(source);
    if (sourceError) {
      notes.push(sourceError);
      source = "";
      url = null;
    }
  }

  if (!source) {
    notes.push(
      `Could not resolve a source for "${name}". Pass --source owner/repo (e.g. anthropics/skills).`,
    );
  }

  const { command, args } = source
    ? buildCommand(source, name)
    : { command: "npx", args: ["--yes", SKILLS_INSTALLER_PACKAGE, "add", "<source>", "--skill", name] };

  return {
    skillName: name,
    source: source || "(unresolved)",
    destination,
    projectRoot,
    alreadyInstalled,
    command: [command, ...args].join(" "),
    commandArgs: args,
    riskNotes,
    notes,
    url,
  };
}

function runSpawn(
  command: string,
  args: string[],
  opts: SpawnOptions,
  spawnImpl: typeof defaultSpawn,
): Promise<{ code: number | null; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const child = spawnImpl(command, args, {
      ...opts,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    // ChildProcess typings mark pipe streams as nullable; keep ?. for editor strictness.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- stdout typed Readable | null
    child.stdout?.on("data", (chunk: Buffer | string) => {
      stdout += String(chunk);
    });
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- stderr typed Readable | null
    child.stderr?.on("data", (chunk: Buffer | string) => {
      stderr += String(chunk);
    });
    child.on("error", (err) => {
      resolve({ code: 1, stdout, stderr: stderr || String(err) });
    });
    child.on("close", (code) => {
      resolve({ code, stdout, stderr });
    });
  });
}

/**
 * Run the previewed install command. Caller must enforce --yes / confirm first.
 */
export async function runInstall(
  preview: InstallPreview,
  options: RunInstallOptions = {},
): Promise<InstallResult> {
  if (preview.alreadyInstalled) {
    return {
      ok: true,
      skillName: preview.skillName,
      destination: preview.destination,
      alreadyInstalled: true,
      skipped: true,
      stdout: "",
      stderr: "",
      error: null,
    };
  }

  const nameError = validateInstallSkillName(preview.skillName);
  if (nameError) {
    return {
      ok: false,
      skillName: preview.skillName,
      destination: preview.destination,
      alreadyInstalled: false,
      skipped: true,
      stdout: "",
      stderr: "",
      error: nameError,
    };
  }

  if (!preview.source || preview.source === "(unresolved)") {
    return {
      ok: false,
      skillName: preview.skillName,
      destination: preview.destination,
      alreadyInstalled: false,
      skipped: true,
      stdout: "",
      stderr: "",
      error: "Unresolved source — pass --source owner/repo",
    };
  }

  if (preview.source === "(invalid)") {
    return {
      ok: false,
      skillName: preview.skillName,
      destination: preview.destination,
      alreadyInstalled: false,
      skipped: true,
      stdout: "",
      stderr: "",
      error: "Invalid source — pass --source owner/repo",
    };
  }

  const sourceError = validateInstallSource(preview.source);
  if (sourceError) {
    return {
      ok: false,
      skillName: preview.skillName,
      destination: preview.destination,
      alreadyInstalled: false,
      skipped: true,
      stdout: "",
      stderr: "",
      error: sourceError,
    };
  }

  const cwd = options.cwd ?? preview.projectRoot;
  const spawnImpl = options.spawnImpl ?? defaultSpawn;
  const { command, args } = buildCommand(preview.source, preview.skillName);
  const result = await runSpawn(command, args, { cwd, env: process.env }, spawnImpl);

  if (result.code !== 0) {
    return {
      ok: false,
      skillName: preview.skillName,
      destination: preview.destination,
      alreadyInstalled: false,
      skipped: false,
      stdout: result.stdout,
      stderr: result.stderr,
      error: `Install failed (exit ${result.code ?? "null"})`,
    };
  }

  return {
    ok: true,
    skillName: preview.skillName,
    destination: preview.destination,
    alreadyInstalled: false,
    skipped: false,
    stdout: result.stdout,
    stderr: result.stderr,
    error: null,
  };
}
