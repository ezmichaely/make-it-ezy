# Task 018 — Add Vitest testTimeout guard

## Goal

Reduce structural cold-start flake risk in CLI tests.

## Scope

- `vitest.config.ts`
- `docs/EXECUTION-PLAN.md` reconciliation note only if task status changes

## Out of scope

- No test rewrites unless strictly required by timeout config.
- No CLI behavior changes.
- No CI workflow redesign.

## Required checks

- Add an explicit `testTimeout` in `vitest.config.ts` appropriate for current CLI smoke/spawn tests.
- Keep value conservative but not excessive; document rationale in task/PR if non-obvious.
- Confirm existing tests still pass.

## Acceptance criteria

- `vitest.config.ts` defines `testTimeout`.
- `pnpm test` passes.
- `pnpm check:ci` passes.

## Validation

```bash
pnpm test
pnpm check:ci
```

## Stop condition

If a timeout exposes a real failing/flaky test, report it; do not hide it by setting an extreme timeout without justification.
