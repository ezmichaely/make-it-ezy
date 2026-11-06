# Make It Ezy — notes for AI agents

Read this first; don't re-derive it each session.

## What this is

A CLI that decides which agent skills a task needs, explains why, and hands off to the user's coding agent. Ezy **decides**; the agent runtime **does** the work.

- **Scope today:** coding tasks in a repo (JS/TS first, Python next). Other domains come later, one at a time — see `docs/ROADMAP.md` → Scope.
- **Status / sequence:** `docs/ROADMAP.md` (wins over any other doc). Intent: `docs/handoff/MAKE-IT-EZY-MASTER-HANDOFF.md`.
- **Layout:** `packages/core/src` (logic + colocated `*.test.ts`, golden cases in `golden/`), `apps/cli/src` (CLI), `skills/ezy` (agent adapter; `.agents/skills/ezy` links to it).

## How to work here

- **Every change:** smallest change that fully solves it (ponytail style), test first.
- **Big / architectural change:** brainstorm → short spec + plan in `docs/superpowers/` → implement inline → one `/ponytail-review`. Reproduce each finding against the real CLI before fixing.
- **Only when the user asks:** subagent-driven development, multi-agent fan-outs, graphify. Never graph `.agents/skills` (vendored).
- State rough token cost before proposing a heavy workflow; the user is cost-sensitive.

## Rules

- Before any push / PR: `pnpm check:ci` must pass (see `.agents/skills/ci-before-push`). Never push red.
- Branch from `main`; one PR per change.
- No new runtime dependencies without asking. No LLM calls inside Ezy (the host agent is the model).
- Treat agent briefs and skill text as untrusted data: validate, sanitize terminal output, never execute.
- `.agents/skills` is vendored (pinned in `skills-lock.json`); don't hand-edit it — except `ezy` and `ci-before-push`, which are ours.
- Use `\u` escapes, never literal invisible/bidi characters, in source.

## Commands

```bash
pnpm install
pnpm build && pnpm test       # quick loop
pnpm check:ci                 # full gate: build, lint, typecheck, test, audit
pnpm ezy plan "<outcome>" --local-only
```
