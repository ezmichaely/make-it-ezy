# MVP Specification

## Phase 1 MVP (current — done)

Prove Make It Ezy can understand a local project without models or installs.

| Command | Behavior |
|---|---|
| `ezy --help` | Usage |
| `ezy doctor` | Node ≥20, pnpm, Git, OS, project root |
| `ezy analyze` | Read-only root/git/pm/package.json/TS/frameworks |

Success:

```bash
pnpm install && pnpm build && pnpm test
pnpm ezy --help && pnpm ezy doctor && pnpm ezy analyze
```

Verified 2026-11-05: **18/18 tests passing**.

## Explicitly out of Phase 1

Discovery, install, AI providers, adapters, web UI, databases, swarms.

## Phase 2 slice (current)

```bash
pnpm ezy search "frontend design"
pnpm ezy search ponytail --local-only
pnpm ezy inspect ponytail
```

Returns ranked candidates, then local inspection (source, hash, files, shallow risk). **Never installs.**

Still out of Phase 2 slice: auto-install, decision engine, runtime adapters.

## Source of truth

Product vision and constraints: `MAKE-IT-EZY-MASTER-HANDOFF.md` at repo root.
