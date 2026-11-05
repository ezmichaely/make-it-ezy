import { describe, expect, it } from "vitest";
import { extractRequirements } from "./requirements.js";
import type { ProjectAnalysis } from "./types.js";

function analysis(partial: Partial<ProjectAnalysis> = {}): ProjectAnalysis {
  return {
    cwd: "/tmp",
    projectRoot: "/tmp/app",
    isGitRepository: true,
    packageManager: "pnpm",
    nodeVersion: "v20.0.0",
    packageJson: { present: true, name: "app", parseError: null },
    language: "TypeScript",
    frameworks: [],
    tools: [],
    notes: [],
    ...partial,
  };
}

describe("extractRequirements", () => {
  it("maps greenfield website outcomes to frontend requirements", () => {
    const empty = analysis({
      projectRoot: null,
      packageJson: { present: false, name: null, parseError: null },
      language: null,
      frameworks: [],
    });
    const { requirements, skipHints } = extractRequirements("Build me a website", empty);
    expect(requirements.map((r) => r.label)).toEqual(
      expect.arrayContaining(["frontend", "UI/UX"]),
    );
    expect(skipHints.some((h) => /swarm|vector/i.test(h))).toBe(true);
  });

  it("for a small UI change on an existing React app, skips heavyweight tooling", () => {
    const reactApp = analysis({
      frameworks: [
        {
          id: "react",
          label: "React",
          value: "18",
          confidence: "high",
          evidence: "package.json",
        },
        {
          id: "next",
          label: "Next.js",
          value: "14",
          confidence: "high",
          evidence: "package.json",
        },
      ],
    });
    const { requirements, skipHints } = extractRequirements(
      "Add a small button to the settings page",
      reactApp,
    );
    expect(requirements.length).toBeGreaterThan(0);
    expect(skipHints.some((h) => /graphify|codebase graph/i.test(h))).toBe(true);
    expect(skipHints.some((h) => /new frontend framework|already has/i.test(h))).toBe(true);
    expect(skipHints.some((h) => /swarm/i.test(h))).toBe(true);
    // Small change should not insist on a broad "testing" capability as required
    expect(requirements.every((r) => r.label !== "testing" || r.priority === "optional")).toBe(
      true,
    );
  });

  it("normalizes 'add a button' without frontend lexicon into a UI change requirement", () => {
    const bare = analysis({ frameworks: [] });
    const { requirements, skipHints } = extractRequirements(
      "Add a small button to the settings page",
      bare,
    );
    expect(requirements.some((r) => r.label === "UI change")).toBe(true);
    expect(skipHints.some((h) => /graphify|codebase graph/i.test(h))).toBe(true);
  });

  it("returns empty for blank outcome", () => {
    const { requirements, skipHints } = extractRequirements("  ", analysis());
    expect(requirements).toEqual([]);
    expect(skipHints).toEqual([]);
  });
});
