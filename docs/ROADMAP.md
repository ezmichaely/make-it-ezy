# Roadmap

## Phase 0 — Research (**done**)

## Phase 1 — Minimal CLI (**done**)

## Phase 2 — Discovery (**done**)

- `search` / `inspect` / `recommend`

## Phase 3 — Decision engine (**done**)

- `ezy plan "<outcome>"` (heuristic, outcome-only — not yet project-aware)

## Phase 4 — Install + adapters (**mostly done**)

- `ezy install <skill> [--yes] [--source …]`
- `ezy install --plan "…" / --query "…"` with TTY arrow picker
- Install via `npx skills add` → `.agents/skills` (Cursor-local) — adapter #0
- `ezy next "<outcome>"` — paste-ready checklist + agent prompt
- Agent Skill adapter #1: `skills/ezy/SKILL.md` (Claude `/ezy`, Cursor/Codex skills)
- CI: strict ESLint + `tsc` + Vitest + build + `pnpm audit` + CodeQL (`docs/CI.md`)
- Still TODO later: deep verify, soft-C spawn, Codex marketplace plugin, trusted auto

## Phase 5 — Project Capability Planner (**done**)

> Spec: `docs/superpowers/specs/2026-11-05-phase5-project-capability-planner-design.md`  
> Plan: `docs/superpowers/plans/2026-11-05-phase5-project-capability-planner.md`

- Wire `analyze` into `plan` / `next`
- Requirements from goal **+** project
- Filter to minimum useful skill set with exclusion reasons
- No LLM, no Soft-C, no mandatory Graphify

## Phase 6 — Agent Brief + Decision Quality (**done**)

> Spec: `docs/superpowers/specs/2026-11-06-phase6-agent-brief-design.md`  
> Plan: `docs/superpowers/plans/2026-11-06-phase6-agent-brief.md`

- `ezy brief` → host agent researches the outcome and writes `.ezy/brief.json`
- `plan` / `next` / `install --plan` accept `--brief`; invalid briefs exit 2
- Requirement-covering minimum set with explanations; heuristic fallback without a brief

## Phase 7 — Project Brain (**later**)

> Spec (deferred): `docs/superpowers/specs/2026-11-06-phase6-project-brain-design.md`

- Lightweight persistent project knowledge (not a repo dump)
- Avoid repeated rediscovery across agent sessions

## Phase 8 — Verification (**later**)

- Check that the outcome was actually achieved after handoff/execution

## Phase 9 — Web UI (**later**)

- Same core as CLI

## Deliberately not scheduled as “next”

- Soft-C (CLI spawning Codex/Claude)
- Deep skill verification / trusted-auto allowlists
- Codex marketplace plugin
- Giant skill marketplace / filled `catalog/`
- Mandatory Superpowers or Graphify at product runtime
