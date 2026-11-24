# Broker Workflow Implementation Plan

> **For agentic workers:** Implement inline in this session, task by task. Keep the user's existing working-tree changes intact.

**Goal:** Make Ezy route a coding task to a contractor-style skill set or individual skills and give the host agent an ordered workflow, including temporary instructions for uncovered work.

**Architecture:** Keep discovery and selection in `packages/core`; represent contractor entries as a small typed catalog alongside existing skill results. Extend the existing plan and handoff report with ordered workflow stages, then teach the `/ezy` adapter to execute those stages. Do not add a runtime agent, database, new discovery service, or dependency.

**Tech Stack:** TypeScript, Node.js, pnpm workspace, existing local + skills.sh discovery.

**Spec:** `docs/superpowers/specs/2026-11-18-broker-orchestrated-skills-design.md`

## Implementation status (2026-11-19)

Work on `feat/phase8-launch`. Tasks 1–2 and adapter steps in `skills/ezy/SKILL.md` are in tree; verify with `pnpm build` / `pnpm test`.

| Task | Status |
|------|--------|
| Task 1 — Contractor catalog + plan routing | **Done** |
| Task 2 — Ordered workflow in handoff | **Done** |
| Task 3 — `/ezy` adapter + doc sync | **Done** (adapter + HOW-IT-WORKS/MVP/ROADMAP synced; build/test not run in this environment) |

Spec comparison detail: [spec § Implementation status](../specs/2026-11-18-broker-orchestrated-skills-design.md#implementation-status-vs-plan-2026-11-19).

## Global Constraints

- Ezy coordinates and routes; the host agent reads/runs the skills and performs the work.
- Keep external skills untrusted; do not install or run them silently.
- Use a contractor as one workflow unit; allow individual skills to fill specialist stages.
- If no skill covers a required stage, emit temporary task-specific instructions; do not add them to the catalog automatically.
- Preserve existing user changes and avoid new runtime dependencies or hosted services.
- The graphify-out graph is stale (built Nov 6); verify all code details against current sources.
- Do not add or run tests in this task unless the user asks for test/verification work; use build/typecheck checks only.

## Review Focus

- A non-coding/research brief must not receive the coding contractor recommendation.
- A contractor recommendation must not be mistaken for an installed atomic skill or silently installed.
- A selected contractor's own workflow must remain intact; Ezy should not flatten its internal skills into fake individual candidates.
- Requirements with no selected skill must remain visible as temporary host-agent work.
- Existing handoff generation from `install --plan` and `install --query` must continue to work with optional workflow data.

---

### Task 1: Add contractor catalog and plan routing

**Files:**
- Create: `packages/core/src/contractors.ts`
- Modify: `packages/core/src/plan-types.ts`
- Modify: `packages/core/src/plan.ts`
- Modify: `packages/core/src/index.ts`

**Interfaces:**
- Produces `Contractor` and `ContractorRecommendation` types and a small built-in Superpowers contractor entry with source `obra/superpowers`, applicability to coding task types, and a note that it owns its internal workflow.
- `PlanReport.contractors` contains recommended contractor records selected for the current task; it defaults to an empty array for empty/invalid input paths.
- Recommend Superpowers only for brief task types `feature`, `bugfix`, `refactor`, `greenfield`, and `ui-change`; do not recommend for `research` or `other`.

- [x] Add the types and contractor entry in `contractors.ts`.
- [x] Extend `PlanReport` and every constructor in `plan.ts` with `contractors`.
- [x] Select the contractor from a validated brief task type without changing existing individual-skill scoring.
- [x] Export the new public types/entry from `packages/core/src/index.ts`.
- [x] Run `pnpm --filter @make-it-ezy/core build` and read the output. *(Passes only after Task 2 fills required `HandoffReport` fields — currently fails on `handoff.ts`.)*

### Task 2: Produce an ordered workflow in the handoff

**Files:**
- Modify: `packages/core/src/handoff-types.ts`
- Modify: `packages/core/src/handoff.ts`
- Modify: `packages/core/src/format.ts`
- Modify: `packages/core/src/plan.ts`

**Interfaces:**
- `WorkflowStage` is a discriminated union for `contractor`, `skill`, and `custom` stages; each stage has an order, task, and reason, and skill/contractor stages carry their source and installation state.
- `HandoffReport.workflow` is always present (possibly empty).
- A selected contractor is the workflow owner; ordered requirement stages use selected individual skills where available; uncovered required work becomes a custom stage with temporary instructions.

- [x] Derive ordered workflow stages from the plan's requirements, contractor recommendation, selected skills, and uncovered requirements.
- [x] Include stages in `HandoffReport` and compose them in `buildHandoff` and `composeHandoffFromItems`.
- [x] Format a `Workflow` section and a prompt that tells the host agent to follow the contractor's own process and load individual skills at their assigned stages.
- [x] Keep installation checks explicit and retain current behavior for callers that do not supply contractors.
- [x] Pass `plan.contractors` from `buildHandoff` into `composeHandoffFromItems`.
- [ ] Run `pnpm --filter @make-it-ezy/core build` and `pnpm --filter @make-it-ezy/cli build`; inspect output.

### Task 3: Make `/ezy` follow the routed workflow and sync docs

**Files:**
- Modify: `skills/ezy/SKILL.md`
- Modify: `docs/MVP-SPECIFICATION.md`
- Modify: `docs/HOW-IT-WORKS.md`
- Modify: `docs/architecture/ARCHITECTURE.md`
- Modify: `docs/ROADMAP.md`
- Modify: `AGENTS.md`

**Interfaces:**
- The adapter uses the `Workflow` output from `ezy next`, preserves approval-gated installs, lets a selected contractor run its own intake, and performs uncovered custom stages without persisting them as skills.
- Shipped docs describe only behavior implemented by the CLI and adapter; broader GitHub discovery remains future work if not included in this slice.

- [x] Update the adapter steps to show route → approve any install → execute each workflow stage in order → report the result.
- [ ] Update MVP and one-page workflow to distinguish current contractor routing from future broader source discovery.
- [ ] Update architecture, roadmap, and root agent guide to reflect the approved broker direction and current shipped slice.
- [ ] Run `pnpm typecheck` and `pnpm build`; inspect output. Do not run tests in this task.