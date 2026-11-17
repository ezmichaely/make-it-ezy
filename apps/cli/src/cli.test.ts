import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const cliEntry = join(repoRoot, "apps/cli/src/index.ts");
const tsx = join(repoRoot, "node_modules/tsx/dist/cli.mjs");

function fixtureWithSkill(skillName = "ponytail"): string {
  const root = mkdtempSync(join(tmpdir(), "ezy-cli-"));
  writeFileSync(join(root, "package.json"), JSON.stringify({ name: "cli-fixture" }));
  const skillDir = join(root, ".agents", "skills", skillName);
  mkdirSync(skillDir, { recursive: true });
  writeFileSync(
    join(skillDir, "SKILL.md"),
    `---
name: ${skillName}
description: Fixture skill for CLI tests
---

# ${skillName}
`,
  );
  writeFileSync(
    join(root, "skills-lock.json"),
    JSON.stringify({
      version: 1,
      skills: {
        [skillName]: {
          source: "example/fixture-skills",
          skillPath: `skills/${skillName}/SKILL.md`,
        },
      },
    }),
  );
  return root;
}

function runEzy(args: string[], cwd = repoRoot) {
  return spawnSync(process.execPath, [tsx, cliEntry, ...args], {
    encoding: "utf8",
    cwd,
    env: process.env,
  });
}

describe("ezy CLI", () => {
  it("prints help", () => {
    const result = runEzy(["--help"]);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Usage:");
    expect(result.stdout).toContain("doctor");
    expect(result.stdout).toContain("analyze");
    expect(result.stdout).toContain("search");
    expect(result.stdout).toContain("inspect");
    expect(result.stdout).toContain("recommend");
    expect(result.stdout).toContain("plan");
    expect(result.stdout).toContain("install");
    expect(result.stdout).toContain("next");
  });

  it("prints next handoff from local plan", () => {
    const cwd = fixtureWithSkill();
    const result = runEzy(["next", "Build a SaaS dashboard", "--local-only"], cwd);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Make It Ezy — next");
    expect(result.stdout).toContain("Checklist");
    expect(result.stdout).toContain("Prompt");
    expect(result.stdout).not.toMatch(/skills were executed|executed the skill/i);
  });

  it("requires a next outcome", () => {
    const result = runEzy(["next"]);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Usage: ezy next");
  });

  it("plain install without plan/query does not print handoff block", () => {
    const cwd = fixtureWithSkill("ponytail");
    const result = runEzy(
      ["install", "ponytail", "--source", "example/fixture-skills"],
      cwd,
    );
    expect(result.status).toBe(0);
    expect(result.stdout).not.toContain("Make It Ezy — next");
  });

  it("searches local skills", () => {
    const cwd = fixtureWithSkill("ponytail");
    const result = runEzy(["search", "ponytail", "--local-only"], cwd);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Make It Ezy — search");
    expect(result.stdout).toContain("ponytail");
    expect(result.stdout).toContain("nothing was installed");
  });

  it("requires a search query", () => {
    const result = runEzy(["search"]);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Usage: ezy search");
  });

  it("inspects a local skill", () => {
    const cwd = fixtureWithSkill("ponytail");
    const result = runEzy(["inspect", "ponytail", "--local-only"], cwd);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Make It Ezy — inspect");
    expect(result.stdout).toContain("ponytail");
    expect(result.stdout).toContain("Risk findings");
  });

  it("fails inspect for unknown skills", () => {
    const cwd = fixtureWithSkill();
    const result = runEzy(
      ["inspect", "definitely-missing-skill-xyz", "--local-only"],
      cwd,
    );
    expect(result.status).toBe(1);
    expect(result.stdout).toContain("not found locally");
  });

  it("recommends from local skills", () => {
    const cwd = fixtureWithSkill("ponytail");
    const result = runEzy(["recommend", "ponytail", "--local-only"], cwd);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Make It Ezy — recommend");
    expect(result.stdout).toContain("Recommended");
    expect(result.stdout).toContain("nothing was installed");
  });

  it("requires a recommend query", () => {
    const result = runEzy(["recommend"]);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Usage: ezy recommend");
  });

  it("plans an outcome from local skills", () => {
    const cwd = fixtureWithSkill("ponytail");
    const result = runEzy(["plan", "Build a SaaS dashboard", "--local-only"], cwd);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Make It Ezy — plan");
    expect(result.stdout).toContain("Project");
    expect(result.stdout).toContain("Requirements");
    expect(result.stdout).toContain("nothing was installed");
  });

  it("requires a plan outcome", () => {
    const result = runEzy(["plan"]);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Usage: ezy plan");
  });

  it("requires install target or plan/query", () => {
    const result = runEzy(["install"]);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Usage: ezy install");
  });

  it("previews install and refuses without --yes when non-TTY", () => {
    const cwd = fixtureWithSkill();
    const result = runEzy(
      [
        "install",
        "definitely-missing-for-preview-xyz",
        "--source",
        "example/repo",
      ],
      cwd,
    );
    expect(result.status).toBe(1);
    expect(result.stdout).toContain("Make It Ezy — install preview");
    expect(result.stderr).toMatch(/--yes|Pass --yes/);
  });

  it("reports already-installed skills without --yes", () => {
    const cwd = fixtureWithSkill("ponytail");
    const result = runEzy(
      ["install", "ponytail", "--source", "example/fixture-skills"],
      cwd,
    );
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/Already installed|already installed/i);
  });

  it("runs doctor", () => {
    const result = runEzy(["doctor"]);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Node.js");
    expect(result.stdout).toContain("Status:");
  });

  it("runs analyze on this repo", () => {
    const result = runEzy(["analyze"]);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Make It Ezy");
    expect(result.stdout).toContain("Package manager");
  });

  it("lists ezy brief in help", () => {
    const result = runEzy(["--help"]);
    expect(result.stdout).toContain("ezy brief");
    expect(result.stdout).toContain("ezy brain");
  });

  it("brief prints instructions and schema", () => {
    const result = runEzy(["brief", "add stripe"], fixtureWithSkill());
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("searchTerms");
    expect(result.stdout).toContain(".ezy/brief.json");
  });

  it("plan with missing brief exits 2", () => {
    const result = runEzy(["plan", "x", "--brief", "missing.json"], fixtureWithSkill());
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("Invalid brief:");
    expect(result.stderr).toContain("cannot read file");
    expect(result.stdout).not.toContain("Recommended");
  });

  it("plan and next use a relative --brief", () => {
    const cwd = fixtureWithSkill();
    writeFileSync(
      join(cwd, "brief.json"),
      JSON.stringify({
        version: 1,
        outcome: "add stripe",
        taskType: "feature",
        requirements: [
          { id: "pay", label: "Payments", priority: "required", why: "charge cards", searchTerms: ["ponytail"] },
        ],
        exclusions: [],
        research: [],
      }),
    );
    const plan = runEzy(["plan", "add stripe", "--brief", "./brief.json", "--local-only"], cwd);
    expect(plan.status).toBe(0);
    expect(plan.stdout).toContain("Basis: agent brief");
    const next = runEzy(["next", "add stripe", "--brief=./brief.json", "--local-only"], cwd);
    expect(next.status).toBe(0);
    expect(next.stdout).toContain("Why these skills");
  });

  it("install --plan with invalid brief exits 2", () => {
    const result = runEzy(["install", "--plan", "x", "--brief", "missing.json", "--yes"], fixtureWithSkill());
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("cannot read file");
    expect(result.stdout).not.toContain("Install");
  });

  it("--brief without a value exits 2", () => {
    const result = runEzy(["plan", "x", "--brief"], fixtureWithSkill());
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("--brief requires a path");
    expect(result.stdout).not.toContain("Recommended");
  });

  it("--brief followed by a flag exits 2", () => {
    const result = runEzy(["plan", "x", "--brief", "--local-only"], fixtureWithSkill());
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("--brief requires a path");
    const inst = runEzy(["install", "--plan", "x", "--brief"], fixtureWithSkill());
    expect(inst.status).toBe(2);
  });

  it("shows brief notes for unknown fields", () => {
    const cwd = fixtureWithSkill();
    writeFileSync(
      join(cwd, "brief.json"),
      JSON.stringify({
        version: 1,
        outcome: "add stripe",
        taskType: "feature",
        requirements: [
          { id: "pay", label: "Payments", priority: "required", why: "charge", searchTerms: ["ponytail"] },
        ],
        exclusions: [],
        research: [],
        bogusField: 1,
      }),
    );
    const plan = runEzy(["plan", "add stripe", "--brief", "brief.json", "--local-only"], cwd);
    expect(plan.status).toBe(0);
    expect(plan.stdout).toContain("ignored unknown field");
  });

  it("rejects unknown commands", () => {
    const result = runEzy(["swarm"]);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Unknown command");
  });
});
