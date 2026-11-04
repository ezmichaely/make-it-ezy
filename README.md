# Make It Ezy

Local-first **AI capability discovery and orchestration** layer.

> The user describes the outcome. Make It Ezy figures out the minimum useful process.

**Status:** Phase 1 CLI + Phase 2 discovery (`search` / `inspect` / `recommend`). Discover only — never installs.

**Source of truth:** [`MAKE-IT-EZY-MASTER-HANDOFF.md`](./MAKE-IT-EZY-MASTER-HANDOFF.md)

**Research:** see `docs/research/` (live-verified 2026-11-05).

## Requirements

- Node.js 20+
- [pnpm](https://pnpm.io/) 9+ (10.x recommended)

## Setup

```bash
pnpm install
pnpm build
pnpm test
```

## CLI

```bash
pnpm ezy --help
pnpm ezy doctor
pnpm ezy analyze
pnpm ezy search "frontend design"
pnpm ezy search ponytail --local-only
pnpm ezy inspect ponytail
pnpm ezy recommend "frontend design" --local-only
```

During development without building:

```bash
pnpm dev:ezy recommend "frontend design" --local-only
```

## Repository layout

```text
apps/cli          CLI entrypoint
packages/core     Detection + formatting
catalog/          Reserved for local capability metadata (empty)
docs/             Research + architecture (Phase 0)
```

## Deliberately not built yet

- Auto-install / skill execution (Phase 4+; suggest-then-go → trusted auto)
- Decision engine for freeform outcomes (Phase 3)
- Runtime adapters
- Web UI
- Databases
- Multi-agent frameworks

See `docs/MVP-SPECIFICATION.md` and `docs/ROADMAP.md`.

## License

MIT
