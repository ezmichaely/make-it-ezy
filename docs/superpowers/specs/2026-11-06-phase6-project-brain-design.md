# Phase 6 — Project Brain design

**Status:** pending approval  
**Date:** 2026-11-06  
**Approach:** A — silent cache (`.ezy/brain.json`) refreshed by `plan` / `next`

## Intent

Persist a **small, local project knowledge file** so later `plan` / `next` (and agents reading the handoff) reuse what Ezy already learned — without dumping the repo or adding a database.

## Why

Phase 5 re-runs `analyzeProject` every time and throws the summary away. Across agent sessions that means repeated rediscovery of package manager, frameworks, and local skills. The demonstrated need for Brain is: **keep the planner’s project summary + last plan digest on disk**.

## Goals

- Store a tiny brain at `<projectRoot>/.ezy/brain.json`
- Refresh automatically from `plan` / `next` when missing or stale
- Expose `ezy brain` (show) and `ezy brain refresh` (force rewrite from analyze)
- Include a short “from brain” line in plan / handoff when loaded or refreshed
- Stay heuristic — **no LLM**, no vector DB, no Graphify required
- No new runtime dependencies

## Non-goals (this phase)

- Outcome verification (Phase 7)
- Soft-C / spawning agents
- User preference store / rejected-skill history / workflow library (Approach C)
- Vector search / embeddings
- Mandatory Graphify or Superpowers
- Web UI
- Filling `catalog/`
- Sharing brain across machines via sync service

## Anti-goals

- Copy source files or a repo dump into brain
- Treat brain as authority over a fresh analyze when fingerprints disagree
- Silent “memory” that agents cannot inspect

## Approaches considered

| Approach | Tradeoff | Decision |
|---|---|---|
| **A. Silent cache** | Smallest; matches roadmap | **Picked** |
| B. Explicit-only updates | Transparent; easy to go stale | Rejected for v1 |
| C. Rich memory | Too large; no demonstrated need yet | Deferred |

## Behavior (target)

1. Resolve `projectRoot` (same as analyze). If none → no brain read/write; plan behaves as today.
2. **Fingerprint** = stable hash of `package.json` bytes (when present) + sorted local skill directory names under `.agents/skills`.
3. **Load** `.ezy/brain.json` if present and `version` supported.
4. **Stale** when missing, unreadable, fingerprint mismatch, or `updatedAt` older than 7 days.
5. On `plan` / `next`:
   - Always run `analyzeProject` (truth source).
   - If brain missing/stale **or** analyze disagrees with cached summary fields → **write** brain after plan completes.
   - If brain fresh and fingerprint matches → keep/update `lastPlan` only (still rewrite file once with new plan digest).
6. Brain file shape (minimum):

```json
{
  "version": 1,
  "updatedAt": "ISO-8601",
  "fingerprint": "hex",
  "project": {
    "projectRoot": "/abs/or/null",
    "packageName": "…",
    "language": "…",
    "frameworks": ["…"],
    "packageManager": "…",
    "localSkills": ["…"]
  },
  "lastPlan": {
    "outcome": "…",
    "requirements": ["…"],
    "recommended": ["…"],
    "at": "ISO-8601"
  }
}
```

7. CLI:
   - `ezy brain` → print human summary of brain (or “no brain yet”).
   - `ezy brain refresh` → analyze + write brain (no plan required); clears/omits `lastPlan` or leaves previous `lastPlan` untouched (prefer **leave** lastPlan).
8. `.ezy/` is **gitignored** (local agent state). Document that teams may force-add if they want a shared snapshot later.

## Data / code touchpoints

- New: `packages/core/src/brain.ts` (+ types + tests) — load / save / fingerprint / format
- Wire write path in `planOutcome` (covers `next` / install-plan)
- CLI: `brain` command in `apps/cli`
- Docs: `ROADMAP.md`, `ARCHITECTURE.md`, README quick start one-liner, handoff phase pointer
- `.gitignore`: `.ezy/`

## Success criteria

- After one `ezy plan "…"`, `.ezy/brain.json` exists with project + lastPlan
- Changing `package.json` (fingerprint) causes next plan to refresh project fields
- `ezy brain` shows the cached summary without planning
- Existing Phase 1–5 tests still pass; no new runtime deps
- CodeQL / `pnpm check:ci` green

## Spec lock before coding

1. Approach A (silent cache)
2. No LLM / no vector DB
3. Analyze remains source of truth; brain is cache + last-plan digest
4. `.ezy/` gitignored
5. Verification / rich memory / Soft-C still deferred
