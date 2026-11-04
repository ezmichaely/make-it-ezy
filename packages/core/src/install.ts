import { existsSync } from "node:fs";
import { join } from "node:path";
import { spawn as defaultSpawn, type SpawnOptions } from "node:child_process";
import { findProjectRoot } from "./find-project-root.js";
import { searchSkills } from "./search.js";
import type { InstallPreview, InstallResult } from "./install-types.js";

export type BuildInstallPreviewOptions = {
  cwd?: string;
  /** Explicit skills source, e.g. anthropics/skills */
  source?: string;
  fetchImpl?: typeof fetch;
};

export type RunInstallOptions = {
  cwd?: string;
  spawnImpl?: typeof defaultSpawn;
};

function skillsDir(projectRoot: string): string {
  return join(projectRoot, ".agents", "skills");
}

export function isSkillInstalledLocally(skillName: string, cwd = process.cwd()): boolean {
  const root = findProjectRoot(cwd) ?? cwd;
  const dir = join(skillsDir(root), skillName);
  return existsSync(join(dir, "SKILL.md")) || existsSync(dir);
}

function buildCommand(source: string, skillName: string): { command: string; args: string[] } {
  // npx skills add <source> --skill <name>
  return {
    command: "npx",
    args: ["skills", "add", source, "--skill", skillName],
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
  const alreadyInstalled = isSkillInstalledLocally(name, cwd);
  const notes = [
    "Suggest-then-go install — requires explicit approval (--yes or confirm).",
    "Skill execution / outcome run is not in this slice.",
  ];
  const riskNotes: string[] = [
    "Review SKILL.md after install. Popularity is not safety.",
  ];

  let source = options.source?.trim() ?? "";
  let url: string | null = null;

  if (!source) {
    const report = await searchSkills(name, {
      cwd: projectRoot,
      limit: 8,
      ...(options.fetchImpl ? { fetchImpl: options.fetchImpl } : {}),
    });
    const hit =
      report.hits.find((h) => h.name.toLowerCase() === name.toLowerCase()) ?? report.hits[0];
    if (hit?.source) {
      source = hit.source;
      url = hit.url;
      if (hit.sourceKind === "local" || hit.installedLocally) {
        notes.push("Matched a local/catalog hit; source taken from search metadata.");
      }
    }
    if (report.remoteError) {
      notes.push(`skills.sh lookup unavailable: ${report.remoteError}`);
    }
  } else {
    url = source.includes("/") ? `https://github.com/${source}` : null;
  }

  if (!source) {
    notes.push(
      `Could not resolve a source for "${name}". Pass --source owner/repo (e.g. anthropics/skills).`,
    );
  }

  const { command, args } = source
    ? buildCommand(source, name)
    : { command: "npx", args: ["skills", "add", "<source>", "--skill", name] };

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
    child.stdout?.on("data", (chunk: Buffer | string) => {
      stdout += String(chunk);
    });
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
