import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { planOutcome, preferRecommendItem } from "./plan.js";
import * as recommendMod from "./recommend.js";
import type { RecommendItem } from "./recommend-types.js";
import type { SkillHit } from "./search-types.js";

function hit(partial: Partial<SkillHit> & Pick<SkillHit, "name" | "source">): SkillHit {
  return {
    sourceKind: "remote",
    description: "",
    url: null,
    score: 5,
    installs: null,
    installedLocally: false,
    ...partial,
  };
}

function item(partial: Partial<SkillHit> & Pick<SkillHit, "name" | "source">, reason = "match"): RecommendItem {
  return { hit: hit(partial), reason };
}

function fixtureProject(): string {
  const root = mkdtempSync(join(tmpdir(), "ezy-plan-"));
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

describe("planOutcome", () => {
  it("plans a saas dashboard outcome using local skills", async () => {
    const root = fixtureProject();
    const report = await planOutcome("Build me a beautiful SaaS dashboard", {
      cwd: root,
      localOnly: true,
    });
    expect(report.capabilities).toEqual(expect.arrayContaining(["frontend", "UI/UX"]));
    expect(report.recommended.some((r) => r.hit.name === "frontend-design")).toBe(true);
    expect(report.notes.some((n) => n.includes("nothing was installed"))).toBe(true);
    expect(report.notes.some((n) => n.includes("Phase 4"))).toBe(true);
  });

  it("returns guidance when outcome is empty", async () => {
    const report = await planOutcome("  ");
    expect(report.capabilities).toEqual([]);
    expect(report.recommended).toEqual([]);
    expect(report.notes.join(" ")).toContain("Provide an outcome");
  });

  it("dedupes skills across capabilities", async () => {
    const root = fixtureProject();
    const report = await planOutcome("frontend UI dashboard", {
      cwd: root,
      localOnly: true,
    });
    const names = [...report.recommended, ...report.optional].map((i) => i.hit.name);
    expect(names.filter((n) => n === "frontend-design").length).toBeLessThanOrEqual(1);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("preferRecommendItem keeps higher installs when scores tie", () => {
    const weak = item({ name: "onboarding", source: "a/skills", score: 8, installs: 10 });
    const strong = item({ name: "onboarding", source: "b/skills", score: 8, installs: 50_000 });
    expect(preferRecommendItem(weak, strong).hit.source).toBe("b/skills");
  });

  it("collapses same skill name from different sources to one pick", async () => {
    vi.spyOn(recommendMod, "recommendSkills").mockImplementation(async (query) => ({
      query,
      recommended: [
        item({ name: "onboarding", source: "alice/skills", score: 7, installs: 100 }),
        item({ name: "onboarding", source: "bob/skills", score: 9, installs: 9_000 }),
      ],
      optional: [item({ name: "onboarding", source: "carol/skills", score: 6, installs: 1 })],
      notNeeded: [],
      notes: [],
    }));

    const report = await planOutcome("Improve onboarding flow", { localOnly: true });
    const all = [...report.recommended, ...report.optional];
    expect(all.filter((i) => i.hit.name === "onboarding")).toHaveLength(1);
    expect(all[0]?.hit.source).toBe("bob/skills");
  });
});
