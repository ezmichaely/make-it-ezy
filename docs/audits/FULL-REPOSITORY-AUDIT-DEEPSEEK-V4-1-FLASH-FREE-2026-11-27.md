# Make It Ezy — Canonical Repository Audit (Current)

> **Canonical active audit. Diagnostic evidence only — not a work order, not product authority.**
> This file consolidates the verified current state. Historical audits are archived under `docs/archive/audits/`.
> **2026-11-28 reconciliation (Task 016):** 001–015 completed/merged; sections 6 and 9 updated; full open/finding reconciliation queued as Task 017.

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
- No application code changed between the audit baseline and this consolidation; the repository delta was documentation only.

Authoritative documents remain: `AGENTS.md`, `docs/AGENT-WORKFLOW.md`, `docs/ROADMAP.md`, `docs/MVP-SPECIFICATION.md`, `docs/HOW-IT-WORKS.md`, `docs/architecture/`, and accepted decisions in `docs/decisions/`.

## 2. Verified current behavior

| Area | Verified state |
|---|---|
| Build / lint / typecheck | Pass |
| Tests | 189/189 pass (source-level via `tsx`) |
| CLI commands | `doctor`, `analyze`, `search`, `inspect`, `recommend`, `brief`, `brain`, `plan`, `next`, `install` present |
| Discovery | Local `.agents/skills` + skills.sh; `--local-only` skips remote in inspected paths |
| Planning | Project-aware requirements/selection; heuristic fallback |
| Handoff | Checklist + prompt + optional workflow; no skill execution engine |
| Install | Preview + approval gate; delegates to external `npx skills add` |
| Packaging | Build + pack dry-run succeed; clean-install smoke not automated in CI |
| Lifecycle | Exported contracts only; not wired into CLI/planner |

## 3. Confirmed open findings

### Release / behavior

1. **Cold-start CLI test flake risk.** No `testTimeout` in `vitest.config.ts`; the suite passed this run but the audit's cold-start timeout is not structurally fixed.
2. **Contractor presence not detected in handoff.** Contractor stages do not carry an `installed`/`(install first)` signal; only skill stages do.
3. **`install` ignores unknown flags and `--local-only`.** `parseInstallArgs` silently skips unknown flags and has no local-only path.
4. **`install --plan` plans twice.** `resolveInstallTarget` plans, then `appendInstallHandoff` plans again via `buildHandoff`.
5. **Non-exact remote attribution.** `inspect-skill.ts` and `install.ts` fall back to `hits[0]` when no exact name match exists.
6. **Brain staleness not surfaced.** `isBrainStale` exists but is not used by `ezy brain` output.
7. **Duplicate stopword logic.** `capabilities.ts` keeps its own skip list instead of the canonical `STOPWORDS`.
8. **Test side effect.** `plan.test.ts` calls `planOutcome` without `cwd`, writing the repository `.ezy/brain.json`.
9. **"Discovery only" note is incomplete.** `plan` writes `.ezy/brain.json` while output says nothing was installed or executed.

### Packaging / distribution

10. **Unpinned external installer.** `npx skills add` is invoked without a version pin.
11. **No install name/source validation.** Raw names are joined into paths; no strict allowlist.
12. **Windows spawn risk unverified.** `spawn("npx")` without shell; CI is Ubuntu-only.
13. **No `prepack`/clean hardening.** Package preparation overlays `dist/core` and does not guarantee a clean artifact.
14. **No CI packaged-artifact smoke test.** CLI tests run source via `tsx`, not the packed/installed artifact.
15. **Tarball omits `LICENSE`; packed `devDependencies` retain `workspace:*`.**
16. **CI tests only Node 22**, while `engines` declares Node >=20.

### Documentation drift

17. **Phase 8 spec/plan contradict shipped distribution.** The spec still describes two public packages; no accepted distribution decision records the reversal.
18. **MVP spec omits brain auto-write and `brain refresh`/`brain enrich`.**
19. **MVP spec omits the network matrix** (which commands contact skills.sh; network is default).
20. **SECURITY-MODEL is stale** ("optional remote metadata"; dated 2026-11-05).
21. **SHARED-EVIDENCE-LEARNING overstates lifecycle status** ("now implemented").
22. **CAPABILITY-MODEL says Superpowers is STUDY/OPTIONAL** although contractor routing is shipped.
23. **Roadmap horizon gap** for agent control/router/Home Node.
24. **CLI help banner is stale** ("Phase 6 brief + Phase 7 project brain"; inspect described as local-only).
25. **CONTRIBUTING/CI docs link to gitignored `.agents/skills/ci-before-push/SKILL.md`.**
26. **Authority/navigation ambiguity** between `AGENTS.md`, `docs/STATUS.md`, `docs/handoff/README.md`, and `docs/decisions/README.md`.

### Repository hygiene

27. **`docs/skill-scan/` remains very large (~744 MB).** `graphify-out/` has been removed.
28. **Inspect output is not sanitized** for skill-derived terminal content.

## 4. Confirmed fixed / no longer applicable

- Brief and remote text are control/bidi-sanitized (`brief.ts`, `search-remote.ts`).
- `graphify-out/` is no longer present.
- Raw conversation exports were removed from `docs/archive/conversations/`; `docs/convo/` contains only policy/README.
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
- **Task 017** is queued to fully reconcile this audit's open/fixed sections against post-015 repo state.
- Small related findings were folded into existing tasks:
  - Task 003 — reading-order/precedence reconciliation.
  - Task 008 — brain staleness plus test-side-effect/notes wording.
  - Task 009 — exact-match attribution plus inspect output sanitization.
  - Task 015 — LICENSE and packed-metadata checks.

## 7. Limitations / unverified

- GitHub Actions results for this branch were not queried.
- npm publication status for `make-it-ezy@0.1.6` was verified with `npm view` and outside-repo registry install smoke; npm package-name ownership was not verified.
- Windows behavior of `spawn("npx")` was not verified.
- Node 20 runtime was not verified (local Node 24; CI Node 22).
- Actual `npx skills add` install location/behavior was not executed.
- OS-level network isolation for `--local-only` was not packet-captured.
- Heuristic decision quality was sampled, not exhaustively evaluated.

## 8. Audit history

Historical audits are preserved under `docs/archive/audits/` for traceability. They are evidence, not current instructions. Active work must be driven by the current codebase, this canonical audit, and the execution plan.

## 9. What remains

Tasks 001–015 executed and merged; Task 016 reconciliation completed (2026-11-28). Next batch (execution queue): **017** reconcile this audit's open/fixed sections, **018** add vitest `testTimeout` guard, **019** ignore local `docs/skill-scan` evaluator bloat. `make-it-ezy@0.1.6` is published; further publication remains a manual maintainer action. Decision-gated later items remain out of scope.
