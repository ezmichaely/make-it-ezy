import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it } from "vitest";
import { loadBrief } from "./brief.js";
import { planOutcome } from "./plan.js";
import type { PlanReport } from "./plan-types.js";

type Expectation = {
  outcome: string;
  requiredIds: string[];
  mustInclude: string[];
  mustExclude: string[];
  uncovered: string[];
  excluded?: string[];
  heuristic: { mustExclude: string[] };
};

const goldenDir = fileURLToPath(new URL("./golden", import.meta.url));
const cases = readdirSync(goldenDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

function picks(plan: PlanReport): string[] {
  return [...plan.recommended, ...plan.optional].map((i) => i.hit.name);
}

const tempDirs: string[] = [];
afterAll(() => {
  for (const d of tempDirs) rmSync(d, { recursive: true, force: true });
});

function copyProject(name: string): string {
  const cwd = mkdtempSync(join(tmpdir(), `ezy-golden-${name}-`));
  tempDirs.push(cwd);
  cpSync(join(goldenDir, name, "project"), cwd, { recursive: true });
  return cwd;
}

function expectCoverage(plan: PlanReport): void {
  for (const item of [...plan.recommended, ...plan.optional]) {
    const d = plan.decisions.find((x) => x.name === item.hit.name);
    expect(d?.covers.length ?? 0, `${item.hit.name} has empty coverage`).toBeGreaterThan(0);
  }
  for (const d of plan.decisions) {
    expect(d.covers.length, `${d.name} has empty coverage`).toBeGreaterThan(0);
  }
}

describe.each(cases)("golden: %s", (name) => {
  const expected = JSON.parse(
    readFileSync(join(goldenDir, name, "expect.json"), "utf8"),
  ) as Expectation;

  it("brief path meets expectations", async () => {
    const loaded = loadBrief(join(goldenDir, name, "brief.json"));
    if (!loaded.ok) throw new Error(loaded.errors.join("; "));
    const plan = await planOutcome(expected.outcome, {
      cwd: copyProject(name),
      localOnly: true,
      brief: loaded.brief,
    });
    const names = picks(plan);

    expect(plan.basis).toBe("brief");
    expect(plan.requirements.map((r) => r.id)).toEqual(
      expect.arrayContaining(expected.requiredIds),
    );
    for (const skill of expected.mustInclude) expect(names).toContain(skill);
    for (const skill of expected.mustExclude) expect(names).not.toContain(skill);
    expect(plan.uncovered.map((r) => r.id).sort()).toEqual([...expected.uncovered].sort());
    expectCoverage(plan);
    for (const skill of expected.excluded ?? []) {
      const entry = plan.excluded.find((e) => e.label === skill);
      expect(entry?.why, `${skill} should be removed by an exclusion`).toMatch(/^matches exclusion:/);
    }
  });

  it("heuristic path avoids excluded skills", async () => {
    const plan = await planOutcome(expected.outcome, {
      cwd: copyProject(name),
      localOnly: true,
    });
    const seen = [...picks(plan), ...plan.requirements.map((r) => r.label)];
    for (const item of expected.heuristic.mustExclude) {
      expect(seen).not.toContain(item);
      expect(seen.map((x) => x.toLowerCase()).some((x) => x.includes(item.toLowerCase())), item).toBe(false);
    }
    expectCoverage(plan);
  });
});
