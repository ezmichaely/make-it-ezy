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

- `ezy search <query> [--local-only]`
- `ezy inspect <skill> [--local-only]`
- `ezy recommend <query> [--local-only]` — Recommended / Optional / Not needed (heuristic, never installs)
- Sources: local `.agents/skills` + `skills-lock.json`, skills.sh API
- North star later: suggest-then-go → trusted auto-run (not this phase)

## Phase 3 — Decision engine

- Freeform outcome → minimum useful capability selection + explanations
  (`ezy "Build me a beautiful SaaS dashboard"`)

## Phase 4 — Install + one runtime adapter

- Approval UX (suggest-then-go); single tested adapter first
- Path to trusted auto for allowlisted skills/sources

## Phase 5 — Verification + memory (only if needed)

## Phase 6 — Web UI (same core as CLI)
