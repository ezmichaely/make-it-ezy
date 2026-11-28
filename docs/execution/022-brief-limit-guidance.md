# Task 022 — Surface brief schema limits in `ezy brief` output

**Status:** OPEN — not started

## Goal

Make `ezy brief` output self-sufficient so a host agent can generate a valid `.ezy/brief.json` first time, instead of discovering `Invalid brief` / exit `2` only after `ezy next`.

## Current behavior

- `ezy brief` prints research instructions and an annotated schema example, then tells the host agent to write `.ezy/brief.json` and run `ezy next`. See `packages/core/src/brief.ts` `formatBriefInstructions`.
- `parseBrief` already enforces strict limits. Current constants are `MAX_STRING = 200` and `MAX_LIST = 10`.
- `ezy next` calls `loadBriefOrFail`; invalid briefs print `Invalid brief`, exit `2`, and print no plan. See `apps/cli/src/index.ts`.
- The printed schema example does **not** state the hard limits.
- The `/ezy` adapter says on exit `2` fix the brief at reported paths and re-run, but does not repeat the limits. See `skills/ezy/SKILL.md`.
- Existing validation is not the issue; missing up-front guidance is.

## Scope

- `packages/core/src/brief.ts`
- `packages/core/src/brief.test.ts`
- `skills/ezy/SKILL.md`
- `docs/EXECUTION-PLAN.md` status update for Task 022
- `docs/MVP-SPECIFICATION.md` only if its shipped `ezy brief` wording needs synchronization

## Out of scope

- No change to `.ezy/brief.json` schema or validation behavior.
- No auto-truncation, silent repair, or accepting invalid briefs.
- No change to invalid-brief exit code `2`.
- No `.qwen` creation, deletion, ignore-policy, or cleanup work.
- No `ezy-reels` changes.
- No external skill installation.
- No planner/selector redesign.

## Required change

Add concise schema-limit guidance to `formatBriefInstructions` output, reusing `MAX_STRING` and `MAX_LIST` rather than duplicating numeric literals where practical. State the currently enforced limits, including:

- `outcome`: non-empty string, at most `MAX_STRING` characters.
- `requirements`: `MAX_LIST` minimum `1`, maximum `MAX_LIST`.
- `exclusions`: optional; `0` to `MAX_LIST`.
- `research`: optional; `0` to `MAX_LIST`.
- each requirement `searchTerms`: `1` to `MAX_LIST`; strings at most `MAX_STRING`.
- other string fields at most `MAX_STRING`.
- requirement `id`: `^[a-z0-9-]{1,40}$`, unique.
- `version: 1`.
- `taskType`: one of `feature`, `bugfix`, `refactor`, `greenfield`, `research`, `ui-change`, `other`.

Keep output concise; do not duplicate the full parser. In `skills/ezy/SKILL.md`, make explicit that on exit `2` the host agent must trim/correct `.ezy/brief.json` to the printed schema and limits before re-running; Ezy does not auto-truncate.

## Acceptance criteria

- `ezy brief "<outcome>"` prints the hard schema limits before the `Next:` command.
- Printed numeric limits come from `MAX_STRING` / `MAX_LIST`, not stale hard-coded copies.
- `formatBriefInstructions` test proves the output includes `at most 200`, `at most 10`, `requirements`, `exclusions`, `research`, and `searchTerms`.
- Existing schema validation, sanitization, unknown-field notes, exit codes, and `ezy next` behavior are unchanged.
- `/ezy` adapter instructions tell the agent to trim/correct invalid briefs rather than expecting Ezy to repair them.
- No `.qwen` changes are made.

## Validation

```bash
pnpm exec vitest run packages/core/src/brief.test.ts
pnpm test
pnpm check:ci
git diff --check
```

Manual: run `ezy brief "add stripe"`, inspect printed limits, write a valid `.ezy/brief.json`, and run `ezy next "add stripe" --brief .ezy/brief.json --local-only`.

## Stop condition

If satisfying the guidance requires loosening validation, changing the `.ezy/brief.json` schema, or touching `.qwen`, stop and report instead.

## Next

Stop after creating Task 022. Implementation is a separate task; do not start it until Task 022 is reviewed/approved.
