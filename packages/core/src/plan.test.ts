import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { planOutcome, preferRecommendItem } from "./plan.js";
import * as searchMod from "./search.js";
import type { Brief } from "./brief-types.js";
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

function nextFixture(): string {
  const root = mkdtempSync(join(tmpdir(), "ezy-plan-next-"));
  writeFileSync(
    join(root, "package.json"),
    JSON.stringify({
      name: "next-app",
      dependencies: { next: "14.0.0", react: "18.0.0" },
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
    expect(report.requirements.some((r) => r.label === "frontend")).toBe(true);
    expect(report.project.projectRoot).toBe(root);
    expect(report.project.localSkills).toContain("frontend-design");
    expect(report.recommended.some((r) => r.hit.name === "frontend-design")).toBe(true);
    expect(report.notes.some((n) => n.includes("nothing was installed"))).toBe(true);
    expect(report.notes.some((n) => /suggest-then-go|heuristic/i.test(n))).toBe(true);
  });

  it("includes project snapshot and heavyweight skips for a small UI change", async () => {
    const root = nextFixture();
    const report = await planOutcome("Add a small button to the settings page", {
      cwd: root,
      localOnly: true,
    });
    expect(report.project.frameworks.some((f) => /next|react/i.test(f))).toBe(true);
    expect(report.notNeeded.some((h) => /graphify|codebase graph/i.test(h))).toBe(true);
    expect(report.notNeeded.some((h) => /swarm/i.test(h))).toBe(true);
  });

  it("returns guidance when outcome is empty", async () => {
    const report = await planOutcome("  ");
    expect(report.capabilities).toEqual([]);
    expect(report.requirements).toEqual([]);
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
    vi.spyOn(searchMod, "searchSkills").mockImplementation(async (query) => ({
      query,
      hits: [
        hit({ name: "onboarding", source: "alice/skills", score: 7, installs: 100, description: "onboarding flow" }),
        hit({ name: "onboarding", source: "bob/skills", score: 9, installs: 9_000, description: "onboarding flow" }),
        hit({ name: "onboarding", source: "carol/skills", score: 6, installs: 1, description: "onboarding flow" }),
      ],
      localCount: 0,
      remoteCount: 3,
      remoteError: null,
      notes: [],
    }));

    const report = await planOutcome("Improve onboarding flow", { localOnly: true });
    const all = [...report.recommended, ...report.optional];
    expect(all.filter((i) => i.hit.name === "onboarding")).toHaveLength(1);
    expect(all[0]?.hit.source).toBe("bob/skills");
  });
});

function stripeFixture(): string {
  const root = fixtureProject();
  for (const [name, description] of [
    ["stripe-billing", "Stripe payments checkout billing subscriptions"],
    ["build-game-changelog", "Stripe game changelog generator"],
  ] as const) {
    const dir = join(root, ".agents", "skills", name);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "SKILL.md"), `---\nname: ${name}\ndescription: ${description}\n---\n`);
  }
  return root;
}

function stripeBrief(extra: Partial<Brief> = {}): Brief {
  return {
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
    exclusions: [{ label: "game changelog", why: "unrelated" }],
    research: [{ kind: "technical", finding: "Use Checkout", source: null }],
    ...extra,
  };
}

describe("planOutcome with a brief", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("plans from the brief with coverage on every decision", async () => {
    const root = stripeFixture();
    const report = await planOutcome("Add Stripe payments", {
      cwd: root,
      localOnly: true,
      brief: stripeBrief(),
    });
    expect(report.basis).toBe("brief");
    expect(report.taskType).toBe("feature");
    expect(report.research).toHaveLength(1);
    expect(report.decisions.length).toBeGreaterThan(0);
    for (const d of report.decisions) expect(d.covers.length).toBeGreaterThan(0);
    const names = [...report.recommended, ...report.optional].map((i) => i.hit.name);
    expect(names).toContain("stripe-billing");
    expect(names).not.toContain("build-game-changelog");
    expect(report.basis).toBe("brief");
    expect(report.notes.some((n) => n.startsWith("Basis:"))).toBe(false);
  });

  it("falls back to heuristics without a brief", async () => {
    const report = await planOutcome("Build me a beautiful SaaS dashboard", {
      cwd: fixtureProject(),
      localOnly: true,
    });
    expect(report.basis).toBe("heuristic");
    expect(report.taskType).toBeNull();
    expect(report.research).toEqual([]);
    expect(report.notes.some((n) => n.startsWith("Basis:"))).toBe(false);
  });

  it("keeps the CLI outcome when the brief outcome differs", async () => {
    const report = await planOutcome("Add Stripe payments", {
      cwd: stripeFixture(),
      localOnly: true,
      brief: stripeBrief({ outcome: "something else" }),
    });
    expect(report.outcome).toBe("Add Stripe payments");
    expect(report.notes).toContain("Brief outcome differs from CLI outcome; using CLI outcome.");
  });

  it("surfaces remote-unavailable notes and still returns local picks", async () => {
    const report = await planOutcome("Add Stripe payments", {
      cwd: stripeFixture(),
      localOnly: false,
      brief: stripeBrief(),
      fetchImpl: async () => {
        throw new Error("offline");
      },
    });
    expect(report.notes.some((n) => n.includes("unavailable"))).toBe(true);
    expect(report.recommended.some((i) => i.hit.name === "stripe-billing")).toBe(true);
  });

  it("reports uncovered required requirements", async () => {
    const brief = stripeBrief({
      requirements: [
        ...stripeBrief().requirements,
        {
          id: "R2",
          label: "Quantum teleporter",
          priority: "required",
          why: "x",
          searchTerms: ["quantum", "teleporter"],
        },
      ],
    });
    const report = await planOutcome("Add Stripe payments", {
      cwd: stripeFixture(),
      localOnly: true,
      brief,
    });
    expect(report.uncovered.map((r) => r.id)).toEqual(["R2"]);
    expect(report.notNeeded.some((n) => n.startsWith("game changelog — unrelated"))).toBe(true);
  });
});
