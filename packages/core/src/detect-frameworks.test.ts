import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { detectFrameworks, readPackageJson } from "./detect-frameworks.js";

function tempDir(): string {
  return mkdtempSync(join(tmpdir(), "ezy-fw-"));
}

describe("detectFrameworks", () => {
  it("detects Next.js and TypeScript from dependencies", () => {
    const root = tempDir();
    const pkg = {
      dependencies: { next: "15.0.0", react: "19.0.0" },
      devDependencies: { typescript: "5.8.0" },
    };
    writeFileSync(join(root, "package.json"), JSON.stringify(pkg));
    const items = detectFrameworks(root, pkg);
    expect(items.map((i) => i.id)).toEqual(
      expect.arrayContaining(["next", "react", "typescript"]),
    );
  });

  it("detects TypeScript from tsconfig alone", () => {
    const root = tempDir();
    writeFileSync(join(root, "tsconfig.json"), "{}");
    const items = detectFrameworks(root, {});
    expect(items.some((i) => i.id === "typescript")).toBe(true);
  });
});

describe("readPackageJson", () => {
  it("reports missing package.json", () => {
    const root = tempDir();
    expect(readPackageJson(root)).toEqual({
      pkg: null,
      name: null,
      parseError: null,
      present: false,
    });
  });

  it("reports parse errors for malformed JSON", () => {
    const root = tempDir();
    writeFileSync(join(root, "package.json"), "{not-json");
    const result = readPackageJson(root);
    expect(result.present).toBe(true);
    expect(result.pkg).toBeNull();
    expect(result.parseError).toBeTruthy();
  });
});
