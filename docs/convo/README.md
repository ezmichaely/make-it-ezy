# Conversation Summary

> **Purpose:** Preserve a compact, durable summary of the important repository decisions and context that came out of prior conversations.
>
> **Status:** Historical/contextual reference only. This file is **not** a source of truth and is **not** a work order.
>
> **Current authority:** Start with [../../AGENTS.md](../../AGENTS.md), then follow the repository source-of-truth hierarchy.

## Why This Exists

The repository previously contained conversation and agent-session material used while recovering the project's direction. Those session artifacts are no longer needed and have been removed.

This README keeps only the durable context that is useful when someone needs to understand **why the repository is structured this way**, without recreating a warehouse of transcripts, session logs, or old agent instructions.

Do not add raw conversation exports or full agent-session histories here.

## Current Repository Direction

Make It Ezy is a **local-first capability and context decision/routing layer for coding tasks**.

The intended workflow is:

```text
User outcome
    ↓
Project context
    ↓
Intent + requirements
    ↓
Capability discovery
    ↓
Evidence / evaluation
    ↓
Capability selection
    ↓
Plan / workflow
    ↓
Host-agent handoff
    ↓
Host-agent execution
    ↓
Verification
    ↓
Project state update
    ↓
Future session recovery
```

The important boundary is:

- **Ezy decides, understands, discovers, selects, prepares, and routes.**
- **The host coding agent executes the work.**

Ezy is not intended to become the coding agent itself, a generic autonomous multi-agent runtime, a skills marketplace, a model host, or a mandatory Superpowers/Graphify runtime.

## Current Product State

As of the documentation reconciliation on **2026-11-25**:

- Phases **0–7** are shipped.
- **Phase 8 — Launch and Distribution** is current.
- Phase 9 — Outcome Verification — is later.
- Phase 10 — Web UI — is later.
- The first broker-directed workflow slice is shipped.
- The current planning path is:

```text
analyze → requirements → search → select → plan → handoff
```

- Project Brain is persistent project context, not an autonomous memory/decision engine.
- `packages/core/src/lifecycle.ts` contains exported lifecycle boundary contracts, but those contracts do **not** control the current CLI/planner pipeline.
- Superpowers is an example contractor integration, not a mandatory product dependency.
- External skills, repository content, briefs, and generated research are treated as untrusted input.

## Distribution Direction

The chosen public distribution model is:

```text
npm install --global make-it-ezy
ezy --help
```

- Public npm package: `make-it-ezy`
- CLI executable: `ezy`
- `apps/cli`: published package
- `packages/core`: internal/private workspace package
- Core is bundled into the published CLI package.
- The repository root remains private.
- Release-Please is configured around the single public CLI package.

This distribution work still requires actual build/package verification before claiming the npm artifact is release-ready.

## Documentation Recovery / Cleanup

A major repository cleanup was performed to restore a single clear path for future agents.

The active documentation hierarchy is:

```text
AGENTS.md
  ↓
docs/STATUS.md
  ↓
docs/PRODUCT-DIRECTION.md
  ↓
docs/ROADMAP.md
  ↓
docs/MVP-SPECIFICATION.md
  ↓
docs/HOW-IT-WORKS.md
  ↓
docs/INTEGRATIONS.md
  ↓
docs/architecture/
  ↓
code + tests
```

Accepted decisions in `docs/decisions/` take precedence over lower-level proposals.

Historical audits, research, conversations, old plans, generated scan output, and branch names must not be treated as automatic work orders.

Old material that was still useful as historical evidence was moved under `docs/archive/` rather than left beside current instructions.

## Important Recovery Decisions

### 1. Do not reconstruct the project from old conversations

A conversation can explain provenance, but it does not define current implementation.

When something is unclear:

1. inspect the current repository;
2. check the source-of-truth hierarchy;
3. classify the statement as FACT, DECISION, PROPOSAL, UNKNOWN, or HISTORICAL;
4. verify implementation and tests;
5. ask for a decision when the conflict cannot be resolved.

### 2. Do not create competing master documents

When documentation conflicts:

- identify the authoritative document;
- update the authority;
- update dependent documents;
- archive/remove redundant material.

Do not create another summary document just to avoid resolving the conflict.

### 3. Audits are evidence, not authorization

An audit can identify a gap. It does not automatically mean the gap is still open or approved for implementation.

### 4. Specs and plans are not implementation

A plan or specification may describe intended behavior. Current code and tests must be inspected before describing something as shipped.

### 5. Keep the repository lean

The repository should contain durable product and engineering documentation, not a permanent archive of every conversation or agent session.

Historical evidence belongs under clearly marked historical locations when it is worth preserving.

## Key Working Principles

The project adopted a strict implementation loop:

```text
READ → VERIFY → CLASSIFY → PLAN → CHANGE → TEST → SYNC DOCS → VERIFY AGAIN
```

Before substantive work, establish:

```text
TASK:
CURRENT PHASE:
CURRENT BEHAVIOR:
REQUESTED CHANGE:
AUTHORITATIVE SOURCES:
RELEVANT FILES:
KNOWN GAPS / CONFLICTS:
```

Before declaring work complete:

```text
WHAT CHANGED:
WHY:
FILES:
TESTS RUN:
DOCS UPDATED:
KNOWN LIMITATIONS:
NEXT ACTION:
```

Never claim tests, builds, typechecks, or other verification passed unless they were actually run.

## Where To Continue

For any new repository session, **do not start here**.

Start with:

1. [../../AGENTS.md](../../AGENTS.md)
2. [../AGENT-WORKFLOW.md](../AGENT-WORKFLOW.md)
3. [../STATUS.md](../STATUS.md)
4. [../PRODUCT-DIRECTION.md](../PRODUCT-DIRECTION.md)
5. [../ROADMAP.md](../ROADMAP.md)
6. [../MVP-SPECIFICATION.md](../MVP-SPECIFICATION.md)
7. [../HOW-IT-WORKS.md](../HOW-IT-WORKS.md)
8. relevant accepted decisions in [../decisions/](../decisions/)
9. relevant architecture, implementation, callers, and tests

For product intent and trust context, see [../handoff/README.md](../handoff/README.md).

## Maintenance Rule

Keep this document short.

Update it only when a **durable historical context point** is worth preserving for future maintainers and is not already clearly documented elsewhere.

Do not use this file to track:

- active TODOs;
- current implementation tasks;
- release checklists;
- agent sessions;
- conversation transcripts;
- temporary debugging notes;
- speculative future architecture.

Those belong in the appropriate current documentation or nowhere at all.
