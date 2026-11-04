import { describe, expect, it } from "vitest";
import { parseSkillFrontmatter } from "./parse-skill-frontmatter.js";

describe("parseSkillFrontmatter", () => {
  it("parses simple name and description", () => {
    const raw = `---
name: demo
description: A short skill
---

# Demo
`;
    expect(parseSkillFrontmatter(raw)).toEqual({
      name: "demo",
      description: "A short skill",
    });
  });

  it("parses folded description blocks", () => {
    const raw = `---
name: ponytail
description: >
  Lazy senior
  mode for agents
---
`;
    const result = parseSkillFrontmatter(raw);
    expect(result.name).toBe("ponytail");
    expect(result.description).toContain("Lazy senior");
    expect(result.description).toContain("mode for agents");
  });

  it("returns nulls without frontmatter", () => {
    expect(parseSkillFrontmatter("# Just markdown")).toEqual({
      name: null,
      description: null,
    });
  });
});
