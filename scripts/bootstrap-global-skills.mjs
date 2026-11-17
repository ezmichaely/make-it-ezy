import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
} from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const globalRoot =
  process.env.BUILDER_SKILLS_HOME?.trim() ||
  join(homedir(), ".local", "share", "make-it-ezy-builder-skills");
const globalSkills = join(globalRoot, ".agents", "skills");
const repoLock = join(repoRoot, "skills-lock.json");
const globalLock = join(globalRoot, "skills-lock.json");

mkdirSync(globalRoot, { recursive: true });
cpSync(repoLock, globalLock);

const lock = JSON.parse(readFileSync(repoLock, "utf8"));
const expected = Object.keys(lock.skills);

const needsInstall = () => {
  if (!existsSync(globalSkills)) return true;
  if (!existsSync(globalLock) || readFileSync(repoLock, "utf8") !== readFileSync(globalLock, "utf8")) {
    return true;
  }
  for (const name of expected) {
    if (!existsSync(join(globalSkills, name))) return true;
  }
  return false;
};

const repoSkills = join(repoRoot, ".agents", "skills");
const canMigrateFromRepo = () => {
  if (!existsSync(repoSkills) || !lstatSync(repoSkills).isDirectory()) return false;
  if (lstatSync(repoSkills).isSymbolicLink()) return false;
  return expected.every((name) => existsSync(join(repoSkills, name)));
};

if (needsInstall() && canMigrateFromRepo()) {
  mkdirSync(join(globalRoot, ".agents"), { recursive: true });
  if (existsSync(globalSkills)) {
    cpSync(repoSkills, globalSkills, { recursive: true, force: true });
  } else {
    renameSync(repoSkills, globalSkills);
  }
  cpSync(repoLock, globalLock);
  console.log(`Migrated builder skills to ${globalSkills}`);
} else if (needsInstall()) {
  const result = spawnSync("npx", ["skills", "install", "-y"], {
    cwd: globalRoot,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
  cpSync(repoLock, globalLock);
} else {
  const present = new Set(readdirSync(globalSkills, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name));
  console.log(`Global builder skills OK (${present.size} dirs under ${globalSkills})`);
}