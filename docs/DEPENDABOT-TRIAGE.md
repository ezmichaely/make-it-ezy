# Dependabot Triage — 2026-11-28

Task 020 (docs-only). Classifies the 48 open Dependabot alerts on `main` before any dependency changes. No upgrades were made.

## Summary

- Total open alerts: **48** (GitHub: 7 critical, 11 high, 26 moderate, 4 low).
- Classification:
  - **Test fixture dependency:** 41 alerts (Next.js `15.0.0` in `packages/core/src/golden/stripe-subscriptions/project/package.json`) — 5 critical, 11 high, 21 medium, 4 low.
  - **Dev tooling (transitive):** 7 alerts — `tinypool` 2 critical; `vitest` 2 medium; `@vitest/mocker` 2 medium; `minimatch` 1 medium.
- Shipped runtime dependency alerts: **0**.
- `pnpm audit --prod --audit-level=high`: **No known vulnerabilities found.**
- `pnpm check:ci`: passes (run 2026-11-28).

## Classification detail

### 1. Test fixture — Next.js (41 alerts)

- Manifest: `packages/core/src/golden/stripe-subscriptions/project/package.json`
- Package: `next@15.0.0` (also `react@19.0.0`, `prisma@6.0.0`)
- Scope per Dependabot: `runtime`
- Nature: golden test fixture used by `packages/core/src/golden.test.ts` to exercise the planner/selector on a representative Next.js + Prisma + Stripe project. Not built, published, or executed as a running app; not part of `apps/cli/dist` or the published package.
- Shipped? **No.** Published package ships `apps/cli/dist`; fixture is test data.
- Action: no change in this task. Future atomic task may bump the fixture's pinned versions if a golden test needs newer APIs; not a security remediation of the product.

### 2. Dev tooling — transitive (7 alerts)

| Package | Alerts | Severity | Via | Shipped? |
|---|---|---|---|---|
| `tinypool` | 2 | critical | `vitest@3.2.7` → `make-it-ezy` (devDependencies) | No (dev only) |
| `vitest` | 2 | medium | `make-it-ezy` (devDependencies) | No (dev only) |
| `@vitest/mocker` | 2 | medium | `vitest@3.2.7` (devDependencies) | No (dev only) |
| `minimatch` | 1 | medium | `eslint` toolchain (devDependencies) | No (dev only) |

- Versions verified: `vitest@3.2.7`, `@vitest/mocker@3.2.7`, `tinypool@1.1.1`, `minimatch@10.2.6`.
- Not in shipped runtime (`pnpm audit --prod` clean).

## Recommended next atomic tasks (not implemented here)

1. Decide whether to bump the golden fixture's `next` pin (test data only) — separate task, not security remediation.
2. Track upstream Vitest release that fixes `tinypool` advisories before upgrading devDependencies; no blind upgrade.
3. Re-run this triage after any dependency change or new alert.

## Verification

- `pnpm check:ci` — passed.
- `pnpm audit --prod --audit-level=high` — no known vulnerabilities.
- `git diff --check` — clean.
- Spot-checked representative alerts against `package.json`, `pnpm-lock.yaml`, `pnpm why`, and the golden fixture manifest.