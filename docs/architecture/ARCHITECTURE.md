# Architecture

**Current phase:** [`docs/ROADMAP.md`](../ROADMAP.md)
**Shipped behavior:** [`docs/MVP-SPECIFICATION.md`](../MVP-SPECIFICATION.md)
**Agent rules:** [`../../AGENTS.md`](../../AGENTS.md)

## Product boundary

Make It Ezy is a local-first **decision and routing layer** for coding tasks.

```text
USER OUTCOME
    ↓
project/context understanding
    ↓
requirements
    ↓
candidate discovery
    ↓
selection
    ↓
optional contractor/workflow routing
    ↓
handoff
    ↓
HOST AGENT EXECUTES
    ↓
verification (later Phase 9)
```

The host agent, not Ezy, performs specialist work and edits the repository.

## Current runtime

```text
apps/cli
   ↓
packages/core
   ├─ detection
   ├─ requirements
   ├─ discovery/search
   ├─ selection
   ├─ planning
   ├─ handoff/workflow
   ├─ install
   ├─ inspect
   └─ Project Brain
```

Current planner path:

`analyze → requirements → search → select → plan → handoff`

`packages/core/src/lifecycle.ts` is **not** the controlling runtime pipeline. It contains exported boundary contracts that are unit-tested but not called by the CLI/planner.

## Two layers

| Layer | Purpose |
|---|---|
| Build layer | Development aids used while building Ezy: builder skills, Graphify, Superpowers, Ponytail, etc. |
| Product layer | Ezy's actual end-user CLI and `skills/ezy` adapter |

Build-layer tools are not automatically product runtime dependencies.

## Current shipped surface

- `apps/cli`: `doctor`, `analyze`, `search`, `inspect`, `recommend`, `brief`, `brain`, `plan`, `next`, `install`
- `packages/core`: current planning/discovery/install/handoff implementation
- `skills/ezy`: end-user host-agent adapter
- `catalog/`: reserved; not a complete catalog
- lifecycle contracts: internal boundary only

## Architectural principles

1. Ezy decides; the host agent executes.
2. External skills are untrusted until inspected/approved.
3. Prefer local capabilities where the current implementation guarantees local-first behavior.
4. Do not add runtime dependencies, hosted services, telemetry, or LLM calls without an explicit decision.
5. Contractors/providers remain replaceable integrations.
6. Do not turn research artifacts into runtime dependencies.
7. Keep the core small; expand only when a real product requirement justifies it.

## Future architecture

```text
intent
 ↓
requirements
 ↓
discovery
 ↓
evaluation
 ↓
composition
 ↓
host execution
 ↓
outcome verification
 ↓
privacy-safe evidence
```

Only the shipped portions should be described as current behavior.