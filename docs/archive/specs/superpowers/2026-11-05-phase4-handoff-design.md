# Phase 4 — `ezy next` handoff design (slice 2 / approach A)

**Status:** approved (2026-11-05)  
**Date:** 2026-11-05  
**Branch:** `phase-4` (or current working branch)

## Intent

After planning (and optionally installing), give the end user **one paste-ready next action**: a short checklist + agent prompt they drop into Cursor/Claude. Closes the loop without Make It Ezy driving the agent (not C).

## Why

Ideal user doesn’t know skill names or the ecosystem. `plan` / `install` still leave them asking “now what?” Approach A answers that in one command.

## Goals

- `ezy next "<outcome>"` — reuse `planOutcome`; show recommended (+ optional) skills with **installed / not installed**; print:
  1. Short **checklist** (install missing recommended first, then do the work)
  2. A fenced **paste-ready prompt** for the coding agent (outcome, skills to use, local paths when installed, “follow each skill’s SKILL.md”)
- After successful `ezy install --plan "…"`, also print that same handoff for the outcome (no extra typing)
- Update stale “Next” lines in `formatPlan` / `formatInstallResult` to point at `ezy next` / inspect
- Thin trust labels only: reuse existing risk/reason strings from plan/recommend; mark `installed` vs not

## Non-goals

- Make It Ezy spawning/driving Cursor, Claude Code, or Codex (approach C)
- Deep “verified” bar (license fetch, script static analysis, quality scoring) — separate slice
- Trusted auto-run allowlist
- Bare `ezy "<outcome>"` alias (still deferred)
- Memory of last plan across sessions
- Web UI

## Anti-goals

- Pretending the outcome was executed
- Dumping raw SKILL.md bodies into the prompt
- Auto-install from `ezy next` (suggest `ezy install …` only)

## Constraints

- Logic in `@make-it-ezy/core`; CLI wires command like plan/install
- No new runtime dependencies; no LLM
- Vitest for handoff composition + format + CLI smoke
- Local-first: skill paths under `.agents/skills/<name>` when installed

## Approaches

| Approach | Tradeoff | Decision |
|---|---|---|
| **A. Paste-ready `ezy next` (+ post-install handoff)** | Almost magic; user still approves/pastes | **Picked** |
| B. Install-only “done” | Leaves user stranded | Rejected for this user |
| C. Drive the agent | Full magic; weak security with untrusted skills | Deferred (soft-C later, trusted-only) |

## Behavior (happy path)

```text
$ ezy next "scrape congested skills and recommend the right verified ones"
# Capabilities + skill list (installed?)
# Checklist:
#   1. ezy install <missing>   (if any)
#   2. Paste the prompt below into your agent
# Prompt:
#   """
#   Outcome: …
#   Use these skills (read each SKILL.md): …
#   Prefer verified/low-risk; do not invent skills.
#   """
```

```text
$ ezy install --plan "…"   # after successful install of one skill
# … install result …
# Handoff for outcome: …   (same block as ezy next)
```

## Builder calls

- Prompt tone: imperative, short, no marketing fluff
- Optional skills mentioned as “only if needed”
- Missing recommended skills → checklist tells user to install before pasting (does not block printing the prompt)

## What’s left to the builder

- Exact type names (`HandoffReport`), format layout, and whether install `--plan` always reprints full handoff or a one-line “Next: ezy next \"…\"" when TTY is noisy — prefer **full handoff once** after install from `--plan`/`--query` only when an outcome/query string exists; plain `ezy install <skill>` keeps inspect next-step only
