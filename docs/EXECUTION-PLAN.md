# Make It Ezy — Sequential Execution Plan

> Execution plan derived from the completed repository audit.
> This document is an execution queue, not a product roadmap.

## Purpose

Turn the audit findings into small, sequential tasks that can be handed to a coding agent one task at a time.

The agent must **not** implement the whole audit in one pass.

**Current state (2026-11-27):** the audit/reconciliation phase is complete for this batch. Exactly one canonical audit is active under `docs/audits/`; superseded audits are archived. The next step is execution of Tasks 001–015 in order. Task 016 remains the post-batch reconciliation gate and runs only after 001–015 are completed and validated.

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

- [ ] **010** — Packaged-artifact smoke test
- [ ] **011** — Prepack build/clean hardening
- [ ] **012** — Install name/source validation and installer pin
- [ ] **013** — Decide/document Windows support
- [ ] **014** — Node 20 + 22 CI matrix
- [ ] **015** — Publish checklist / package metadata verification

### Gate 3 — Post-batch reconciliation (after 001–015)

- [ ] **016** — Post-batch reconciliation / next-batch generation

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

