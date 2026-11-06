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
  <img src="https://img.shields.io/badge/status-phase%206-111111?style=flat-square" alt="Phase 6">
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

## Install

> Not on npm yet — install from source for now. Needs **Node.js 20+** and **pnpm 9+**.

```bash
git clone https://github.com/ezmichaely/make-it-ezy.git
cd make-it-ezy
pnpm install
pnpm build
```

Make the `ezy` command available everywhere (add both lines to `~/.zshrc` or `~/.bashrc`):

```bash
export MAKE_IT_EZY_ROOT="/absolute/path/to/make-it-ezy"
alias ezy='node "$MAKE_IT_EZY_ROOT/apps/cli/dist/index.js"'
```

Check it: `ezy --help`.

> Always run `ezy` **from inside the project you want to change** — it reads that folder. (`pnpm ezy …` inside the make-it-ezy repo only plans for Make It Ezy itself.)

## Use it with your coding agent (recommended)

Ezy is meant to run *through* your agent (Claude Code, Cursor, Codex): the agent researches the task, Ezy picks the skills, the agent builds.

**1. Add the `/ezy` skill to your project** (once per project):

```bash
cd /path/to/your-app
mkdir -p .agents/skills
ln -s "$MAKE_IT_EZY_ROOT/skills/ezy" .agents/skills/ezy     # Cursor / Codex
mkdir -p .claude/skills
ln -s ../../.agents/skills/ezy .claude/skills/ezy           # Claude Code
```

(Use `cp -R` instead of `ln -s` if you don't want it to follow updates.)

The agent finds the CLI through `MAKE_IT_EZY_ROOT` (agents usually don't load shell aliases), so keep that `export` in your shell profile.

**2. Ask your agent:**

```text
/ezy add Stripe subscriptions to this app
```

The agent then:

1. runs `ezy brief "…"` and researches what the task needs,
2. writes `.ezy/brief.json` (requirements, exclusions, sources),
3. runs `ezy next "…" --brief .ezy/brief.json` and shows you the plan,
4. asks before installing any skill,
5. builds the change using those skills.

Requirements no skill covers are listed as **Uncovered** — the agent handles them directly.

## Use the CLI directly

From inside your project:

```bash
ezy plan "add Stripe subscriptions"                  # quick plan (keyword fallback)
ezy brief "add Stripe subscriptions"                 # instructions for writing a researched brief
ezy plan "add Stripe subscriptions" --brief .ezy/brief.json
ezy next "add Stripe subscriptions" --brief .ezy/brief.json   # checklist + prompt to paste into your agent
ezy install --plan "add Stripe subscriptions"        # pick skills to install (asks first)
```

| Command | What it does |
|---|---|
| `ezy brief "<goal>"` | Prints your project summary + how to write `.ezy/brief.json`. Writes nothing. |
| `ezy plan "<goal>"` | Requirements → minimum skill set, with a reason for each pick, exclusions and uncovered items. |
| `ezy next "<goal>"` | Same plan as a checklist plus a ready-to-paste agent prompt. |
| `ezy install <skill>` / `--plan "<goal>"` | Installs skills into `.agents/skills` — always asks first (or pass `--yes`). |
| `ezy search` · `ezy inspect` · `ezy recommend` | Browse and inspect skills. |
| `ezy analyze` · `ezy doctor` | Show what Ezy detects about your project / environment. |

Useful flags: `--brief <path>` (use a researched brief), `--local-only` (no network; only skills already in `.agents/skills`), `--yes` (skip install confirmation).

Without `--brief`, plans use a keyword fallback and say so (`Basis: heuristic fallback`). A brief gives much better picks. An invalid brief stops with a list of errors (exit code 2).

## Develop Make It Ezy

```bash
pnpm build && pnpm test   # quick loop
pnpm check:ci             # full gate before any push
```

See [`CLAUDE.md`](./CLAUDE.md) and [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## Status

**Phase 6 shipped** — agent brief + decision quality (`ezy brief`, `--brief`), on top of project-aware `plan` / `next` (plus install + `/ezy`).

| Next | Later |
|---|---|
| Phase 7 — Project Brain | Soft-C, deep verify, trusted-auto |
| Phase 8 — Outcome verification | Codex marketplace plugin |
| Phase 9 — Web UI | Giant catalog / marketplace |

Roadmap: [`docs/ROADMAP.md`](./docs/ROADMAP.md) · Intent: [`docs/handoff/MAKE-IT-EZY-MASTER-HANDOFF.md`](./docs/handoff/MAKE-IT-EZY-MASTER-HANDOFF.md)

## License

[MIT](LICENSE).
