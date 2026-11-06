import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { formatBriefInstructions, loadBrief, parseBrief, sanitizeText } from "./brief.js";

function validBrief(): Record<string, unknown> {
  return {
    version: 1,
    outcome: "Accept Stripe payments in checkout",
    taskType: "feature",
    requirements: [
      {
        id: "payments",
        label: "Stripe payments",
        priority: "required",
        why: "Users must pay by card",
        searchTerms: ["stripe", "payments"],
      },
    ],
    exclusions: [{ label: "Subscriptions", why: "Out of scope" }],
    research: [{ kind: "web", finding: "Stripe Checkout is hosted", source: "https://stripe.com/docs" }],
  };
}

function errorsOf(raw: unknown): string[] {
  const r = parseBrief(raw);
  if (r.ok) throw new Error("expected failure");
  return r.errors;
}

describe("parseBrief", () => {
  it("accepts a valid brief and preserves fields", () => {
    const r = parseBrief(validBrief());
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.brief.research[0]?.source).toBe("https://stripe.com/docs");
    expect(r.brief.exclusions).toHaveLength(1);
  });

  it("defaults exclusions, research and source", () => {
    const b = validBrief();
    delete b.exclusions;
    b.research = [{ kind: "web", finding: "x" }];
    const r = parseBrief(b);
    expect(r.ok && r.brief.exclusions).toEqual([]);
    expect(r.ok && r.brief.research[0]?.source).toBeNull();
  });

  it("reports missing requirements", () => {
    const b = validBrief();
    delete b.requirements;
    expect(errorsOf(b).some((e) => e.includes("requirements:"))).toBe(true);
  });

  it("rejects more than 10 requirements", () => {
    const b = validBrief();
    const req = (b.requirements as Record<string, unknown>[])[0]!;
    b.requirements = Array.from({ length: 11 }, (_, i) => ({ ...req, id: `r-${String(i)}` }));
    expect(errorsOf(b)).toContain("requirements: at most 10");
  });

  it("rejects bad ids", () => {
    const b = validBrief();
    ((b.requirements as Record<string, unknown>[])[0]!).id = "Payments";
    expect(errorsOf(b)).toContain("requirements[0].id: must match ^[a-z0-9-]{1,40}$");
  });

  it("rejects duplicate ids", () => {
    const b = validBrief();
    const req = (b.requirements as Record<string, unknown>[])[0];
    b.requirements = [req, { ...req }];
    expect(errorsOf(b)).toContain('requirements[1].id: duplicate "payments"');
  });

  it("rejects a 201-char label", () => {
    const b = validBrief();
    ((b.requirements as Record<string, unknown>[])[0]!).label = "a".repeat(201);
    expect(errorsOf(b)).toContain("requirements[0].label: at most 200 characters");
  });

  it("names allowed taskType values", () => {
    const b = validBrief();
    b.taskType = "epic";
    const e = errorsOf(b).find((x) => x.startsWith("taskType:"));
    expect(e).toContain("ui-change");
  });

  it("rejects version 2", () => {
    const b = validBrief();
    b.version = 2;
    expect(errorsOf(b)).toContain("version: must be 1");
  });

  it("collects multiple errors", () => {
    const b = validBrief();
    b.version = 2;
    b.taskType = "epic";
    expect(errorsOf(b).length).toBeGreaterThanOrEqual(2);
  });

  it("notes unknown top-level keys", () => {
    const b = validBrief();
    b.extra = 1;
    const r = parseBrief(b);
    expect(r.ok && r.notes).toContain('ignored unknown field "extra"');
  });

  it("sanitizes unknown field names in notes", () => {
    const b = validBrief();
    b["\u202Eev\u001bil" + "x".repeat(60)] = 1;
    const r = parseBrief(b);
    const note = r.ok ? (r.notes[0] ?? "") : "";
    expect(note).toContain("ignored unknown field");
    expect(note).not.toContain("\u202E");
    expect(note).not.toContain("\u001b");
    expect(note).toContain("\u2026");
  });

  it("sanitizes strings", () => {
    const b = validBrief();
    b.research = [{ kind: "web", finding: "\u202Eevil\u200B", source: null }];
    const r = parseBrief(b);
    expect(r.ok && r.brief.research[0]?.finding).toBe("evil");
  });

  it("allows all-stopword search terms", () => {
    const b = validBrief();
    ((b.requirements as Record<string, unknown>[])[0]!).searchTerms = ["add", "new"];
    expect(parseBrief(b).ok).toBe(true);
  });

  it("rejects non-object input", () => {
    expect(errorsOf(null)).toEqual(["$: must be an object"]);
  });
});

describe("sanitizeText", () => {
  it("replaces controls with spaces and trims", () => {
    expect(sanitizeText(" a\nb\tc\u0085d ")).toBe("a b c d");
  });
});

describe("loadBrief", () => {
  const dir = mkdtempSync(join(tmpdir(), "brief-"));

  it("loads a BOM + CRLF file", () => {
    const p = join(dir, "ok.json");
    writeFileSync(p, "\uFEFF" + JSON.stringify(validBrief(), null, 2).replace(/\n/g, "\r\n"));
    expect(loadBrief(p).ok).toBe(true);
  });

  it("reports unreadable files", () => {
    const r = loadBrief(join(dir, "nope.json"));
    expect(!r.ok && r.errors[0]).toMatch(/cannot read file$/);
  });

  it("reports invalid JSON", () => {
    const p = join(dir, "bad.json");
    writeFileSync(p, "{bad json");
    const r = loadBrief(p);
    expect(!r.ok && r.errors[0]).toContain("invalid JSON");
  });
});

describe("formatBriefInstructions", () => {
  it("includes instructions, schema and next command", () => {
    const out = formatBriefInstructions("add stripe", {
      projectRoot: "/p",
      packageName: "p",
      language: "TypeScript",
      frameworks: [],
      localSkills: Array.from({ length: 10 }, (_, i) => `skill-${i}`),
    });
    expect(out).toContain(".ezy/brief.json");
    expect(out).toContain("searchTerms");
    expect(out).toContain("primary sources");
    expect(out).toContain('ezy next "add stripe" --brief .ezy/brief.json');
    expect(out).toContain("skill-7");
    expect(out).not.toContain("skill-8");
  });
});

describe("formatBriefInstructions escaping", () => {
  it("escapes shell metacharacters in the next command", () => {
    const out = formatBriefInstructions('say "hi" $HOME `x`', {
      projectRoot: null,
      packageName: null,
      language: null,
      frameworks: [],
      localSkills: [],
    });
    expect(out).toContain('ezy next "say \\"hi\\" \\$HOME \\`x\\`" --brief .ezy/brief.json');
  });
});
