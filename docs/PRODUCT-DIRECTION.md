# Make It Ezy — Product Direction

**Purpose:** This document defines the intended destination of Make It Ezy. It is future-facing product direction, not a claim that every capability described here is already implemented.

## Why Ezy exists

Make It Ezy should reduce the amount of project knowledge a user or coding agent must remember manually.

The user should be able to describe an outcome in ordinary language. Ezy should recover relevant project context, identify the capabilities and evidence needed, help form a sound execution plan, hand that plan to the host agent, and preserve useful project state for the next session.

## Product boundary

Ezy is a **local-first decision, context, and routing layer for coding work**.

Ezy should:
- understand the requested outcome;
- understand current project state;
- derive requirements;
- discover relevant capabilities;
- evaluate and select useful capabilities;
- compose an execution plan or workflow;
- produce an evidence-backed handoff for a host agent;
- preserve useful project knowledge;
- help the user recover current state later.

The host agent remains responsible for coding, research execution, and execution of selected external skills.

Ezy is not intended to become:
- the coding agent itself;
- a generic autonomous agent runtime;
- a model-hosting platform;
- a mandatory Superpowers or Graphify runtime;
- a giant skills marketplace merely for its own sake.

## North-star workflow

~~~text
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
~~~

The exact implementation may evolve. The responsibility boundaries should remain clear.

## Project Brain

Project Brain should become the durable, structured representation of project continuity.

It should distinguish at least:
- current objective;
- current phase/state;
- accepted decisions;
- architecture;
- constraints;
- completed work;
- active work;
- known gaps/blockers;
- useful historical context;
- session/task outcomes.

The Brain should help reconstruct project state. It should not silently turn historical notes, stale plans, or generated research into current instructions.

## Capability system

Capabilities should be treated as tools Ezy can discover and reason about, not as the product's sole purpose.

A future capability system may support local capabilities, external skill sources, metadata, trust/evaluation state, compatibility information, lifecycle/version information, workflow composition, and host-specific adapters.

No external capability should become a runtime dependency merely because it exists in a catalog.

## Host-agent integrations

Ezy should remain host-agnostic at the core.

Potential host integrations include Codex, Claude Code, Cursor, OpenCode, Qwen Code, and other compatible hosts.

An integration should translate Ezy's structured decision/handoff output into the host's conventions. It should not force Ezy to become that host.

## Evidence and verification

A mature Ezy workflow should distinguish:
- what the user requested;
- what the repository proves;
- what has been decided;
- what is inferred;
- what remains unknown;
- what was actually verified.

Outcome verification is a planned expansion, not something to claim as fully implemented today.

## User continuity

A core success criterion is:

> A user can return after forgetting most of the project and recover what matters without reconstructing the entire history manually.

The system should make this possible through concise current-state artifacts, structured project knowledge, accepted decisions, and clear next actions.

## Future expansion rule

Future features should be evaluated against the north-star loop. Prefer features that improve outcome understanding, project context, capability selection, evidence quality, handoff quality, verification, or continuity.

Do not expand into unrelated infrastructure merely because it is technically interesting.

## Documentation roles

- AGENTS.md — how agents operate in this repository.
- docs/STATUS.md — where the project is now.
- docs/PRODUCT-DIRECTION.md — what Make It Ezy is becoming.
- docs/ROADMAP.md — the accepted path from current state toward the destination.
- docs/MVP-SPECIFICATION.md — shipped/current product behavior.
- docs/HOW-IT-WORKS.md — current operating flow.
- docs/INTEGRATIONS.md — integration targets and boundaries.
- docs/architecture/ — technical architecture.
- docs/decisions/ — accepted decisions.
- audits, research, conversations, and archived plans — evidence/history, not automatic work orders.
