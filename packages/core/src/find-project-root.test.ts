import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { findProjectRoot } from "./find-project-root.js";

function tempDir(): string {
  return mkdtempSync(join(tmpdir(), "ezy-"));
}

describe("findProjectRoot", () => {
  it("finds package.json in the start directory", () => {
    const root = tempDir();
    writeFileSync(join(root, "package.json"), "{}");
    expect(findProjectRoot(root)).toBe(root);
  });

  it("walks upward to a parent package.json", () => {
    const root = tempDir();
    writeFileSync(join(root, "package.json"), "{}");
    const nested = join(root, "apps", "web");
    mkdirSync(nested, { recursive: true });
    expect(findProjectRoot(nested)).toBe(root);
  });

  it("returns null when no markers exist", () => {
    const root = tempDir();
    expect(findProjectRoot(root)).toBeNull();
  });
});
