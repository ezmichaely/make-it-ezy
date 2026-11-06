import { describe, expect, it } from "vitest";
import { requirementRelevance, scoreSkillText, tokenizeQuery } from "./score-skill.js";

describe("scoreSkillText", () => {
  it("scores name matches higher than description", () => {
    const tokens = tokenizeQuery("frontend design");
    const nameHit = scoreSkillText(tokens, "frontend-design", "something else");
    const descHit = scoreSkillText(tokens, "other", "helps with frontend design work");
    expect(nameHit).toBeGreaterThan(descHit);
  });

  it("returns 0 when nothing matches", () => {
    expect(scoreSkillText(tokenizeQuery("seo"), "ponytail", "lazy senior")).toBe(0);
  });

  it("does not match substrings inside name tokens", () => {
    expect(scoreSkillText(["change"], "build-game-changelog", "")).toBe(0);
  });

  it("ignores stopwords in the query", () => {
    expect(scoreSkillText(["add", "new"], "add-feature", "add new things")).toBe(0);
  });

  it("scores whole name tokens and description words", () => {
    expect(scoreSkillText(["stripe"], "stripe-billing", "")).toBe(6);
    expect(scoreSkillText(["stripe"], "stripe", "")).toBe(10);
    expect(scoreSkillText(["billing"], "payments", "Stripe billing helpers")).toBe(2);
  });
});

describe("requirementRelevance", () => {
  it("reports hits", () => {
    const r = requirementRelevance(["stripe", "billing"], "stripe-integration", "Billing and subscriptions");
    expect(r).toEqual({ score: 8, nameHits: ["stripe"], descHits: ["billing"] });
  });
});
