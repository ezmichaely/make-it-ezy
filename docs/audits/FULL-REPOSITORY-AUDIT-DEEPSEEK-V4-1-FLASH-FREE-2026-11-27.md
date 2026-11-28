# Make It Ezy — Canonical Repository Audit (Current)

> **Canonical active audit. Diagnostic evidence only — not a work order, not product authority.**
> This file consolidates the verified current state. Historical audits are archived under `docs/archive/audits/`.
> **2026-11-28 reconciliation (Task 016):** 001–015 completed/merged; sections 6 and 9 updated.
> **2026-11-28 reconciliation (Task 017):** open/fixed findings reconciled against post-015 `main`; original finding numbers retained.

- **Date:** 2026-11-27
- **Branch:** `analysis/full-scan-reconciliation`
- **HEAD at audit:** `d4c82f9 audit:collection`
- **Auditor / consolidator:** `opencode/deepseek-v4.1-flash-free`
- **Verification basis:** source inspection, `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test` (21 files / 189 tests passed), CLI smoke commands, `npm pack --dry-run`, and reconciliation against `docs/EXECUTION-PLAN.md` + `docs/execution/001–016`.

## 1. Current repository state

Make It Ezy is a local-first capability/context decision layer for coding tasks.

- Ezy decides; the host agent executes.
- Current planning path: `analyze → requirements → search → select → plan → handoff`.
- Current phase: Phase 8 — Launch and Distribution (Phases 0–7 shipped; Phase 9 verification and Phase 10 Web UI later).
- Distribution shape: one public `make-it-ezy` package; `@make-it-ezy/core` is internal and bundled into the CLI.
- `packages/core/src/lifecycle.ts` contains exported lifecycle contracts but is **not** the controlling CLI/planner pipeline.
- The original consolidation made no application-code changes; Tasks 001–015 subsequently applied shipped-behavior, packaging, CI, documentation, and dependency hardening fixes.

Authoritative documents remain: `AGENTS.md`, `docs/AGENT-WORKFLOW.md`, `docs/ROADMAP.md`, `docs/MVP-SPECIFICATION.md`, `docs/HOW-IT-WORKS.md`, `docs/architecture/`, and accepted decisions in `docs/decisions/`.

## 2. Verified current behavior

| Area | Verified state |
|---|---|
| Build / lint / typecheck | Pass |
| Tests | 213/213 pass; `pnpm check:ci` passed on current `main` (23 test files) |
| CLI commands | `doctor`, `analyze`, `search`, `inspect`, `recommend`, `brief`, `brain`, `plan`, `next`, `install` present |
| Discovery | Local `.agents/skills` + skills.sh; `--local-only` skips remote in inspected paths |
| Planning | Project-aware requirements/selection; heuristic fallback |
| Handoff | Checklist + prompt + optional workflow; no skill execution engine |
| Install | Preview + approval gate; delegates to external pinned `npx --yes skills@1.9.1 add` |
| Packaging | Build + pack dry-run succeed; CI packaged-artifact smoke installs the tarball outside repo and runs `ezy --help` + `ezy plan x --local-only` |
| Lifecycle | Exported contracts only; not wired into CLI/planner |

## 3. Confirmed open findings

Original finding numbers are retained. Confirmed resolved findings are moved to section 4; items that could not be confidently verified remain open here.

### Release / behavior

1. **Cold-start CLI test flake risk.** No `testTimeout` in `vitest.config.ts`; the suite passes now, but the cold-start timeout is not structurally fixed. **Task 018.**

### Documentation drift

20. **`SECURITY-MODEL` has residual stale install wording.** The original “optional remote metadata” claim is no longer present, but `docs/architecture/SECURITY-MODEL.md` still says `npx skills add`, while `packages/core/src/install.ts` uses `npx --yes skills@1.9.1 add`. Task 017 does not expand scope to rewrite security policy; no dedicated task is queued.

### Repository hygiene

27. **`docs/skill-scan/` remains very large (~744 MB on disk).** 10 files are tracked; local generated `skill-evaluator` data includes ignored `.venv` / `.cache`, and `graphify-out/` is present, not removed. **Task 019.**

## 4. Confirmed fixed / no longer applicable

- **Finding 2** — contractor presence is carried as `installed`; CLI renders `not installed — install first`. **Task 004.**
- **Finding 3** — `install` accepts `--local-only`, rejects unknown `--*` flags, and wires local-only source resolution. **Task 005.**
- **Finding 4** — `install --plan` uses the existing `planReport`; `appendInstallHandoff` does not re-plan via `buildHandoff`. **Task 006.**
- **Finding 5** — remote attribution uses exact-name matching; no `hits[0]` fallback. **Task 009.**
- **Finding 6** — `ezy brain` uses `isBrainStale` and reports `current` / `stale`. **Task 008.**
- **Finding 7** — requirement fallback filters canonical `STOPWORDS`. **Task 007.**
- **Finding 8** — `plan.test.ts` passes `cwd` to `planOutcome`. **Task 008.**
- **Finding 9** — plan note says no skills were installed/executed **and** project summary may be cached at `.ezy/brain.json`. **Task 008.**
- **Finding 10** — external installer is pinned to `skills@1.9.1`. **Task 012.**
- **Finding 11** — install skill name/source validation and no raw unsafe joins. **Task 012.**
- **Finding 12** — Windows install-spawn risk has explicit decision + focused CI `windows-latest` `npx --version` smoke; `shell: true` on Windows; full Windows support not claimed. **Task 013.**
- **Finding 13** — package build runs `prepare-package`, which builds core, removes stale `dist/core`, copies current output, rewrites core import; supported `pnpm build` → pack flow includes license. **Task 011.**
- **Finding 14** — CI packaged-artifact smoke installs tarball outside repo and smoke-runs CLI. **Task 010.**
- **Finding 15** — tarball includes `LICENSE`; packed `devDependencies` rewrites `workspace:*`. **Task 015.**
- **Finding 16** — CI matrix tests Node 20 + 22. **Task 014.**
- **Finding 17** — one public `make-it-ezy` package; `@make-it-ezy/core` internal; accepted distribution decision. **Task 002.**
- **Finding 18** — MVP documents `.ezy/brain.json` auto-write/update, `ezy brain refresh`, and `ezy brain enrich`. **Tasks 003/008.**
- **Finding 19** — MVP documents network matrix and `--local-only`. **Task 003.**
- **Finding 21** — `SHARED-EVIDENCE-LEARNING` says boundary contracts/local helpers, not wired controlling pipeline. **Task 003.**
- **Finding 22** — `CAPABILITY-MODEL` says Superpowers shipped first-slice optional contractor, not STUDY/OPTIONAL-only. **Task 003.**
- **Finding 23** — roadmap horizon includes agent control/router/Home Node. **Task 003.**
- **Finding 24** — CLI help no longer says Phase 6/7-only; inspect says skills.sh unless `--local-only`. **Task 003.**
- **Finding 25** — `CONTRIBUTING.md` links repo-owned `skills/ci-before-push/SKILL.md`, not gitignored `.agents/...`. **Task 003.**
- **Finding 26** — source-of-truth hierarchy is explicit in `AGENTS.md` + `docs/AGENT-WORKFLOW.md`. **Tasks 003/016.**
- **Finding 28** — inspect output sanitizes skill-derived terminal content. **Task 009.**
- Brief and remote text are control/bidi-sanitized (`brief.ts`, `search-remote.ts`).
- Raw conversation exports were removed; `docs/convo/` contains only policy/README.
- `graphify-out/` exists and is tracked generated navigation output; it is not product authority.
- Literal `\`` escape rendering (old D9) is not reproducible in current files.
- PRODUCT-DIRECTION vs FUTURE-ECOSYSTEM is not a conflict; they serve different roles.
- Lifecycle contracts are consistently documented as non-controlling.
- Core modularity and composition-over-rebuilding remain verified positives.

## 5. Intentionally deferred

- `--json` machine-readable plan/handoff contract.
- Unified requirement model and planner/selector consolidation.
- `ezy verify` / lifecycle wiring (Phase 9).
- Web UI (Phase 10).
- Deeper capability discovery, second contractor, host proofs, continuity expansion.
- Agent control, provider routing, RAG/vector memory, MCP, local-model routing, contractor registry, trusted auto-install, telemetry/shared evidence, LLM inside Ezy, Home Ezy Node, broader domains.

These require explicit decisions before implementation. They are not authorized by this audit.

## 6. Relationship to execution plan

- `docs/EXECUTION-PLAN.md` is the active execution queue.
- **Tasks 001–015** completed and merged to `main` on 2026-11-28 (PRs #31–#46; current `main` includes release-please PR #25). Task 001 closed as not reproducible/no justified fix. `make-it-ezy@0.1.6` is published; registry metadata and outside-repo install smoke verified.
- **Task 016** reconciliation completed on 2026-11-28 (execution queue updated; next batch 017–019 created). This was a reconciliation pass, not a full re-audit.
- **Task 017** reconciliation completed on 2026-11-28: open/fixed sections reconciled against post-015 `main`; no full re-audit and no implementation changes.
- Small related findings were folded into existing tasks:
  - Task 003 — reading-order/precedence reconciliation.
  - Task 008 — brain staleness plus test-side-effect/notes wording.
  - Task 009 — exact-match attribution plus inspect output sanitization.
  - Task 015 — LICENSE and packed-metadata checks.

## 7. Limitations / unverified

- Original audit did not query GitHub Actions; Task 016/017 verification includes local `pnpm check:ci`, current-main CI, and PR checks where stated, not every historical workflow run.
- npm publication status for `make-it-ezy@0.1.6` was verified with `npm view` and outside-repo registry install smoke; npm package-name ownership was not verified.
- Full Windows support is not claimed; focused `windows-latest` `npx --version` smoke is verified, but actual `npx --yes skills@1.9.1 add` on Windows is not executed.
- Node 20 runtime is covered by CI matrix; local verification used Node 24; Node 22 CI is covered.
- Actual external `npx --yes skills@1.9.1 add` install location/behavior was not executed.
- OS-level network isolation for `--local-only` was not packet-captured.
- Heuristic decision quality was sampled, not exhaustively evaluated.

## 8. Audit history

Historical audits are preserved under `docs/archive/audits/` for traceability. They are evidence, not current instructions. Active work must be driven by the current codebase, this canonical audit, and the execution plan.

## 9. What remains

Tasks 001–015 executed and merged; Tasks 016/017 reconciliation completed (2026-11-28). Remaining current batch: **018** add vitest `testTimeout` guard, **019** ignore local `docs/skill-scan` evaluator bloat. Remaining open findings are evidence-backed above; unverified items remain in section 7. `make-it-ezy@0.1.6` is published; further publication remains a manual maintainer action. Decision-gated later items remain out of scope.
