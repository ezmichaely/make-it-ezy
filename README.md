<p align="center">
  <img src="make-it-ezy.png" width="280" alt="Make It Ezy">
</p>

<h1 align="center">Make It Ezy</h1>

<p align="center">
  <em>Tell Ezy what you want. It figures out what you need.</em><br>
  <sub>Starting with coding tasks in your repo.</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/ezmichaely/make-it-ezy?style=flat-square&color=111111" alt="MIT license">
  <img src="https://img.shields.io/badge/status-phase%208%20current-111111?style=flat-square" alt="Phase 8 current">
  <img src="https://img.shields.io/badge/node-%3E%3D20-111111?style=flat-square" alt="Node 20+">
</p>

---

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

## Distribution

For end users, the intended installation is one public npm package:

```bash
npm install --global make-it-ezy
ezy --help
```

The published CLI package contains the internal core runtime, so users do not need to install a second Ezy package.

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
| Current execution queue | [`docs/EXECUTION-PLAN.md`](./docs/EXECUTION-PLAN.md) |
| Accepted decisions | [`docs/decisions/`](./docs/decisions/) |
| Current architecture | [`docs/architecture/ARCHITECTURE.md`](./docs/architecture/ARCHITECTURE.md) |
| Product intent/trust | [`docs/handoff/MAKE-IT-EZY-HANDOFF.md`](./docs/handoff/MAKE-IT-EZY-HANDOFF.md) (context, not current authority) |
| Product direction | [`docs/PRODUCT-DIRECTION.md`](./docs/PRODUCT-DIRECTION.md) |
| Current state | [`docs/STATUS.md`](./docs/STATUS.md) |
| Builder skills | [`docs/BUILDER-SKILLS.md`](./docs/BUILDER-SKILLS.md) |
| Current audit | [`docs/audits/FULL-REPOSITORY-AUDIT-DEEPSEEK-V4-1-FLASH-FREE-2026-11-27.md`](./docs/audits/FULL-REPOSITORY-AUDIT-DEEPSEEK-V4-1-FLASH-FREE-2026-11-27.md) |
| Audits/research | Read only when the current task specifically requires evidence; historical audits are in `docs/archive/audits/` |

## License

MIT