# Task 014 — Node 20 + 22 CI Matrix

## Goal

Verify the supported Node runtime range instead of assuming the local runtime is representative.

## Scope

- `.github/workflows/ci.yml`
- runtime documentation only if the supported range changes

## Out of scope

- source compatibility rewrites unless a failing supported runtime proves one is required
- Node 24-specific optimization
- unrelated CI changes

## Required behavior

Add verification for Node 20 and Node 22 if those are the intended supported versions.

## Acceptance criteria

CI explicitly tests the supported Node versions.

## Validation

Run the relevant CI workflow and inspect both runtime jobs.

## Stop condition

If the repository has an existing accepted Node support policy that differs, reconcile that policy before changing CI.

## Next

Task 015.
