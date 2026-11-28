# Archived work plans — index

> **Status:** historical implementation plans. Completed or superseded. Not authority, not a work order.

These are the task-by-task plans that built Phases 2–8. They are kept as the "how it was built"
record. Current work is driven by [`docs/EXECUTION-PLAN.md`](../../EXECUTION-PLAN.md).

## Index

| Plan | Phase | Outcome |
|---|---|---|
| [`superpowers/2026-11-05-phase2-recommend.md`](./superpowers/2026-11-05-phase2-recommend.md) | 2 | Added `ezy recommend <query> [--local-only]` with Recommended / Optional / Not needed buckets. |
| [`superpowers/2026-11-05-phase3-plan.md`](./superpowers/2026-11-05-phase3-plan.md) | 3 | Added `ezy plan "<outcome>"` mapping capabilities to a minimum skill shortlist. |
| [`superpowers/2026-11-05-phase4-install.md`](./superpowers/2026-11-05-phase4-install.md) | 4 | Gated skill install with optional TTY arrow picker; `--yes` or confirm required. |
| [`superpowers/2026-11-05-phase4-agent-skill.md`](./superpowers/2026-11-05-phase4-agent-skill.md) | 4 | Shipped the markdown-only `skills/ezy/SKILL.md` adapter. |
| [`superpowers/2026-11-05-phase4-handoff.md`](./superpowers/2026-11-05-phase4-handoff.md) | 4 | Added `ezy next` and reprinting the handoff after successful installs. |
| [`superpowers/2026-11-05-phase5-project-capability-planner.md`](./superpowers/2026-11-05-phase5-project-capability-planner.md) | 5 | Made `plan` / `next` project-aware; kept install/handoff gates unchanged. |
| [`superpowers/2026-11-06-phase6-agent-brief.md`](./superpowers/2026-11-06-phase6-agent-brief.md) | 6 | Added `brief.ts` and `select.ts`; coverage scoring plus greedy cover; `ezy brief` and `--brief`. |
| [`superpowers/2026-11-17-phase7-project-brain.md`](./superpowers/2026-11-17-phase7-project-brain.md) | 7 | Added `brain.ts`, `.ezy/brain.json` merge-save, and `ezy brain enrich`. |
| [`superpowers/2026-11-18-phase8-launch.md`](./superpowers/2026-11-18-phase8-launch.md) | 8 | Early launch plan for publishing two packages. Superseded by shipped single-package `make-it-ezy` distribution; kept for history. |
| [`FOLLOW-UP-WORK-PLAN-2026-11-25.md`](./FOLLOW-UP-WORK-PLAN-2026-11-25.md) | — | **Proposal only — nothing was started.** Superseded by the canonical audit and `docs/EXECUTION-PLAN.md`. |

## Reading rule

These describe how shipped behavior was built. They are not a queue. Do not reopen a plan
because it still has unchecked boxes — verify the current code and the execution plan first.
