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
  <img src="https://img.shields.io/badge/status-phase%207%20shipped-111111?style=flat-square" alt="Phase 7 shipped">
  <img src="https://img.shields.io/badge/node-%3E%3D20-111111?style=flat-square" alt="Node 20+">
</p>

---

**Make It Ezy** is a local-first capability and context decision layer. Give it a goal, and it identifies what the project needs, selects a minimum useful set of capabilities, and prepares a handoff. The host agent (Claude Code, Cursor, Codex, or another runtime) performs the work.

Ezy is **not** another coding agent, skills marketplace, or multi-agent runtime. Its role is to help choose and compose what the execution agent needs.

**How it works in practice:** Ezy discovers and filters capabilities, then hands off; your agent runs the recommended skills (from the net or local) and implements. Short walkthrough: [`docs/HOW-IT-WORKS.md`](./docs/HOW-IT-WORKS.md).

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

## Scope

**General by design, specific by launch.** The vision is any goal in any domain. **Today, Ezy targets coding tasks in your repo** (JS/TS first, Python next); other domains — video, research, documents — come later, one at a time. Ezy decides what's needed; your agent (Claude Code, Cursor, Codex) does the work. Details: [`docs/ROADMAP.md#scope`](./docs/ROADMAP.md).

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
pnpm ezy brief "Build me a beautiful SaaS dashboard"   # agent researches, writes .ezy/brief.json
pnpm ezy next "Build me a beautiful SaaS dashboard" --brief .ezy/brief.json
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

**Phases 0–7 shipped** — project-aware `plan` / `next`, agent brief (`ezy brief`, `--brief`), Project Brain (`.ezy/brain.json`, `ezy brain`), gated install + `/ezy`.

| Optional maintenance | Roadmap sequence | Deferred |
|---|---|---|
| Audit findings **5–10** only if approved. [Details](./docs/audits/2026-11-07-codebase-gaps.md) (1–4 fixed) | **Phase 8 — Outcome verification** | Soft-C, deep verify, trusted-auto |
|  | Phase 9 — Web UI | Codex marketplace plugin, giant catalog |

Shared agent guide: [`AGENTS.md`](./AGENTS.md) · Roadmap: [`docs/ROADMAP.md`](./docs/ROADMAP.md) · Intent: [`docs/handoff/MAKE-IT-EZY-HANDOFF.md`](./docs/handoff/MAKE-IT-EZY-HANDOFF.md)

## License

[MIT](LICENSE).
