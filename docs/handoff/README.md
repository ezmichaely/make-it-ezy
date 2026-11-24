# Handoff

For the shared agent entry point and current work sequence, start at [`../../AGENTS.md`](../../AGENTS.md). Claude Code reaches the same guide through the root `CLAUDE.md` bridge.

**Current product handoff:**

[`MAKE-IT-EZY-HANDOFF.md`](./MAKE-IT-EZY-HANDOFF.md) (2026-11-08). Read this for **product intent and trust** after the shared agent guide; use the roadmap and MVP spec for **shipped** behavior. The handoff opens with **shipped → next → future** so vision sections are not mistaken for today's CLI.

Historical material is segregated so current handoffs stay small and unambiguous:

- [`archive/`](./archive/) — superseded handoff snapshots and historical handoff analysis
- [`../convo/`](../convo/) — raw conversation exports / transcripts (research history only)

Do not reconstruct the current product from archived handoffs or raw conversation exports.

## Precedence

| Doc | Role |
|---|---|
| [`../../AGENTS.md`](../../AGENTS.md) | **Shared agent entry point / current work path** |
| [`../HOW-IT-WORKS.md`](../HOW-IT-WORKS.md) | **One-page workflow** (Ezy vs host agent; read before the long handoff) |
| [`MAKE-IT-EZY-HANDOFF.md`](./MAKE-IT-EZY-HANDOFF.md) | **Product definition / trust / architecture intent** |
| [`../ROADMAP.md`](../ROADMAP.md) | **Locked phase sequence / status** (wins on phase numbering) |
| [`../audits/2026-11-07-codebase-gaps.md`](../audits/2026-11-07-codebase-gaps.md) | **2026-11-07 audit** — findings **1–4 fixed**; **5–10** optional follow-up |
| [`../MVP-SPECIFICATION.md`](../MVP-SPECIFICATION.md) | What the CLI/skill do today (through the Phase 8 first slice) |
| [`../audits/FULL-REPOSITORY-AUDIT.md`](../audits/FULL-REPOSITORY-AUDIT.md) | **2026-11-25 full read-only audit** — 28 findings F-01–F-28, contradictions, risks |
| [`../work-plan/FOLLOW-UP-WORK-PLAN.md`](../work-plan/FOLLOW-UP-WORK-PLAN.md) | Ranked follow-up proposal — **nothing implemented** |
| [`../research/SKILL-SCAN-CORPUS-PLAN.md`](../research/SKILL-SCAN-CORPUS-PLAN.md) | What to do with the 224 MB `docs/skill-scan/` corpus |
| [`../architecture/ARCHITECTURE.md`](../architecture/ARCHITECTURE.md) | Current layout |
| [`../BUILDER-SKILLS.md`](../BUILDER-SKILLS.md) | Vendored builder skills (lockfile; not in git) |
| [`../superpowers/specs/`](../superpowers/specs/) | Slice designs (Phases 4–7 done) |
| [`../../skills/ezy/SKILL.md`](../../skills/ezy/SKILL.md) | Agent Skill adapter #1 |

## Scope (2026-11-06)

General by design, specific by launch: **coding tasks in your repo today**, other domains later, one at a time. See [`../ROADMAP.md` → Scope](../ROADMAP.md).

## Phase map (see ROADMAP)

Phases 0–7 are done. Audit findings **1–4** are resolved (see the audit doc). **Phase 8 — Launch and Distribution** is current; Phase 9 Verification and Phase 10 Web UI follow launch. Findings **5–10** are optional maintenance.

The product handoff elevates trust/evaluation as product-critical; ROADMAP still schedules outcome verification before Web UI. Do not invent a new phase order in chat — change `docs/ROADMAP.md` explicitly if that priority should move.


## Handoff structure

Handoffs are actionable implementation context, not the canonical product definition.

Use:
- `docs/architecture/` for **what Ezy is** and its stable system boundaries.
- `docs/decisions/` for **why we chose a direction** and durable decisions.
- `docs/handoff/` for **what the next coding/review agent should do**.

A good handoff should point agents to the relevant architecture and decisions instead of reconstructing the whole conversation.

2026-11-23 implementation instructions (both now carry a historical-status banner; they disagree about whether the lifecycle is dead or next — see audit §6):
- [Missing Ezy Capabilities — Coding Agent Instruction](./CODING-AGENT-INSTRUCTION-MISSING-EZY-CAPABILITIES-2026-11-23.md)
- [Claude Implementation Command — Review Fix Pass](./CLAUDE-IMPLEMENTATION-COMMAND-REVIEW-FIX-PASS-2026-11-23.md)
