# Phase 8 — Launch and Distribution

**Status:** In progress

## Intent

Let a user install and run Ezy from outside the source repository. This unblocks an early public launch; individual skill tests are not required first.

## Goals

- Publish the existing CLI and core workspace packages as public npm packages.
- Let users install the `ezy` command with `npm install -g @make-it-ezy/cli`.
- Keep the current CLI/core architecture and gated skill installs.
- Document first-use setup and distinguish community reputation evidence from Ezy verification.

## Non-goals

- Publishing from this change or configuring npm credentials.
- Bundling or running third-party skills.
- Requiring per-skill behavioral testing for launch.
- Adding a web UI or outcome verification in this phase.

## Approaches

1. **Publish the existing CLI and core packages.** Reuse the workspace split and `workspace:*` dependency, which pnpm rewrites when packing. This keeps the code and runtime behavior intact; it requires both packages to be published in dependency order. **Selected.**
2. Bundle core into a single CLI package. This avoids publishing a second package but adds a bundling step and changes the build pipeline.
3. Keep distribution as a repository clone. This needs no registry setup but does not provide the user install experience requested.

## Launch trust policy

Broad discovery and recommendations use task fit plus public reputation and maintenance evidence. Show source, evidence, and review state; do not label popularity as verification. External skill content remains untrusted and installs stay user-approved. Deep per-skill tests can support stronger scoped labels after launch.

## Constraints and remaining calls

- Existing package names are `@make-it-ezy/cli` and `@make-it-ezy/core`; npm scope ownership and availability must be confirmed before first publication.
- Publishing is an explicit release action and is outside this implementation.
- The current GitHub release flow is repository-level; package versioning and publish instructions must be prepared without publishing automatically.
