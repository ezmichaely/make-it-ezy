import { cpSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const dest = join(root, ".agents", "skills");
mkdirSync(dest, { recursive: true });

for (const name of ["ezy", "ci-before-push"]) {
  const src = join(root, "skills", name);
  if (!existsSync(src)) {
    console.warn(`skip ${name}: missing ${src}`);
    continue;
  }
  cpSync(src, join(dest, name), { recursive: true, force: true });
}