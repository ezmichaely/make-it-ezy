import { describe, expect, it } from "vitest";
import { extractCapabilities } from "./capabilities.js";

describe("extractCapabilities", () => {
  it("maps promotional video outcomes", () => {
    const caps = extractCapabilities("Create a promotional video");
    expect(caps).toEqual(
      expect.arrayContaining(["video scripting", "media generation", "editing / review"]),
    );
    expect(caps.length).toBeGreaterThanOrEqual(2);
    expect(caps.length).toBeLessThanOrEqual(5);
  });

  it("maps saas dashboard outcomes", () => {
    const caps = extractCapabilities("Build me a beautiful SaaS dashboard");
    expect(caps).toEqual(expect.arrayContaining(["frontend", "UI/UX", "testing"]));
  });

  it("maps structural engineering outcomes", () => {
    const caps = extractCapabilities("Act as a structural engineer on this beam");
    expect(caps.some((c) => /domain|calculation|report/i.test(c))).toBe(true);
  });

  it("falls back when lexicon misses", () => {
    const caps = extractCapabilities("xyzzy plugh fnord");
    expect(caps.length).toBeGreaterThan(0);
    expect(caps.join(" ")).toMatch(/xyzzy|plugh|fnord/);
  });

  it("returns empty for blank outcome", () => {
    expect(extractCapabilities("   ")).toEqual([]);
  });

  it.each([
    ["add stripe", "payments"],
    ["handle webhook", "webhooks"],
    ["use prisma", "database / state"],
    ["set up nextauth", "authentication"],
    ["security audit", "security review"],
    ["work offline", "offline / PWA"],
  ])("maps %s to %s", (outcome, label) => {
    expect(extractCapabilities(outcome)).toContain(label);
  });
});
