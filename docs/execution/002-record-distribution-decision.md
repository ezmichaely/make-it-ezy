# Task 002 — Record Single-Package Distribution Decision

## Goal

Make the repository's distribution truth explicit and remove the superseded Phase 8 launch spec/plan from the active documentation path.

## Scope

### In scope

- `docs/decisions/`
- `docs/archive/specs/superpowers/2026-11-18-phase8-launch-design.md` (moved from `docs/superpowers/specs/`)
- `docs/archive/work-plans/superpowers/2026-11-18-phase8-launch.md` (moved from `docs/superpowers/plans/`)
- relevant index/readme links only when required

### Out of scope

- `package.json`
- packaging implementation
- npm publishing
- release automation

## Decision to record

The shipped distribution shape is one public `make-it-ezy` package with the internal core bundled into the CLI package.

Do not introduce a separate public core package as part of this task.

## Required work

1. Inspect the two superseded Phase 8 documents.
2. Record the current accepted distribution decision in `docs/decisions/`.
3. Move/archive the superseded spec and plan rather than leaving competing active instructions.
4. Update only links that would otherwise point agents at the superseded documents.

## Acceptance criteria

- One clear current distribution decision exists.
- Superseded launch documents are clearly historical/archive material.
- No package source files are changed.
- No contradictory active documentation remains.

## Validation

Search documentation for active references to the superseded Phase 8 spec/plan and confirm only archive/history references remain.

## Stop condition

If the repository contains an existing accepted decision that already establishes this exact distribution truth, do not create a duplicate decision. Reconcile the existing decision instead.

## Next

Task 003.

## Completion record

### WHAT CHANGED

- Added [`docs/decisions/DECISION-SINGLE-PACKAGE-DISTRIBUTION.md`](../decisions/DECISION-SINGLE-PACKAGE-DISTRIBUTION.md) recording the shipped distribution: one public `make-it-ezy` package with `@make-it-ezy/core` bundled into the CLI, not published separately.
- Moved the superseded Phase 8 launch spec and plan into the archive:
  - `docs/archive/specs/superpowers/2026-11-18-phase8-launch-design.md`
  - `docs/archive/work-plans/superpowers/2026-11-18-phase8-launch.md`
- Marked both moved documents HISTORICAL/superseded and pointed them at the new decision and current specification.
- Updated archive indexes and the decision index; marked Task 002 complete in `docs/EXECUTION-PLAN.md`.

### WHY

The Phase 8 spec/plan selected publishing two public packages (`@make-it-ezy/cli` + `@make-it-ezy/core`). Shipped distribution and current docs (`docs/MVP-SPECIFICATION.md`, `docs/CI.md`, `README.md`, `apps/cli/package.json`, `apps/cli/scripts/prepare-package.mjs`) describe one public package with core bundled. Leaving the old documents active created contradictory instructions.

### VALIDATION

- Searched Markdown for active references to `docs/superpowers/specs/2026-11-18-phase8-launch-design.md` and `docs/superpowers/plans/2026-11-18-phase8-launch.md`; remaining references are in archived/historical material and this task record.
- No package source, metadata, release automation, or test files changed.
- `pnpm check:ci` run before commit.

### DISPOSITION

Task complete. No separate public core package introduced. Task 003 not started.
