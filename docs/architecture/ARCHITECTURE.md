# Architecture

Aligned to [`docs/handoff/MAKE-IT-EZY-HANDOFF.md`](../handoff/MAKE-IT-EZY-HANDOFF.md) (product intent). Phase status: [`docs/ROADMAP.md`](../ROADMAP.md).

**Human-friendly explainer (Taglish):** [`ARCHITECTURE-EXPLAINED.md`](./ARCHITECTURE-EXPLAINED.md).

## What Make It Ezy is

A **local-first capability-intelligence and routing layer** — discover, evaluate, compose a minimum trusted set, hand off. Not a coding agent, marketplace, or multi-agent framework.

**Scope today:** coding tasks in a repo (JS/TS first). The decision core — brief, scoring, selection, explanation — is domain-neutral; project inspection and the fallback lexicon are the domain-specific extension points. See [`../ROADMAP.md` → Scope](../ROADMAP.md).

Flow:

```text
USER OUTCOME
  → understand project/environment
  → classify task
  → plan capabilities
  → discover candidates (skills/tools/workflows/runtimes)
  → decide minimum useful set
  → risk / permission check (thin today)
  → suggest-then-go install
  → handoff prompt (ezy next) / Agent Skill continues in runtime
  → verify (later)
  → result
```

Prefer: **DISCOVER → EVALUATE → COMPOSE → EXECUTE → VERIFY**  
Avoid: building a new swarm framework.

This is the intended product flow. The shipped CLI covers only the slices listed in [`../MVP-SPECIFICATION.md`](../MVP-SPECIFICATION.md); deep trust verification and outcome verification are not complete.

## Two layers (critical)

| Layer | Purpose | Examples today |
|---|---|---|
| **A — Build Make It Ezy** | Skills/workflows used by coding agents developing this repo | Superpowers, Ponytail, Graphify, Anthropic/Vercel skills |
| **B — Product** | Make It Ezy discovers/evaluates/composes the ecosystem for end users | CLI + `skills/ezy` adapter |

Layer A tools are **not** mandatory runtime dependencies of the product.

## Current implementation (Phases 0–7 shipped; Phase 8 launch and distribution is current)

Audit findings **1–4** are resolved; optional **5–10** remain in [`../audits/2026-11-07-codebase-gaps.md`](../audits/2026-11-07-codebase-gaps.md). **Phase 8 — Launch and Distribution** is current. See [`../ROADMAP.md`](../ROADMAP.md).

```text
apps/cli            doctor | analyze | search | inspect | recommend | brief | brain | plan | next | install
packages/core       detection, search, plan, brief, brain, install, handoff, lifecycle contracts
skills/ezy          Agent Skill adapter #1 (Claude /ezy, Cursor/Codex skills)
catalog/            reserved (empty)
docs/               research, architecture, decisions, audits, work-plan, specs, plans, handoff
skills/ + skills-lock.json   Layer A pins; `.agents/skills/` installed locally (see BUILDER-SKILLS.md)
```

`analyze` is wired into `plan` / `next` (Phase 5): requirements come from the goal plus the detected project. Lifecycle contracts are exported from core but remain an architectural boundary, not a runtime pipeline — verified in [`../audits/FULL-REPOSITORY-AUDIT.md`](../audits/FULL-REPOSITORY-AUDIT.md) §6, with the proposed wiring in [`../work-plan/FOLLOW-UP-WORK-PLAN.md`](../work-plan/FOLLOW-UP-WORK-PLAN.md) (nothing implemented).

No AI SDK. No database. No mandatory hosted backend. Soft-C (CLI spawning Codex/Claude) and deep verify are not shipped.

## Shipped vs later

| Box | Status |
|---|---|
| Discovery (search / inspect / recommend) | Shipped |
| Decision engine (`ezy plan`) | Shipped (brief-driven (agent research) with heuristic fallback) |
| Gated install + Cursor `.agents/skills` | Shipped (adapter #0) |
| Handoff (`ezy next`) | Shipped |
| Agent Skill (`skills/ezy`) | Shipped (adapter #1) |
| Project Capability Planner (project-aware `plan`) | **Phase 5 — shipped** |
| Agent Brief + decision quality (`ezy brief`) | **Phase 6 — shipped** |
| Project Brain (`.ezy/brain.json`, `ezy brain` / enrich) | **Phase 7 — shipped** |
| Launch and distribution | Phase 8 — current |
| Outcome verification | Phase 9 |
| Deep verify / trusted-auto | Later |
| Soft-C / Codex marketplace plugin | Later |
| Web UI | Phase 10 |

See `docs/ROADMAP.md` for the locked sequence.

## Non-goals (near term)

- LangGraph / CrewAI / AutoGen / Ruflo as core
- Copying all skills into the repo
- Mandatory hosted backend or paid Make It Ezy API
- Treating Superpowers as required end-user runtime
