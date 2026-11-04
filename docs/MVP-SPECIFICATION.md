# MVP Specification

## Phase 1 MVP (done)

Prove Make It Ezy can understand a local project without models or installs.

| Command | Behavior |
|---|---|
| `ezy --help` | Usage |
| `ezy doctor` | Node ≥20, pnpm, Git, OS, project root |
| `ezy analyze` | Read-only root/git/pm/package.json/TS/frameworks |

```bash
pnpm install && pnpm build && pnpm test
pnpm ezy --help && pnpm ezy doctor && pnpm ezy analyze
```

## Phase 2 MVP (done)

```bash
pnpm ezy search "frontend design"
pnpm ezy search ponytail --local-only
pnpm ezy inspect ponytail
pnpm ezy recommend "frontend design" --local-only
```

Returns ranked candidates, local inspection, and a heuristic shortlist
(Recommended / Optional / Not needed). **Never installs.**

Still out of Phase 2: auto-install, freeform decision engine, runtime adapters.

## Source of truth

Product vision and constraints: `MAKE-IT-EZY-MASTER-HANDOFF.md` at repo root.
Design for recommend: `docs/superpowers/specs/2026-11-05-phase2-recommend-design.md`.
