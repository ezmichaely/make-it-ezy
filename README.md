<p align="center">
  <img src="make-it-ezy.png" width="280" alt="Make It Ezy">
</p>

<h1 align="center">Make It Ezy</h1>

<p align="center">
  <em>Tell Ezy what you want. It figures out what you need.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/ezmichaely/make-it-ezy?style=flat-square&color=111111" alt="MIT license">
  <img src="https://img.shields.io/badge/status-phase%205-111111?style=flat-square" alt="Phase 5">
  <img src="https://img.shields.io/badge/node-%3E%3D20-111111?style=flat-square" alt="Node 20+">
</p>

---

**Make It Ezy** is an **AI capability orchestration layer**. Give it a goal, and it determines the capabilities, context, tools, agents, and workflow needed to accomplish it—using the **minimum necessary** to get the job done reliably.

It is **not** another coding agent, skill manager, MCP manager, marketplace, or prompt tool. Those are things Ezy can *select and compose*. Ezy sits **above** them.

```text
             HUMAN
                │
                ▼
          MAKE IT EZY
       "What do I need?"
                │
      ┌─────────┼─────────┐
      ▼         ▼         ▼
    Skills     Tools     Agents
      │         │         │
      └─────────┼─────────┘
                ▼
              WORK
```

## What Ezy does

```text
User: "Build me a SaaS" / "Add Stripe subscriptions" / "Refactor auth"
                     │
                     ▼
              ┌─────────────┐
              │ MAKE IT EZY │
              └──────┬──────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   Understand     Discover     Understand
     Goal       Capabilities    Project
        │            │            │
        └────────────┼────────────┘
                     ▼
           Select what's actually needed
                     │
                     ▼
              Execution / handoff plan
                     │
                     ▼
          Agents · Tools · Skills · Services
                     │
                     ▼
               Verify (later) · Update knowledge (later)
```

**Two jobs in one layer:**

1. **Capability router** — what skills, tools, agents, workflows, or services are actually needed?
2. **Context router** — what does that stack need to know, so the next agent doesn’t rediscover the whole repo?

```text
"Add subscriptions to my app."

              Ezy
               │
       ┌───────┴────────┐
       ▼                ▼
 Capability          Context
 selection            selection
       │                │
       ▼                ▼
 Stripe skill       Existing auth
 Testing            DB / billing
 Security           Project conventions
 Coding agent
       │                │
       └───────┬────────┘
               ▼
             Agent
```

A **capability** can be a skill, tool, MCP, agent, model, workflow, service, API, knowledge source—or later, a human expert. Today the product focuses on software development; the engine is capability-centered so it can grow beyond that.

**Principle:** minimum sufficient capabilities + minimum sufficient context.

## Quick start

```bash
pnpm install
pnpm build
pnpm test
```

Node.js 20+ · pnpm 9+ (10.x recommended).

```bash
export MAKE_IT_EZY_ROOT=/absolute/path/to/make-it-ezy
```

```bash
pnpm ezy plan "Build me a beautiful SaaS dashboard" --local-only
pnpm ezy next "Build me a beautiful SaaS dashboard" --local-only
pnpm ezy install --plan "Build me a beautiful SaaS dashboard"   # ↑/↓ pick on TTY
pnpm ezy inspect taste
```

## Agent Skill (`/ezy`)

Product adapter: [`skills/ezy/SKILL.md`](./skills/ezy/SKILL.md) — run the CLI, gated-install, then **keep building** in the host agent (Claude Code / Cursor / Codex).

```bash
mkdir -p /path/to/your-app/.agents/skills
cp -R /path/to/make-it-ezy/skills/ezy /path/to/your-app/.agents/skills/ezy
```

Then: `/ezy build me a profile page` (or ask the agent to use the `ezy` skill).

## Status

**Phase 5 shipped** — project-aware `plan` / `next` (plus install + `/ezy`).

| Next | Later |
|---|---|
| Phase 6 — Project Brain | Soft-C, deep verify, trusted-auto |
| Phase 7 — Outcome verification | Codex marketplace plugin |
| Phase 8 — Web UI | Giant catalog / marketplace |

Roadmap: [`docs/ROADMAP.md`](./docs/ROADMAP.md) · Intent: [`docs/handoff/MAKE-IT-EZY-MASTER-HANDOFF.md`](./docs/handoff/MAKE-IT-EZY-MASTER-HANDOFF.md)

## License

[MIT](LICENSE).
