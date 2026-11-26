# Task 003 — Reconcile Agent Reading Order

## Goal

Make the new sequential execution plan discoverable without creating a competing source of truth.

## Scope

### In scope

- `AGENTS.md`
- `docs/AGENT-WORKFLOW.md`
- `docs/EXECUTION-PLAN.md`
- links/index references only where necessary

### Out of scope

- product behavior
- roadmap phase definitions
- architecture
- implementation code

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

## Next

Task 004.
