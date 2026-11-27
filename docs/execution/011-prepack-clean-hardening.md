# Task 011 — Prepack Build and Clean Hardening

## Goal

Ensure package preparation starts from a clean generated core artifact and builds the artifact from current source.

## Scope

- `apps/cli/package.json`
- `apps/cli/scripts/prepare-package.mjs`

## Out of scope

- CI workflow design
- core source
- package API changes
- npm publishing

## Required behavior

Before copying generated core output into the package artifact:

1. build the required source;
2. remove stale generated `dist/core` content;
3. copy only the current generated artifact.

Do not delete unrelated working-tree files.

## Acceptance criteria

- Repeated packaging does not retain stale generated files.
- A clean package contains the current build output.
- Existing package execution still works.

## Validation

Run the package build/pack flow and inspect the resulting tarball contents.

## Stop condition

If the current packaging script has assumptions that require changing package structure, stop and report them.

## Next

Task 012.
