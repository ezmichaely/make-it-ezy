# How Make It Ezy works (short)

Read this before the long handoff. It states who does what in one workflow.

**Shipped / next / future:** [`ROADMAP.md`](./ROADMAP.md) and [`MVP-SPECIFICATION.md`](./MVP-SPECIFICATION.md) own **shipped** CLI behavior. **Next:** Phase 8 verification, then Web UI. Phase 7 Project Brain is shipped (`.ezy/brain.json`). **Future:** trust automation, Soft-C, and other items called out as deferred in the roadmap. The long [`handoff/MAKE-IT-EZY-HANDOFF.md`](./handoff/MAKE-IT-EZY-HANDOFF.md) mixes intent with that timeline — it opens with a **Shipped → next → future** table; treat everything after that as product direction unless the MVP spec says otherwise.

## One sentence

**Ezy picks and explains a small stack of capabilities for your goal; your host agent (Cursor, Claude Code, Codex) runs those skills and writes the code.**

## Two roles

| Who | Role |
|-----|------|
| **Make It Ezy (CLI)** | Understand the outcome and project, **discover** candidates (local `.agents/skills` + skills.sh), **filter** to a minimum useful set, **gate** installs, print a **handoff** (checklist + prompt). No LLM inside Ezy. |
| **Host agent + installed skills** | **Do the work**: sharpen vague goals, research, deep inspect, implement. Uses **skills from the ecosystem** (Prompt Master, research skills, domain skills, optional tools like SkillEvaluator) when the handoff or you says so — those are **not** built into the Ezy binary. |

**Shopping list vs kitchen:** Ezy does not replace Prompt Master, NVIDIA SkillEvaluator, or your coding agent. It decides **what belongs on the list for this job** and passes that to the agent.

## Typical flow (coding in your repo)

```text
1. You describe an outcome ("improve onboarding", "add Stripe", …).
2. Optional: ezy brief "…"  →  the agent researches and writes .ezy/brief.json
3. ezy next "…" [--brief .ezy/brief.json]  →  plan + skills + checklist + paste-ready prompt
4. You approve any ezy install … commands (gated).
5. The agent reads recommended SKILL.md files, runs any extra skills the situation needs, implements in the repo.
6. Optional: `ezy brain enrich`  →  agent maintains `agent` slice in `.ezy/brain.json` for the next session.
```

Agent adapter: [`skills/ezy/SKILL.md`](../skills/ezy/SKILL.md) — the host must not stop after step 3.

## What "discover → evaluate → …" means here

The handoff uses a lifecycle (discover, evaluate, compose, execute, verify). In the **shipped** product:

- **Discover / filter / compose** → mostly **Ezy** (`search`, `plan`, `select`, `inspect` at a light level).
- **Intake, deep research, deep security, coding, verification** → **host agent** and **skills you install from the internet**, when needed — not a fixed pipeline reimplemented in TypeScript.

Discovery on skills.sh is **not** automatic trust. Popularity is not safety.

## What Ezy is not

- Not the coding agent
- Not a skills marketplace you browse forever
- Not a multi-agent runtime that spawns Codex/Claude for you (Soft-C is later/out of scope for MVP)
- Not required to bundle every "excellent" orchestrator skill inside the repo

## Where to go next

| Question | Doc |
|----------|-----|
| Shipped CLI behavior | [`MVP-SPECIFICATION.md`](./MVP-SPECIFICATION.md) |
| Phase order | [`ROADMAP.md`](./ROADMAP.md) |
| Full product intent & trust | [`handoff/MAKE-IT-EZY-HANDOFF.md`](./handoff/MAKE-IT-EZY-HANDOFF.md) |
| Agents working in this repo | [`../AGENTS.md`](../AGENTS.md) |