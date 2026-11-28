# Task 020 — Dependabot triage

## Goal

Classify current Dependabot alerts before any dependency changes.

## Scope

- `docs/EXECUTION-PLAN.md`
- new task file(s) only if reconciliation requires them
- `docs/archive/...` only if scan policy needs clarification

## Inputs

- `https://github.com/ezmichaely/make-it-ezy/security/dependabot`
- GitHub Dependabot API output
- `pnpm check:ci`
- `pnpm why vitest @vitest/mocker tinypool minimatch`

## Current verified evidence

- GitHub reports **48 open alerts** on `main`: **7 critical**, **11 high**, **26 moderate**, **4 low**.
- Local `pnpm check:ci` passes, including `pnpm audit --prod --audit-level=high`.
- **~41 alerts** are Next.js in test fixture `packages/core/src/golden/stripe-subscriptions/project/package.json`.
- `vitest` / `@vitest/mocker` / `tinypool` / `minimatch` alerts are **dev/transitive dev tooling**, not shipped runtime.
- Current verified dev-tooling versions: `vitest@3.2.7`, `@vitest/mocker@3.2.7`, `tinypool@1.1.1`, `minimatch@10.2.6`.
- Published package ships `apps/cli/dist`, not the golden Next fixture or Vitest.

## Out of scope

- No dependency upgrades.
- No implementation/code fixes.
- No blind dismissal of alerts.
- No starting Task 021+.
- No production security-policy redesign.

## Acceptance criteria

- Every current alert is classified as:
  - shipped runtime dependency;
  - devDependency;
  - test fixture;
  - generated/third-party scan artifact;
  - already fixed/stale.
- `pnpm check:ci` result is recorded separately from Dependabot count.
- Remaining open findings are evidence-backed.
- Recommended next atomic tasks are listed, not implemented.

## Validation

```bash
git diff --check
pnpm check:ci
```

Manual: spot-check representative alerts against current `package.json`, `pnpm-lock.yaml`, `pnpm why`, and relevant workspace manifests.

## Stop condition

If an alert cannot be confidently classified from current repo state, keep it open and label it unverified; do not guess.

## Next

Stop after triage. Do not implement dependency changes in this task.
