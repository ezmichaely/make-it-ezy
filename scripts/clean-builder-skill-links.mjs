import { existsSync, lstatSync, readdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

for (const rel of [".agents/skills", ".cursor/skills", ".claude/skills"]) {
  const path = join(repoRoot, rel);
  if (!existsSync(path)) continue;
  rmSync(path, { recursive: true, force: true });
}

const agents = join(repoRoot, ".agents");
if (existsSync(agents) && lstatSync(agents).isDirectory()) {
  try {
    if (!existsSync(join(agents, "skills"))) {
      const entries = readdirSync(agents);
      if (entries.length === 0) rmSync(agents, { recursive: true, force: true });
    }
  } catch {
    /* ignore */
  }
}

console.log("Removed local builder skill links (global home unchanged).");