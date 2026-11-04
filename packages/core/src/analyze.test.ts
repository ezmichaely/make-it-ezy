import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { analyzeProject } from "./analyze.js";

function tempDir(): string {
  return mkdtempSync(join(tmpdir(), "ezy-analyze-"));
}

describe("analyzeProject", () => {
  it("returns notes when cwd is not a project", () => {
    const root = tempDir();
    const result = analyzeProject({ cwd: root });
    expect(result.projectRoot).toBeNull();
    expect(result.notes.length).toBeGreaterThan(0);
  });

  it("analyzes a simple TypeScript project", () => {
    const root = tempDir();
    writeFileSync(
      join(root, "package.json"),
      JSON.stringify({
        name: "demo",
        devDependencies: { typescript: "5.8.0", vite: "6.0.0" },
      }),
    );
    writeFileSync(join(root, "pnpm-lock.yaml"), "");
    writeFileSync(join(root, "tsconfig.json"), "{}");
    mkdirSync(join(root, ".git"));

    const result = analyzeProject({ cwd: root });
    expect(result.projectRoot).toBe(root);
    expect(result.packageJson.name).toBe("demo");
    expect(result.packageManager).toBe("pnpm");
    expect(result.language).toBe("TypeScript");
    expect(result.isGitRepository).toBe(true);
    expect(result.frameworks.some((f) => f.id === "vite")).toBe(true);
  });
});
