# Phase 4 — Make It Ezy Agent Skill (adapter #1 / approach A)

**Status:** approved (2026-11-05)  
**Date:** 2026-11-05  
**Branch:** `main` (or short-lived `phase-4-skill`)

## Intent

Ship an **Agent Skill** named `ezy` so Claude Code / Cursor / Codex can invoke Make It Ezy **inside the agent session**: run the CLI → gated install → **keep building from the handoff** (no “CLI printed a prompt and stopped”).

Toward the UX: `/ezy build me this` (Claude) or “use the ezy skill…” (Codex `/skills`).

## Why

Manual paste failed in testing: agents treat `node … ezy next` as the whole task. A skill makes “continue after handoff” the default procedure.

## Goals

- Add product skill at `skills/ezy/SKILL.md` (tracked in-repo; installable into any project’s `.agents/skills/ezy`)
- Frontmatter: `name: ezy`, description that triggers on outcomes like “build me…”, “use make it ezy”, `/ezy`
- Skill body instructs the agent to:
  1. Resolve CLI: prefer `ezy` on PATH; else `node <MAKE_IT_EZY_ROOT>/apps/cli/dist/index.js` (document env/default path)
  2. `ezy next "<outcome>"` from **current project cwd**
  3. If checklist needs installs: run `ezy install …` with explicit user approval (do not invent `--yes` unless user already approved)
  4. Re-run `ezy next` if needed, then **execute the Prompt** — read listed `SKILL.md`s, build the outcome in this repo
  5. **Anti-stop:** never end the turn after only printing CLI output
- README + `docs/MVP-SPECIFICATION.md` / ROADMAP: how to install this skill into a target repo (copy or `ezy install` once we publish source; for now: copy path / symlink / manual)
- One short smoke doc: “Claude: /ezy … · Codex: enable skill ezy · Cursor: skill in `.agents/skills`”

## Non-goals

- Full OpenAI Codex **plugin marketplace** package (`.codex-plugin`) — later
- Soft-C: Make It Ezy process spawning `codex`/`claude` (approach C)
- Deep verify / trusted-auto
- Changing core plan/recommend ranking quality in this slice
- Publishing to npm as a global `ezy` binary (nice later; skill may document `pnpm link` / PATH)

## Anti-goals

- Skill that only explains Make It Ezy without requiring continue-to-build
- Auto-install without mentioning approval
- Pretending skills were verified

## Constraints

- Skill is markdown + frontmatter only (Agent Skills format); no new runtime deps
- Reuse existing CLI; do not duplicate plan/install logic in the skill
- Local-first; skill must work when `MAKE_IT_EZY_ROOT` points at a built checkout
- Keep Layer A vs B clear: this skill is **product** (Layer B adapter), not a Superpowers dependency

## Approaches

| Approach | Tradeoff | Decision |
|---|---|---|
| **A. In-repo `skills/ezy/SKILL.md` agent procedure** | Fast; works across Claude/Cursor; Codex via skills | **Picked** |
| B. Deep verify first | Trust; doesn’t fix agent stop | Deferred |
| C. Codex marketplace plugin + soft-C spawn | Closest to product; heavier | Deferred |

## Behavior (happy path)

```text
User (Claude): /ezy build me a profile page
→ Agent loads skills/ezy
→ Runs: node $MAKE_IT_EZY_ROOT/apps/cli/dist/index.js next "build me a profile page"
→ Shows shortlist; asks to install recommended if missing
→ After install (approved): follows Prompt, reads SKILL.md paths, implements in cwd
```

## Builder calls

- Document `MAKE_IT_EZY_ROOT` default example: `/Users/…/make-it-ezy` only as example; prefer env var
- If CLI missing/unbuilt: instruct `pnpm build` in make-it-ezy repo, then retry — do not silently skip
- Empty project: proceed (cwd install of skills is OK); optional one-line note to add `package.json` if analyze would say no project

## What’s left to the builder

- Exact SKILL.md wording and install instructions in README
- Whether to also add a thin `skills-lock` / catalog entry — skip unless needed for `ezy install ezy` from this repo as source
