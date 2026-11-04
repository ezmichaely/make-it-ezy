import { describe, expect, it } from "vitest";
import { scoreSkillText, tokenizeQuery } from "./score-skill.js";

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
});
