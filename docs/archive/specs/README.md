# Archived specs — index

> **Status:** historical design specifications. The behavior they describe is now represented by
> current docs and code. Not authority, not a work order.

These are the approved Phase 2–7 designs. They are kept because they explain *why* the shipped
behavior looks the way it does. They are **not** a description of current behavior — read
`docs/MVP-SPECIFICATION.md` and the implementation for that.

## Index

| Spec | Status at archive | Phase | What it designed |
|---|---|---|---|
| [`2026-11-05-phase2-recommend-design.md`](./superpowers/2026-11-05-phase2-recommend-design.md) | approved | 2 | `ezy recommend` — discover-only shortlist bucketed into Recommended / Optional / Not needed. No install. |
| [`2026-11-05-phase3-plan-design.md`](./superpowers/2026-11-05-phase3-plan-design.md) | approved | 3 | `ezy plan` — outcome → capabilities → minimum skill shortlist, still discover-only. |
| [`2026-11-05-phase4-install-design.md`](./superpowers/2026-11-05-phase4-install-design.md) | approved | 4 | `ezy install` — gated skill install with an explicit confirm step. |
| [`2026-11-05-phase4-agent-skill-design.md`](./superpowers/2026-11-05-phase4-agent-skill-design.md) | approved | 4 | `skills/ezy/SKILL.md` — adapter #1 (approach A), a markdown wrapper around the CLI. |
| [`2026-11-05-phase4-handoff-design.md`](./superpowers/2026-11-05-phase4-handoff-design.md) | approved | 4 | `ezy next` — checklist plus paste-ready host-agent prompt. |
| [`2026-11-05-phase5-project-capability-planner-design.md`](./superpowers/2026-11-05-phase5-project-capability-planner-design.md) | approved | 5 | Project-aware `plan` / `next` (approach A: evolve `planOutcome` in place). |
| [`2026-11-06-phase6-agent-brief-design.md`](./superpowers/2026-11-06-phase6-agent-brief-design.md) | shipped | 6 | Agent Brief + decision quality — requirement coverage, explained minimum set. |
| [`2026-11-06-phase6-project-brain-design.md`](./superpowers/2026-11-06-phase6-project-brain-design.md) | superseded | 6 | Early Project Brain design (silent cache refreshed by `plan` / `next`). Superseded by the Phase 7 hybrid design; kept for history. |
| [`2026-11-17-phase7-project-brain-design.md`](./superpowers/2026-11-17-phase7-project-brain-design.md) | shipped | 7 | `.ezy/brain.json` hybrid B — machine slice in the CLI, optional agent slice via `ezy brain enrich`. |

## Not in this folder

- **Phase 8 (Launch and Distribution)** specs are still under `docs/superpowers/specs/` because
  they are the current phase's documents — although they currently contradict shipped
  distribution and are the subject of **Task 002**.
- Phase 0–1 designs predate the archived set.

## Reading rule

Use these to understand a past design decision. Do not treat any status line in them as current.
