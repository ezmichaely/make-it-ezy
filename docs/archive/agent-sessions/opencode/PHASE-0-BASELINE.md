# Phase 0 — Baseline (OpenCode investigation)

**Date:** 2026-11-24
**Branch:** `analysis/full-scan-reconciliation` (the single local analysis branch; rules: no new branch, no production-code edits, no CI/Graphify, small phases, persist to `docs/opencode/`)
**Constraint:** local MLX runner at 32K context — memory-stable, checkpointed investigation.
**Status:** Phase 0 complete. STOP and await next instruction. Do not proceed to Phase 1 automatically.

---

## 1. Current branch / HEAD (directly observed)

- Branch: `analysis/full-scan-reconciliation`, tracking `origin/analysis/full-scan-reconciliation`.
- HEAD: `310be4e0dee2ab803b664cff59e0d1aa4d331465` (short `310be4e`).
- Last commit subject: `docs: add full scan re-analysis report`, authored 2026-11-24.
- Local branches present: `main`, `doc/skill-scan-analysis`, `dependabot/npm_and_yarn/npm_and_yarn-9d349b809c`, and the current `analysis/full-scan-reconciliation`.
- **Discrepancy to resolve (Q1):** `REANALYSIS-2026-11-24.md` §1 self-reports "New branch HEAD after this pass: `315e92d836595f3e69dcc672062a82b1e1e2450c`", but the current HEAD is `310be4e`. At least one commit (the "add full scan re-analysis report" commit and possibly others) post-dates that doc's self-report. Confirm via `git log` in Phase 1.

## 2. Working-tree state (directly observed)

- Modified: `.gitignore` (pre-existing user work — do NOT touch or revert).
- Untracked: `docs/opencode/2.txt`, `docs/opencode/session-11-21-2026-continue.txt`, `graphify-out/`.
- `docs/opencode/` also contains: `Session-11-23-2026.md`, `Session-11-23-2026.txt` (did **not** appear in `git status` → likely ignored or already tracked; status unconfirmed).
- Action: none. These are pre-existing artifacts. Phase 1 may *inspect* them read-only if needed; the session transcripts are NOT to be fully ingested.

## 3. Repository top-level structure (directly observed)

pnpm monorepo. Top-level:
- Code: `apps/`, `packages/`, `skills/`, `catalog/`, `scripts/`.
- Docs: `docs/` (see §4). Root docs: `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`, `README.md`, `CHANGELOG.md`, `LICENSE`.
- Agent/config dirs: `.agents`, `.claude`, `.cursor`, `.qwen`, `.superpowers`, `.ezy`.
- Build config: `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `tsconfig*.json`, `eslint.config.js`, `vitest.config.ts`, `skills-lock.json`, `release-please-*`.
- Untracked artifacts: `graphify-out/`.

## 4. Instruction hierarchy

Source of truth is the root `AGENTS.md` (in context), loaded by Codex/Cursor/Qwen; `CLAUDE.md` → `AGENTS.md` for Claude Code.
1. `AGENTS.md` (root) — single shared agent guide; product goal, trust rules, phase path, source-of-truth table.
2. Then, in order: `docs/HOW-IT-WORKS.md` (one-page workflow), `docs/ROADMAP.md` (shipped status + phase order — owns phase sequencing), `docs/audits/2026-11-07-codebase-gaps.md` (findings 1–4 fixed; 5–10 optional), `docs/handoff/MAKE-IT-EZY-HANDOFF.md` (product intent + trust principles).
3. Topic source-of-truth table (from AGENTS.md): Architecture → `docs/architecture/`; Decisions → `docs/decisions/`; Handoffs → `docs/handoff/`; CLI behavior → `docs/MVP-SPECIFICATION.md` + implementation; broker/staged workflow → `docs/superpowers/specs/2026-11-18-broker-orchestrated-skills-design.md`.
4. Agent-context rule: do NOT reconstruct direction from conversation exports; use **Architecture → Decisions → Handoff → implementation**.
5. Builder stack (always-on for contributors to this repo): Superpowers (process), Ponytail (implementation, default `full`), Graphify (navigation), Ezy adapter `skills/ezy/SKILL.md`.

## 5. Authoritative vs historical documents

**Authoritative (current):**
- `AGENTS.md`, `CLAUDE.md`, `README.md`, `docs/ROADMAP.md`, `docs/HOW-IT-WORKS.md`, `docs/MVP-SPECIFICATION.md`, `docs/architecture/ARCHITECTURE.md`, `docs/architecture/CAPABILITY-MODEL.md`, `docs/handoff/MAKE-IT-EZY-HANDOFF.md`, `docs/decisions/*`, `skills/ezy/SKILL.md`, the lifecycle source under `packages/core/src/`.

**Historical / audit / non-authoritative:**
- `docs/handoff/archive/*` — archived handoff snapshots (use only for intent, not current direction).
- `docs/convo/*` — raw conversation exports; explicitly NOT architectural authority.
- `docs/audits/2026-11-07-codebase-gaps.md` — audit; findings 1–4 fixed, 5–10 optional maintenance.
- `docs/skill-scan/ANALYSIS.md` — research inventory of an external workbook (`make-it-ezy-final.xlsx`), NOT the Ezy runtime catalog.
- `docs/skill-scan/REANALYSIS-2026-11-24.md` — today's full-scan re-analysis (authoritative for current reconciliation status).
- The two `docs/handoff/...-2026-11-23.md` files inspected here are **planning/implementation handoffs**, not product-definition sources.

## 6. Confirmed existing implementation

> Status: the following is **reported by the inspected docs** (REANALYSIS §4.1 and the coding-agent brief §2/§8). Code-verification in this session = NO (Phase 0 did not open `packages/core/src/*`). Treat as "documented, not yet code-confirmed."

- **Lifecycle contract slice exists** in `packages/core/src/lifecycle-types.ts`, `packages/core/src/lifecycle.ts`, tests in `lifecycle.test.ts`, exported from `packages/core/src/index.ts`.
  - Functions: `buildIntentIntake`, `evaluateSkillCandidate`, `composeSkillSpec`, `evaluateOutcome`, `aggregateEvidence`, `proposeImprovement`.
  - Types cover: intent intake + clarification questions; skill review state; task-fit/provenance/security/quality/maintenance/compatibility evidence; skill spec/composition; outcome verification (PASS/FAIL/UNCERTAIN); shared-evidence aggregation; reversible improvement proposals.
- **Existing runtime path** (in `packages/core/src/plan.ts`): `analyze → requirements → search → select → plan → handoff`.
- **Product features present** (per coding-agent brief §2): project-aware `plan`/`next`; agent-brief path + `.ezy/brief.json`; Project Brain; local + skills.sh discovery; minimum-useful capability selection; gated installation; broker-directed contractor/workflow handoff (first slice shipped within Phase 8); Superpowers as coding-contractor example; host-agent execution model; **no LLM embedded in the Ezy CLI**.
- `packages/core/src/capabilities.ts` is a small outcome-token lexicon (conceptual mapping), **not** a full lifecycle-role registry.
- Doc reconciliation already applied (per REANALYSIS §5): README badge → Phase 8; roadmap broker-workflow status; architecture docs distinguish "contract exists" vs "runtime-wired"; HOW-IT-WORKS distinguishes contract boundary from execution; `ANALYSIS.md` completion wording corrected; skill-scan workspace docs (SkillEvaluator 1.0.1, model names configurable); removed `docs/skill-scan/.qwen/settings.json` and a committed `run.pid`; `.gitignore` rules cleaned for local Qwen/PID state.

## 7. Confirmed missing implementation (the deliberate boundary)

> Status: reported by REANALYSIS §4.2/§8 and the coding-agent brief; not yet code-confirmed this session.

- **Core gap:** lifecycle contracts are **not wired into the runtime/CLI**. `plan.ts` still runs the old path and does **not** call the lifecycle evaluators; the CLI imports the planner/recommendation/handoff path, not the lifecycle pipeline.
- Therefore the following are **contracts, not runtime stages**:
  1. Intent-intake / clarification adapter (does not yet block the planner).
  2. Skill-evaluation adapter after discovery/inspection (evaluator exists as a contract; selection path is still discovery/filtering — **discovery ≠ recommendation not yet enforced at runtime**).
  3. Skill-spec / composition adapter before handoff.
  4. Contractor/workflow integration (first broker slice shipped; broader integration pending).
  5. Phase 9 outcome-evaluation adapter (intentionally **not** in Phase 8).
  6. Evidence aggregation only where a privacy-safe data source exists.
- **Recommended future order** (REANALYSIS §8): intent-intake → skill-evaluation → skill-spec composition → contractor/workflow → Phase 9 outcome-eval → privacy-safe evidence aggregation.
- SkillEvaluator/skill-scan workspace is usable **as a research/evidence tool**, NOT an Ezy runtime dependency; Tier 1/2 static/similarity fit Phase 8, Tier 3 (live agent trials) stays research-only.

## 8. Unresolved questions

1. **Q1 (HEAD drift):** REANALYSIS §1 self-reports HEAD `315e92d`; actual current HEAD is `310be4e` ("docs: add full scan re-analysis report"). What commit(s) sit between, and was the doc committed after its own self-report? → `git log` in Phase 1.
2. **Q2 (CLAUDE fix-pass branch):** `CLAUDE-IMPLEMENTATION-COMMAND-REVIEW-FIX-PASS-2026-11-23.md` targets a *different* branch (`docs/shared-evidence-self-improvement`, PR #21). Is that work already merged into `main`/current branch, or a separate/pending workstream? Its 12 review areas (wire evaluator into real selection, wire SkillSpec into planner, make clarification a real boundary, outcome separation, shared-evidence privacy, controlled self-improvement, Phase boundaries, public-repo privacy, docs consistency, run tests) overlap heavily with the "missing implementation" in §7 — need to know if already done.
3. **Q3 (lifecycle slice on main?):** Is the `lifecycle-types.ts`/`lifecycle.ts` slice present on `main` or only on the analysis branch? The coding-agent brief says "target: current `main`". → `git log` / `git diff main` in Phase 1.
4. **Q4 (working tree):** Is the `.gitignore` modification and `graphify-out/` intentional in-progress user work? Should Phase 1 start from a clean index or carry these forward? (Leaning: leave as-is, inspect read-only.)
5. **Q5 (CI unverified):** REANALYSIS §9 states CI / `pnpm check:ci` were **not** run on this branch ("Do not mark CI-green yet"). No CI gate exists for this branch. User instruction: do not run CI yet.
6. **Q6 (public-repo privacy):** CLAUDE fix-pass §10 flags `docs/convo/` (raw conversation exports) as inappropriate for a now-public repo. Remediation status unknown. → inspect `docs/convo/` existence/ignore status in Phase 1.
7. **Q7 (session files in docs/opencode):** `Session-11-23-2026.md/.txt` did not appear in `git status` (ignored or tracked, unconfirmed); `2.txt` and `session-11-21-2026-continue.txt` are untracked. Confirm tracking status; do NOT ingest transcripts.

## 9. Exact files to inspect in Phase 1 (targeted, read-only, small reads)

Code (confirm §6/§7 against source):
- `packages/core/src/lifecycle-types.ts` — confirm contract types/shape.
- `packages/core/src/lifecycle.ts` — confirm the 6 functions + signatures/behavior.
- `packages/core/src/lifecycle.test.ts` — confirm coverage.
- `packages/core/src/index.ts` — confirm lifecycle exports.
- `packages/core/src/plan.ts` — confirm runtime path does NOT call lifecycle evaluators (the core gap).
- `packages/core/src/capabilities.ts` — confirm it is a token lexicon, not a role registry.
- CLI entrypoint + recommendation/selection/handoff modules — confirm no lifecycle-as-pipeline invocation (locate exact paths via `grep` first).
- `docs/architecture/ARCHITECTURE.md`, `docs/architecture/CAPABILITY-MODEL.md` — confirm doc-reconciliation claims (§6 last bullet).

Git (resolve Q1/Q3):
- `git log --oneline main..analysis/full-scan-reconciliation` and `git diff --stat main...HEAD` to see what the analysis branch adds vs main.
- `git log -5 --oneline` to resolve the `315e92d` vs `310be4e` drift.

Privacy (resolve Q6):
- `docs/convo/` — confirm existence + ignore status (do not read contents).

Branch-state (resolve Q4/Q7):
- `git status --short --ignored` for `docs/opencode/` and `graphify-out/` tracking status.

**Do NOT** open the full session transcripts; **do NOT** run CI/Graphify/full-repo scans in Phase 1 unless explicitly re-authorized.

## 10. Cross-reference note for the CLAUDE fix-pass (Q2)

`docs/handoff/CLAUDE-IMPLEMENTATION-COMMAND-REVIEW-FIX-PASS-2026-11-23.md` is a *command* to a coding agent on branch `docs/shared-evidence-self-improvement` / PR #21. Its scope (wire evaluator into selection, wire SkillSpec into planner, clarification boundary, outcome separation, shared-evidence privacy, controlled self-improvement, Phase-boundary preservation, public-repo privacy remediation, doc consistency, run tests) is the **action side** of the same gap described in §7. Phase 1 must first determine whether that fix pass is already reflected in `main`/current HEAD before assuming any of §7 is still open.

---
End of Phase 0. Awaiting next instruction.
