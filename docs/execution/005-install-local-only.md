# Task 005 — Honor install --local-only and Reject Unknown Flags

## Goal

Make the install command enforce the option the user supplied and reject unsupported flags.

## Scope

### In scope

- `apps/cli/src/index.ts`
- `packages/core/src/install.ts)
- `apps/cli/src/cli.test.ts`
- focused install tests if present

## Out of scope

- approval gating
- remote source redesign beyond what is required to honor `--local-only`
- installer UX redesign
- package/release changes

## Required behavior

- `ezy install ... --local-only` must not perform remote lookup/fetch.
- `--local-only` must be threaded through the actual install path.
- Unknown install flags must fail clearly rather than being silently ignored.
- Existing approval gating must remain intact.

## Acceptance criteria

- A regression test proves `--local-only` prevents remote access.
- A regression test proves an unknown flag exits non-zero.
- Existing install approval behavior is unchanged.

## Validation

Run focused CLI/install tests, then the repository CI gate.

## Stop condition

Do not modify the approval flow to solve this task.

## Next

Task 006.
