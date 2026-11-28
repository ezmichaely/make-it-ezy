# Decision: Single Public Package Distribution

**Date:** 2026-11-28
**Status:** Accepted; matches shipped distribution

## Decision

Make It Ezy ships as **one public npm package**, `make-it-ezy`, which installs the global `ezy` executable.

`@make-it-ezy/core` is an internal, private workspace package. It is bundled into the CLI package during the release build and is **not** published as a separate public package.

## Context / problem

Phase 8 (Launch and Distribution) needed a user install path outside the source repository. The earlier Phase 8 design assumed publishing the CLI and core workspace packages separately, in dependency order, with pnpm rewriting the `workspace:*` dependency at pack time.

The shipped implementation moved to a self-contained CLI package instead: the CLI build copies the compiled core into `dist/core/` and rewrites core imports to that local path. The Phase 8 spec and plan still described the two-package approach and therefore contradicted shipped behavior.

## Options considered

1. **Publish CLI and core as two public packages.** Reuses the workspace split, but requires publishing two packages in dependency order and keeping their versions aligned.
2. **Bundle core into one public CLI package.** Avoids a second public package and removes cross-package version coordination for users. **Selected.**
3. **Distribute as a repository clone only.** No registry setup, but no normal global-install experience.

## Chosen direction

- Public package: `make-it-ezy` (`apps/cli`).
- Global executable: `ezy`.
- Internal package: `@make-it-ezy/core` (`packages/core`), `private: true`, bundled into the CLI at build time.
- Users install with `npm install --global make-it-ezy`; they do not install core separately.

## Trade-offs

- The published package is larger because it contains the bundled core.
- Core cannot be consumed independently from npm by third parties.
- The CLI build owns an extra bundling/rewrite step (`apps/cli/scripts/prepare-package.mjs`).
- Package metadata, release-please config, and user docs must consistently describe one package.

## Consequences

- `docs/MVP-SPECIFICATION.md`, `docs/CI.md`, and `README.md` are the current authority for the shipped distribution shape.
- Any future proposal to publish core separately is a new decision, not an implementation detail.
- The superseded Phase 8 launch spec/plan are historical material under `docs/archive/`.

## Non-goals

- Do not introduce a separate public core package as part of the current distribution work.
- Do not publish to npm from this decision; publishing remains an explicit maintainer action.
- Do not change packaging implementation, release automation, or package metadata as part of recording this decision.
