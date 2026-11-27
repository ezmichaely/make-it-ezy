# Contributing

## AI assistants (Codex, Cursor, Claude Code)

Read root [`AGENTS.md`](./AGENTS.md) first, then [`docs/AGENT-WORKFLOW.md`](./docs/AGENT-WORKFLOW.md). Use `docs/ROADMAP.md` for phase status and `docs/MVP-SPECIFICATION.md` for shipped behavior.

## Develop

```bash
pnpm install
pnpm skills:install   # link .agents/skills to global builder home (see BUILDER-SKILLS.md)
pnpm check            # lint + typecheck + test + build (same gates as CI)
pnpm test:watch
pnpm dev:ezy analyze
```

Vendored builder skills: see [`docs/BUILDER-SKILLS.md`](./docs/BUILDER-SKILLS.md). Source of truth is [`skills-lock.json`](./skills-lock.json); repo-owned skills live under [`skills/`](./skills/).

## Pull requests

1. Branch from `main`, open a PR (do not push straight to `main` for feature work).
2. Wait for **CI** + **CodeQL** (free on this public repo — see `docs/CI.md`).
3. Merge when green; delete the branch after merge (enable auto-delete in repo Settings if available).

## Scope

Prefer thin, tested slices with a short design under `docs/superpowers/specs/` when behavior changes.

## Shipping a roadmap phase (doc sync)

When a phase moves from **in progress** to **shipped**, update code + tests and then synchronize the authoritative documentation that actually changed.

- `docs/ROADMAP.md` — phase/status owner.
- `docs/STATUS.md` — current-state dashboard when current state changes.
- `docs/MVP-SPECIFICATION.md` — shipped behavior.
- `docs/HOW-IT-WORKS.md` — current user/host workflow when it changes.
- `docs/architecture/ARCHITECTURE.md` — technical architecture when it changes.
- `README.md` — user-facing summary when behavior or setup changes.
- `AGENTS.md` — only when repository operating rules or current navigation changes.
- `skills/ezy/SKILL.md` — when the end-user adapter changes.
- `docs/decisions/` — when a durable product/architecture decision changes.

Do not update archived audits, historical conversations, or completed plans as part of normal phase shipping. Do not create competing documentation merely to mirror a change; update the document that owns the claim and only the dependent docs that need synchronization.

Run `pnpm check:ci` before push (see [`.agents/skills/ci-before-push/SKILL.md`](./.agents/skills/ci-before-push/SKILL.md)).
## Principles

1. Simplify before adding complexity.
2. Evidence over speculation in detectors.
3. External skills/tools are untrusted until inspected.
4. Do not invent repository URLs in research docs — mark `UNRESOLVED`.

## Tests

Add or update Vitest coverage when changing detection, install, handoff, or CLI behavior.
