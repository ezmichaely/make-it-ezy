import { describe, expect, it } from "vitest";
import {
  coverageReason,
  matchesExclusion,
  scoreCandidates,
  selectCapabilities,
} from "./select.js";
import type { Requirement } from "./plan-types.js";
import type { SkillHit } from "./search-types.js";

function hit(name: string, over: Partial<SkillHit> = {}): SkillHit {
  return {
    id: `src/${name}`,
    name,
    description: "",
    source: "src",
    sourceKind: "skills.sh",
    path: null,
    installs: null,
    score: 0,
    installedLocally: false,
    url: null,
    ...over,
  };
}

function req(id: string, searchTerms: string[], priority: Requirement["priority"] = "required"): Requirement {
  return { id, label: id, rationale: "", priority, searchTerms };
}

describe("selectCapabilities", () => {
  it("filters decoys that cover nothing", () => {
    const reqs = [req("payments", ["stripe", "billing"])];
    const cands = scoreCandidates([hit("build-game-changelog"), hit("plan-ui-change")], reqs);
    const sel = selectCapabilities(cands, reqs, []);
    expect(sel.filteredCount).toBe(2);
    expect(sel.recommended).toEqual([]);
    expect(sel.uncovered.map((r) => r.id)).toEqual(["payments"]);
  });

  it("recommends one skill per requirement", () => {
    const reqs = [req("pay", ["stripe"]), req("hooks", ["webhook"]), req("db", ["prisma"])];
    const cands = scoreCandidates(
      [hit("stripe-integration"), hit("webhook-handler"), hit("prisma-schema")],
      reqs,
    );
    const sel = selectCapabilities(cands, reqs, []);
    expect(sel.recommended).toHaveLength(3);
    for (const c of sel.recommended) expect(c.covers.length).toBeGreaterThan(0);
    expect(sel.uncovered).toEqual([]);
  });

  it("prefers one skill covering two requirements", () => {
    const reqs = [req("pay", ["stripe"]), req("hooks", ["webhook"])];
    const cands = scoreCandidates(
      [hit("stripe-webhook"), hit("stripe-basics"), hit("webhook-tools")],
      reqs,
    );
    const sel = selectCapabilities(cands, reqs, []);
    expect(sel.recommended.map((c) => c.hit.name)).toEqual(["stripe-webhook"]);
  });

  it("breaks coverage ties toward local over popular remote", () => {
    const reqs = [req("pay", ["stripe"])];
    const cands = scoreCandidates(
      [
        hit("stripe-remote", { installs: 50000 }),
        hit("stripe-local", { sourceKind: "local", installedLocally: true }),
      ],
      reqs,
    );
    const sel = selectCapabilities(cands, reqs, []);
    expect(sel.recommended[0]?.hit.name).toBe("stripe-local");
  });

  it("applies exclusions and records both exclusion and skill", () => {
    const reqs = [req("ship", ["docker"])];
    const cands = scoreCandidates([hit("docker-deploy")], reqs);
    const sel = selectCapabilities(cands, reqs, [{ label: "Docker", why: "no deployment change" }]);
    expect(sel.recommended).toEqual([]);
    expect(sel.excluded).toContainEqual({ label: "Docker", why: "no deployment change" });
    expect(sel.excluded).toContainEqual({ label: "docker-deploy", why: "matches exclusion: Docker" });
  });

  it("keeps unmatched exclusions in excluded", () => {
    const sel = selectCapabilities([], [], [{ label: "Kubernetes", why: "out of scope" }]);
    expect(sel.excluded).toEqual([{ label: "Kubernetes", why: "out of scope" }]);
  });

  it("leaves stopword-only search terms uncovered without throwing", () => {
    const reqs = [req("misc", ["add", "new"])];
    const cands = scoreCandidates([hit("add-new-thing")], reqs);
    const sel = selectCapabilities(cands, reqs, []);
    expect(sel.uncovered.map((r) => r.id)).toEqual(["misc"]);
  });

  it("stretches recommended past 4 to cover all required requirements", () => {
    const names = ["alpha", "bravo", "charlie", "delta", "echo", "foxtrot"];
    const reqs = names.map((n) => req(n, [n]));
    const cands = scoreCandidates(names.map((n) => hit(`${n}-skill`)), reqs);
    const sel = selectCapabilities(cands, reqs, []);
    expect(sel.recommended).toHaveLength(6);
    expect(sel.optional).toHaveLength(0);
    expect(sel.uncovered).toEqual([]);
    expect(sel.recommendedStretched).toBe(true);
  });

  it("reports only requirements with no candidate as uncovered", () => {
    const reqs = [req("pay", ["stripe"]), req("none", ["zzzqqq"])];
    const sel = selectCapabilities(scoreCandidates([hit("stripe-x")], reqs), reqs, []);
    expect(sel.uncovered.map((r) => r.id)).toEqual(["none"]);
  });

  it("leaves required requirements uncovered once the total cap of 8 is exhausted", () => {
    const names = ["alpha", "bravo", "charlie", "delta", "echo", "foxtrot", "golf", "hotel", "india"];
    const reqs = names.map((n) => req(n, [n]));
    const sel = selectCapabilities(scoreCandidates(names.map((n) => hit(`${n}-skill`)), reqs), reqs, []);
    expect(sel.recommended).toHaveLength(8);
    expect(sel.optional).toHaveLength(0);
    expect(sel.uncovered).toHaveLength(1);
  });

  it("puts all required-covering picks in recommended even beyond 4", () => {
    const names = ["alpha", "bravo", "charlie", "delta", "echo"];
    const reqs = names.map((n) => req(n, [n]));
    const sel = selectCapabilities(scoreCandidates(names.map((n) => hit(`${n}-skill`)), reqs), reqs, []);
    expect(sel.recommended).toHaveLength(5);
    expect(sel.optional).toHaveLength(0);
    expect(sel.uncovered).toEqual([]);
  });

  it("selects optional requirements separately", () => {
    const reqs = [req("pay", ["stripe"]), req("docs", ["swagger"], "optional")];
    const cands = scoreCandidates([hit("stripe-x"), hit("swagger-y")], reqs);
    const sel = selectCapabilities(cands, reqs, []);
    expect(sel.recommended.map((c) => c.hit.name)).toEqual(["stripe-x"]);
    expect(sel.optional.map((c) => c.hit.name)).toEqual(["swagger-y"]);
  });
});

describe("scoreCandidates", () => {
  it("collapses same-name hits preferring local", () => {
    const reqs = [req("pay", ["stripe"])];
    const cands = scoreCandidates(
      [hit("Stripe-X", { installs: 9 }), hit("stripe-x", { installedLocally: true, sourceKind: "local" })],
      reqs,
    );
    expect(cands).toHaveLength(1);
    expect(cands[0]?.hit.installedLocally).toBe(true);
  });
});

describe("matchesExclusion", () => {
  it("is false for labels without significant tokens", () => {
    expect(matchesExclusion(hit("docker"), { label: "the", why: "" })).toBe(false);
  });

  it("matches on the skill name, not words in its description", () => {
    const styles = hit("button-styles", { description: "Button styling patterns for any frontend framework" });
    expect(matchesExclusion(styles, { label: "new frontend framework", why: "" })).toBe(false);
    expect(matchesExclusion(hit("docker-deploy"), { label: "Docker", why: "" })).toBe(true);
  });
});

describe("coverageReason", () => {
  const reqs = [req("pay", ["stripe"]), req("db", ["prisma"])];
  it("omits installs when null and never claims strength", () => {
    const [c] = scoreCandidates([hit("stripe-prisma")], reqs);
    const reason = coverageReason(c!, reqs);
    expect(reason).toContain("covers pay (pay):");
    expect(reason).toContain(" | covers db (db):");
    expect(reason).not.toMatch(/installs|strong match|high installs/);
  });
  it("appends installs as a separate fact", () => {
    const [c] = scoreCandidates([hit("stripe-x", { installs: 120 })], reqs);
    expect(coverageReason(c!, reqs)).toMatch(/ · 120 installs$/);
  });
});
