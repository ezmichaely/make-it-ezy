# Task 003 — Reconcile Agent Reading Order

## Goal

Make the new sequential execution plan discoverable without creating a competing source of truth.

## Status note (2026-11-27)

The execution-plan pointer has already been added to `AGENTS.md`, `docs/AGENT-WORKFLOW.md`, `docs/STATUS.md`, `README.md`, and `docs/handoff/README.md`. This task now focuses on the remaining reading-order/precedence reconciliation rather than re-adding the pointer.

## Scope

### In scope

- `AGENTS.md`
- `docs/AGENT-WORKFLOW.md`
- `docs/EXECUTION-PLAN.md`
- `docs/decisions/README.md`
- `README.md`
- `docs/handoff/README.md`
- `docs/STATUS.md`
- `docs/architecture/SHARED-EVIDENCE-LEARNING.md`
- `docs/ROADMAP.md` (only for horizon/terminology notes already identified)
- `CONTRIBUTING.md` and `docs/CI.md` (only for the ci-before-push path fix)
- links/index references only where necessary

### Out of scope

- product behavior
- implementation code
- rewriting architecture or roadmap decisions beyond the identified drift

## Required behavior

Agents should know:

1. `AGENTS.md` is the first operating guide.
2. `docs/EXECUTION-PLAN.md` is the active audit-reconciliation queue.
3. Individual task files under `docs/execution/` are atomic implementation instructions.
4. The execution plan does not override `docs/ROADMAP.md` or `docs/MVP-SPECIFICATION.md`.

## Acceptance criteria

- An unfamiliar coding agent can discover the execution queue from the mandatory reading path.
- No duplicate roadmap or product specification is introduced.
- Existing source-of-truth hierarchy remains intact.

## Validation

Read the modified documents together and verify there is one unambiguous path:

```
AGENTS.md
  → AGENT-WORKFLOW.md
  → ROADMAP / MVP
  → EXECUTION-PLAN
  → current atomic task
```

## Additional verified findings (folded in)

- The precedence wording differs between `AGENTS.md` and `docs/decisions/README.md`; clarify the scoped precedence rules rather than leaving two orderings.
- `README.md` routes "Product intent/trust" to the handoff, while the handoff points to `docs/PRODUCT-DIRECTION.md`; reconcile the pointer.
- Ensure the final reading path includes `docs/STATUS.md` and `docs/PRODUCT-DIRECTION.md` where relevant, without creating a competing source of truth.
- `docs/architecture/SHARED-EVIDENCE-LEARNING.md` says lifecycle contracts are "now implemented" / "provide structured outcome evidence" in a way that can be read as active runtime behavior; clarify they are boundary contracts, not wired into the CLI/planner.
- `docs/ROADMAP.md` horizon stops before agent-control/router/Home Node; add a clearly marked "Beyond Phase 14 — unscheduled / decision-gated" note and disambiguate "Web UI (Phase 10, same core decision layer)" from the FUTURE-ECOSYSTEM "control cockpit".
- `CONTRIBUTING.md` and `docs/CI.md` link to `.agents/skills/ci-before-push/SKILL.md` (gitignored). Point to the tracked `skills/ci-before-push/SKILL.md`.

## Next

Task 004.
