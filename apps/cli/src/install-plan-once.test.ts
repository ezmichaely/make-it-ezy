import { afterEach, describe, expect, it, vi } from "vitest";

const planOutcomeSpy = vi.hoisted(() => vi.fn());
const buildHandoffSpy = vi.hoisted(() => vi.fn());
const buildInstallPreviewSpy = vi.hoisted(() => vi.fn());
const formatInstallPreviewSpy = vi.hoisted(() => vi.fn(() => "preview"));
const formatInstallResultSpy = vi.hoisted(() => vi.fn(() => "result"));
const formatHandoffSpy = vi.hoisted(() => vi.fn(() => "handoff"));
const runInstallSpy = vi.hoisted(() => vi.fn());
const composeHandoffFromItemsSpy = vi.hoisted(() => vi.fn());

vi.mock("@make-it-ezy/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@make-it-ezy/core")>();
  return {
    ...actual,
    planOutcome: planOutcomeSpy,
    buildHandoff: buildHandoffSpy,
    buildInstallPreview: buildInstallPreviewSpy,
    formatInstallPreview: formatInstallPreviewSpy,
    formatInstallResult: formatInstallResultSpy,
    formatHandoff: formatHandoffSpy,
    runInstall: runInstallSpy,
    composeHandoffFromItems: composeHandoffFromItemsSpy,
  };
});

vi.mock("./select.js", () => ({
  selectWithArrows: vi.fn(async () => "alpha-skill"),
  confirmYesNo: vi.fn(async () => true),
}));

import { handleInstall } from "./index.js";

const minimalPlan = {
  outcome: "test outcome",
  capabilities: [],
  requirements: [],
  project: { projectRoot: "/tmp/p", packageName: null, language: null, frameworks: [], localSkills: [] },
  decisions: [],
  recommended: [
    {
      hit: {
        id: "remote:o/r/alpha-skill",
        name: "alpha-skill",
        source: "o/r",
        sourceKind: "skills.sh",
        path: null,
        description: "",
        url: null,
        score: 1,
        installs: null,
        installedLocally: false,
      },
      reason: "r",
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

const minimalHandoff = {
  outcome: "test outcome",
  capabilities: [],
  skills: [],
  checklist: [],
  prompt: "p",
  notes: [],
  basis: "heuristic",
  research: [],
  uncovered: [],
  excluded: [],
  workflow: [],
  contractors: [],
};

afterEach(() => {
  vi.clearAllMocks();
});

describe("install --plan planning", () => {
  it("plans once per invocation and reuses the result for handoff", async () => {
    planOutcomeSpy.mockResolvedValue(minimalPlan);
    buildHandoffSpy.mockImplementation(async () => {
      await planOutcomeSpy();
      return minimalHandoff;
    });
    buildInstallPreviewSpy.mockResolvedValue({
      skillName: "alpha-skill",
      source: "o/r",
      destination: "/tmp/p/.agents/skills/alpha-skill",
      projectRoot: "/tmp/p",
      alreadyInstalled: true,
      command: "npx skills add o/r --skill alpha-skill",
      commandArgs: ["skills", "add", "o/r", "--skill", "alpha-skill"],
      riskNotes: [],
      notes: [],
      url: null,
    });

    const stdout = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    const stderr = vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    try {
      const code = await handleInstall(["--plan", "test outcome", "--local-only", "--yes"]);
      expect(code).toBe(0);
      expect(planOutcomeSpy).toHaveBeenCalledTimes(1);
    } finally {
      stdout.mockRestore();
      stderr.mockRestore();
    }
  });
});
