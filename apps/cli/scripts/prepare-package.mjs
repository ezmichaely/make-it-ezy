import { chmodSync, cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(here, "..");
const distDir = resolve(packageRoot, "dist");
const coreDist = resolve(packageRoot, "../../packages/core/dist");
const bundledCore = resolve(distDir, "core");
const entry = resolve(distDir, "index.js");

mkdirSync(distDir, { recursive: true });
cpSync(coreDist, bundledCore, { recursive: true });

const source = readFileSync(entry, "utf8");
const rewritten = source
  .replaceAll('"@make-it-ezy/core"', '"./core/index.js"')
  .replaceAll("'@make-it-ezy/core'", "'./core/index.js'");

writeFileSync(entry, rewritten, "utf8");
chmodSync(entry, 0o755);

console.log("Prepared self-contained npm package:");
console.log("  dist/index.js");
console.log("  dist/core/*");
