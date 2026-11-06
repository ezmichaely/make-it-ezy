# Integration Strategy

## Above package managers

```text
Make It Ezy decides what is needed
  → npm/pnpm, Git, MCP, runtime installers, OS tools perform install/run
```

Not a replacement for pnpm/npm.

## Phased integrations

| Phase | Integration | Status |
|---|---|---|
| 1 | Local filesystem + PATH doctor checks | **done** |
| 2 | skills.sh + local `.agents/skills` discovery | **done** (search / inspect / recommend) |
| 3 | Ranking + explainable minimum set (`plan`) | **done** (brief-driven (agent research) with heuristic fallback) |
| 4a | Gated install → Cursor `.agents/skills` | **done** (adapter #0) |
| 4b | Handoff `ezy next` | **done** |
| 4c | Agent Skill `skills/ezy` (Claude / Cursor / Codex) | **done** (adapter #1) |
| 5 | Project-aware capability planner (`analyze` → `plan`) | **done** |
| 6 | Agent brief + decision quality (`ezy brief`) | **done** |
| 7 | Project Brain (lightweight local knowledge) | later |
| 8 | Outcome verification | later |
| 9 | Web UI (same core) | later |
| Later | Deep skill verify, soft-C spawn, Codex marketplace plugin | TODO |
| Optional | Taste, OpenSEO, REA, Graphify, browser tools | only when task needs them |

Canonical sequence: `docs/ROADMAP.md`.

## Layer A vs Layer B

Development may install Superpowers/Ponytail/Graphify into `.agents/skills`.  
Product must not require them to run `ezy doctor` / `ezy analyze`.

Product ships its own skill at repo `skills/ezy` for agents consuming Make It Ezy.

## Compatibility claims

Only after tested against a real runtime install. Agent Skill path tested manually via Claude/Codex/Cursor loading `skills/ezy`.
