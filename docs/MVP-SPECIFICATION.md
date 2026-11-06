# MVP Specification

## Phases 1–3 (done)

`doctor` / `analyze` / `search` / `inspect` / `recommend` / `plan` — discover & plan only.  
Note: `plan` is still **outcome-only** (lexicon → skill shortlist). It does not yet use `analyze`.

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

## Later (not this MVP slice)

| Phase | Work |
|---|---|
| 6 | Agent Brief + Decision Quality (done) |
| 7 | Project Brain (lightweight persistent knowledge) |
| 8 | Outcome verification |
| 9 | Web UI |
| — | Soft-C, deep skill verify, trusted-auto, Codex marketplace plugin |

## Source of truth

- Phase sequence: `docs/ROADMAP.md`
- Product intent: `docs/handoff/MAKE-IT-EZY-MASTER-HANDOFF.md` (see phase-map note at top)
- Phase 4 designs: `docs/superpowers/specs/2026-11-05-phase4-*-design.md`
- Phase 5 design: `docs/superpowers/specs/2026-11-05-phase5-project-capability-planner-design.md`
