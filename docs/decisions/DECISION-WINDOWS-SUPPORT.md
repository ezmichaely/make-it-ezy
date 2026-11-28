# Decision: Windows install-spawn verification

**Date:** 2026-11-28  
**Status:** Accepted; focused verification path added, full Windows support not claimed

## Decision

Choose **Option 1** from Task 013: add a focused Windows CI verification path for the external installer spawn behavior. Apply a minimal Windows-only spawn correction for `npx` because Node on Windows cannot spawn `.cmd` shims reliably without `shell: true`.

## Context / problem

`packages/core/src/install.ts` invokes the external skills installer via `spawn("npx", ...)`. On Windows, `npx` resolves to a `.cmd` shim; Node `child_process.spawn` without `shell: true` commonly fails with `ENOENT`. Task 013 required an evidence-backed Windows position, not a guessed claim.

## Evidence

- Code inspection: install path used `spawnImpl("npx", args, { stdio: ["ignore","pipe","pipe"] })` with no Windows shell handling.
- Minimal correction: `runSpawn` now sets `shell: true` only when `process.platform === "win32"`.
- CI verification: `.github/workflows/ci.yml` adds `windows-install-spawn` on `windows-latest` that installs, builds, and verifies `spawnSync("npx", ["--version"], { shell: process.platform === "win32" })` succeeds.

## Chosen direction

- Keep Linux CI as primary gate.
- Add focused Windows CI smoke for install-spawn behavior.
- Do **not** claim broad Windows support for every CLI/workflow path until verified.

## Trade-offs

- `shell: true` on Windows increases command-shell involvement; mitigated because command is fixed to `npx` and skill name/source are validated before spawn.
- Windows smoke is focused, not full CI parity.

## Consequences

- Windows install-spawn behavior has an explicit verification path.
- Any future claim of full Windows support requires broader evidence.

## Non-goals

- No broad Windows port/rewrite.
- No claim of full Windows support.
