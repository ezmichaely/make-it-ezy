# Phase 2 `ezy recommend` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `ezy recommend <query> [--local-only]` that buckets search hits into Recommended / Optional / Not needed without installing anything.

**Architecture:** Core `recommendSkills` calls existing `searchSkills`, takes top 6 hits, buckets by score + `installedLocally`, formats via `formatRecommend`. CLI wires the command like search/inspect.

**Tech Stack:** TypeScript, pnpm workspace, Vitest (no new deps).

**Spec:** `docs/superpowers/specs/2026-11-05-phase2-recommend-design.md`

## Global Constraints

- Never installs; notes must say discovery-only and popularity ≠ safety
- No LLM / embeddings
- `--local-only` matches search
- Exit 0 with empty recommendations; exit 1 only for missing query / unknown command
- Cap recommendation body at 6 hits; Preferred Recommended count 1–3

## Review Focus

- Empty query → usage error (CLI) / empty report with guidance note (core)
- Zero hits → empty buckets, exit 0, clear message
- Local strong match outranks weaker remote
- Remote-only hits never trigger skill-body network fetch
- `--local-only` never calls skills.sh

---

### Task 1: Core recommend + format

**Files:**
- Create: `packages/core/src/recommend-types.ts`
- Create: `packages/core/src/recommend.ts`
- Create: `packages/core/src/recommend.test.ts`
- Modify: `packages/core/src/format.ts` — add `formatRecommend`
- Modify: `packages/core/src/index.ts` — export recommend API

**Interfaces:**
- Consumes: `searchSkills(query, SearchOptions) => Promise<SearchReport>`, `SkillHit`
- Produces:
  - `recommendSkills(query: string, options?: SearchOptions): Promise<RecommendReport>`
  - `RecommendReport { query, recommended: RecommendItem[], optional: RecommendItem[], notNeeded: string[], notes: string[] }`
  - `RecommendItem { hit: SkillHit, reason: string }`
  - `formatRecommend(report: RecommendReport): string`

- [ ] **Step 1: Write failing tests** in `recommend.test.ts`
  - local fixture skill matching query → appears in `recommended` with reason mentioning local/installed
  - weaker second hit (if any) or synthetic via mocked search path → `optional` when score lower
  - empty query → empty lists + note to provide query
  - assert notes include “nothing was installed”

- [ ] **Step 2: Run** `pnpm exec vitest run packages/core/src/recommend.test.ts` — expect FAIL

- [ ] **Step 3: Implement** types, `recommendSkills`, `formatRecommend`, exports
  - Bucketing: sort hits by existing score; take ≤6
  - Recommended: score ≥ 6 OR `installedLocally`, max 3
  - Optional: remaining from the 6
  - Not needed: if query tokens include `frontend` or `design` or `ui`, add fixed strings `multi-agent swarm` and `vector database`; else `["(none from this candidate set)"]` when optional/recommended cover all, or list leftover hit names with “weak match”

- [ ] **Step 4: Run tests** — expect PASS

- [ ] **Step 5: Commit** `feat(core): add recommendSkills bucketing`

---

### Task 2: CLI + docs

**Files:**
- Modify: `apps/cli/src/index.ts`
- Modify: `apps/cli/src/cli.test.ts`
- Modify: `README.md`, `docs/ROADMAP.md`, `docs/MVP-SPECIFICATION.md`

**Interfaces:**
- Consumes: `recommendSkills`, `formatRecommend`
- Produces: `ezy recommend <query> [--local-only]`

- [ ] **Step 1: Failing CLI tests** — help lists recommend; `recommend ponytail --local-only` status 0 and contains “Make It Ezy — recommend”; bare `recommend` status 1 + usage

- [ ] **Step 2: Wire CLI** + update HELP copy (Phase 2)

- [ ] **Step 3: Run** `pnpm test` — expect PASS

- [ ] **Step 4: Docs** — mark Phase 2 recommend done; keep install out of scope

- [ ] **Step 5: Commit** `feat(cli): add ezy recommend command`

---

### Task 3: Push phase-2

- [ ] Merge/sync: ensure `main` points at updated `phase-2`; push `phase-2` and `main`
