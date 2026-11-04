import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { planOutcome } from "./plan.js";

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
});
