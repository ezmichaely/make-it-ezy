# Roadmap

Locked phase sequence and shipped status. Product definition / trust rules: [`handoff/MAKE-IT-EZY-HANDOFF.md`](./handoff/MAKE-IT-EZY-HANDOFF.md).

## Current work (2026-11-24)

Phases 0–7 are shipped. Audit findings **1–4** in [`audits/2026-11-07-codebase-gaps.md`](./audits/2026-11-07-codebase-gaps.md) are **resolved** (sanitized skill output, monorepo root detection, local-first selection, YAML chomping). **Phase 8 — Launch and Distribution** is current. Phase 9 — outcome verification is post-launch work; exhaustive per-skill testing is not a launch gate. Audit findings **5–10** remain optional follow-up maintenance.

Shared instructions for Codex, Cursor, Claude Code, and Qwen Code: [`../AGENTS.md`](../AGENTS.md). The roadmap remains authoritative for phase order; the audit does not renumber or replace phases.

**Shipped within Phase 8 (not a new phase):** [Broker-directed workflow](./superpowers/specs/2026-11-18-broker-orchestrated-skills-design.md) — contractor routing + ordered handoff stages. The core routing, `ezy next` Workflow output, `skills/ezy` adapter, and documentation sync are now present. Keep the workflow extensible without turning contractors into mandatory runtime dependencies.

## Scope (decided 2026-11-06) — canonical

**General by design, specific by launch.**

| | |
|---|---|
| **Vision** | Any goal, any domain: *"Tell Ezy what you want. It figures out what you need."* Ezy **decides** what's needed; the agent runtime (Claude Code / Cursor / Codex) **does** the work. |
| **Today** | **Coding tasks in your repo.** JS/TS projects first, Python next. Skills from local `.agents/skills` and skills.sh. |
| **Later** | Other domains (video, research, documents, engineering, …), added **one at a time** — not "everything at once". |

Why: every domain needs its own project inspection, skill sources, golden cases and (Phase 9) verification. One domain at a time keeps each phase small and testable. The brief path (Phase 6) is already domain-neutral, so adding a domain does **not** require a redesign.

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

- `ezy plan "<outcome>"` (initial heuristic, outcome-only; superseded by the project-aware planner in Phase 5)

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

## Phase 7 — Project Brain (**done**)

> Spec: [`docs/superpowers/specs/2026-11-17-phase7-project-brain-design.md`](./superpowers/specs/2026-11-17-phase7-project-brain-design.md)  
> Plan: [`docs/superpowers/plans/2026-11-17-phase7-project-brain.md`](./superpowers/plans/2026-11-17-phase7-project-brain.md)

- `ezy brain` / `brain refresh` / `brain enrich`; `.ezy/brain.json` machine slice on plan/next
- Optional host-maintained `agent` slice (decisions, conventions, rejected skills)

## Phase 8 — Launch and Distribution (**current**)

### Lifecycle contract slice

The Phase 8 lifecycle contract slice includes small internal contracts for intent clarification/intake, explicit skill evaluation state, skill specification/composition, outcome evaluation (PASS / FAIL / UNCERTAIN), and privacy-safe evidence aggregation with reversible improvement proposals.

These contracts are not a hosted telemetry system and do not auto-modify Ezy. Full execution-time outcome verification remains Phase 9. They are exported and unit-tested but **not wired into the CLI/planner path** — see [`audits/FULL-REPOSITORY-AUDIT.md`](./audits/FULL-REPOSITORY-AUDIT.md) §6 and work-plan item 1.

- Make the CLI installable and usable outside this repository. The root workspace remains private; the release workflow creates GitHub releases but does not publish the CLI/core packages to npm.
- Document and verify the first-user install path.
- Keep external skill discovery broad and automated; do not require manual tests for every skill before launch.
- Rank recommendations with task fit plus public reputation and maintenance evidence (for example installs, source provenance, and update activity).
- Show the evidence and Ezy review state clearly. Reputation supports discovery; it does not certify safety or quality.
- Keep installs user-approved. Deep per-skill verification can add stronger evidence after launch.

## Phase 9 — Verification (**later**)

- Check that the outcome was actually achieved after handoff/execution
- Add deeper skill verification when it serves a concrete launch or user need; do not block launch on validating every catalog entry

## Phase 10 — Web UI (**later**)

- Same core as CLI

## Deliberately not scheduled as “next”

- Soft-C (CLI spawning Codex/Claude)
- Deep skill verification / trusted-auto allowlists
- Codex marketplace plugin
- Giant skill marketplace / filled `catalog/`
- Mandatory Superpowers or Graphify at product runtime
