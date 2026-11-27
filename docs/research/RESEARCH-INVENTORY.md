# Research Inventory

Re-analysis against earlier handoffs (v3 / master) + live GitHub checks (2026-11-05). Product intent now: `docs/handoff/MAKE-IT-EZY-HANDOFF.md`.

**Not approved product dependencies.** Decisions are provisional for Make It Ezy core vs optional task tooling.

Decision vocabulary: **BUILD | REUSE | INTEGRATE | STUDY | OPTIONAL | IGNORE**

## Executive findings

1. **Agent Skills is the portable format** Make It Ezy should understand — not reinvent.
2. **Superpowers / Ponytail are Layer A (how we build)** — STUDY/OPTIONAL for product; do not hard-require.
3. **skills.sh + Vercel Skills CLI are Phase 2 discovery infrastructure** — INTEGRATE.
4. **GSD is archived** — demote; prefer Superpowers/gstack/BMAD for workflow study.
5. **LangGraph/CrewAI stay out of core** — STUDY only.
6. **Phase 1 CLI already exists** and passes tests; next product work is Phase 2 discovery, not more architecture packages.
7. **This repo already installed 52 agent skills** — useful evidence for how discovery/install should work later.

## Captured corpus

The 224 MB SkillEvaluator capture lives in [`../skill-scan/`](../skill-scan/) and is **research evidence, not a product catalog**. What to keep in the repository and what to move out is proposed in [`SKILL-SCAN-CORPUS-PLAN.md`](./SKILL-SCAN-CORPUS-PLAN.md) (nothing moved yet).

## Skill ecosystem

| Project | Decision | Why |
|---|---|---|
| Agent Skills (agentskills.io) | STUDY / INTEGRATE | Canonical `SKILL.md` ecosystem |
| Vercel Skills / skills.sh | INTEGRATE (Phase 2) | Install + directory; prefer documented API over scraping |
| Anthropic Skills | STUDY | Examples; **NO_LICENSE** on repo — caution for redistribution |
| Awesome Agent Skills | STUDY / OPTIONAL | Catalog only |

## Workflows (Layer A + optional Layer B)

| Project | Decision | Why |
|---|---|---|
| Superpowers | STUDY / OPTIONAL | Build methodology; not runtime dependency |
| Ponytail | STUDY / OPTIONAL | Simplification principle; already installed for development |
| gstack | STUDY / OPTIONAL | Active Claude Code workflow pack |
| BMAD | STUDY / OPTIONAL | Active; license NOASSERTION — recheck |
| GSD | IGNORE (archived) | Archived 2026-05; do not plan around it |

## Specialists

| Project | Decision | Why |
|---|---|---|
| Agency Agents | STUDY / INTEGRATE | Large role catalog; schema inspiration only |

## UI / design

| Project | Decision | Why |
|---|---|---|
| Taste | INTEGRATE / OPTIONAL | Strong UI candidate; model token cost |
| UI UX Pro Max | OPTIONAL | Overlaps Taste — compare before recommending both |
| Impeccable | OPTIONAL | Critique/polish vocabulary |

## Domain optional

| Project | Decision | Why |
|---|---|---|
| OpenSEO | OPTIONAL | SEO MCP; external data cost |
| REA | OPTIONAL | RE specialist path; high risk |
| Browser Use | OPTIONAL | Python browser agents |
| Agent Browser | OPTIONAL | Node-friendly browser CLI |

## Code understanding

| Project | Decision | Why |
|---|---|---|
| Graphify | OPTIONAL | Excellent for codebase Q&A; already used in this project |

## Orchestration frameworks

| Project | Decision | Why |
|---|---|---|
| LangGraph / CrewAI | STUDY / IGNORE for core | Useful patterns; wrong default for Make It Ezy MVP |

## Runtimes

| Project | Decision | Why |
|---|---|---|
| Cursor | INTEGRATE (current) | Build harness today |
| Claude Code | INTEGRATE (Phase 4, likely first adapter) | Primary coding-agent target |
| Codex | INTEGRATE (Phase 4+) | Second adapter |

## What Make It Ezy should BUILD

Only coordination logic the ecosystem does not provide:

- task/outcome understanding
- minimum-useful capability selection
- explainable recommendations
- risk/permission gating
- adapters to runtimes
- verification reporting

## Open questions

1. skills.sh API: auth, rate limits, fields for commit/hash/path — still needs a real client probe.
2. How to normalize Agency Agents roles into a neutral specialist schema without claiming competence.
3. Duplicate detection across Taste / UI UX Pro Max / Impeccable.
4. Anthropic Skills / Claude Code license clarity before any redistribution guidance.
