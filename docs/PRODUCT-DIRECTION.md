# Make It Ezy — Product Direction

**Purpose:** This document defines the intended destination of Make It Ezy. It is future-facing product direction, not a claim that every capability described here is already implemented.

## Why Ezy exists

Make It Ezy should reduce the amount of project knowledge, capability knowledge, and execution coordination a user must manage manually.

The user should be able to describe an outcome in ordinary language. Ezy should recover relevant context, identify the domain and capabilities needed, discover and evaluate reusable skills and tools, form a sound execution plan, route work to suitable agents/models, and preserve useful project state for the next session.

## Product boundary today

Ezy is a **local-first decision, context, capability-discovery, and handoff layer for coding work**.

Today Ezy should:
- understand the requested outcome;
- understand current project state;
- derive requirements;
- discover relevant capabilities;
- evaluate and select useful capabilities;
- compose an execution plan or workflow;
- produce an evidence-backed handoff for a host agent;
- preserve useful project knowledge;
- help the user recover current state later.

The current implementation should remain focused until the coding path is solid. The broader destination described below is intentionally not the current implementation scope.

## North-star workflow

~~~text
User outcome
    ↓
Project / domain context
    ↓
Intent + requirements
    ↓
Capability discovery
    ↓
Evidence / evaluation
    ↓
Capability composition
    ↓
Plan / workflow
    ↓
Agent / model / provider selection
    ↓
Execution
    ↓
Verification
    ↓
Project state update
    ↓
Future session recovery
~~~

The exact implementation may evolve. The responsibility boundaries and composition principle should remain clear.

## The composition principle

**Do not rebuild a capability merely because Make It Ezy needs to use it.**

When a useful capability already exists and is suitable for integration, Ezy should prefer to:
- discover it;
- inspect its quality, interface, license, trust, compatibility, and maintenance state;
- evaluate whether it actually solves the need;
- integrate, wrap, adapt, or reference it as appropriate;
- keep it replaceable when practical.

This applies to skills, context systems, retrieval/RAG systems, MCP tools, evaluation systems, agent harnesses, model providers, routers, and domain-specific capabilities.

Examples such as ECC or RAG are **integration candidates, not automatic dependencies**. Their presence in the ecosystem does not by itself justify adopting them.

The goal is not to own every piece. The goal is to make the pieces work together into a useful whole.

## Capability system

Capabilities are tools Ezy can discover, reason about, compose, and eventually execute through appropriate hosts.

A capability may represent:
- a domain capability;
- a reusable skill;
- a context or evidence system;
- a retrieval/RAG system;
- an MCP tool or external API;
- an evaluation or verification mechanism;
- an agent capability;
- a model/provider capability;
- a workflow component.

A future capability system may support local capabilities, external skill sources, metadata, trust/evaluation state, compatibility information, lifecycle/version information, workflow composition, and host-specific adapters.

No external capability should become a runtime dependency merely because it exists in a catalog.

## Domain expansion

The current product is coding-first. The long-term system is **not coding-only**.

The eventual capability model should be able to represent multiple domains without requiring a separate application for each one. Potential domains include development, research, data, design, finance, legal, property, documentation, and other useful domains.

Domain expansion should happen when the core composition and execution model can support it cleanly, not by prematurely implementing every domain.

## Unified UI and routing direction

The long-term product should converge on a **single Make It Ezy UI/control plane** rather than requiring the user to manually stitch together separate agent applications.

The UI should take inspiration from the **T3-style multi-agent control concept**: a unified workspace for agent sessions, tasks, workspaces, context, skills, execution state, and results.

This is a conceptual reference, not a requirement to clone T3 or its implementation.

Provider routing should similarly take inspiration from the **OmniRoute-style routing/fallback concept**. Ezy should eventually be able to route execution across suitable cloud, local, and hybrid providers and apply fallback policies based on availability, task fit, quality, cost, latency, and other constraints.

The intended relationship is:

~~~text
Make It Ezy UI
      ↓
Agent / Task Control
      ↓
Ezy Control Plane
      ↓
Ezy Router
      ↓
Cloud / Local / Hybrid Providers
      ↓
Execution + Verification
~~~

Agent control and provider routing are therefore part of the same long-term control-plane vision. They are future capabilities, not reasons to expand today's implementation prematurely.


### Reference study: Linger

Linger is a complementary reference for the **local execution and personal-agent side** of the long-term Ezy vision.

Study Linger for local inference, hardware-aware model selection, runtime adapters, persistent wiki/memory, computer use, background work, agent teams, model scheduling, BYOK, and self-hosted execution. Do not treat Linger as an Ezy dependency or clone target.

The important Ezy question is not "How do we rebuild Linger?" It is:

> **Which Linger capabilities should Ezy USE, ADAPT, WRAP, REPLACE, or DEFER, and where must Ezy provide a stronger composition/control layer?**

Ezy should remain distinct as a capability-discovery and orchestration/control layer with explicit Domain / Capability / Skill / Agent / Runtime / Provider / Execution boundaries.

The authoritative study and comparison lives in \`docs/architecture/FUTURE-ECOSYSTEM.md\`.

## Agent and provider control

Ezy should remain agent- and provider-agnostic at the core.

Potential host integrations include Codex, Claude Code, Cursor, OpenCode, Qwen Code, local agents, and other compatible hosts.

A mature Ezy control plane may select and coordinate multiple agents and providers based on task requirements, capability fit, quality, availability, cost, latency, and fallback rules.

Provider routing and fallback are future capabilities. They should grow from real execution needs rather than becoming speculative infrastructure today.

## Project Brain and persistent context

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

A mature system may combine structured project state with retrieval/context systems such as RAG when that provides a real benefit.

The Brain should help reconstruct project state. It should not silently turn historical notes, stale plans, or generated research into current instructions.

## Long-term destination

The final destination is a **composable AI control and orchestration ecosystem**, eventually capable of running as a self-hosted **Home Ezy Node**.

Conceptually:

~~~text
                         MAKE IT EZY
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
       Domains             Capabilities         Agents
          │                   │                   │
     Coding/Research     Skills/ECC/RAG       Claude/Codex
     Finance/Legal       MCP/Tools             Cursor/Local
     Property/Design     Knowledge/Evidence
          │                   │                   │
          └───────────────────┼───────────────────┘
                              │
                         Orchestrator
                              │
                         Ezy Router
                              │
                ┌─────────────┼─────────────┐
                │             │             │
              Cloud         Local         Hybrid
             Models        Models         Providers
                │             │             │
                └─────────────┼─────────────┘
                              │
                       HOME EZY NODE
                              │
                    HOME AI ECOSYSTEM
~~~

This is the **final destination**, not a near-term implementation commitment.

The ecosystem may take years to build. The timeline is intentionally open-ended.

## Future expansion rule

Future work should preserve the ability to compose existing capabilities while improving one or more of:
- outcome understanding;
- domain capability selection;
- project context;
- retrieval and evidence;
- skill discovery;
- agent selection;
- provider routing;
- execution;
- verification;
- continuity;
- local/cloud interoperability.

Do not build speculative infrastructure simply because it could be useful someday.

At the same time, do not make today's implementation choices that unnecessarily prevent the long-term ecosystem.

**Build today's useful product. Preserve tomorrow's architecture. Assemble the ecosystem piece by piece.**

## Documentation roles

- AGENTS.md — how agents operate in this repository.
- docs/STATUS.md — where the project is now.
- docs/PRODUCT-DIRECTION.md — what Make It Ezy is becoming.
- docs/architecture/FUTURE-ECOSYSTEM.md — the preserved long-term destination and composition principles.
- docs/ROADMAP.md — the accepted path from current state toward the destination.
- docs/MVP-SPECIFICATION.md — shipped/current product behavior.
- docs/HOW-IT-WORKS.md — current operating flow.
- docs/INTEGRATIONS.md — integration targets and boundaries.
- docs/architecture/ — technical architecture.
- docs/decisions/ — accepted decisions.
- audits, research, conversations, and archived plans — evidence/history, not automatic work orders.
