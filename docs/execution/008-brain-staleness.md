# Task 008 — Surface Project Brain Staleness

## Goal

Make `ezy brain` tell the user when the persisted brain is stale.

## Scope

### In scope

- `apps/cli/src/index.ts`
- `packages/core/src/format.ts`
- existing brain staleness helpers in `packages/core/src/brain.ts`
- focused CLI/brain tests

## Out of scope

- changing the brain file format
- changing fingerprint computation
- changing persistence semantics
- adding new storage

## Required behavior

Reuse the existing staleness calculation and expose a clear human-readable stale/current indication in `ezy brain`.

## Acceptance criteria

- A stale brain is visibly identified.
- A current brain is not incorrectly reported as stale.
- No brain schema changes occur.

## Validation

Run focused brain/CLI tests and then the CI gate.

## Stop condition

If the existing staleness helper is incorrect, stop and report it rather than rewriting the helper in this task.

## Next

Task 009.
