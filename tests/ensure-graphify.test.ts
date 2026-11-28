import { describe, expect, it, vi } from "vitest";
import { hasGraphify, ensureGraphify } from "../scripts/ensure-graphify.mjs";

describe("hasGraphify", () => {
  it("returns true when `graphify --version` exits 0", () => {
    const run = vi.fn(() => ({ status: 0 }));
    expect(hasGraphify(run)).toBe(true);
    expect(run).toHaveBeenCalledWith("graphify", ["--version"], { stdio: "ignore" });
  });

  it("returns false when `graphify --version` exits non-zero or throws", () => {
    expect(hasGraphify(() => ({ status: 1 }))).toBe(false);
    expect(
      hasGraphify(() => {
        throw new Error("ENOENT");
      }),
    ).toBe(false);
  });
});

describe("ensureGraphify", () => {
  it("is a no-op when `graphify` is already on PATH", () => {
    const run = vi.fn(() => ({ status: 0 }));
    const log = vi.fn();
    expect(ensureGraphify(run, log)).toBe(true);
    expect(run).toHaveBeenCalledTimes(1); // only version check, no installer
    expect(run).toHaveBeenCalledWith("graphify", ["--version"], { stdio: "ignore" });
  });

  it("uses `uv tool install graphifyy` first when `uv` is available and CLI was missing", () => {
    let graphifyOk = false;
    const calls: string[] = [];
    const run = (cmd: string, args: string[]) => {
      calls.push(`${cmd} ${args.join(" ")}`.trim());
      if (cmd === "graphify" && args[0] === "--version") return { status: graphifyOk ? 0 : 1 };
      if (cmd === "uv" && args[0] === "--version") return { status: 0 };
      if (cmd === "pipx" && args[0] === "--version") return { status: 1 };
      if (cmd === "python3" && args[0] === "-m" && args[1] === "pip" && args[2] === "--version") return { status: 0 };
      if (cmd === "python" && args[0] === "-m" && args[1] === "pip" && args[2] === "--version") return { status: 1 };
      if (cmd === "uv" && args[0] === "tool" && args[1] === "install") {
        graphifyOk = true;
        return { status: 0 };
      }
      return { status: 1 };
    };
    expect(ensureGraphify(run, () => undefined)).toBe(true);
    expect(calls.some((c) => c === "uv tool install graphifyy")).toBe(true);
  });

  it("is non-fatal when no installer exists / nothing becomes available", () => {
    const run = () => ({ status: 1 });
    expect(ensureGraphify(run, () => undefined)).toBe(false);
  });

  it("is non-fatal when installer command throws", () => {
    const run = (cmd: string) => {
      if (cmd === "graphify") return { status: 1 };
      throw new Error("ENOENT");
    };
    expect(ensureGraphify(run, () => undefined)).toBe(false);
  });
});
