import { describe, expect, it } from "vitest";
import { formatPlan } from "./format.js";
import type { PlanReport } from "./plan-types.js";

function report(extra: Partial<PlanReport> = {}): PlanReport {
  return {
    outcome: "Add Stripe payments",
    capabilities: ["Stripe payments"],
    requirements: [
      {
        id: "R1",
        label: "Stripe payments",
        rationale: "Charge customers",
        priority: "required",
      },
    ],
    project: {
      projectRoot: "/tmp/x",
      packageName: "x",
      language: "TypeScript",
      frameworks: [],
      localSkills: ["stripe-billing"],
    },
    decisions: [],
    recommended: [
      {
        hit: {
          id: "local:stripe-billing",
          name: "stripe-billing",
          source: "local",
          sourceKind: "local",
          path: null,
          description: "",
          url: null,
          score: 5,
          installs: null,
          installedLocally: true,
        },
        reason: 'covers payments (Stripe subscriptions): name matches "stripe"',
      },
    ],
    optional: [],
    notNeeded: [],
    notes: [],
    basis: "brief",
    taskType: "feature",
    research: [{ kind: "technical", finding: "Use Checkout", source: "stripe.com/docs" }],
    uncovered: [
      { id: "R2", label: "webhooks", rationale: "x", priority: "optional" },
    ],
    excluded: [{ label: "game changelog", why: "unrelated" }],
    ...extra,
  };
}

describe("formatPlan", () => {
  it("explains a brief-based plan", () => {
    const text = formatPlan(report());
    expect(text).toContain("Basis: agent brief");
    expect(text).toContain("Research");
    expect(text).toContain("- technical · Use Checkout (stripe.com/docs)");
    expect(text).toContain("Excluded");
    expect(text).toContain("- game changelog — unrelated");
    expect(text).toContain("Uncovered");
    expect(text).toContain("- webhooks — no matching skill; agent handles directly");
    expect(text).toContain("covers payments");
  });

  it("states the heuristic fallback and omits empty sections", () => {
    const text = formatPlan(report({ basis: "heuristic", research: [], excluded: [], uncovered: [] }));
    expect(text).toContain("Basis: heuristic fallback — run ezy brief for a researched plan");
    expect(text).not.toContain("Research");
    expect(text).not.toContain("Excluded");
    expect(text).not.toContain("Uncovered");
  });

  it("caps local skills at 8 names", () => {
    const localSkills = Array.from({ length: 54 }, (_, i) => `skill-${i}`);
    const text = formatPlan(report({ project: { ...report().project, localSkills } }));
    const line = text.split("\n").find((l) => l.startsWith("Local skills:"))!;
    expect(line).toBe(`Local skills: 54 (${localSkills.slice(0, 8).join(", ")}, …)`);
    expect(text).not.toContain("skill-8");
  });

  it("never mentions install-count justifications", () => {
    const text = formatPlan(report());
    expect(text).not.toContain("strong match");
    expect(text).not.toContain("high installs");
  });
});
