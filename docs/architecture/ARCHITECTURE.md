# Architecture

Aligned to `docs/handoff/MAKE-IT-EZY-MASTER-HANDOFF.md` after 2026-11-05 re-analysis.

## What Make It Ezy is

A **local-first capability discovery, decision, and orchestration layer**.

Flow:

```text
USER OUTCOME
  → understand project/environment
  → classify task
  → plan capabilities
  → discover candidates (skills/tools/workflows/runtimes)
  → decide minimum useful set
  → risk / permission check
  → execute via existing runtime adapter
  → verify
  → result
```

Prefer: **DISCOVER → EVALUATE → COMPOSE → EXECUTE → VERIFY**  
Avoid: building a new swarm framework.

## Two layers (critical)

| Layer | Purpose | Examples today |
|---|---|---|
| **A — Build Make It Ezy** | Skills/workflows used by coding agents developing this repo | Superpowers, Ponytail, Graphify, Anthropic/Vercel skills |
| **B — Product** | Make It Ezy discovers/evaluates/composes the ecosystem for end users | Phase 2+ |

Layer A tools are **not** mandatory runtime dependencies of the product.

## Current implementation (Phase 1)

```text
apps/cli            argv → help | doctor | analyze
packages/core       read-only detection + formatting
catalog/            reserved (empty)
docs/               Phase 0 research + architecture
.agents/skills/     Layer A installs (gitignored; skills-lock.json tracked)
```

No AI SDK. No network discovery. No install path. No web UI. No database.

## Conceptual boxes not yet packages

Task classifier, decision engine, registries, adapters, verification — exist only as docs until Phase 2+.

## Non-goals (near term)

- LangGraph / CrewAI / AutoGen / Ruflo as core
- Copying all skills into the repo
- Mandatory hosted backend or paid Make It Ezy API
- Treating Superpowers as required end-user runtime
