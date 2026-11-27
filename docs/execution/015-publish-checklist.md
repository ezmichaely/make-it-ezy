# Task 015 — Publish Checklist and Package Metadata Verification

## Goal

Make the release checklist explicit without automating publication prematurely.

## Scope

- `docs/decisions/` or `docs/` release documentation
- `apps/cli/package.json` only if a metadata defect is verified
- package artifact inspection

## Out of scope

- automatic npm publishing
- credentials/secrets
- release workflow redesign

## Required checks

Document and verify:

- public package name is `make-it-ezy`;
- the intended executable is `ezy`;
- `LICENSE` is included in the package tarball;
- the package contains the bundled core needed at runtime;
- npm publication/name ownership is explicitly checked by the maintainer rather than assumed.

## Acceptance criteria

A maintainer can follow the checklist and determine whether the artifact is ready to publish.

## Validation

Create the package artifact and inspect its file list.

## Stop condition

Do not publish or change npm ownership as part of this task.

## Additional verified findings (folded in)

- `npm pack --dry-run` currently omits `LICENSE`; ensure the MIT license file is included in the published tarball.
- Packed `devDependencies` retain `workspace:*`; verify whether to clean this metadata before publication.

## Next

After Task 015, stop the immediate release-hardening sequence and reconcile documentation before beginning the JSON contract work.
