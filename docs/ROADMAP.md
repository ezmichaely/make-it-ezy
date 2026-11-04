# Roadmap

## Phase 0 — Research (updated 2026-11-05)

- Live-verified priority references
- GSD marked archived / IGNORE
- Layer A skills installed for development (Superpowers, Ponytail, Graphify, …)
- Architecture docs aligned to master handoff

## Phase 1 — Minimal CLI (**implemented**)

- `ezy --help` / `ezy doctor` / `ezy analyze`
- Vitest coverage; TypeScript / pnpm monorepo

## Phase 2 — Discovery (**in progress**)

- `ezy search <query> [--local-only]` — **implemented**
- `ezy inspect <skill> [--local-only]` — **implemented** (provenance, files, shallow risk notes)
- Sources: local `.agents/skills` + `skills-lock.json`, skills.sh API
- Still TODO: compare/recommend UX, approval-gated install

## Phase 3 — Decision engine

- Minimum useful capability selection + explanations

## Phase 4 — Install + one runtime adapter

- Approval UX; single tested adapter first

## Phase 5 — Verification + memory (only if needed)

## Phase 6 — Web UI (same core as CLI)
