# Make It Ezy

Local-first **AI capability discovery and orchestration** layer.

> The user describes the outcome. Make It Ezy figures out the minimum useful process.

**Status:** Phase 4 `ezy install` + `ezy next` (suggest-then-go install, paste-ready handoff). Does not execute skill outcomes yet.

**Source of truth:** [`docs/handoff/MAKE-IT-EZY-MASTER-HANDOFF.md`](./docs/handoff/MAKE-IT-EZY-MASTER-HANDOFF.md)

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
pnpm ezy plan "Build me a beautiful SaaS dashboard" --local-only
pnpm ezy next "Build me a beautiful SaaS dashboard" --local-only
pnpm ezy install --plan "Build me a beautiful SaaS dashboard"   # arrow-pick on TTY; then handoff
pnpm ezy install taste --source Leonxlnx/taste-skill --yes
pnpm ezy inspect taste
```

On a TTY, `ezy install --plan "…"` / `--query "…"` lets you **↑/↓** select a recommended skill, then confirm and prints `ezy next` handoff. Scripts/CI use `ezy install <skill> --yes`.

## Deliberately not built yet

- Deep skill verification
- Auto-running skills / outcome execution
- Trusted-auto allowlists
- Full Claude Code / Codex adapters (files land in `.agents/skills` for Cursor today)

See `docs/MVP-SPECIFICATION.md` and `docs/ROADMAP.md`.

## License

MIT
