# Contributing

## Develop

```bash
pnpm install
pnpm check          # lint + typecheck + test + build (same gates as CI)
pnpm test:watch
pnpm dev:ezy analyze
```

## Pull requests

1. Branch from `main`, open a PR (do not push straight to `main` for feature work).
2. Wait for **CI** + **CodeQL** (free on this public repo — see `docs/CI.md`).
3. Merge when green; delete the branch after merge (enable auto-delete in repo Settings if available).

## Scope

Prefer thin, tested slices with a short design under `docs/superpowers/specs/` when behavior changes.

## Principles

1. Simplify before adding complexity.
2. Evidence over speculation in detectors.
3. External skills/tools are untrusted until inspected.
4. Do not invent repository URLs in research docs — mark `UNRESOLVED`.

## Tests

Add or update Vitest coverage when changing detection, install, handoff, or CLI behavior.
