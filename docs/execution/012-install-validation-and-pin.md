# Task 012 — Install Name/Source Validation and Installer Pin

## Goal

Harden the install boundary so invalid package/skill names and sources are rejected before invoking the external installer.

## Scope

- `packages/core/src/install.ts`
- `apps/cli/src/index.ts` only for source-option parsing
- relevant install tests
- package metadata only if required to pin the existing installer invocation

## Out of scope

- approval gating
- automatic installation
- contractor registry
- remote discovery redesign

## Required behavior

Reject invalid names/sources before invoking the external installer. Preserve the current approval requirement.

Where the external `skills` installer is invoked, pin the intended installer version rather than relying on an unbounded latest version.

## Acceptance criteria

Regression coverage rejects representative invalid inputs such as:

- `../x`
- `-x`
- `a/b/c`

Valid existing inputs remain valid.

## Validation

Run focused install tests and the CI gate.

## Stop condition

Do not invent a new source grammar. Derive allowed forms from current behavior/documentation or stop for clarification.

## Next

Task 013.
