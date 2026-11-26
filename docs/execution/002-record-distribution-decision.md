# Task 002 — Record Single-Package Distribution Decision

## Goal

Make the repository's distribution truth explicit and remove the superseded Phase 8 launch spec/plan from the active documentation path.

## Scope

### In scope

- `docs/decisions/`
- `docs/superpowers/specs/2026-11-18-phase8-launch-design.md`
- `docs/superpowers/plans/2026-11-18-phase8-launch.md`
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
