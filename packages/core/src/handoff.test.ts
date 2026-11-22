import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SUPERPOWERS_CONTRACTOR } from "./contractors.js";
import { buildHandoff, composeHandoffFromItems } from "./handoff.js";
import { formatHandoff } from "./format.js";
import * as planMod from "./plan.js";
import type { PlanReport } from "./plan-types.js";
import type { Brief } from "./brief-types.js";

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
      requirements: [
        {
          id: "discovery",
          label: "discovery",
          rationale: "test",
          priority: "required",
        },
      ],
      project: {
        projectRoot: root,
        packageName: "empty",
        language: "JavaScript (inferred from package.json; no TypeScript evidence)",
        frameworks: [],
        localSkills: [],
      },
      decisions: [
        {
          name: "missing-skill",
          source: "example/skills",
          decision: "install",
          reason: "strong match",
          covers: ["discovery"],
        },
      ],
      recommended: [
        {
          hit: {
            id: "remote:example/skills/missing-skill",
            name: "missing-skill",
            source: "example/skills",
            sourceKind: "remote",
            path: null,
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
      basis: "heuristic",
      taskType: null,
      research: [],
      uncovered: [],
      excluded: [],
      contractors: [],
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
    expect(report.skills[0]?.path).toMatch(/\.agents[/\\]skills[/\\]missing-skill$/);
    expect(report.prompt).toMatch(/missing-skill.*\.agents[/\\]skills[/\\]missing-skill/);
    expect(report.prompt).toMatch(/install first/i);
  });

  it("composeHandoffFromItems keeps recommend picks (query path)", () => {
    const root = mkdtempSync(join(tmpdir(), "ezy-handoff-compose-"));
    writeFileSync(join(root, "package.json"), JSON.stringify({ name: "compose" }));
    const report = composeHandoffFromItems(
      "ponytail workflow",
      {
        capabilities: [],
        recommended: [
          {
            hit: {
              name: "ponytail",
              source: "DietrichGebert/ponytail",
              sourceKind: "remote",
              description: "lazy senior",
              url: null,
              score: 9,
              installs: null,
              installedLocally: false,
            },
            reason: "topic match",
          },
        ],
        optional: [],
      },
      { cwd: root },
    );
    expect(report.skills.some((s) => s.name === "ponytail")).toBe(true);
    expect(report.prompt).toContain("ponytail");
    expect(report.checklist.some((c) => c.includes("ezy install ponytail"))).toBe(true);
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

  it("carries brief coverage and research into the handoff", async () => {
    const root = mkdtempSync(join(tmpdir(), "ezy-handoff-brief-"));
    writeFileSync(join(root, "package.json"), JSON.stringify({ name: "b" }));
    const dir = join(root, ".agents", "skills", "stripe-billing");
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      join(dir, "SKILL.md"),
      "---\nname: stripe-billing\ndescription: Stripe payments checkout billing subscriptions\n---\n",
    );
    const brief: Brief = {
      version: 1,
      outcome: "Add Stripe payments",
      taskType: "feature",
      requirements: [
        {
          id: "R1",
          label: "Stripe payments",
          priority: "required",
          why: "Charge customers",
          searchTerms: ["stripe", "payments", "checkout"],
        },
      ],
      exclusions: [],
      research: [{ kind: "technical", finding: "Use Stripe Checkout sessions", source: null }],
    };
    const report = await buildHandoff("Add Stripe payments", { cwd: root, localOnly: true, brief });
    expect(report.basis).toBe("brief");
    expect(report.research).toHaveLength(1);
    expect(report.skills[0]?.covers.length).toBeGreaterThan(0);
    expect(report.prompt).toContain("Why these skills");
    expect(report.prompt).toContain("Use Stripe Checkout sessions");
  });

  it("composeHandoffFromItems defaults to heuristic with no coverage section", () => {
    const root = mkdtempSync(join(tmpdir(), "ezy-handoff-q-"));
    const report = composeHandoffFromItems(
      "x",
      {
        recommended: [
          {
            hit: {
              id: "remote:a/b/ponytail",
              path: null,
              name: "ponytail",
              source: "a/b",
              sourceKind: "skills.sh",
              description: "",
              url: null,
              score: 9,
              installs: null,
              installedLocally: false,
            },
            reason: "topic match",
          },
        ],
        optional: [],
      },
      { cwd: root },
    );
    expect(report.basis).toBe("heuristic");
    expect(report.research).toEqual([]);
    expect(report.skills[0]?.covers).toEqual([]);
    expect(report.prompt).not.toContain("Why these skills");
  });

  it("does not duplicate the installs suffix in skill reasons", () => {
    const root = mkdtempSync(join(tmpdir(), "ezy-handoff-inst-"));
    const report = composeHandoffFromItems(
      "x",
      {
        recommended: [
          {
            hit: {
              id: "remote:a/b/ponytail",
              path: null,
              name: "ponytail",
              source: "a/b",
              sourceKind: "skills.sh",
              description: "",
              url: null,
              score: 9,
              installs: 1234,
              installedLocally: false,
            },
            reason: "covers payments (Stripe): name matches \"stripe\" · 1,234 installs",
          },
        ],
        optional: [],
      },
      { cwd: root },
    );
    expect(report.skills[0]?.reason.match(/installs/g)).toHaveLength(1);
  });

  it("carries basis, uncovered, excluded and plan notes into the handoff", async () => {
    const root = mkdtempSync(join(tmpdir(), "ezy-handoff-carry-"));
    writeFileSync(join(root, "package.json"), JSON.stringify({ name: "carry" }));
    const fakePlan: PlanReport = {
      outcome: "Add Stripe payments",
      capabilities: ["Stripe payments", "webhooks"],
      requirements: [],
      project: { projectRoot: root, packageName: "carry", language: null, frameworks: [], localSkills: [] },
      decisions: [],
      recommended: [],
      optional: [],
      notNeeded: [],
      notes: ["Recommended exceeds 4 to cover all required requirements.", "Plan note"],
      basis: "brief",
      taskType: "feature",
      research: [],
      uncovered: [{ id: "hooks", label: "webhooks", rationale: "Receive events", priority: "required" }],
      excluded: [{ label: "Subscriptions", why: "Out of scope" }],
      contractors: [],
    };
    vi.spyOn(planMod, "planOutcome").mockResolvedValue(fakePlan);
    const report = await buildHandoff("Add Stripe payments", { cwd: root, localOnly: true });
    expect(report.uncovered.map((u) => u.id)).toEqual(["hooks"]);
    expect(report.excluded).toEqual([{ label: "Subscriptions", why: "Out of scope" }]);
    expect(report.notes).toContain("Plan note");
    expect(report.notes.filter((n) => n === "Plan note")).toHaveLength(1);
    expect(report.prompt).toContain("Uncovered (handle directly): webhooks — Receive events");
    const text = formatHandoff(report);
    expect(text).toContain("Basis: agent brief");
    expect(text).toContain("Excluded\n- Subscriptions — Out of scope");
    expect(text).toContain("Uncovered\n- webhooks — no matching skill; agent handles directly");
    expect(report.workflow.some((s) => s.type === "custom")).toBe(true);
  });

  it("adds a contractor workflow stage when the plan recommends one", async () => {
    const root = mkdtempSync(join(tmpdir(), "ezy-handoff-contractor-"));
    writeFileSync(join(root, "package.json"), JSON.stringify({ name: "contractor" }));
    const fakePlan: PlanReport = {
      outcome: "Add a settings button",
      capabilities: ["ui"],
      requirements: [],
      project: { projectRoot: root, packageName: "contractor", language: null, frameworks: [], localSkills: [] },
      decisions: [],
      recommended: [],
      optional: [],
      notNeeded: [],
      notes: [],
      basis: "brief",
      taskType: "feature",
      research: [],
      uncovered: [],
      excluded: [],
      contractors: [
        {
          contractor: SUPERPOWERS_CONTRACTOR,
          reason: "Coding task type matches Superpowers workflow scope",
        },
      ],
    };
    vi.spyOn(planMod, "planOutcome").mockResolvedValue(fakePlan);
    const report = await buildHandoff("Add a settings button", { cwd: root, localOnly: true });
    expect(report.workflow[0]).toMatchObject({ type: "contractor", contractorName: "superpowers" });
    expect(report.prompt).toContain("Workflow (run in order)");
    expect(formatHandoff(report)).toContain("Workflow\n1. contractor · superpowers");
  });

  it("prints the heuristic basis and defaults uncovered/excluded on the query path", () => {
    const root = mkdtempSync(join(tmpdir(), "ezy-handoff-qp-"));
    const report = composeHandoffFromItems("x", { recommended: [], optional: [] }, { cwd: root });
    expect(report.uncovered).toEqual([]);
    expect(report.excluded).toEqual([]);
    const text = formatHandoff(report);
    expect(text).toContain("Basis: heuristic fallback — run ezy brief for a researched plan");
    expect(text).not.toContain("Excluded");
    expect(text).not.toContain("Uncovered");
  });

  it("lists install lines for every missing recommended skill (6 required picks)", () => {
    const root = mkdtempSync(join(tmpdir(), "ezy-handoff-six-"));
    const recommended = ["a", "b", "c", "d", "e", "f"].map((n) => ({
      hit: {
        id: `remote:o/r/${n}-skill`,
        path: null,
        name: `${n}-skill`,
        source: "o/r",
        sourceKind: "skills.sh" as const,
        description: "",
        url: null,
        score: 9,
        installs: null,
        installedLocally: false,
      },
      reason: "r",
    }));
    const report = composeHandoffFromItems("x", { recommended, optional: [] }, { cwd: root });
    expect(report.checklist.filter((c) => c.startsWith("ezy install "))).toHaveLength(6);
  });
});
