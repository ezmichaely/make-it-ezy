import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { detectPackageManager } from "./detect-package-manager.js";

function tempDir(): string {
  return mkdtempSync(join(tmpdir(), "ezy-pm-"));
}

describe("detectPackageManager", () => {
  it("detects pnpm from lockfile", () => {
    const root = tempDir();
    writeFileSync(join(root, "pnpm-lock.yaml"), "");
    expect(detectPackageManager(root)).toBe("pnpm");
  });

  it("detects yarn from yarn.lock", () => {
    const root = tempDir();
    writeFileSync(join(root, "yarn.lock"), "");
    expect(detectPackageManager(root)).toBe("yarn");
  });

  it("detects npm from package-lock.json", () => {
    const root = tempDir();
    writeFileSync(join(root, "package-lock.json"), "{}");
    expect(detectPackageManager(root)).toBe("npm");
  });

  it("falls back to npm when only package.json exists", () => {
    const root = tempDir();
    writeFileSync(join(root, "package.json"), "{}");
    expect(detectPackageManager(root)).toBe("npm");
  });

  it("returns null with no package evidence", () => {
    const root = tempDir();
    expect(detectPackageManager(root)).toBeNull();
  });
});
