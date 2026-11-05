# Make It Ezy

Local-first **AI capability discovery and orchestration** layer.

> The user describes the outcome. Make It Ezy figures out the minimum useful process.

**Status:** Phase 5 shipped — project-aware `plan` / `next` (plus Phase 4 install + `skills/ezy`). **Next:** Phase 6 Project Brain (optional). Soft-C, deep verify, and Web UI are later — see [`docs/ROADMAP.md`](./docs/ROADMAP.md).

**Product intent:** [`docs/handoff/MAKE-IT-EZY-MASTER-HANDOFF.md`](./docs/handoff/MAKE-IT-EZY-MASTER-HANDOFF.md)  
**Phase status / sequence:** [`docs/ROADMAP.md`](./docs/ROADMAP.md)

## Requirements

- Node.js 20+
- [pnpm](https://pnpm.io/) 9+ (10.x recommended)

## Setup

```bash
pnpm install
pnpm build
pnpm test
```

Set `MAKE_IT_EZY_ROOT` to this repo’s absolute path so agents can find the CLI:

```bash
export MAKE_IT_EZY_ROOT=/absolute/path/to/make-it-ezy
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

## Agent Skill (`/ezy`)

Product skill: [`skills/ezy/SKILL.md`](./skills/ezy/SKILL.md). It tells the agent to run the CLI, gated-install, then **keep building**.

Install into another project (Claude Code / Cursor / Codex skills):

```bash
mkdir -p /path/to/your-app/.agents/skills
cp -R /path/to/make-it-ezy/skills/ezy /path/to/your-app/.agents/skills/ezy
# or: ln -s /path/to/make-it-ezy/skills/ezy /path/to/your-app/.agents/skills/ezy
```

Then:

- **Claude Code:** `/ezy build me a profile page`
- **Cursor:** ask to use the `ezy` skill for an outcome
- **Codex:** enable/select skill `ezy` via `/skills`, then describe the outcome

## Deliberately not built yet

- Project Brain (Phase 6)
- Outcome verification (Phase 7)
- Deep skill verification / trusted-auto allowlists
- Soft-C (CLI spawning Codex/Claude)
- Codex marketplace plugin package
- Web UI (Phase 8)

See `docs/MVP-SPECIFICATION.md` and `docs/ROADMAP.md`.

## License

MIT
