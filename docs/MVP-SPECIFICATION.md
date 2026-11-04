# MVP Specification

## Phase 1 MVP (done)

| Command | Behavior |
|---|---|
| `ezy --help` | Usage |
| `ezy doctor` | Node ≥20, pnpm, Git, OS, project root |
| `ezy analyze` | Read-only root/git/pm/package.json/TS/frameworks |

## Phase 2 MVP (done)

```bash
pnpm ezy search "frontend design"
pnpm ezy inspect ponytail
pnpm ezy recommend "frontend design" --local-only
```

## Phase 3 MVP (done)

```bash
pnpm ezy plan "Create a promotional video" --local-only
pnpm ezy plan "Build me a beautiful SaaS dashboard" --local-only
```

Maps outcome → capability labels → Recommended / Optional / Not needed.
**Never installs or executes.**

Still out: auto-install, runtime adapters, bare `ezy "…"` alias.

## Source of truth

- `MAKE-IT-EZY-MASTER-HANDOFF.md`
- `docs/superpowers/specs/2026-11-05-phase3-plan-design.md`
