import { execFileSync } from "node:child_process";
import { platform, release } from "node:os";
import { findProjectRoot } from "./find-project-root.js";
import type { DoctorCheck, DoctorReport } from "./types.js";

function tryVersion(command: string, args: string[]): string | null {
  try {
    return execFileSync(command, args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 5000,
    }).trim();
  } catch {
    return null;
  }
}

export type DoctorOptions = {
  cwd?: string;
};

export function runDoctor(options: DoctorOptions = {}): DoctorReport {
  const cwd = options.cwd ?? process.cwd();
  const checks: DoctorCheck[] = [];

  const major = Number(process.versions.node.split(".")[0] ?? 0);
  checks.push({
    id: "node",
    label: "Node.js",
    status: major >= 20 ? "ok" : "fail",
    detail: major >= 20 ? process.version : `${process.version} (Node 20+ required)`,
  });

  const pnpmVersion = tryVersion("pnpm", ["--version"]);
  checks.push({
    id: "pnpm",
    label: "pnpm",
    status: pnpmVersion ? "ok" : "warn",
    detail: pnpmVersion ? pnpmVersion : "not found on PATH (recommended for this project)",
  });

  const gitVersion = tryVersion("git", ["--version"]);
  checks.push({
    id: "git",
    label: "Git",
    status: gitVersion ? "ok" : "warn",
    detail: gitVersion ?? "not found on PATH",
  });

  checks.push({
    id: "os",
    label: "Operating system",
    status: "ok",
    detail: `${platform()} ${release()}`,
  });

  const projectRoot = findProjectRoot(cwd);
  checks.push({
    id: "project-root",
    label: "Project root",
    status: projectRoot ? "ok" : "warn",
    detail: projectRoot ?? `no project markers found from ${cwd}`,
  });

  const ok = checks.every((c) => c.status !== "fail");
  return { checks, ok };
}
