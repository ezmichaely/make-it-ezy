import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { buildHandoff } from "./handoff.js";
import { formatHandoff } from "./format.js";
import * as planMod from "./plan.js";
import type { PlanReport } from "./plan-types.js";

function fixtureWithLocalSkill(): string {
  const root = mkdtempSync(join(tmpdir(), "ezy-handoff-"));
  writeFileSync(join(root, "package.json"), JSON.stringify({ name: "fixture" }));
  const skillDir = join(root, ".agents", "skills", "frontend-design");
  mkdirSync(skillDir, { recursive: true });
  writeFileSync(
    join(skillDir, "SKILL.md"),
    `---
name: frontend-design
description: Create distinctive frontend interfaces and dashboards
---
`,
  );
  writeFileSync(
    join(root, "skills-lock.json"),
    JSON.stringify({
      version: 1,
      skills: {
        "frontend-design": {
          source: "anthropics/skills",
          skillPath: "skills/frontend-design/SKILL.md",
        },
      },
    }),
  );
  return root;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("buildHandoff", () => {
  it("marks installed recommended skills and skips install checklist for them", async () => {
    const root = fixtureWithLocalSkill();
    const report = await buildHandoff("Build me a beautiful SaaS dashboard", {
      cwd: root,
      localOnly: true,
    });

    const skill = report.skills.find((s) => s.name === "frontend-design");
    expect(skill).toBeDefined();
    expect(skill!.installed).toBe(true);
    expect(skill!.path).toMatch(/\.agents[/\\]skills[/\\]frontend-design$/);
    expect(report.checklist.some((c) => /paste the prompt/i.test(c))).toBe(true);
    expect(report.checklist.some((c) => c.includes("ezy install frontend-design"))).toBe(false);
    expect(report.prompt).toContain("Outcome:");
    expect(report.prompt).toContain("read each SKILL.md");
    expect(report.prompt).toContain("do not invent skills");
    expect(report.prompt).not.toContain("---\nname:");
    expect(report.notes.some((n) => /does not install or run/i.test(n))).toBe(true);
  });

  it("lists ezy install for missing recommended skills but still prints a prompt", async () => {
    const root = mkdtempSync(join(tmpdir(), "ezy-handoff-empty-"));
    writeFileSync(join(root, "package.json"), JSON.stringify({ name: "empty" }));

    const fakePlan: PlanReport = {
      outcome: "Ship a verified skill recommender",
      capabilities: ["discovery"],
      recommended: [
        {
          hit: {
            name: "missing-skill",
            source: "example/skills",
            sourceKind: "remote",
            description: "fake",
            url: null,
            score: 10,
            installs: null,
            installedLocally: false,
          },
          reason: "strong match",
        },
      ],
      optional: [],
      notNeeded: [],
      notes: [],
    };
    vi.spyOn(planMod, "planOutcome").mockResolvedValue(fakePlan);

    const report = await buildHandoff("Ship a verified skill recommender", {
      cwd: root,
      localOnly: true,
    });

    expect(report.checklist.some((c) => c.includes("ezy install missing-skill"))).toBe(true);
    expect(report.prompt.length).toBeGreaterThan(0);
    expect(report.prompt).toContain("Ship a verified skill recommender");
    expect(report.skills[0]?.installed).toBe(false);
    expect(report.skills[0]?.path).toBeNull();
  });

  it("returns guidance when outcome is empty", async () => {
    const report = await buildHandoff("  ");
    expect(report.skills).toEqual([]);
    expect(report.checklist).toEqual([]);
    expect(report.notes.join(" ")).toContain("Provide an outcome");
    expect(report.prompt === "" || /provide an outcome/i.test(report.prompt)).toBe(true);
  });

  it("formatHandoff includes required sections", async () => {
    const root = fixtureWithLocalSkill();
    const report = await buildHandoff("Build me a beautiful SaaS dashboard", {
      cwd: root,
      localOnly: true,
    });
    const text = formatHandoff(report);
    expect(text).toContain("Make It Ezy — next");
    expect(text).toContain("Checklist");
    expect(text).toContain("Prompt");
    expect(text).toContain("```");
  });
});
