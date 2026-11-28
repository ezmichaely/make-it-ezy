# Decisions

This directory contains **accepted, durable product and architecture decisions**.

A decision is not a brainstorm, audit, research note, implementation plan, or conversation transcript.

## Decision format

A durable decision should state:

- decision;
- context/problem;
- options considered;
- chosen direction;
- trade-offs;
- consequences;
- explicit non-goals;
- date/status.

Keep it concise. Do not copy conversations here.

## Current decisions

| Decision | Status |
|---|---|
| `DECISION-SINGLE-PACKAGE-DISTRIBUTION.md` | Accepted; matches shipped distribution |
| `DECISION-SHARED-MEMORY-3C.md` | Accepted direction; implementation details remain separate |
| `DECISION-WINDOWS-SUPPORT.md` | Accepted; focused Windows install-spawn CI verification added; full Windows support not claimed |
| Agent documentation/source-of-truth workflow | Accepted by repository operating policy in `AGENTS.md` + `docs/AGENT-WORKFLOW.md` |

## Precedence

The authoritative source-of-truth hierarchy is [`AGENTS.md`](../AGENTS.md) §2. **This directory does not define a second ordering.**

Scoped notes:

- The hierarchy in `AGENTS.md` §2 is authoritative; this directory does not re-order it.
- Accepted decisions outrank `docs/ROADMAP.md`, `docs/MVP-SPECIFICATION.md`, architecture, implementation/tests, handoff, specs/plans, and evidence, but do not override explicit user instruction or `AGENTS.md`.
- Current phase: `docs/ROADMAP.md` is authoritative.
- Shipped behavior: `docs/MVP-SPECIFICATION.md`; current behavior is finally verified against implementation/tests.
- Agent workflow: `AGENTS.md` + `docs/AGENT-WORKFLOW.md` are authoritative.
- `docs/STATUS.md` = current state; `docs/PRODUCT-DIRECTION.md` = product direction; handoff = context, not current authority.
- Specs/plans and audits/research/history are lower precedence evidence, not work orders.
- When guidance conflicts, do not create a second competing source. Resolve the conflict in the existing authority.