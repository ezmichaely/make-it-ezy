# Handoff archive

> **Status:** historical traceability only. Nothing here is current product or implementation instruction.
>
> This is the **single summary file** for the handoff archive. The raw handoff snapshots were
> removed on 2026-11-27; their durable conclusions are preserved below. Git history retains the
> full text.

## Current sources

Do not start here. Use:

1. [`AGENTS.md`](../../../AGENTS.md) — agent entry point
2. [`docs/AGENT-WORKFLOW.md`](../../AGENT-WORKFLOW.md) — working protocol
3. [`docs/STATUS.md`](../../STATUS.md) — current state
4. [`docs/EXECUTION-PLAN.md`](../../EXECUTION-PLAN.md) — active queue
5. [`docs/handoff/MAKE-IT-EZY-HANDOFF.md`](../../handoff/MAKE-IT-EZY-HANDOFF.md) — current product intent and trust boundary
6. [`docs/decisions/`](../../decisions/) — durable decisions
7. [`docs/architecture/`](../../architecture/) — current architecture
8. [`docs/ROADMAP.md`](../../ROADMAP.md) — phase/status authority

---

## Retained conclusions

These are the product-level conclusions from the 2026-11-22 synthesis that are **not** fully
represented elsewhere. Treat them as historical decisions, not current authority.

### 1. Ezy stays a decision / composition / routing layer

Ezy should not become another coding agent, a generic multi-agent runtime, a giant skill bundle,
a model-hosting service, or a replacement for Cursor, Claude Code, Codex, or Qwen Code.

### 2. Paperclip and other agent runtimes

Paperclip AI and similar systems are useful for understanding agent runtime/orchestration
infrastructure. They remain study/reference material unless a concrete integration solves a
problem Ezy should own.

> Reuse strong open-source infrastructure when it fits the boundary; do not rebuild it merely
> because it exists, and do not absorb it into Ezy just because it is interesting.

### 3. Local / Home AI is an execution environment

A local AI workstation or Home AI is an execution environment, not the Ezy product itself.

### 4. Intent-to-outcome pipeline

Ezy does not only route an already well-specified task. Turning ambiguous intent into a
sufficiently understood, executable objective is core Ezy responsibility.

Role separation matters — these are different problems:

| Role | Responsibility |
|---|---|
| Prompt Master | Structure the user's intent into a stronger task specification |
| Grill Me | Expose ambiguity, assumptions, missing requirements, unresolved decisions |
| Skillspector | Inspect the available skill/capability landscape |
| Find Skills | Discover candidate capabilities for a concrete need |
| Skill Evaluator | Judge candidates for relevance, quality, trust, overlap, safety, fit |
| Skill Spec / composition | Formalize selected capabilities for composition |
| Humanizer | Improve user-facing communication when relevant |
| Contractor | Own the domain/workflow methodology and execute through a host |

Ezy should depend on **stable roles and interfaces**, not on hard-coding one external project
into core.

### 5. Two evaluators, not one

Evaluation happens at two distinct levels and must not be collapsed:

- **Skill evaluation** — after discovery, before selection. *"Is this capability a good choice for the work?"* Signals: task fit, quality, trust, safety, overlap, dependencies, reliability.
- **Outcome evaluation** — after execution. *"Did the work actually achieve the outcome?"*

### 6. Revised Ezy boundary

> **Make It Ezy is an intent-to-outcome orchestration layer:** it understands user intent,
> invokes the capabilities needed to clarify and formulate the work, discovers and evaluates
> suitable skills, composes a workflow/contractor, delegates execution, evaluates the outcome,
> and decides whether to deliver, iterate, or escalate.

This does not mean Ezy implements every capability. The core stays small; capabilities and
contractors provide specialized work; execution hosts perform the work.

---

## Removed files (2026-11-27)

| File | Date | What it was |
|---|---|---|
| `MAKE-IT-EZY-HANDOFF-v1.md` | early | Product vision plus a research inventory of the ecosystem: skill discovery, agent collections, orchestration, codebase memory, browser automation, security, UI/UX. Ancestor of `docs/architecture/CAPABILITY-MODEL.md`. |
| `MAKE-IT-EZY-HANDOFF-V2.md` | early | Technology decision and the first phased roadmap (Phase 0–4). |
| `MAKE-IT-EZY-HANDOFF-v3.md` | 2026-11-06 | "Master Project Handoff": the scope decision, the Layer A / Layer B distinction (skills used to *build* Ezy vs skills Ezy *uses*), and Superpowers vs Agent Skills. |
| `MAKE-IT-EZY-HANDOFF-v6.md` | 2026-11-06 | Cursor handoff (superseded 2026-11-08): mission, problem, core architecture, "research comes before capability selection", capability taxonomy (skill / agent / tool / MCP / runtime / model router). |
| `CONVERSATION-SYNTHESIS-2026-11-22.md` | 2026-11-22 | Decision synthesis. Its uncovered conclusions are folded into "Retained conclusions" above. |
| `CONVERSATION-ANALYSIS-HANDOFF.md` | 2026-11-11 | Per-topic analysis of the conversation exports and repo state, with a topic index. Source transcripts were removed on 2026-11-27; see [`docs/archive/conversations/README.md`](../../archive/conversations/README.md). |
| `CODING-AGENT-INSTRUCTION-MISSING-EZY-CAPABILITIES-2026-11-23.md` | 2026-11-23 | Implementation brief treating lifecycle contracts as work still to be wired into the runtime. |
| `CLAUDE-IMPLEMENTATION-COMMAND-REVIEW-FIX-PASS-2026-11-23.md` | 2026-11-23 | Review/fix pass instruction for a different branch (`docs/shared-evidence-self-improvement`) and PR #21. |

The current consolidated handoff is [`../../handoff/MAKE-IT-EZY-HANDOFF.md`](../../handoff/MAKE-IT-EZY-HANDOFF.md).

### The lifecycle conflict (the one thing worth remembering)

The two 2026-11-23 files said lifecycle contracts must be wired into the runtime/CLI.
`docs/architecture/ARCHITECTURE.md` and `CAPABILITY-MODEL.md` say the opposite: they are
deliberate boundary contracts, not a runtime pipeline.

That conflict is recorded in [`docs/archive/audits/README.md`](../audits/README.md) (§3, full
repository audit 2026-11-25; full text in git history) and is the reason a single ADR is still
proposed. **Do not treat either side as decided.**

## Reading rule

Use this file only to understand how the project got here. If anything here conflicts with a
current source, the current source wins.
