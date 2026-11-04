# Phase 2 — `ezy recommend` design

**Status:** approved (2026-11-05)  
**Date:** 2026-11-05  
**Branch target:** `phase-2` (closes Phase 2 discovery slice)  
**Product north star:** suggest-then-go now; trusted auto-run later (Phase 3–4). This slice is discover-only shortlist.

## Intent

Finish Phase 2 with a discover-only **recommend** command: given a capability query, return a short human-readable shortlist (`Recommended` / `Optional` / `Not needed`) so users know what to inspect next — without installing anything or invoking a model.

## Why

`search` dumps ranked hits; `inspect` deep-dives one skill. Users still have to invent the “minimum useful set.” Recommend bridges that gap with heuristics, and leaves freeform outcome → composition for Phase 3.

## Goals

- CLI: `ezy recommend <query> [--local-only]`
- Reuse existing `searchSkills` (+ shallow risk signals where cheap)
- Bucket top candidates into Recommended / Optional / Not needed
- Explain each pick in one short line (match + local/remote + risk hint)
- Keep “never installs” and “popularity ≠ safety” notes

## Non-goals

- Freeform goals (`ezy "Build me a SaaS dashboard"`) — Phase 3
- Install / approval UX — Phase 4
- LLM ranking or embeddings
- Pairwise `ezy compare` (can wait)
- Mutating `ezy search` with a `--recommend` flag

## Anti-goals

- Recommending install commands as the primary CTA
- Claiming security audit completeness
- Dumping >~8 skills without bucketing

## Constraints

- TypeScript / pnpm monorepo; logic in `@make-it-ezy/core`, CLI in `apps/cli`
- No new runtime dependencies
- Vitest coverage for bucketing + CLI wiring
- `--local-only` behavior matches search

## Approaches considered

| Approach | Tradeoff | Decision |
|---|---|---|
| **A. `ezy recommend <query>`** | One command; clear UX | **Picked** |
| B. `ezy compare a b` | Good for pairwise; weak for “what should I use?” | Deferred |
| C. `ezy search --recommend` | Less surface; muddies discovery vs opinion | Rejected |

## Behavior

1. Require a non-empty query (same style as search).
2. Call `searchSkills(query, { localOnly, limit: ~12 })`.
3. Take top hits (cap **6** for recommendation body).
4. Bucket heuristically (builder may tune weights; intent fixed):
   - **Recommended** — strong score and/or already local; prefer 1–3
   - **Optional** — overlapping / weaker alternatives
   - **Not needed** — low score leftovers **or** fixed category notes when query looks UI/frontend-ish (e.g. orchestration-heavy catalogs) — keep this conservative; prefer empty Not needed over inventing categories
5. Format stdout; suggest `ezy inspect <name>` as next step.
6. Exit `0` even with zero hits (report “no recommendations”); exit `1` only for usage errors.

### Output sketch

```text
Make It Ezy — recommend

Query: frontend design

Recommended
1. frontend-design (local) — strong match; already installed
2. taste (skills.sh) — design-focused; high installs

Optional
- impeccable — overlaps; useful for critique vocabulary

Not needed
- (none from this candidate set)

Next: ezy inspect <name>
Notes:
- Discovery only — nothing was installed.
- Popularity is not safety. Heuristic ranking, not a model.
```

## Builder calls (settled)

- Prefer inspecting **local** skills for risk hints; remote-only hits use search score + installs only (no network fetch of skill bodies in this slice).
- Hard-code at most a tiny “not needed” hint list tied to query tokens; do not invent project-specific architecture advice.
- Update `README.md`, `docs/ROADMAP.md`, `docs/MVP-SPECIFICATION.md` when shipping.

## Out of scope for builder

- Phase 3 decision engine
- Publishing / semver tags
