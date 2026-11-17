# MVP Specification

> **Scope:** coding tasks in your repo (JS/TS first, Python next). Other domains are later — see [`ROADMAP.md` → Scope](./ROADMAP.md).

## Phases 1–3 (done)

`doctor` / `analyze` / `search` / `inspect` / `recommend` / `plan` — discover & plan only.  
`plan` was outcome-only in Phase 3; Phase 5 made `plan` / `next` project-aware. See the Phase 5 behavior below.

## Phase 4 slice (done)

```bash
pnpm ezy install <skill> --source owner/repo --yes
pnpm ezy install --plan "Build a SaaS dashboard"   # TTY: arrow select + confirm
pnpm ezy next "Build a SaaS dashboard" --local-only
```

- Preview source, destination, risk notes, exact command
- Require `--yes` or interactive confirm
- Install with `npx skills add …` into `.agents/skills`
- `ezy next` — checklist + paste-ready agent prompt (does not install/run)
- After `install --plan` / `--query`, reprints that handoff
- Agent Skill `skills/ezy` — agent runs CLI then **continues building** (adapter #1)
- **Does not** soft-C spawn Codex/Claude; deep verify is later

## Phase 5 — Project Capability Planner (done)

`ezy plan` / `ezy next` are **project-aware**:

- Wire `analyze` into planning
- Requirements from goal + project
- Filter to a minimum useful skill set with exclusion reasons
- No LLM, no Soft-C, no mandatory Graphify

```bash
pnpm ezy plan "Add a small button to the settings page" --local-only
pnpm ezy next "Add a small button to the settings page" --local-only
```

Spec: `docs/superpowers/specs/2026-11-05-phase5-project-capability-planner-design.md`  
Plan: `docs/superpowers/plans/2026-11-05-phase5-project-capability-planner.md`  
Sequence: `docs/ROADMAP.md`

## Phase 6 — Agent Brief + Decision Quality (done)

```bash
pnpm ezy brief "Add Stripe subscriptions"                     # instructions for the agent
pnpm ezy next "Add Stripe subscriptions" --brief .ezy/brief.json
```

- Host agent researches the outcome and writes `.ezy/brief.json` (requirements + search terms, exclusions, research)
- Ezy validates it as untrusted data (invalid → exit 2), picks a requirement-covering minimum skill set, explains picks / exclusions / uncovered
- Without a brief: heuristic fallback, labelled as such

## Phase 7 — Project Brain (done)

```bash
pnpm ezy brain
pnpm ezy brain refresh
pnpm ezy brain enrich
```

- `.ezy/brain.json` — machine slice (analyze + last plan) written by Ezy on `plan` / `next`; optional `agent` slice maintained by the host after `brain enrich`
- Does not drive planning in v1 (brief still owns requirements for `--brief`)

Spec: [`docs/superpowers/specs/2026-11-17-phase7-project-brain-design.md`](./superpowers/specs/2026-11-17-phase7-project-brain-design.md)  
Plan: [`docs/superpowers/plans/2026-11-17-phase7-project-brain.md`](./superpowers/plans/2026-11-17-phase7-project-brain.md)

## Later (not this MVP slice)

| Phase | Work |
|---|---|
| 8 | Outcome verification |
| 9 | Web UI |
| — | Soft-C, deep skill verify, trusted-auto, Codex marketplace plugin |

## Source of truth

- One-page workflow (Ezy vs host agent): [`HOW-IT-WORKS.md`](./HOW-IT-WORKS.md)
- Shared agent guide / current work path: `AGENTS.md`
- Phase sequence: `docs/ROADMAP.md`
- Product intent: `docs/handoff/MAKE-IT-EZY-HANDOFF.md`
- Phase 4 designs: `docs/superpowers/specs/2026-11-05-phase4-*-design.md`
- Phase 5 design: `docs/superpowers/specs/2026-11-05-phase5-project-capability-planner-design.md`
