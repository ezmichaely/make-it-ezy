# Task 010 — Packaged Artifact Smoke Test

## Goal

Prove the published package shape works outside the repository checkout.

## Scope

### In scope

- `.github/workflows/ci.yml`
- `apps/cli/package.json`
- `apps/cli/scripts/prepare-package.mjs` only if packaging currently prevents the smoke test

## Out of scope

- core source changes
- feature work
- npm publishing
- Windows support
- installer semantics

## Required behavior

CI must:

1. create the package artifact;
2. install it into a clean temporary location;
3. invoke the packaged `ezy` outside the repository;
4. run a minimal local-only planning command.

Recommended smoke commands:

```bash
ezy --help
ezy plan x --local-only
```

## Acceptance criteria

- The artifact installs without depending on the source checkout.
- `ezy --help` works outside the repo.
- `ezy plan x --local-only` works outside the repo.
- The smoke test fails CI when packaging is broken.

## Stop condition

If packaging itself is broken, report the smallest packaging defect; do not refactor core to make the smoke test pass.

## Next

Task 011.
