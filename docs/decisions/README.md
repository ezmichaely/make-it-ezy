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
| Agent documentation/source-of-truth workflow | Accepted by repository operating policy in `AGENTS.md` + `docs/AGENT-WORKFLOW.md` |

## Precedence

For product/architecture questions:

1. explicit user instruction;
2. accepted decision in `docs/decisions/`;
3. `AGENTS.md` operating rules;
4. `docs/ROADMAP.md` phase/status;
5. `docs/MVP-SPECIFICATION.md` shipped behavior;
6. current architecture docs;
7. current implementation/tests;
8. current handoff;
9. specs/plans;
10. audits/research/history.

For current behavior, implementation/tests are the final verification layer.

For current phase, `ROADMAP.md` is authoritative.

For agent workflow, `AGENTS.md` is authoritative.

When guidance conflicts, do not create a second competing source. Resolve the conflict in the existing authority.