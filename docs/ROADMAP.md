# Roadmap

## Phase 0 — Research (updated 2026-11-05)

- Live-verified priority references
- GSD marked archived / IGNORE
- Layer A skills installed for development (Superpowers, Ponytail, Graphify, …)
- Architecture docs aligned to master handoff

## Phase 1 — Minimal CLI (**implemented**)

- `ezy --help` / `ezy doctor` / `ezy analyze`
- Vitest coverage; TypeScript / pnpm monorepo

## Phase 2 — Discovery (**implemented**)

- `ezy search` / `ezy inspect` / `ezy recommend`
- Sources: local `.agents/skills` + `skills-lock.json`, skills.sh API

## Phase 3 — Decision engine (**implemented**)

- `ezy plan "<outcome>" [--local-only]` — capabilities + minimum skill set
- Heuristic lexicon + reuse of recommend; never installs/runs

## Phase 4 — Install + one runtime adapter

- Approval UX (suggest-then-go); single tested adapter first
- Path to trusted auto for allowlisted skills/sources

## Phase 5 — Verification + memory (only if needed)

## Phase 6 — Web UI (same core as CLI)
