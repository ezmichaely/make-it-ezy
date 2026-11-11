# Roadmap

Locked phase sequence and shipped status. Product definition / trust rules: [`handoff/MAKE-IT-EZY-CANONICAL-HANDOFF.md`](./handoff/MAKE-IT-EZY-CANONICAL-HANDOFF.md).

## Scope (decided 2026-11-06) — canonical

**General by design, specific by launch.**

| | |
|---|---|
| **Vision** | Any goal, any domain: *"Tell Ezy what you want. It figures out what you need."* Ezy **decides** what's needed; the agent runtime (Claude Code / Cursor / Codex) **does** the work. |
| **Today** | **Coding tasks in your repo.** JS/TS projects first, Python next. Skills from local `.agents/skills` and skills.sh. |
| **Later** | Other domains (video, research, documents, engineering, …), added **one at a time** — not "everything at once". |

Why: every domain needs its own project inspection, skill sources, golden cases and (Phase 8) verification. One domain at a time keeps each phase small and testable. The brief path (Phase 6) is already domain-neutral, so adding a domain does **not** require a redesign.

### Adding a domain (checklist)

1. **Golden cases first** — 2–4 realistic outcomes under `packages/core/src/golden/<domain>-<case>/` with must-include / must-exclude expectations. They show where Ezy breaks before any code changes.
2. **Project inspection** — detection for that domain's project markers (today: `packages/core/src/detect-*.ts`).
3. **Fallback lexicon** — entries in `packages/core/src/capabilities.ts` (the brief path needs none).
4. **Skill sources** — confirm candidate skills exist (local or skills.sh); otherwise requirements show as *Uncovered*, which is honest but not useful.
5. **Docs** — move the domain from *Later* to *Today* in this section and the README.

**Folder structure:** unchanged today. When the **second** domain lands, group domain-specific inspection + lexicon under `packages/core/src/domains/<domain>/`; the brief, scoring, selection and output modules stay shared. Do not restructure before then.

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
