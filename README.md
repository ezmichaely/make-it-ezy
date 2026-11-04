# Make It Ezy

Local-first **AI capability discovery and orchestration** layer.

> The user describes the outcome. Make It Ezy figures out the minimum useful process.

**Status:** Phase 3 `ezy plan` (outcome → capabilities + skill shortlist). Discover/plan only — never installs or runs.

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
pnpm ezy inspect ponytail
pnpm ezy recommend "frontend design" --local-only
pnpm ezy plan "Create a promotional video" --local-only
pnpm ezy plan "Build me a beautiful SaaS dashboard" --local-only
```

## Repository layout

```text
apps/cli          CLI entrypoint
packages/core     Detection + discovery + planning
catalog/          Reserved for local capability metadata (empty)
docs/             Research + architecture + specs
```

## Deliberately not built yet

- Auto-install / skill execution (Phase 4; suggest-then-go → trusted auto)
- Runtime adapters
- Web UI
- Databases
- Multi-agent frameworks

See `docs/MVP-SPECIFICATION.md` and `docs/ROADMAP.md`.

## License

MIT
