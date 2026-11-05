import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { inspectSkill } from "./inspect-skill.js";

function fixtureWithSkill(): string {
  const root = mkdtempSync(join(tmpdir(), "ezy-inspect-"));
  writeFileSync(join(root, "package.json"), JSON.stringify({ name: "fixture" }));
  const skillDir = join(root, ".agents", "skills", "ponytail");
  mkdirSync(join(skillDir, "scripts"), { recursive: true });
  writeFileSync(
    join(skillDir, "SKILL.md"),
    `---
name: ponytail
description: Be lazy and ship the smallest change
---

# Ponytail

Use curl carefully.
`,
  );
  writeFileSync(join(skillDir, "scripts", "demo.sh"), "#!/bin/sh\necho hi\n");
  writeFileSync(
    join(root, "skills-lock.json"),
    JSON.stringify({
      version: 1,
      skills: {
        ponytail: {
          source: "DietrichGebert/ponytail",
          skillPath: "skills/ponytail/SKILL.md",
          computedHash: "abc123def4567890",
          installMode: "copy",
        },
      },
    }),
  );
  return root;
}

describe("inspectSkill", () => {
  it("inspects a local skill with findings", async () => {
    const root = fixtureWithSkill();
    const report = await inspectSkill("ponytail", { cwd: root, skipRemote: true });
    expect(report.found).toBe(true);
    expect(report.name).toBe("ponytail");
    expect(report.source).toBe("DietrichGebert/ponytail");
    expect(report.files).toEqual(expect.arrayContaining(["SKILL.md", "scripts/demo.sh"]));
    expect(report.findings.some((f) => f.id === "scripts-present")).toBe(true);
    expect(report.findings.some((f) => f.id === "network-or-exec-mentions")).toBe(true);
    expect(report.notes.join(" ")).toContain("nothing was installed");
  });

  it("reports missing skills", async () => {
    const root = fixtureWithSkill();
    const report = await inspectSkill("nope-skill", { cwd: root, skipRemote: true });
    expect(report.found).toBe(false);
    expect(report.notes.join(" ")).toContain("No local skill");
  });

  it("reports when the skill directory lacks SKILL.md", async () => {
    const root = mkdtempSync(join(tmpdir(), "ezy-inspect-empty-"));
    writeFileSync(join(root, "package.json"), JSON.stringify({ name: "fixture" }));
    mkdirSync(join(root, ".agents", "skills", "hollow"), { recursive: true });
    const report = await inspectSkill("hollow", { cwd: root, skipRemote: true });
    expect(report.found).toBe(false);
    expect(report.notes.join(" ")).toContain("SKILL.md is missing");
  });

  it("requires a name", async () => {
    const report = await inspectSkill("  ", { skipRemote: true });
    expect(report.found).toBe(false);
    expect(report.notes.join(" ")).toContain("Provide a skill name");
  });
});
