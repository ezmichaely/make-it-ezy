# Task 009 — Exact-Match-Only Remote Attribution

## Goal

Prevent inspect/install output from attributing a remote skill to a user request when the remote result is only a loose name match.

## Scope

### In scope

- `apps/cli/src/index.ts`
- `packages/core/src/search-remote.ts`
- relevant install/inspect tests

## Out of scope

- replacing remote discovery
- semantic search redesign
- fetching untrusted skill content
- installer redesign

## Required behavior

Remote attribution should only occur when the result meets the repository's explicit exact-match condition.

## Acceptance criteria

- Exact matches retain current behavior.
- Non-exact matches cannot be presented as the requested remote skill.
- Existing network hermeticity is preserved.

## Validation

Add focused regression coverage for exact and non-exact names, then run the CI gate.

## Stop condition

If exact-match semantics are not currently defined in code, stop and report the ambiguity instead of inventing a matching policy.

## Additional verified findings (folded in)

- `inspect` output should sanitize skill-derived strings consistently, using the same sanitization path already applied to brief and remote metadata.
- CLI help/banner is stale (`Phase 6 brief + Phase 7 project brain`; inspect described as local-only while it queries skills.sh by default). Update help text to match current behavior.

## Next

Task 010.
