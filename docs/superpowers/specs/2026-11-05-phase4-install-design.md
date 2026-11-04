# Phase 4 — `ezy install` design (slice 1)

**Status:** approved (2026-11-05)  
**Date:** 2026-11-05  
**Branch:** `phase-4`

## Intent

Add **suggest-then-go install**: show provenance/risk for a skill, require explicit approval, then install into `.agents/skills`. Interactive TTY can **arrow-pick** from a plan/query shortlist so users don’t retype names. Does **not** execute skill outcomes.

## Why

Phase 3 plans; without install the north star stalls. Arrow pick reduces friction on the approval path.

## Goals

- `ezy install <skill> [--yes] [--source <owner/repo>]`
- `ezy install --plan "<outcome>" [--yes]` — plan → arrow picker (TTY) → preview → install
- `ezy install --query "<topic>" [--yes]` — recommend → same picker flow
- Preview: source, destination, risk notes, exact `npx skills add …` command
- Approval: `--yes` **or** TTY confirm; non-TTY without `--yes` → exit 1
- Install via `npx skills add <source> --skill <name>` into project `.agents/skills`
- Already-local → report + exit 0

## Non-goals

- `ezy run` / outcome execution
- Trusted-auto allowlist
- Full Claude Code/Codex adapters (Cursor `.agents/skills` = adapter #0)
- Uninstall/upgrade

## Anti-goals

- Install without preview
- Default `--yes`
- Custom download scripts outside `npx skills`

## Constraints

- Core: preview + command building + install runner (injectable spawn)
- CLI: TTY arrow select (small raw-mode helper; no required new dep unless needed)
- Vitest mocks spawn; non-TTY gating tested
- Do not push `main` unless asked

## Approaches

| Approach | Decision |
|---|---|
| A. Gated `ezy install` via `npx skills` | **Picked** |
| Picker list from `--plan` / `--query` (not last-run cache) | **Picked** |
| B. Install + run stub / C. Full adapters | Deferred |

## Behavior (happy path)

```text
$ ezy install --plan "Build a SaaS dashboard"
# arrow keys select from Recommended (+ Optional)
# preview → confirm → npx skills add …
```

```text
$ ezy install taste --yes
# preview printed, install proceeds
```
