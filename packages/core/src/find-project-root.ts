import { existsSync } from "node:fs";
import { dirname, join, parse, resolve } from "node:path";

const MARKERS = ["package.json", "pnpm-workspace.yaml", "turbo.json", "nx.json"] as const;

function hasWorkspaceSkillsRoot(dir: string): boolean {
  return existsSync(join(dir, ".agents", "skills")) || existsSync(join(dir, "pnpm-workspace.yaml"));
}

function hasProjectMarker(dir: string): boolean {
  return MARKERS.some((marker) => existsSync(join(dir, marker)));
}

/**
 * Walk upward from startDir looking for common project markers.
 * Prefers the nearest ancestor with `.agents/skills` or `pnpm-workspace.yaml`
 * (monorepo root). Otherwise returns the nearest directory with a project marker.
 * Returns null when nothing is found before the filesystem root.
 */
export function findProjectRoot(startDir: string): string | null {
  let current = resolve(startDir);
  const { root } = parse(current);
  let markerRoot: string | null = null;

  for (;;) {
    if (hasWorkspaceSkillsRoot(current)) {
      return current;
    }
    if (markerRoot === null && hasProjectMarker(current)) {
      markerRoot = current;
    }
    if (current === root) {
      return markerRoot;
    }
    current = dirname(current);
  }
}