# Phase 3 — `ezy plan` design

**Status:** approved (2026-11-05)  
**Date:** 2026-11-05  
**Branch:** `phase-3`

## Intent

Given a freeform **outcome** (“Create a promotional video”), produce a human-readable **minimum useful plan**: capabilities needed, recommended skills, optional skills, and not-needed items — still **discover-only** (no install/run).

## Why

`recommend` shortlists skills for a *topic query*. Users think in *outcomes*. `plan` is the decision-engine slice that maps outcome → composition, and stops before Phase 4 execution (suggest-then-go → trusted auto).

## Goals

- CLI: `ezy plan "<outcome>" [--local-only]`
- Derive a small set of **capability labels** from the outcome (heuristic; no LLM in this slice)
- For each capability (or a merged query), reuse `search` / `recommend` machinery
- Print: Capabilities → Recommended → Optional → Not needed → Next steps
- Keep “never installs” + “heuristic, not a model” notes

## Non-goals

- Installing or executing skills (Phase 4)
- Bare `ezy "<outcome>"` alias (can follow later)
- LLM / embeddings
- Multi-agent orchestration
- Runtime adapters / Web UI

## Anti-goals

- Pretending the plan *ran* the work
- Dumping dozens of skills without a minimum set
- Inventing skill names that aren’t from search/local catalog

## Constraints

- TypeScript / pnpm; logic in `@make-it-ezy/core`, wire in `apps/cli`
- No new runtime dependencies
- Vitest for capability extraction + plan composition + CLI
- `--local-only` matches search/recommend

## Approaches considered

| Approach | Tradeoff | Decision |
|---|---|---|
| **A. `ezy plan "<outcome>"`** | Explicit; keeps recommend for topics | **Picked** |
| B. Bare `ezy "…"` | Matches slogan; ambiguous vs unknown cmds | Deferred |
| C. Fold into `recommend` | Less surface; muddies intents | Rejected |

## Behavior

1. Require non-empty outcome text; else usage error (exit 1).
2. Tokenize / match outcome against a small built-in **capability lexicon** (e.g. video → scripting/media/editing; saas dashboard → frontend/ui/testing; structural → domain + analysis). Prefer 2–5 capabilities.
3. If lexicon misses everything, fall back to one capability derived from the raw outcome tokens (and still search).
4. Run discovery (via existing search/recommend helpers) with `--local-only` respected; cap skills shown (~6–8 total across buckets).
5. Deduplicate skills across capabilities; prefer local + strong matches in Recommended (1–4).
6. Exit 0 even when no skills found (explain); exit 1 only for usage/unknown command.

### Output sketch

```text
Make It Ezy — plan

Outcome: Create a promotional video

Capabilities
- video scripting
- media generation
- editing / review

Recommended
1. … (local/skills.sh) — why
2. …

Optional
- …

Not needed
- multi-agent swarm — …
- vector database — …

Next
- ezy inspect <name>
- Installation / run = Phase 4 (suggest-then-go)

Notes
- Discovery only — nothing was installed or executed.
- Heuristic planning, not a model.
```

## Builder calls (settled)

- Capability lexicon lives in core as a small explicit table (easy to extend); do not scrape the web for taxonomy.
- Reuse `recommendSkills` / `searchSkills` rather than reimplementing ranking.
- Update README, ROADMAP, MVP-SPEC when shipping.
- Do not push `main` until asked.

## Out of scope for builder

- Phase 4 install/adapter
- Bare-outcome CLI alias
