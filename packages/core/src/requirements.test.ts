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

  const nextAnalysis = analysis({
    frameworks: [
      { id: "next", label: "Next.js", value: "14", confidence: "high", evidence: "package.json" },
    ],
  });

  it("does not call Stripe subscriptions a UI change", () => {
    const { requirements } = extractRequirements(
      "add Stripe subscriptions to this Next.js app",
      nextAnalysis,
    );
    const labels = requirements.map((r) => r.label);
    expect(labels).not.toContain("UI change");
    expect(labels).toContain("payments");
    const pay = requirements.find((r) => r.label === "payments");
    expect(pay?.searchTerms).toEqual(expect.arrayContaining(["payments", "stripe", "subscriptions"]));
  });

  it("every requirement has non-empty searchTerms", () => {
    for (const o of ["add a button to the header", "xyzzy plugh", "Build me a website", "stripe webhook"]) {
      const { requirements } = extractRequirements(o, nextAnalysis);
      expect(requirements.length).toBeGreaterThan(0);
      for (const r of requirements) expect(r.searchTerms?.length).toBeGreaterThan(0);
    }
  });

  it("derives a Graphify exclusion for small UI changes", () => {
    const { exclusions, skipHints } = extractRequirements("add a button to the header", nextAnalysis);
    expect(exclusions).toContainEqual({
      label: "Graphify",
      why: "full codebase graph is overkill for a small UI change",
    });
    expect(skipHints).toContain("Graphify \u2014 full codebase graph is overkill for a small UI change");
  });

  it("collapses non-domain labels for small UI changes", () => {
    const { requirements } = extractRequirements("change the button label in the codebase", nextAnalysis);
    expect(requirements.map((r) => r.label)).toEqual(["UI change"]);
  });

  it("keeps domain labels next to UI change", () => {
    const { requirements } = extractRequirements("add a Stripe checkout button", nextAnalysis);
    expect(requirements.map((r) => r.label).sort()).toEqual(["UI change", "payments"]);
  });

  it("does not label a bare 'add a settings page' as UI change", () => {
    const { requirements } = extractRequirements("add a settings page", nextAnalysis);
    expect(requirements.map((r) => r.label)).not.toContain("UI change");
  });

  it("UI change searchTerms include the UI token", () => {
    const { requirements } = extractRequirements("add a button to the header", nextAnalysis);
    const ui = requirements.find((r) => r.label === "UI change");
    expect(ui?.searchTerms).toContain("button");
  });

  it("drops non-frontend labels on small UI changes in a dashboard repo", () => {
    const labels = extractRequirements("fix the button style on the dashboard repo", nextAnalysis)
      .requirements.map((r) => r.label);
    expect(labels.length).toBeGreaterThan(0);
    for (const l of labels) expect(["frontend", "UI/UX", "testing"]).toContain(l);
    for (const bad of ["code understanding", "implementation", "verification / testing"]) {
      expect(labels).not.toContain(bad);
    }
  });
});
