# Decisions

This directory contains durable product and architecture decisions.

Use this area for decisions that should survive across conversations and coding agents:
- decision statement
- context/problem
- options considered
- chosen direction
- trade-offs
- consequences
- explicit non-goals
- date/status when useful

A decision should be concise and durable. Do not copy whole conversations here.

## Current decisions

| Decision | Date | Status |
|---|---|---|
| [`DECISION-SHARED-MEMORY-3C.md`](./DECISION-SHARED-MEMORY-3C.md) — git as shared memory across Claude/Cursor/Codex | 2026-11-23 | Accepted direction; implementation not specified |

Open questions that need a decision (not decisions yet): the lifecycle contract boundary vs runtime wiring, and the `docs/skill-scan/` corpus location. Inputs live in [`../audits/FULL-REPOSITORY-AUDIT.md`](../audits/FULL-REPOSITORY-AUDIT.md), [`../work-plan/FOLLOW-UP-WORK-PLAN.md`](../work-plan/FOLLOW-UP-WORK-PLAN.md) and [`../research/SKILL-SCAN-CORPUS-PLAN.md`](../research/SKILL-SCAN-CORPUS-PLAN.md).

## Precedence

When guidance conflicts:
1. Current approved decision
2. Current architecture
3. Current implementation handoff
4. Historical conversation/research

If a new discussion changes an existing decision, update or supersede the decision explicitly instead of silently creating conflicting guidance.
