# Make It Ezy — Sequential Execution Plan

> Execution plan derived from the completed repository audit.
> This document is an execution queue, not a product roadmap.

## Purpose

Turn the audit findings into small, sequential tasks that can be handed to a coding agent one task at a time.

The agent must **not** implement the whole audit in one pass.

**Current state (2026-11-28):** Tasks 001–016 completed and merged to `main`. Task 016 generated Tasks 017–019; Task 017 reconciliation completed in this batch with no implementation changes. Remaining current batch is Tasks 018–019 (docs/hygiene hardening), sequential, one PR per task.

### Execution rules

1. Read `AGENTS.md` first.
2. Read this file, then **only the current task file** unless the task explicitly requires another document.
3. Work on one task at a time.
4. Do not combine adjacent tasks unless the task file explicitly says they are inseparable.
5. Inspect current implementation before changing it.
6. Stay inside the task's file boundary.
7. Do not refactor unrelated code.
8. Do not implement future architecture because it appears in the audit.
9. Run the task's validation before declaring it complete.
10. If validation fails for an unrelated pre-existing reason, stop and report it instead of expanding scope.
11. Do not start the next task until the current task has passed review/validation.

## Source-of-truth relationship

- `AGENTS.md` — agent operating rules.
- `docs/ROADMAP.md` — product roadmap and phase order.
- `docs/MVP-SPECIFICATION.md` — shipped behavior.
- `docs/EXECUTION-PLAN.md` — current audit-reconciliation execution queue.
- `docs/execution/NNN-*.md` — atomic implementation instructions.
- Canonical audit: [`docs/audits/FULL-REPOSITORY-AUDIT-DEEPSEEK-V4-1-FLASH-FREE-2026-11-27.md`](./audits/FULL-REPOSITORY-AUDIT-DEEPSEEK-V4-1-FLASH-FREE-2026-11-27.md) — diagnostic evidence; it does not replace repository truth.
- Historical audits: `docs/archive/audits/` — evidence only.

The execution queue does **not** redefine the product roadmap. Phase 8 remains the product roadmap's current phase until that authority is deliberately reconciled.

## Current execution sequence

### Gate 0 — Truth and release gate

- [x] **001** — CLOSED: historical one-off timeout; not reproducible; no fix justified (see `docs/execution/001-fix-cli-cold-start-timeout.md`)
- [x] **002** — Record single-package distribution decision and archive superseded Phase 8 launch docs (see `docs/decisions/DECISION-SINGLE-PACKAGE-DISTRIBUTION.md`; archived under `docs/archive/`)
- [x] **003** — Reconcile agent reading order / execution-plan routing

### Gate 1 — Shipped-behavior fixes

- [x] **004** — Contractor presence detection and install guidance
- [x] **005** — `install --local-only` and unknown-flag rejection
- [x] **006** — `install --plan` plans once
- [x] **007** — Unify requirement stopwords
- [x] **008** — Surface Project Brain staleness
- [x] **009** — Exact-match-only remote attribution

### Gate 2 — Package/release hardening

- [x] **010** — Packaged-artifact smoke test
- [x] **011** — Prepack build/clean hardening
- [x] **012** — Install name/source validation and installer pin
- [x] **013** — Decide/document Windows support
- [x] **014** — Node 20 + 22 CI matrix
- [x] **015** — Publish checklist / package metadata verification (see `docs/RELEASE-CHECKLIST.md`; `make-it-ezy@0.1.6` is published and registry smoke verified; further publication remains a manual maintainer action)

### Gate 3 — Post-batch reconciliation

- [x] **016** — Post-batch reconciliation / next-batch generation (this batch)

### Gate 4 — Post-release docs/hygiene hardening (next batch)

- [x] **017** — Reconcile canonical audit after 001–015 (mark fixed/stale findings, add reconciliation note)
- [x] **018** — Add vitest `testTimeout` guard for cold-start CLI tests
- [ ] **019** — Ignore local `docs/skill-scan` evaluator/clone bloat and document scan artifact policy

### Gate 5 — Dependabot triage

- [ ] **020** — Classify current Dependabot alerts before any dependency changes (docs-only)

## Post-batch reconciliation note (2026-11-28)

**Scope:** Task 016 reconciliation only. No implementation fixes, no full re-audit.

**Verified completed (001–015):** PRs #31–#46 merged to `main`; Task 001 closed as not reproducible/no justified fix. Tasks 002–015 landed the planned docs/behavior/package hardening. `pnpm check:ci` passed on current `main`; packaged artifact smoke and Node 20/22 CI matrix are in place. `make-it-ezy@0.1.6` is published on npm; registry metadata and outside-repo install smoke were verified.

**Still real / carry forward:**
- Canonical audit `docs/audits/FULL-REPOSITORY-AUDIT-DEEPSEEK-V4-1-FLASH-FREE-2026-11-27.md` reconciliation was completed in Task 017; remaining open findings are evidence-backed.
- Cold-start CLI timeout guard added in Task 018 (`testTimeout: 10_000` in `vitest.config.ts`); Task 001 remains closed as not reproducible.
- `docs/skill-scan/` has 10 tracked docs/files but ~744M local untracked evaluator/clone data in the worktree; risk of accidental bloat/noise. Needs explicit ignore/policy, not mass deletion (019).

**Confirmed no longer open from audit list (spot-checked):** contractor presence signal, install `--local-only`/unknown-flag handling, install `--plan` double-plan, stopword duplication, brain staleness surfacing, plan.test cwd side effect, exact-match remote attribution + inspect sanitization, unpinned installer + install validation, prepack clean/build, packaged-artifact CI smoke, LICENSE in tarball, Node 20/22 matrix, distribution decision recorded, CLI help/banner stale Phase 6/7 wording, CONTRIBUTING/CI ci-before-push link to tracked skill, MVP spec brain refresh/enrich + network matrix, CAPABILITY-MODEL Superpowers contractor wording.

**Not queued:** further npm publication (manual maintainer action), and all decision-gated later items.

## Later, deliberately not queued for implementation yet

These remain decision/evidence-gated:

- `--json` contract
- unified Requirement model
- planner/selector consolidation
- `ezy verify` / lifecycle wiring
- Web UI
- deeper capability discovery
- second contractor
- host proofs / continuity expansion
- agent control
- provider routing
- RAG/vector memory
- MCP integration
- local-model routing
- Linger integration
- contractor registry
- trusted auto-install / trust scores
- telemetry/shared evidence
- LLM inside Ezy
- Home Ezy Node
- broader domain expansion

Do not create implementation tasks for these until their prerequisites and decision gates are satisfied.

## Critical-path principle

The immediate objective is to make the shipped core trustworthy before expanding it:

```
green test gate
    ↓
shipped-behavior correctness
    ↓
package/release correctness
    ↓
documentation reconciliation
    ↓
machine-readable contract
    ↓
verification
    ↓
future consumers / ecosystem
```

## Completion rule

A task is complete only when:

- its acceptance criteria pass;
- its stated validation has actually been run;
- no unrelated changes were introduced;
- documentation is synchronized when required;
- the next task is still valid after inspecting the resulting state.

