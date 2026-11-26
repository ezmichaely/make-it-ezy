# Task 004 — Contractor Presence Detection and Guidance

## Goal

Prevent Ezy from presenting a contractor workflow as immediately usable when the required contractor skill is absent locally.

## Scope

### In scope

- `packages/core/src/handoff.ts`
- `packages/core/src/handoff-types.ts`
- `packages/core/src/format.ts`
- `packages/core/src/handoff.test.ts`
- `packages/core/src/contractors.ts` only if required to identify the contractor skill

## Out of scope

- contractor registry/catalog
- automatic contractor installation
- remote contractor discovery
- planner selection redesign
- `plan.ts) selection logic unless a narrowly required type change is unavoidable

## Required behavior

When a supported contractor is selected:

- detect whether its required skill is installed locally;
- if present, report the contractor normally;
- if absent, make the handoff explicitly say the contractor must be installed first and provide the existing supported install guidance;
- do not silently install anything.

## Acceptance criteria

- Contractor-present test passes.
- Contractor-absent test passes.
- The absent case cannot be mistaken for an available runtime.
- No registry or auto-install mechanism is introduced.

## Validation

Run the focused handoff tests, then the full CI gate.

## Stop condition

If fixing this requires changing contractor selection semantics, stop and report it rather than expanding this task.

## Next

Task 005.
