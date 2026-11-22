import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { searchSkills } from "./search.js";
import { searchSkillsSh } from "./search-remote.js";

function fixtureProject(): string {
  const root = mkdtempSync(join(tmpdir(), "ezy-search-"));
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

describe("searchSkills", () => {
  it("finds local skills without network", async () => {
    const root = fixtureProject();
    const report = await searchSkills("frontend design", {
      cwd: root,
      localOnly: true,
    });
    expect(report.localCount).toBeGreaterThan(0);
    expect(report.hits[0]?.name).toBe("frontend-design");
    expect(report.hits[0]?.installedLocally).toBe(true);
    expect(report.notes.some((n) => n.includes("nothing was installed"))).toBe(true);
  });

  it("requires a query", async () => {
    const report = await searchSkills("   ", { localOnly: true });
    expect(report.hits).toEqual([]);
    expect(report.notes.join(" ")).toContain("Provide a search query");
  });

  it("merges remote catalog hits when fetch succeeds", async () => {
    const root = fixtureProject();
    let requestedUrl = "";
    const fetchImpl = async (input: string | URL | Request) => {
      requestedUrl = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      return new Response(
        JSON.stringify({
          query: "frontend",
          data: [
            {
              id: "anthropics/skills/frontend-design",
              source: "anthropics/skills",
              slug: "frontend-design",
              name: "frontend-design",
              installs: 1000,
              url: "https://skills.sh/anthropics/skills/frontend-design",
            },
            {
              id: "other/repo/ui-kit",
              source: "other/repo",
              slug: "ui-kit",
              name: "ui-kit",
              installs: 50,
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    };

    const report = await searchSkills("frontend", {
      cwd: root,
      fetchImpl,
    });
    expect(requestedUrl).toBe("https://skills.sh/api/v1/skills/search?q=frontend&limit=12");
    expect(report.remoteCount).toBe(2);
    expect(report.remoteError).toBeNull();
    const local = report.hits.find((h) => h.name === "frontend-design");
    expect(local?.installedLocally).toBe(true);
    expect(local?.installs).toBe(1000);
  });

  it("still reads legacy catalog responses", async () => {
    const fetchImpl = async () =>
      new Response(
        JSON.stringify({
          skills: [
            {
              skillId: "frontend-design",
              name: "frontend-design",
              source: "anthropics/skills",
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );

    const report = await searchSkillsSh("frontend", { fetchImpl });
    expect(report.hits.map((hit) => hit.name)).toContain("frontend-design");
  });

  it("soft-fails when remote search errors", async () => {
    const root = fixtureProject();
    const fetchImpl = async () => {
      throw new Error("network down");
    };
    const report = await searchSkills("frontend", {
      cwd: root,
      fetchImpl: fetchImpl,
    });
    expect(report.remoteError).toContain("network down");
    expect(report.localCount).toBeGreaterThan(0);
  });
});
