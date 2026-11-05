import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { recommendSkills } from "./recommend.js";

function fixtureProject(): string {
  const root = mkdtempSync(join(tmpdir(), "ezy-recommend-"));
  writeFileSync(join(root, "package.json"), JSON.stringify({ name: "fixture" }));
  const skillDir = join(root, ".agents", "skills", "frontend-design");
  mkdirSync(skillDir, { recursive: true });
  writeFileSync(
    join(skillDir, "SKILL.md"),
    `---
name: frontend-design
description: Create distinctive frontend interfaces
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

describe("recommendSkills", () => {
  it("recommends a strong local match", async () => {
    const root = fixtureProject();
    const report = await recommendSkills("frontend design", {
      cwd: root,
      localOnly: true,
    });
    expect(report.recommended.length).toBeGreaterThan(0);
    expect(report.recommended[0]?.hit.name).toBe("frontend-design");
    expect(report.recommended[0]?.reason.toLowerCase()).toMatch(/local|installed/);
    expect(report.notes.some((n) => n.includes("nothing was installed"))).toBe(true);
  });

  it("returns guidance when query is empty", async () => {
    const report = await recommendSkills("   ", { localOnly: true });
    expect(report.recommended).toEqual([]);
    expect(report.optional).toEqual([]);
    expect(report.notes.join(" ")).toContain("Provide a search query");
  });

  it("buckets weaker remote hits as optional", async () => {
    const root = fixtureProject();
    const fetchImpl = async () =>
      new Response(
        JSON.stringify({
          query: "frontend",
          skills: [
            {
              id: "other/repo/ui-kit",
              source: "other/repo",
              skillId: "ui-kit",
              name: "ui-kit",
              installs: 50,
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );

    const report = await recommendSkills("frontend", {
      cwd: root,
      fetchImpl: fetchImpl,
    });
    expect(report.recommended.some((r) => r.hit.name === "frontend-design")).toBe(true);
    expect(report.optional.some((r) => r.hit.name === "ui-kit")).toBe(true);
  });

  it("adds conservative not-needed hints for design queries", async () => {
    const root = fixtureProject();
    const report = await recommendSkills("frontend design", {
      cwd: root,
      localOnly: true,
    });
    expect(report.notNeeded.join(" ").toLowerCase()).toMatch(/swarm|vector/);
  });
});
