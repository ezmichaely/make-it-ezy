import { existsSync } from "node:fs";
import { dirname, join, parse, resolve } from "node:path";

const MARKERS = ["package.json", "pnpm-workspace.yaml", "turbo.json", "nx.json"] as const;

/**
 * Walk upward from startDir looking for common project markers.
 * Returns null when nothing is found before the filesystem root.
 */
export function findProjectRoot(startDir: string): string | null {
  let current = resolve(startDir);
  const { root } = parse(current);

  while (true) {
    for (const marker of MARKERS) {
      if (existsSync(join(current, marker))) {
        return current;
      }
    }
    if (current === root) {
      return null;
    }
    current = dirname(current);
  }
}
