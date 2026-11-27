# Task 006 — Make install --plan Plan Once

## Goal

Prevent `ezy install --plan` from repeating planning work unnecessarily.

## Scope

### In scope

- `apps/cli/src/index.ts`
- install-related tests only

### Out of scope

- install behavior from Task 005
- planner architecture
- selection algorithm
- handoff formatting

## Required behavior

The install planning path should resolve the plan once and reuse that result for the remainder of the command.

## Acceptance criteria

- The command produces the same intended result.
- Planning is performed once per invocation.
- No planner API redesign is introduced.

## Validation

Add/adjust a focused regression test that can distinguish one planning call from repeated calls.

Then run the relevant tests and CI gate.

## Stop condition

If the current architecture does not permit an isolated change without redesigning the planner, stop and report that boundary.

## Next

Task 007.
