# Phase 5 — Project Capability Planner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `ezy plan` / `ezy next` project-aware so Ezy picks a minimum useful skill set instead of keyword-only shortlists.

**Architecture:** Evolve `planOutcome` in place. Snapshot the project via existing `analyzeProject`, derive requirements, reuse search/recommend for candidates, filter with explainable decisions, keep install/handoff gates unchanged.

**Tech Stack:** TypeScript, pnpm, Vitest, existing `@make-it-ezy/core` + `apps/cli` (no new deps).

**Spec:** `docs/superpowers/specs/2026-11-05-phase5-project-capability-planner-design.md`

## Global Constraints

- No LLM planner
- No Soft-C / GUI / marketplace
- Graphify and Superpowers are never mandatory product deps
- Do not break Phase 1–4 CLI commands or install approval gate
- Prefer extending types over new packages
- Heuristic + explainable reasons only

## Review Focus

- Empty / non-package project still plans without crashing
- Existing Next/React app downranks “build a website from scratch” noise
- Local installed skill preferred over remote duplicate
- Handoff prompt stays pasteable and does not dump the whole repo
- `--local-only` still skips skills.sh

## Sequencing (do in this order)

```text
0. Docs lock (roadmap + architecture labels)     ✅
1. Types + ProjectSnapshot helpers               ✅
2. Requirements from outcome + project           ✅
3. Filter/score decisions (wire into planOutcome)✅
4. Format plan + handoff output                  ✅
5. CLI help + skills/ezy copy                    ✅
6. Tests green + CI                              ✅
7. STOP — Brain / verify are later phases
```

---

### Task 0: Lock the phase map in docs

**Files:**
- Modify: `docs/ROADMAP.md`
- Modify: `docs/architecture/ARCHITECTURE.md` (Phase 5 row)
- Modify: `docs/architecture/CAPABILITY-MODEL.md` (planner status line)
- Optional note: `docs/handoff/MAKE-IT-EZY-MASTER-HANDOFF.md` (Phase 5/6/7 pointer only — do not rewrite the whole handoff)

**Interfaces:**
- Produces: agreed phase names for humans/agents

- [x] **Step 1:** Update roadmap so Phase 5 = Project Capability Planner; Brain = Phase 6; Verify = Phase 7; Web UI = Phase 8
- [x] **Step 2:** Align architecture / MVP / README / integration / handoff docs
- [x] **Step 3:** Mark design spec status `approved` only after human says go

**Done when:** Reading `docs/ROADMAP.md` alone answers “what is Phase 5?” — **done**

---

### Task 1: Types for snapshot + decisions

**Files:**
- Modify: `packages/core/src/plan-types.ts`
- Modify: `packages/core/src/types.ts` (only if snapshot fields belong on analysis)
- Modify: `packages/core/src/index.ts` exports
- Test: `packages/core/src/plan.test.ts` (type-level via constructing reports)

**Interfaces:**
- Produces: `Requirement`, `CapabilityDecision`, extended `PlanReport` with `project` summary fields while keeping `recommended` / `optional` / `notNeeded`

- [ ] **Step 1:** Write failing test expecting `plan` report to include project root / frameworks summary fields
- [ ] **Step 2:** Add minimal types; leave planner logic for Task 3
- [ ] **Step 3:** Export types from `index.ts`

**Done when:** Types compile; old plan fields still present.

---

### Task 2: Requirements from outcome + project

**Files:**
- Modify: `packages/core/src/capabilities.ts` (or small sibling `requirements.ts` if clearer)
- Test: `packages/core/src/capabilities.test.ts` (or `requirements.test.ts`)

**Interfaces:**
- Consumes: outcome string + `ProjectAnalysis` (and local skill names if needed)
- Produces: `Requirement[]` + skip hints

- [ ] **Step 1:** Failing tests — greenfield “build website” vs existing Next “add a button” yield different requirement/skip sets
- [ ] **Step 2:** Implement smallest heuristic rules (lexicon + framework presence + task-size hints)
- [ ] **Step 3:** Keep `extractCapabilities` working for back-compat or wrap it

**Done when:** Unit tests prove project-conditioned requirements without network.

---

### Task 3: Wire snapshot + filter into `planOutcome`

**Files:**
- Modify: `packages/core/src/plan.ts`
- Modify: `packages/core/src/handoff.ts` (pass-through richer plan)
- Test: `packages/core/src/plan.test.ts`, `packages/core/src/handoff.test.ts`

**Interfaces:**
- Consumes: Task 1–2 APIs + existing `recommendSkills` / `analyzeProject` / `loadLocalSkills`
- Produces: filled `PlanReport` with decisions → derived recommended/optional/notNeeded

- [ ] **Step 1:** Failing tests for project-aware exclusions and local-prefer decisions
- [ ] **Step 2:** Call `analyzeProject` inside `planOutcome`
- [ ] **Step 3:** Filter candidates; keep caps (≤8) and dedupe
- [ ] **Step 4:** Ensure `buildHandoff` still works from plan output

**Done when:** `plan` / `next` core tests pass locally with `--local-only` fixtures.

---

### Task 4: Format + CLI surface

**Files:**
- Modify: `packages/core/src/format.ts`
- Modify: `apps/cli/src/index.ts` (help text)
- Modify: `skills/ezy/SKILL.md` (one short note: plan is project-aware)
- Test: `apps/cli/src/cli.test.ts`

**Interfaces:**
- Consumes: extended `PlanReport` / `HandoffReport`

- [ ] **Step 1:** Show Project + Requirements sections in `formatPlan` / `formatHandoff`
- [ ] **Step 2:** Update help string Phase label / flow line
- [ ] **Step 3:** Keep install command behavior unchanged

**Done when:** CLI plan/next output readable; cli tests green.

---

### Task 5: Verification gate before claiming done

**Files:** none new

- [ ] **Step 1:** `pnpm test` (or repo `check:ci` if that is the gate)
- [ ] **Step 2:** Manual smoke: `ezy plan "add a button" --local-only` in this repo vs empty temp dir
- [ ] **Step 3:** Commit only when user asks

**Done when:** Phase 1–4 behavior intact; Phase 5 planner demonstrably project-aware.

---

## Explicitly later (do not pull into this plan)

| Later phase | Work |
|---|---|
| Phase 6 — Project Brain | Tiny persistent `.ezy/brain.json` (or similar); no repo dump |
| Phase 7 — Verification | Post-handoff checks that outcome criteria were met |
| Phase 8 — Web UI | Same core as CLI |
| Anytime later | Soft-C, deep verify, trusted-auto, Codex marketplace plugin, Graphify provider |

## First concrete update

**Start at Task 0:** rewrite `docs/ROADMAP.md` Phase 5+ labels so the sequence cannot be lost.  
Do **not** start Task 1 code until the design spec is marked approved.
