# Phase 5 — Project Capability Planner design

**Status:** approved (2026-11-05)  
**Date:** 2026-11-05  
**Approach:** A — evolve `ezy plan` / `planOutcome` in place

## Intent

Make `ezy plan` (and therefore `ezy next`) **project-aware**: given an outcome, inspect the current project, derive requirements, discover skill candidates, filter what is unnecessary, and emit a **minimum useful capability plan** with explicit exclusions.

## Why

Phases 1–4 ship skill discovery → heuristic plan → gated install → handoff.  
`plan` today ignores `analyzeProject()`. Users waste context when agents re-discover the repo and when Ezy over-recommends skills for small tasks.

Core principle: **minimum sufficient capabilities + minimum sufficient context.**

## Goals

- Wire `analyzeProject` into `planOutcome` / `buildHandoff`
- Derive requirements from **outcome + project snapshot**
- Keep discovery on existing search/recommend (skills)
- Emit decisions: use / install / optional / skip (+ reasons)
- Enrich plan + handoff output with a short project summary and exclusions
- Stay heuristic — **no LLM** in this phase
- Preserve Phase 1–4 CLI commands and install gate

## Non-goals (this phase)

- Persistent Project Brain (Phase 6)
- Outcome verification (Phase 7)
- Soft-C / spawning Codex/Claude
- LLM planner
- Mandatory Graphify / Superpowers
- Full tool/MCP/workflow marketplace
- GUI / Web UI
- Filling `catalog/` as a giant registry
- Rewriting working search/install/inspect

## Anti-goals

- Install every relevant skill and dump them on the agent
- Copy the repository into memory
- Pretend the plan executed the work

## Approaches considered

| Approach | Tradeoff | Decision |
|---|---|---|
| **A. Evolve `plan` in place** | Smallest break; familiar CLI | **Picked** |
| B. New `ezy compose` beside `plan` | Clearer name; two surfaces | Rejected for now |
| C. Jump to Brain + verify | Fixes rediscovery later; still plans poorly | Deferred |

## Behavior (target)

1. Require non-empty outcome (unchanged).
2. Build `ProjectSnapshot` from `analyzeProject` + local skill names.
3. Extract requirements (lexicon + simple project rules).
4. Discover skill candidates via existing recommend/search (cap queries).
5. Score/filter into decisions with exclusion reasons grounded in project when possible.
6. Print: Project → Requirements → Use/Install → Optional → Not needed → Notes.
7. `ezy next` includes the short project summary + same skill checklist/prompt shape (backward compatible fields kept).

## Data (minimum)

- Reuse `ProjectAnalysis`; add local skill name list on the plan report
- `Requirement`, `CapabilityDecision` (see architecture reassessment)
- Keep `recommended` / `optional` / `notNeeded` derived for CLI/handoff back-compat

## Success criteria

- Same outcome, empty folder vs existing Next app → different exclusions
- Tiny UI tweak does not recommend Graphify/swarm-style noise
- Existing Phase 1–4 tests still pass
- No new runtime dependencies

## Spec lock before coding

1. Phase 5 = project-aware planner (not verify/memory)
2. Approach A
3. No LLM
4. Skills remain the only installable capability kind
5. Graphify/Superpowers optional forever at product layer
6. Project Brain + verification deferred
