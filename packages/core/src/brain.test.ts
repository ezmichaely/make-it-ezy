import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  computeFingerprint,
  isBrainStale,
  loadBrainFile,
  mergeBrainMachine,
  parseAgentSlice,
  refreshBrainProject,
  saveBrainFile,
} from "./brain.js";
import type { BrainFile } from "./brain-types.js";

function sampleBrain(overrides: Partial<BrainFile> = {}): BrainFile {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    fingerprint: "abc",
    project: {
      projectRoot: "/proj",
      packageName: "demo",
      language: "TypeScript",
      frameworks: ["Node"],
      packageManager: "pnpm",
      localSkills: ["ezy"],
    },
    ...overrides,
  };
}

describe("parseAgentSlice", () => {
  it("accepts a minimal valid agent slice", () => {
    const r = parseAgentSlice({
      updatedAt: new Date().toISOString(),
      decisions: [{ what: "Use pnpm", why: "Workspace root", source: null }],
      conventions: [],
      rejectedSkills: [],
    });
    expect(r.ok).toBe(true);
  });

  it("rejects oversized strings", () => {
    const r = parseAgentSlice({
      updatedAt: new Date().toISOString(),
      decisions: [{ what: "x".repeat(201), why: "y", source: null }],
      conventions: [],
      rejectedSkills: [],
    });
    expect(r.ok).toBe(false);
  });
});

describe("brain persistence", () => {
  it("writes and reloads brain.json preserving agent", () => {
    const dir = mkdtempSync(join(tmpdir(), "ezy-brain-"));
    writeFileSync(
      join(dir, "package.json"),
      JSON.stringify({ name: "demo", private: true }),
      "utf8",
    );
    mkdirSync(join(dir, ".agents", "skills", "ezy"), { recursive: true });
    writeFileSync(join(dir, ".agents", "skills", "ezy", "SKILL.md"), "# ezy\n", "utf8");

    const fp = computeFingerprint(dir);
    const merged = mergeBrainMachine(
      {
        ...sampleBrain({ fingerprint: "old" }),
        agent: {
          updatedAt: new Date().toISOString(),
          decisions: [{ what: "Keep tests", why: "Regression safety", source: null }],
          conventions: [],
          rejectedSkills: [],
        },
      },
      {
        projectRoot: dir,
        packageName: "demo",
        language: "TypeScript",
        frameworks: [],
        packageManager: "pnpm",
        localSkills: ["ezy"],
      },
      fp,
    );
    const saved = saveBrainFile(dir, merged);
    expect(saved.ok).toBe(true);
    const loaded = loadBrainFile(dir);
    expect(loaded.ok).toBe(true);
    if (!loaded.ok) return;
    expect(loaded.brain.agent?.decisions[0]?.what).toBe("Keep tests");
    expect(loaded.brain.fingerprint).toBe(fp);
  });

  it("refreshBrainProject writes under .ezy", () => {
    const dir = mkdtempSync(join(tmpdir(), "ezy-brain-"));
    writeFileSync(
      join(dir, "package.json"),
      JSON.stringify({ name: "refresh-demo", private: true }),
      "utf8",
    );
    const r = refreshBrainProject(dir);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const raw = readFileSync(join(dir, ".ezy", "brain.json"), "utf8");
    expect(raw).toContain("refresh-demo");
  });
});

describe("isBrainStale", () => {
  it("is stale when fingerprint changes", () => {
    const brain = sampleBrain({ fingerprint: "a" });
    expect(isBrainStale(brain, "b")).toBe(true);
  });

  it("is stale when updatedAt is old", () => {
    const brain = sampleBrain({
      fingerprint: "same",
      updatedAt: new Date(0).toISOString(),
    });
    expect(isBrainStale(brain, "same", new Date())).toBe(true);
  });
});