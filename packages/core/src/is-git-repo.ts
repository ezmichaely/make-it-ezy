import { existsSync } from "node:fs";
import { dirname, join, parse, resolve } from "node:path";

/** True if a `.git` directory or file (worktree) exists at or above startDir. */
export function isGitRepository(startDir: string): boolean {
  let current = resolve(startDir);
  const { root } = parse(current);

  for (;;) {
    if (existsSync(join(current, ".git"))) {
      return true;
    }
    if (current === root) {
      return false;
    }
    current = dirname(current);
  }
}
