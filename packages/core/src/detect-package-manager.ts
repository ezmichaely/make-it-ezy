import { existsSync } from "node:fs";
import { join } from "node:path";

export type PackageManagerId = "pnpm" | "yarn" | "npm" | "bun";

/**
 * Infer package manager from lockfiles / workspace markers only.
 * Does not inspect global installs.
 */
export function detectPackageManager(projectRoot: string): PackageManagerId | null {
  if (existsSync(join(projectRoot, "pnpm-lock.yaml")) || existsSync(join(projectRoot, "pnpm-workspace.yaml"))) {
    return "pnpm";
  }
  if (existsSync(join(projectRoot, "bun.lockb")) || existsSync(join(projectRoot, "bun.lock"))) {
    return "bun";
  }
  if (existsSync(join(projectRoot, "yarn.lock"))) {
    return "yarn";
  }
  if (existsSync(join(projectRoot, "package-lock.json"))) {
    return "npm";
  }
  if (existsSync(join(projectRoot, "package.json"))) {
    return "npm";
  }
  return null;
}
