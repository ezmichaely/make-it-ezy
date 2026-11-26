# Task 007 — Unify Requirement Stopwords

## Goal

Prevent verb-like stopwords from leaking into extracted requirements when the capability fallback path is used.

## Scope

### In scope

- `packages/core/src/capabilities.ts`
- `packages/core/src/score-skill.ts`
- focused requirements/golden tests

## Out of scope

- changing the stopword lexicon itself unless a failing test proves a missing entry is required
- rewriting the requirement extractor
- planner selection changes

## Required behavior

Use the existing canonical stopword definition consistently instead of maintaining a second divergent list.

## Acceptance criteria

- The known “add a … page” case no longer leaks the verb as a requirement.
- Existing requirement/golden behavior remains stable.

## Validation

Run the focused requirements and golden tests.

## Stop condition

Do not redesign lexical extraction under this task.

## Next

Task 008.
