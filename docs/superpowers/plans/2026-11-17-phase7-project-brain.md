# Phase 7 — Project Brain Implementation Plan (Hybrid B)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** `.ezy/brain.json` with **machine** slice (CLI) + optional **agent** slice (host via `ezy brain enrich` + `skills/ezy`); Graphify optional via skill.

**Architecture:** `brain.ts` mirrors `brief.ts` split: deterministic merge-save for machine fields; `parseAgentSlice` / sanitize for agent JSON; `formatBrainEnrichInstructions` like `formatBriefInstructions`. `planOutcome` → `persistBrainAfterPlan` (merge, don’t wipe `agent`).

**Spec:** [`docs/superpowers/specs/2026-11-17-phase7-project-brain-design.md`](../specs/2026-11-17-phase7-project-brain-design.md)

## Global constraints

- No new runtime dependencies; no LLM in CLI.
- Plan/next must not fail if brain write fails (note only).
- CLI must never execute Graphify or vendored skill bodies.
- Tests: temp dirs only; no network.
- `pnpm check:ci` before push.

---

### Task 1: Brain types, fingerprint, machine build

**Files:** `brain-types.ts`, `brain.ts`, `brain.test.ts`, export from `index.ts`

- [ ] Types: `BrainFile`, `BrainAgentSlice`, limits (mirror brief caps).
- [ ] `computeFingerprint`, `brainPath`, `buildBrainProject`, `buildLastPlanDigest`.
- [ ] Tests: fingerprint + digest.

---

### Task 2: Load, merge-save, format display

**Files:** `brain.ts`, `brain.test.ts`

- [ ] `loadBrain` / `saveBrain` with 8 KB cap.
- [ ] `mergeMachineSlice(existing, machine)` — preserve valid `agent`.
- [ ] `formatBrainHuman` — show machine + agent sections separately.
- [ ] Tests: round-trip; merge keeps `agent` when CLI updates `project`.

---

### Task 3: Agent slice parse + enrich instructions

**Files:** `brain.ts`, `brain.test.ts`; reuse `sanitizeText` from `brief.ts` where possible

- [ ] `parseAgentSlice(unknown): { ok; agent } | { ok: false; errors[] }` with JSON paths in errors.
- [ ] `formatBrainEnrichInstructions(projectSummary?)` — schema, trust rules, Graphify optional paragraph (“if installed, query before large refactors”).
- [ ] Tests: valid/invalid agent payloads; oversize lists rejected.

---

### Task 4: Wire `planOutcome`

**Files:** `plan.ts`, `plan.test.ts`

- [ ] `persistBrainAfterPlan(cwd, report)` using merge-save.
- [ ] Integration test: brain file after plan; `agent` preserved across second plan.

---

### Task 5: CLI `brain`, `brain refresh`, `brain enrich`

**Files:** `apps/cli/src/index.ts`, `cli.test.ts`

- [ ] `ezy brain` — display or “no brain yet”.
- [ ] `ezy brain refresh` — machine only + merge.
- [ ] `ezy brain enrich` — print enrich instructions (like `brief`); include project summary when root found.
- [ ] Help text updated.

---

### Task 6: `skills/ezy` adapter (product face of hybrid)

**Files:** `skills/ezy/SKILL.md`

- [ ] After handoff (or when re-entering project): `ezy brain` — if missing machine slice, run `plan` or `brain refresh` first.
- [ ] Optional: `ezy brain enrich` → edit `.ezy/brain.json` `agent` only → cite sources; no secrets.
- [ ] Graphify: use **only** if installed under `.agents/skills/graphify` and task is cross-cutting; do not require for small edits; align with plan exclusions.
- [ ] Do not stop after brain commands; continue implementation.

---

### Task 7: Docs

**Files:** `MVP-SPECIFICATION.md`, `ARCHITECTURE.md`, `HOW-IT-WORKS.md`, `ROADMAP.md` when shipped

- [ ] Document hybrid model and commands.
- [ ] `pnpm check:ci`.

---

## Out of scope (v1)

- `--brain` flag on plan.
- `ezy brain validate` as separate command (parse tests + enrich copy suffice).
- Auto-recommend Graphify in planner scoring (future; golden exclusions stay).
- New vendored memory skill.