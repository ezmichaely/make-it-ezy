import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { EventEmitter } from "node:events";
import { describe, expect, it, vi } from "vitest";
import { buildInstallPreview, isSkillInstalledLocally, runInstall } from "./install.js";

function fixtureWithSkill(): string {
  const root = mkdtempSync(join(tmpdir(), "ezy-install-"));
  writeFileSync(join(root, "package.json"), JSON.stringify({ name: "fixture" }));
  const skillDir = join(root, ".agents", "skills", "frontend-design");
  mkdirSync(skillDir, { recursive: true });
  writeFileSync(join(skillDir, "SKILL.md"), "---\nname: frontend-design\n---\n");
  return root;
}

function fixtureEmpty(): string {
  const root = mkdtempSync(join(tmpdir(), "ezy-install-empty-"));
  writeFileSync(join(root, "package.json"), JSON.stringify({ name: "fixture" }));
  return root;
}

describe("install", () => {
  it("detects already-installed local skills", () => {
    const root = fixtureWithSkill();
    expect(isSkillInstalledLocally("frontend-design", root)).toBe(true);
    expect(isSkillInstalledLocally("missing", root)).toBe(false);
  });

  it("builds a preview with explicit source", async () => {
    const root = fixtureEmpty();
    const preview = await buildInstallPreview("taste", {
      cwd: root,
      source: "Leonxlnx/taste-skill",
    });
    expect(preview.alreadyInstalled).toBe(false);
    expect(preview.source).toBe("Leonxlnx/taste-skill");
    expect(preview.command).toContain("npx skills add Leonxlnx/taste-skill --skill taste");
    expect(preview.destination).toContain(".agents/skills/taste");
  });

  it("skips runInstall when already installed", async () => {
    const root = fixtureWithSkill();
    const preview = await buildInstallPreview("frontend-design", {
      cwd: root,
      source: "anthropics/skills",
    });
    const result = await runInstall(preview, { cwd: root });
    expect(result.ok).toBe(true);
    expect(result.skipped).toBe(true);
    expect(result.alreadyInstalled).toBe(true);
  });

  it("runs injectable spawn when approved", async () => {
    const root = fixtureEmpty();
    const preview = await buildInstallPreview("taste", {
      cwd: root,
      source: "Leonxlnx/taste-skill",
    });

    const spawnImpl = vi.fn((_cmd: string, _args: string[]) => {
      const ee = new EventEmitter() as EventEmitter & {
        stdout: EventEmitter;
        stderr: EventEmitter;
      };
      ee.stdout = new EventEmitter();
      ee.stderr = new EventEmitter();
      queueMicrotask(() => {
        ee.stdout.emit("data", "ok");
        ee.emit("close", 0);
      });
      return ee;
    });

    const result = await runInstall(preview, {
      cwd: root,
      spawnImpl: spawnImpl as unknown as typeof import("node:child_process").spawn,
    });
    expect(result.ok).toBe(true);
    expect(spawnImpl).toHaveBeenCalled();
    expect(spawnImpl.mock.calls[0]?.[0]).toBe("npx");
    expect(spawnImpl.mock.calls[0]?.[1]).toEqual([
      "skills",
      "add",
      "Leonxlnx/taste-skill",
      "--skill",
      "taste",
    ]);
  });

  it("fails preview run when source unresolved", async () => {
    const root = fixtureEmpty();
    const preview = await buildInstallPreview("totally-unknown-skill-xyz", {
      cwd: root,
      fetchImpl: async () => new Response(JSON.stringify({ skills: [] }), { status: 200 }),
    });
    const result = await runInstall(preview, { cwd: root });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/Unresolved source/i);
  });

  it("does not perform remote lookup when localOnly is set", async () => {
    const root = fixtureEmpty();
    const fetchImpl = vi.fn(async () =>
      new Response(JSON.stringify({ skills: [] }), { status: 200 }),
    );
    const preview = await buildInstallPreview("totally-unknown-skill-xyz", {
      cwd: root,
      localOnly: true,
      fetchImpl,
    });
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(preview.source).toBe("(unresolved)");
  });

  it("does not attribute remote source from a non-exact name match", async () => {
    const root = fixtureEmpty();
    const preview = await buildInstallPreview("taste", {
      cwd: root,
      fetchImpl: async () =>
        new Response(
          JSON.stringify({
            skills: [{ name: "taste-helper", source: "other/taste-helper", installs: 50 }],
          }),
          { status: 200 },
        ),
    });
    expect(preview.source).toBe("(unresolved)");
    expect(preview.command).not.toContain("other/taste-helper");
  });

  it("resolves remote source only for an exact name match", async () => {
    const root = fixtureEmpty();
    const preview = await buildInstallPreview("taste", {
      cwd: root,
      fetchImpl: async () =>
        new Response(
          JSON.stringify({
            skills: [
              { name: "taste-helper", source: "other/taste-helper", installs: 50 },
              { name: "taste", source: "Leonxlnx/taste-skill", installs: 100 },
            ],
          }),
          { status: 200 },
        ),
    });
    expect(preview.source).toBe("Leonxlnx/taste-skill");
    expect(preview.command).toContain("npx skills add Leonxlnx/taste-skill --skill taste");
  });

  it("treats case-insensitive exact remote name match as exact", async () => {
    const root = fixtureEmpty();
    const preview = await buildInstallPreview("Taste", {
      cwd: root,
      fetchImpl: async () =>
        new Response(
          JSON.stringify({
            skills: [{ name: "taste", source: "Leonxlnx/taste-skill", installs: 100 }],
          }),
          { status: 200 },
        ),
    });
    expect(preview.source).toBe("Leonxlnx/taste-skill");
  });
});
