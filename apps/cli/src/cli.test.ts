import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const cliEntry = join(root, "apps/cli/src/index.ts");
const tsx = join(root, "node_modules/tsx/dist/cli.mjs");

function runEzy(args: string[]) {
  return spawnSync(process.execPath, [tsx, cliEntry, ...args], {
    encoding: "utf8",
    cwd: root,
    env: process.env,
  });
}

describe("ezy CLI", () => {
  it("prints help", () => {
    const result = runEzy(["--help"]);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Usage:");
    expect(result.stdout).toContain("doctor");
    expect(result.stdout).toContain("analyze");
    expect(result.stdout).toContain("search");
    expect(result.stdout).toContain("inspect");
  });

  it("searches local skills", () => {
    const result = runEzy(["search", "ponytail", "--local-only"]);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Make It Ezy — search");
    expect(result.stdout).toContain("ponytail");
    expect(result.stdout).toContain("nothing was installed");
  });

  it("requires a search query", () => {
    const result = runEzy(["search"]);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Usage: ezy search");
  });

  it("inspects a local skill", () => {
    const result = runEzy(["inspect", "ponytail", "--local-only"]);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Make It Ezy — inspect");
    expect(result.stdout).toContain("ponytail");
    expect(result.stdout).toContain("Risk findings");
  });

  it("fails inspect for unknown skills", () => {
    const result = runEzy(["inspect", "definitely-missing-skill-xyz", "--local-only"]);
    expect(result.status).toBe(1);
    expect(result.stdout).toContain("not found locally");
  });

  it("runs doctor", () => {
    const result = runEzy(["doctor"]);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Node.js");
    expect(result.stdout).toContain("Status:");
  });

  it("runs analyze on this repo", () => {
    const result = runEzy(["analyze"]);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Make It Ezy");
    expect(result.stdout).toContain("Package manager");
  });

  it("rejects unknown commands", () => {
    const result = runEzy(["swarm"]);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Unknown command");
  });
});
