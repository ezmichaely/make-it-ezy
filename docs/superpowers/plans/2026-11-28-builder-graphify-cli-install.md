# Builder Graphify CLI Auto-Install Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `pnpm skills:install` best-effort installs standalone `graphify` CLI (`graphifyy`) for contributors without failing, and `pnpm skills:graphify` runs just that step.

**Architecture:** Add `scripts/ensure-graphify.mjs`, called after existing `bootstrap` + `link`. `spawnSync` checks `graphify --version`; missing CLI triggers non-fatal installers. Pure exported helpers are tested with injected `spawnSync`. No new JS dependency.

**Tech Stack:** Node.js >=20 ESM, `node:child_process.spawnSync`, `node:url`, Vitest; optional Python/uv/pipx at runtime; `graphifyy` pip package.

**Spec:** `docs/superpowers/specs/2026-11-28-builder-graphify-cli-install-design.md`

## Global Constraints

- Contributors building Make It Ezy; not `make-it-ezy` package users.
- No `apps/` or `packages/` changes; no product packaging; no published artifacts.
- No new JS runtime dependency; `pnpm check:ci` must not require `graphify`, Python, `uv`, `pipx`, or network.
- No-op when `graphify --version` succeeds (status 0).
- Non-fatal: `pnpm skills:install` still succeeds without Python/uv/pipx/installer success.
- Package name `graphifyy`; CLI `graphify`.
- Existing vendored `graphify` skill remains; committed `graphify-out/` unaffected; no automatic `graphify update .`.
- `pnpm skills:install` = `node scripts/bootstrap-global-skills.mjs && node scripts/link-builder-skills.mjs && node scripts/ensure-graphify.mjs`.
- `pnpm skills:graphify` = `node scripts/ensure-graphify.mjs`.
- No new mandatory Graphify runtime; `pnpm check:ci` unchanged.

## Review Focus

1. `graphify` already on PATH: no installer invoked; log already-installed; return `true`.
2. Missing `graphify`, `uv` available: `uv tool install graphifyy`; then re-check `graphify --version`.
3. No `uv`, `pipx` available: `pipx install graphifyy`; then re-check.
4. Only `python3` + pip: `python3 -m pip install graphifyy`; if that fails, `python3 -m pip install graphifyy --break-system-packages`; then re-check.
5. No `python3`/`python`/uv/pipx or all installers fail or no network: log clear message; return `false`; caller does not `exit(1)`; `pnpm skills:install` succeeds.
6. `pnpm check:ci` does not call `ensure-graphify`; product `package.json` `apps/cli`, `packages/core` untouched.

---

### Builder Task 1: Write failing tests for `hasGraphify` and `ensureGraphify`

**Files:**
- Create: `tests/ensure-graphify.test.ts`
- Create (later task): `scripts/ensure-graphify.mjs`

**Interfaces:**
- Consumes: `node:child_process.spawnSync`-compatible `(command, args, options) => { status: number | null; error?: unknown }`.
- Produces: `hasGraphify(run = spawnSync): boolean`
- Produces: `ensureGraphify(run = spawnSync, log = console.log): boolean`

- [ ] **Step 1: Write failing tests**

```ts
import { describe, expect, it, vi } from "vitest";
// @ts-expect-error no types in .mjs
import { hasGraphify, ensureGraphify } from "../scripts/ensure-graphify.mjs";

describe("hasGraphify", () => {
  it("returns true when `graphify --version` exits 0", () => {
    const run = vi.fn(() => ({ status: 0 }));
    expect(hasGraphify(run)).toBe(true);
    expect(run).toHaveBeenCalledWith("graphify", ["--version"], { stdio: "ignore" });
  });

  it("returns false when `graphify --version` exits non-zero or throws", () => {
    expect(hasGraphify(() => ({ status: 1 }))).toBe(false);
    expect(hasGraphify(() => { throw new Error("ENOENT"); })).toBe(false);
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
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run tests/ensure-graphify.test.ts`
Expected: FAIL — `Cannot find module '../scripts/ensure-graphify.mjs'`

- [ ] **Step 3: Commit failing test** (`test: add ensure-graphify tests`)

### Builder Task 2: Implement `scripts/ensure-graphify.mjs`

**Files:**
- Create: `scripts/ensure-graphify.mjs`
- Modify: `package.json` scripts
- Modify: `docs/BUILDER-SKILLS.md`

**Interfaces:**
- `hasGraphify(run = spawnSync): boolean`
- `ensureGraphify(run = spawnSync, log = console.log): boolean` — returns `true` if `graphify` available after attempt; `false` otherwise; never throws for installer failure; never `process.exit(1)`.
- `main(run = spawnSync, log = console.log): boolean` — calls `ensureGraphify`; returns its result.
- `commandSucceeds(command, args, run = spawnSync): boolean` — catches `error`, treats `status !== 0` / `null` as false.

- [ ] **Step 1: Implement `hasGraphify`**

```js
export function commandSucceeds(command, args, run = spawnSync) {
  try {
    const r = run(command, args, { stdio: "ignore" });
    return r.status === 0;
  } catch {
    return false;
  }
}
export function hasGraphify(run = spawnSync) {
  return commandSucceeds("graphify", ["--version"], run);
}
```

- [ ] **Step 2: Run Builder Task 1 tests; the `hasGraphify` tests pass, `ensureGraphify` still failing**

Run: `pnpm exec vitest run tests/ensure-graphify.test.ts`

- [ ] **Step 3: Implement `ensureGraphify`**

```js
export function ensureGraphify(run = spawnSync, log = console.log) {
  if (hasGraphify(run)) { log("graphify CLI already on PATH"); return true; }
  const has = (cmd, args) => commandSucceeds(cmd, args, run);
  const tryInstall = (cmd, args) => {
    try { const r = run(cmd, args, { stdio: "inherit" }); return r.status === 0; } catch { return false; }
  };
  const hasPython3 = has("python3", ["--version"]);
  const hasPython = has("python", ["--version"]);
  const pip3 = has("python3", ["-m", "pip", "--version"]);
  const pip = has("python", ["-m", "pip", "--version"]);
  const attempts = [];
  if (has("uv", ["--version"])) attempts.push(["uv", ["tool", "install", "graphifyy"]]);
  if (has("pipx", ["--version"])) attempts.push(["pipx", ["install", "graphifyy"]]);
  if (pip3) attempts.push(["python3", ["-m", "pip", "install", "graphifyy"]], ["python3", ["-m", "pip", "install", "graphifyy", "--break-system-packages"]]);
  if (pip) attempts.push(["python", ["-m", "pip", "install", "graphifyy"]], ["python", ["-m", "pip", "install", "graphifyy", "--break-system-packages"]]);
  for (const [cmd, args] of attempts) {
    log(`graphify not found; trying: ${cmd} ${args.join(" ")}`);
    tryInstall(cmd, args);
    if (hasGraphify(run)) { log("graphify CLI installed"); return true; }
  }
  log("graphify CLI not installed; vendored graphify skill + committed graphify-out still work; `graphify query` needs `graphify` on PATH (try `uv tool install graphifyy` / `pipx install graphifyy` / `pip install graphifyy`). pnpm skills:install succeeded.");
  return false;
}
```

(Use `hasPython3`/`hasPython` only to gate pip attempts; not required if pip checks suffice. Keep messages honest.)

- [ ] **Step 4: Wire scripts**

`package.json`:
```json
"skills:install": "node scripts/bootstrap-global-skills.mjs && node scripts/link-builder-skills.mjs && node scripts/ensure-graphify.mjs",
"skills:graphify": "node scripts/ensure-graphify.mjs"
```
Do **not** add to `check`, `check:ci`, `pnpm check`.

- [ ] **Step 5: Direct-run guard**

```js
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
// ... exports ...
export function main(run = spawnSync, log = console.log) { return ensureGraphify(run, log); }
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) { main(); }
```
`main()` returns boolean; do not `process.exit(1)`.

- [ ] **Step 6: Run all tests**

Run: `pnpm exec vitest run tests/ensure-graphify.test.ts`
Expected: PASS

- [ ] **Step 7: Smoke** `node scripts/ensure-graphify.mjs`; on this machine `graphify --version` → `graphify CLI already on PATH`; `graphify --version` rc 0.

- [ ] **Step 8: Commit** `feat: best-effort graphify CLI install for builders`

### Builder Task 3: Add tests for missing-CLI installer order and non-fatal fallback

**Files:** `tests/ensure-graphify.test.ts`

**Interfaces:** consumes `ensureGraphify`.

- [ ] **Step 1: Write tests**

```ts
it("uses `uv tool install graphifyy` first when `uv` is available and CLI was missing", () => {
  let graphifyOk = false;
  const calls: string[] = [];
  const run = (cmd: string, args: string[]) => {
    calls.push(`${cmd} ${args.join(" ")}`.trim());
    if (cmd === "graphify" && args[0] === "--version") return { status: graphifyOk ? 0 : 1 };
    if (cmd === "uv" && args[0] === "--version") return { status: 0 };
    if (cmd === "pipx" && args[0] === "--version") return { status: 1 };
    if (cmd === "python3" && args[0] === "--version") return { status: 0 };
    if (cmd === "python3" && args[0] === "-m" && args[1] === "pip" && args[2] === "--version") return { status: 0 };
    if (cmd === "python" && args[0] === "--version") return { status: 1 };
    if (cmd === "uv" && args[0] === "tool" && args[1] === "install") { graphifyOk = true; return { status: 0 }; }
    return { status: 1 };
  };
  expect(ensureGraphify(run, () => {})).toBe(true);
  expect(calls.some((c) => c === "uv tool install graphifyy")).toBe(true);
});

it("is non-fatal when no installer exists / nothing becomes available", () => {
  const run = () => ({ status: 1 });
  expect(ensureGraphify(run, () => {})).toBe(false);
});

it("is non-fatal when installer command throws", () => {
  const run = (cmd: string) => { if (cmd === "graphify") return { status: 1 }; throw new Error("ENOENT"); };
  expect(ensureGraphify(run, () => {})).toBe(false);
});
```

- [ ] **Step 2: Run** `pnpm exec vitest run tests/ensure-graphify.test.ts` — PASS
- [ ] **Step 3: Commit** `test: cover graphify install order and non-fatal fallback`

### Builder Task 4: Docs + full verification

**Files:** `docs/BUILDER-SKILLS.md`, `package.json` (done Builder Task 2)

- [ ] **Step 1:** `pnpm skills:install` section: `pnpm install` + `pnpm skills:install`; `pnpm skills:install` = bootstrap + link + `pnpm skills:graphify`; best-effort `graphifyy` CLI; non-fatal; not product; `pnpm check:ci` unaffected. `pnpm skills:graphify` alias. Keep `skills:global`, `skills:clean`.
- [ ] **Step 2:** `git diff --check`
- [ ] **Step 3:** `pnpm check:ci` PASS (21+ tests incl new; no network/Graphify needed)
- [ ] **Step 4:** `node scripts/ensure-graphify.mjs` smoke
- [ ] **Step 5:** Commit `docs: document builder graphify CLI auto-install`

## Self-Review

- Spec coverage: B approach, contributors-only, no product packaging, no `pnpm check:ci`, no-op when installed, non-fatal, `uv`/`pipx`/`pip`, `--break-system-packages`, alias, vendored skill unaffected, committed `graphify-out` unaffected, no `graphify update`, no new JS dep. All covered.
- Step scan: each step one action + check; no TBD; no undefined names; `hasGraphify`/`commandSucceeds`/`ensureGraphify`/`main` consistent.
- Type consistency: `run` returns `{status:number|null}`; `commandSucceeds` boolean; `ensureGraphify` boolean; `main` boolean. No later rename.
- Review Focus: six lines each have a task/test.
- Proportion: small change, short plan.

## Execution Handoff

Plan saved. **Review:** does this capture approach B? **Which execution approach?**

- **Subagent-driven** — fresh subagent per task + reviewer. Most thorough; higher cost.
- **Native** (recommended) — implement in this session; one final review. Small, sequential builder-only change.
