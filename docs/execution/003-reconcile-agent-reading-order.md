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

## Completion record

### WHAT CHANGED

- Reconciled `AGENTS.md` §1 and `docs/AGENT-WORKFLOW.md` §1 into one reading path: `AGENTS.md → AGENT-WORKFLOW → STATUS + PRODUCT-DIRECTION → README → HOW-IT-WORKS → ROADMAP → MVP-SPECIFICATION → accepted decisions → relevant architecture → EXECUTION-PLAN → current task → implementation + callers + tests`. Read `EXECUTION-PLAN` + current task before implementation; execution plan does not override `ROADMAP` or `MVP-SPECIFICATION`.
- Reconciled precedence: `docs/decisions/README.md` defers to `AGENTS.md` §2 instead of listing a second ordering; scoped notes retained.
- `README.md`: product intent/trust handoff marked context-not-authority; added `PRODUCT-DIRECTION` and `STATUS` rows.
- `docs/architecture/SHARED-EVIDENCE-LEARNING.md`: lifecycle contracts clarified as boundary contracts + local helpers, not wired into the controlling CLI/planner pipeline.
- `docs/ROADMAP.md`: Phase 10 Web UI disambiguated from FUTURE-ECOSYSTEM control cockpit; added “Beyond Phase 14 — unscheduled / decision-gated” note.
- Fixed `ci-before-push` links to tracked `skills/ci-before-push/SKILL.md`.
- Marked Task 003 complete.

### WHY

Previously `AGENTS.md` ordered implementation/callers before `EXECUTION-PLAN`, conflicting with `AGENT-WORKFLOW.md`; `docs/decisions/README.md` listed a reversed `AGENTS.md` vs accepted-decision ordering; `STATUS`/`PRODUCT-DIRECTION` were not in the mandatory path; the ci-before-push link pointed to a gitignored symlink; lifecycle docs could be read as active runtime; roadmap horizon stopped before agent-control/Home Node.

### VALIDATION

- Read modified documents together; one unambiguous path; no competing source introduced.
- No `.agents/skills/ci-before-push/SKILL.md` active links remain in `CONTRIBUTING.md`/`docs/CI.md`.
- `pnpm check:ci` PASS (21 files / 189 tests; build/lint/typecheck/audit).

### DISPOSITION

Task complete. Graphify map from PR #31 remains optional and is not a mandatory Graphify runtime. Task 004 not started.

## Next

Task 004.
