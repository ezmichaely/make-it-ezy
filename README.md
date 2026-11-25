# Make It Ezy

> **Tell Ezy what you want. It figures out what you need.**

Make It Ezy is a local-first capability and context decision layer for coding tasks. It understands the requested outcome and project, discovers candidate capabilities, selects a minimum useful set, and prepares a handoff for the host agent.

**Ezy decides. The host agent executes.**

Ezy is not itself a coding agent, a generic multi-agent runtime, or a skills marketplace.

## For AI agents working in this repository

**Start with [`AGENTS.md`](./AGENTS.md). Do not infer current work from this README.**

Required workflow:

`AGENTS.md` → `docs/AGENT-WORKFLOW.md` → current product docs → accepted decisions → implementation/tests.

## Current scope

**Today:** coding tasks in a repository, JS/TS first and Python next.

**Later:** other domains, one at a time.

## How it works

```text
User outcome
    ↓
Make It Ezy
    ├─ understand project
    ├─ derive requirements
    ├─ discover capabilities
    ├─ select a minimum useful set
    └─ prepare a workflow / handoff
              ↓
        Host agent
              ↓
          executes
```

The host agent remains responsible for research, implementation, and execution. Ezy does not silently install or execute third-party skills.

## Current status

- Phases 0–7: shipped
- Phase 8 — Launch and Distribution: current
- Broker-directed workflow: first slice shipped
- Phase 9 — Outcome verification: later
- Phase 10 — Web UI: later
- Lifecycle contracts: exported internal boundary contracts, **not** the controlling CLI/planner pipeline

For exact shipped CLI behavior, read [`docs/MVP-SPECIFICATION.md`](./docs/MVP-SPECIFICATION.md).

## Development

```bash
pnpm install
pnpm build
pnpm test
```

For builder-skill setup, read [`docs/BUILDER-SKILLS.md`](./docs/BUILDER-SKILLS.md).

For Ezy dogfooding:

```bash
pnpm ezy brief "<outcome>"
pnpm ezy plan "<outcome>" --local-only
pnpm ezy next "<outcome>" --local-only
```

## Documentation map

| Need | Read |
|---|---|
| Agent operating rules | [`AGENTS.md`](./AGENTS.md) |
| Agent workflow / anti-hallucination | [`docs/AGENT-WORKFLOW.md`](./docs/AGENT-WORKFLOW.md) |
| Human product overview | This README |
| One-page current workflow | [`docs/HOW-IT-WORKS.md`](./docs/HOW-IT-WORKS.md) |
| Current phase | [`docs/ROADMAP.md`](./docs/ROADMAP.md) |
| Shipped behavior | [`docs/MVP-SPECIFICATION.md`](./docs/MVP-SPECIFICATION.md) |
| Accepted decisions | [`docs/decisions/`](./docs/decisions/) |
| Current architecture | [`docs/architecture/ARCHITECTURE.md`](./docs/architecture/ARCHITECTURE.md) |
| Product intent/trust | [`docs/handoff/MAKE-IT-EZY-HANDOFF.md`](./docs/handoff/MAKE-IT-EZY-HANDOFF.md) |
| Builder skills | [`docs/BUILDER-SKILLS.md`](./docs/BUILDER-SKILLS.md) |
| Audits/research | Read only when the current task specifically requires evidence |

## License

MIT