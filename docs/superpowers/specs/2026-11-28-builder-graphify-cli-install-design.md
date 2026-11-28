# Builder Graphify CLI Auto-Install

**Status:** Approved direction B (contributors, not product users)
**Date:** 2026-11-28

## Intent

Fresh clone → `pnpm install` → `pnpm skills:install` should leave a contributor with the vendored `graphify` skill **and**, best-effort, a standalone `graphify` CLI for `graphify query`, without manual `uv/pipx/pip install graphifyy`.

## Goals

- Contributors building Make It Ezy, not `make-it-ezy` package users.
- `pnpm skills:install` remains the builder-skill flow; add a best-effort `graphify` CLI ensure step.
- No-op if `graphify` already on `PATH`.
- Non-fatal: `pnpm skills:install` succeeds even without Python/uv/pipx/network.
- Not wired into `pnpm check:ci`. Not a product runtime dependency. Not published.
- Committed `graphify-out/` map remains readable without the CLI.
- `pnpm skills:graphify` alias runs just the ensure step.

## Non-goals

- No product packaging changes; no `apps/` or `packages/` changes.
- No new JS runtime dependency.
- No making Graphify mandatory.
- No silent third-party execution; `pnpm skills:install` is explicit.
- No automatic `graphify update .`.
- No requiring Python on machines.
- No removal of vendored `graphify` skill.

## Approach

`pnpm skills:install` = `node scripts/bootstrap-global-skills.mjs && node scripts/link-builder-skills.mjs && node scripts/ensure-graphify.mjs`. `scripts/ensure-graphify.mjs` uses Node `spawnSync`; checks `graphify --version`; if missing, tries `uv tool install graphifyy`, then `pipx install graphifyy`, then `python3 -m pip install graphifyy`, then `python3 -m pip install graphifyy --break-system-packages`, then `python -m pip install graphifyy`, then `python -m pip install graphifyy --break-system-packages`. Re-checks `graphify` after each installer. Logs; never `process.exit(1)` for missing Python/installer failure. Package `graphifyy`, CLI `graphify`.

## Validation

`pnpm check:ci` passes. Unit tests for the pure ensure logic with injected `spawnSync`; no network in tests. `graphify --version` smoke on this machine.
