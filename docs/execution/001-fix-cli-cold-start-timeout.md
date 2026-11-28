# Task 001 — Fix CLI Cold-Start Test Timeout

**Status:** CLOSED — HISTORICAL ONE-OFF TIMEOUT; NOT REPRODUCIBLE; NO FIX JUSTIFIED

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

## Completion record (closed)

### WHAT CHANGED
No application/test/configuration code was changed. The previously added global `testTimeout: 15_000` in `vitest.config.ts` was reverted.

### WHY
A historical timeout was confirmed from the surviving Opus 5.5 audit transcript, but extensive subsequent reproduction did not reproduce it. The evidence supports treating it as a one-off latency outlier rather than a confirmed recurring defect.

### EVIDENCE
- **Historical failure:** `apps/cli/src/cli.test.ts > ezy CLI > prints help` timed out at **5578ms** against Vitest's 5000ms default (Opus 5.5 audit session `d836450e-e906-4b43-83d8-a050dac3e7ea`, 2026-11-26 12:54Z, auditing `analysis/full-scan-reconciliation` @ `c0ace2a`; fresh clone → `pnpm install --frozen-lockfile --prefer-offline` → `pnpm build` → `pnpm lint` → `pnpm typecheck` → `pnpm exec vitest run --reporter=verbose`; macOS darwin 27.2.0 arm64, Node v24.22.2, pnpm 10.33.2, Vitest 3.2.7). Same run: 1 failed / 188 passed (189), 1 failed / 20 passed files; other CLI tests 471–1024ms.
- **Immediate reruns:** Two reruns in same session (`pnpm exec vitest run apps/cli/src/cli.test.ts`) passed 26/26; `prints help` 1916ms and 1831ms.
- **Current reproduction:** Warm 26/26 pass; clean TMPDIR 26/26 pass; cleared Vitest cache + clean TMPDIR + `--testTimeout=5000` full suite 189/189 pass; fresh clone + frozen install + build + clean TMPDIR + default 5s, 3 CLI runs all 26/26 pass. Fresh clone without build produced `ERR_MODULE_NOT_FOUND` for `@make-it-ezy/core/dist/index.js` (different failure; resolved by normal build; CI builds first).
- **Later audits:** ICEMAN and DeepSeek audits reported 189/189 pass.
- **CI:** `gh run list --limit 5` showed recent successful CI on main; prior investigation found no timeout among 154 CI runs inspected (4 failures were pnpm conflict, ESLint, assertions, expired log; cancelled logs not inspected).
- **Invalid corroboration:** Supposed `scratchpad/test.log` corroboration was invalid — user-stopped ~20s in, 20 core files passing, no cli.test.ts result, no timeout message, `ELIFECYCLE`; consistent with killed run, not timeout.

### ROOT CAUSE
No root cause was established. Do **not** treat `tsx`, esbuild, macOS first-launch overhead, or host contention as confirmed causes; they remain unmeasured hypotheses only.

### FIX
No fix was justified. The previously added global `testTimeout: 15_000` was reverted because it was an unproven broad mitigation that could not be validated without a reproduced baseline and would have applied to all test files.

### LIMITATION
The original full `v-test.log`, machine-load state, TMPDIR/cache state, and exact original runtime conditions are no longer available, so the historical event cannot be replayed exactly.

### DISPOSITION
Task closed as a historical one-off timeout that is not currently reproducible. No corrective code change is justified by the available evidence.

### NEXT ACTION
After the Task 001 closure record is complete and verified, proceed to **Task 002 — Record single-package distribution decision and archive superseded Phase 8 launch docs** (`docs/execution/002-record-distribution-decision.md`).
