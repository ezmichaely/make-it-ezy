# Task 001 — Fix CLI Cold-Start Test Timeout

## Goal

Make the CLI test suite reliably pass on a cold start without changing CLI production behavior.

## Why

The audit found a cold-start timeout in the CLI suite while warm execution is materially faster. This is the first execution gate because a red/flaky test gate makes later fixes difficult to trust.

## Scope

### In scope

- `apps/cli/src/cli.test.ts`
- `vitest.config.ts` only if the existing test configuration is the correct place for the fix

### Out of scope

- `apps/cli/src/index.ts`
- CLI production behavior
- unrelated test refactors
- performance optimization outside the failing test startup path

## Required approach

1. Reproduce the cold-start failure.
2. Determine whether the timeout is test configuration, test process startup, or an actual CLI regression.
3. Make the smallest change that makes the test deterministic.
4. Preserve the test's intent.

Do not simply increase the timeout without first checking why the test launches slowly.

## Acceptance criteria

- The previously timing-out CLI test completes successfully.
- No production CLI behavior changes.
- The test remains meaningful and still exercises the intended CLI path.
- No unrelated tests are modified.

## Validation

Run:

```bash
pnpm exec vitest run
```

Then repeat the suite from a clean/fresh environment as available.

The audit target is a green **189/189** suite.

## Stop condition

If the failure is caused by a production regression rather than test startup/timeout configuration, stop and report the root cause instead of changing production code under this task.

## Next

Task 002.
