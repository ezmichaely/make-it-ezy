import { existsSync, lstatSync, mkdirSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const globalRoot =
  process.env.BUILDER_SKILLS_HOME?.trim() ||
  join(homedir(), ".local", "share", "make-it-ezy-builder-skills");
const globalSkills = join(globalRoot, ".agents", "skills");
const localSkills = join(repoRoot, ".agents", "skills");
const lock = JSON.parse(readFileSync(join(repoRoot, "skills-lock.json"), "utf8"));

if (!existsSync(globalSkills)) {
  console.error(
    `Missing global builder skills at ${globalSkills}. Run: pnpm skills:global`,
  );
  process.exit(1);
}

mkdirSync(join(repoRoot, ".agents"), { recursive: true });

if (existsSync(localSkills)) {
  const stat = lstatSync(localSkills);
  if (stat.isSymbolicLink()) {
    rmSync(localSkills);
  } else if (stat.isDirectory()) {
    rmSync(localSkills, { recursive: true, force: true });
  }
}
mkdirSync(localSkills, { recursive: true });

const linkDir = (name, target) => {
  const link = join(localSkills, name);
  if (existsSync(link)) rmSync(link, { recursive: true, force: true });
  symlinkSync(target, link, "dir");
};

for (const name of Object.keys(lock.skills)) {
  const target = join(globalSkills, name);
  if (!existsSync(target)) {
    console.error(`Global skill missing: ${name}. Run: pnpm skills:global`);
    process.exit(1);
  }
  linkDir(name, target);
}

for (const name of ["ezy", "ci-before-push"]) {
  const src = join(repoRoot, "skills", name);
  if (!existsSync(src)) {
    console.warn(`skip ${name}: ${src} not found`);
    continue;
  }
  linkDir(name, src);
}

const ensureAgentSymlink = (dir) => {
  const linkPath = join(repoRoot, dir, "skills");
  mkdirSync(join(repoRoot, dir), { recursive: true });
  if (existsSync(linkPath)) {
    try {
      if (lstatSync(linkPath).isSymbolicLink()) return;
    } catch {
      /* ignore */
    }
    rmSync(linkPath, { recursive: true, force: true });
  }
  symlinkSync("../.agents/skills", linkPath);
};

ensureAgentSymlink(".cursor");
ensureAgentSymlink(".claude");

console.log(`Linked .agents/skills → ${globalSkills} (+ repo-owned skills)`);