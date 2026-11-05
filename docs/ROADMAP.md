# Roadmap

## Phase 0 — Research (**done**)

## Phase 1 — Minimal CLI (**done**)

## Phase 2 — Discovery (**done**)

- `search` / `inspect` / `recommend`

## Phase 3 — Decision engine (**done**)

- `ezy plan "<outcome>"`

## Phase 4 — Install + adapters (**mostly done**)

- `ezy install <skill> [--yes] [--source …]`
- `ezy install --plan "…" / --query "…"` with TTY arrow picker
- Install via `npx skills add` → `.agents/skills` (Cursor-local) — adapter #0
- `ezy next "<outcome>"` — paste-ready checklist + agent prompt
- Agent Skill adapter #1: `skills/ezy/SKILL.md` (Claude `/ezy`, Cursor/Codex skills)
- CI: strict ESLint + `tsc` + Vitest + build + `pnpm audit` + CodeQL (`docs/CI.md`)
- Still TODO: deep verify, soft-C spawn, Codex marketplace plugin, trusted auto

## Phase 5 — Verification + memory (only if needed)

## Phase 6 — Web UI (same core as CLI)
