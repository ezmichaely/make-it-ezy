import { spawnSync } from "node:child_process";
import { chmodSync, cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(here, "..");
const repoCoreDir = resolve(packageRoot, "../../packages/core");
const distDir = resolve(packageRoot, "dist");
const coreDist = resolve(repoCoreDir, "dist");
const bundledCore = resolve(distDir, "core");
const entry = resolve(distDir, "index.js");

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: "inherit", encoding: "utf8" });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} exited with status ${String(result.status)}`);
  }
}

mkdirSync(distDir, { recursive: true });

// Build required source so packaging uses current generated core output.
run("pnpm", ["run", "build"], repoCoreDir);

if (!existsSync(coreDist)) {
  throw new Error(`Core dist not found after build: ${coreDist}`);
}

// Remove stale generated core artifact before copying current output.
rmSync(bundledCore, { recursive: true, force: true });
cpSync(coreDist, bundledCore, { recursive: true });

const source = readFileSync(entry, "utf8");
const rewritten = source
  .replaceAll('"@make-it-ezy/core"', '"./core/index.js"')
  .replaceAll("'@make-it-ezy/core'", "'./core/index.js'");

if (!rewritten.includes("./core/index.js")) {
  throw new Error("Expected @make-it-ezy/core import rewrite in dist/index.js");
}

writeFileSync(entry, rewritten, "utf8");
chmodSync(entry, 0o755);

console.log("Prepared self-contained npm package:");
console.log("  dist/index.js");
console.log("  dist/core/*");
