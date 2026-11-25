# Roadmap

**This file owns phase order and current phase status.**

## Current phase — 2026-11-25

**Phase 8 — Launch and Distribution is current.**

Phases 0–7 are shipped.

The first broker-directed workflow slice is shipped within Phase 8:

- contractor routing;
- ordered workflow output;
- host-agent adapter support.

Phase 9 is outcome verification. Phase 10 is Web UI.

### Status rule

Do not use audits or work plans to infer the current phase. Only this file controls phase ordering.

## Scope

**General by design, specific by launch.**

| Status | Scope |
|---|---|
| Today | Coding tasks in a repository; JS/TS first and Python next |
| Later | Other domains, one at a time |

Ezy decides what is needed. The host agent does the work.

## Phase 0 — Research

**Done.**

## Phase 1 — Minimal CLI

**Done.**

## Phase 2 — Discovery

**Done.**

## Phase 3 — Decision engine

**Done.**

## Phase 4 — Install + adapters

**Done.**

## Phase 5 — Project Capability Planner

**Done.**

- project-aware `plan` / `next`;
- goal + project requirements;
- minimum useful skill selection.

## Phase 6 — Agent Brief + Decision Quality

**Done.**

- `ezy brief`;
- validated `.ezy/brief.json`;
- requirement-covering selection.

## Phase 7 — Project Brain

**Done.**

- `.ezy/brain.json`;
- machine slice;
- optional host-maintained agent slice.

Project Brain is persistent context, not an autonomous memory/decision engine.

## Phase 8 — Launch and Distribution

**Current.**

Current work is launch/distribution quality and maintaining the first broker workflow slice.

Lifecycle contracts in `packages/core/src/lifecycle.ts` are exported boundary contracts. They are **not** the controlling CLI/planner pipeline.

## Phase 9 — Outcome Verification

**Later.**

- verify whether the requested outcome was achieved;
- add deeper verification where justified.

## Phase 10 — Web UI

**Later.**

Use the same core decision layer. The UI should not create a second product architecture.

## Future horizon — directional roadmap

These phases are now the explicit destination path beyond the currently scheduled phases. Their detailed scope should be refined when the preceding phase is complete; they are not permission to start all of them at once.

### Phase 11 — Capability Ecosystem

**Future.**

- mature capability registry and metadata;
- stronger capability evaluation/trust state;
- capability composition beyond the first broker slice;
- controlled external capability discovery;
- lifecycle behavior only where it is actually implemented.

### Phase 12 — Host Integration Expansion

**Future.**

- prove one or two host integrations end-to-end;
- standardize adapter boundaries;
- expand to additional coding hosts where justified;
- keep the core decision layer host-agnostic.

Potential hosts include Codex, Claude Code, Cursor, OpenCode, Qwen Code, and other compatible hosts.

### Phase 13 — Project Continuity

**Future.**

- strengthen Project Brain as a durable current-state model;
- make resume/recovery reliable after long gaps;
- preserve decisions, outcomes, blockers, and next actions;
- make stale historical material clearly distinguishable from current state.

The goal is that a user can return after forgetting most of the project and recover what matters without reconstructing the project manually.

### Phase 14 — Broader Domain Expansion

**Future / conditional.**

Only after the coding workflow is stable.

Expand beyond repository coding one domain at a time, reusing the core decision/context/routing model rather than creating unrelated domain-specific architectures.

## Deliberately not current

Do not pull these into current work without an explicit decision:

- autonomous Soft-C execution;
- deep trusted-auto verification;
- mandatory Superpowers;
- mandatory Graphify;
- giant skill marketplace/catalog;
- hosted telemetry;
- autonomous self-improvement;
- multi-domain expansion before the coding path is stable.

## Adding roadmap work

A roadmap item is not approved merely because it appears in an audit, plan, research document, or conversation.

New work enters the roadmap only after explicit acceptance.