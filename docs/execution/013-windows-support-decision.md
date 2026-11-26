# Task 013 — Windows Support Decision

## Goal

Resolve the current uncertainty around spawning the external installer on Windows.

## Scope

- relevant CI configuration
- documentation/decision file
- installer code only if a minimal cross-platform correction is proven necessary

## Out of scope

- broad Windows porting
- shell abstraction rewrite
- unrelated platform cleanup

## Required approach

First determine whether the current `spawn("npx")` behavior is supported on the repository's target Windows environment.

Choose one:

1. add a focused Windows CI verification path; or
2. explicitly document the current Windows limitation.

Do not claim Windows support without verification.

## Acceptance criteria

The repository has one explicit, evidence-backed Windows position.

## Validation

Use a real Windows CI job if support is claimed.

## Stop condition

If CI infrastructure cannot safely establish the behavior, document the limitation rather than guessing.

## Next

Task 014.
