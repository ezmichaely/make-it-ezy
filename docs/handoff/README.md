# Handoff

For the shared agent entry point and current work sequence, start at [`../../AGENTS.md`](../../AGENTS.md). Claude Code reaches the same guide through the root `CLAUDE.md` bridge.

**Current product handoff:**

[`MAKE-IT-EZY-HANDOFF.md`](./MAKE-IT-EZY-HANDOFF.md) (2026-11-08). Read this for **product intent and trust** after the shared agent guide; use the roadmap and MVP spec for **shipped** behavior. The handoff opens with **shipped → next → future** so vision sections are not mistaken for today's CLI.

Older snapshots (historical only — do not reconstruct the product from these):

- `MAKE-IT-EZY-HANDOFF-v6.md`, `MAKE-IT-EZY-HANDOFF-v3.md`, `MAKE-IT-EZY-HANDOFF-V2.md`, `MAKE-IT-EZY-HANDOFF-v1.md`
- `make-it-ezy convo.txt`

## Precedence

| Doc | Role |
|---|---|
| [`../../AGENTS.md`](../../AGENTS.md) | **Shared agent entry point / current work path** |
| [`../HOW-IT-WORKS.md`](../HOW-IT-WORKS.md) | **One-page workflow** (Ezy vs host agent; read before the long handoff) |
| [`MAKE-IT-EZY-HANDOFF.md`](./MAKE-IT-EZY-HANDOFF.md) | **Product definition / trust / architecture intent** |
| [`../ROADMAP.md`](../ROADMAP.md) | **Locked phase sequence / status** (wins on phase numbering) |
| [`../audits/2026-11-07-codebase-gaps.md`](../audits/2026-11-07-codebase-gaps.md) | **2026-11-07 audit** — findings **1–4 fixed**; **5–10** optional follow-up |
| [`../MVP-SPECIFICATION.md`](../MVP-SPECIFICATION.md) | What the CLI/skill do today (through Phase 6) |
| [`../architecture/ARCHITECTURE.md`](../architecture/ARCHITECTURE.md) | Current layout |
| [`../superpowers/specs/`](../superpowers/specs/) | Slice designs (Phases 4–6 done) |
| [`../../skills/ezy/SKILL.md`](../../skills/ezy/SKILL.md) | Agent Skill adapter #1 |

## Scope (2026-11-06)

General by design, specific by launch: **coding tasks in your repo today**, other domains later, one at a time. See [`../ROADMAP.md` → Scope](../ROADMAP.md).

## Phase map (see ROADMAP)

Phases 0–6 are done. Audit findings **1–4** are resolved (see the audit doc). **Phase 7 — Project Brain** is the next roadmap phase, followed by Phase 8 verification and Phase 9 Web UI. Findings **5–10** are optional maintenance, not blockers for Phase 7.

The product handoff elevates trust/evaluation as product-critical; ROADMAP still schedules deep verify after Project Brain. Do not invent a new phase order in chat — change `docs/ROADMAP.md` explicitly if that priority should move.