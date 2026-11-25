# Contributing

## AI assistants (Codex, Cursor, Claude Code)

Read root [`AGENTS.md`](./AGENTS.md) first (Claude Code: [`CLAUDE.md`](./CLAUDE.md) imports the same guide). Product intent: [`docs/handoff/MAKE-IT-EZY-HANDOFF.md`](./docs/handoff/MAKE-IT-EZY-HANDOFF.md). Phase status: [`docs/ROADMAP.md`](./docs/ROADMAP.md).

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

When a phase moves from **in progress** to **shipped**, update **code + tests + adapter + docs in the same PR** (do not mark the phase done in only one file). Use this checklist; [`docs/ROADMAP.md`](./docs/ROADMAP.md) owns phase status.

| Must update | What to change |
|---|---|
| [`docs/ROADMAP.md`](./docs/ROADMAP.md) | Phase section → **done**; “current work” → next phase |
| [`docs/MVP-SPECIFICATION.md`](./docs/MVP-SPECIFICATION.md) | New CLI behavior section; remove from “Later” if listed |
| [`docs/HOW-IT-WORKS.md`](./docs/HOW-IT-WORKS.md) | Workflow step if user-facing; **Shipped → next** paragraph |
| [`docs/architecture/ARCHITECTURE.md`](./docs/architecture/ARCHITECTURE.md) | “Current implementation” + shipped table + command/module list |
| [`ARCHITECTURE-EXPLAINED.md`](./docs/architecture/ARCHITECTURE-EXPLAINED.md) | Same alignment (if maintained) |
| [`README.md`](./README.md) | Status / badge / quick-start if commands changed |
| [`AGENTS.md`](./AGENTS.md) | **Current path** + `skills/ezy` dogfood notes if CLI changed |
| [`skills/ezy/SKILL.md`](./skills/ezy/SKILL.md) | Host procedure for new commands (adapter #1) |
| [`docs/handoff/README.md`](./docs/handoff/README.md) | Phase map + MVP pointer (“through phase N”) |
| Current audit evidence is archived; do not treat it as a work order. |
| The former follow-up plan is archived; approved work must enter the roadmap or an accepted decision. |
| [`docs/research/SKILL-SCAN-CORPUS-PLAN.md`](./docs/research/SKILL-SCAN-CORPUS-PLAN.md) | Only if corpus location or policy changes |
| [`docs/skill-scan/README.md`](./docs/skill-scan/README.md) | Corpus size, layout and untrusted-content rule |
| [`docs/handoff/MAKE-IT-EZY-HANDOFF.md`](./docs/handoff/MAKE-IT-EZY-HANDOFF.md) | **Shipped → next → future** table only (not full handoff rewrite) |
| Completed plans are historical. Do not use unchecked historical tasks as current work orders. |
| [`docs/superpowers/specs/…`](./docs/superpowers/specs/) | Set spec **Status** to shipped when behavior matches |
| Audits are diagnostic only; do not update archived audit documents during normal phase shipping. |

Optional: golden cases, [`CAPABILITY-MODEL.md`](./docs/architecture/CAPABILITY-MODEL.md), audit doc only when the phase touches that topic. **Do not** rewrite historical handoff snapshots or `docs/convo/` unless explicitly asked.

Run `pnpm check:ci` before push (see [`.agents/skills/ci-before-push/SKILL.md`](./.agents/skills/ci-before-push/SKILL.md)).

## Principles

1. Simplify before adding complexity.
2. Evidence over speculation in detectors.
3. External skills/tools are untrusted until inspected.
4. Do not invent repository URLs in research docs — mark `UNRESOLVED`.

## Tests

Add or update Vitest coverage when changing detection, install, handoff, or CLI behavior.
