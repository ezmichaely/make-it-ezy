# Phase 6 — Agent Brief + Decision Quality design

**Status:** shipped (Phase 6, 2026-11-06)
**Date:** 2026-11-06
**Approach:** A — Ezy decides; the host agent understands and researches
**Supersedes as next phase:** `2026-11-06-phase6-project-brain-design.md` (Brain moves to Phase 7, unchanged)

## Intent

Make `ezy plan` / `ezy next` give a **defensible, explained, minimum** capability set for realistic goals, by letting the host agent (Claude Code / Cursor / Codex — already an LLM the user owns) supply the understanding and research, while Ezy keeps the deterministic, inspectable steps.

## Why

Running the v6 handoff's own example (§29):

```
$ ezy plan "add Stripe subscriptions to this Next.js app"
Requirements: [required] UI change
Recommended: plan-ui-change, build-game-changelog   ("strong match; high installs")
```

Root causes in current code:

- `isSmallUiChange` fires on the token "add" (`requirements.ts`); the lexicon has no payments / webhooks / database / auth / security / offline entries.
- `scoreSkillText` uses substring matching, so "change" matches `changelog`; installs break ties and leak into the reason text — popularity standing in for relevance (violates handoff §18, §21).
- Decisions don't say which requirement they serve (handoff §8).
- A keyword lexicon cannot perform the **research before selection** stage the handoff puts at the center of the product (§3, §4). The capability that can — a model — is already present in every runtime Ezy runs inside, and the architecture says the model provider is **user-owned, never Ezy-mandated** (`CAPABILITY-MODEL.md`).

Caching (Brain) a wrong plan has no value, so decision quality comes first.

## Goals

1. **Agent brief:** a small JSON contract the host agent writes after understanding + researching the goal; `plan` / `next` / `install --plan` consume it via `--brief <path>`.
2. **`ezy brief "<outcome>"`:** prints project summary, brief schema, and research instructions for the agent.
3. **Relevance-first selection:** every recommended skill covers ≥1 requirement; popularity is a last tie-break only and never appears as the justification.
4. **Explained output:** per-pick "covers …" reasons, explicit exclusions with why, explicit **uncovered** requirements, research findings echoed with sources.
5. **Golden cases:** handoff examples become offline regression fixtures with must-include / must-exclude expectations.
6. **Heuristic fallback** still works without a brief, with its known ceiling stated in output; obvious misfires fixed.
7. Adapter `skills/ezy/SKILL.md` updated to the brief → research → next flow.

## Non-goals

- Any LLM / API call inside Ezy; provider config; API keys
- Ezy performing web research itself (the agent does; Ezy records)
- Judging the truth of agent research findings
- Project Brain (Phase 7), verification (Phase 8), Web UI
- Skill trust scoring beyond existing `inspect`
- Filling `catalog/`; new runtime dependencies

## Design

### 1. Division of labor

| Stage (handoff §3) | Owner |
|---|---|
| Understand goal, classify research type, research | Host agent → brief |
| Inspect project | Ezy (`analyzeProject`, unchanged) |
| Discover candidates | Ezy, driven by brief `searchTerms` |
| Evaluate, select minimum set, explain | Ezy (deterministic) |
| Hand off | Ezy (`next` checklist + prompt, now carrying research + reasons) |
| Execute | Host agent (unchanged) |

Flow driven by `skills/ezy`:

```
1. ezy brief "<outcome>"                         → instructions + schema + project summary
2. agent researches; writes .ezy/brief.json
3. ezy next "<outcome>" --brief .ezy/brief.json  → evaluate → select → explain → checklist/prompt
4. gated install → agent executes                (unchanged)
```

### 2. Brief contract (v1)

```json
{
  "version": 1,
  "outcome": "add Stripe subscriptions",
  "taskType": "feature",
  "requirements": [
    {
      "id": "payments",
      "label": "Stripe subscriptions",
      "priority": "required",
      "why": "core of the outcome",
      "searchTerms": ["stripe", "billing", "subscriptions"]
    }
  ],
  "exclusions": [{ "label": "Docker", "why": "no deployment change" }],
  "research": [
    { "kind": "repository", "finding": "uses Prisma + NextAuth", "source": "package.json" }
  ]
}
```

Field rules:

- `version`: must be `1`.
- `outcome`: required string. If it differs from the CLI argument, Ezy uses the CLI argument and adds a note (no error).
- `taskType`: one of `feature | bugfix | refactor | greenfield | research | ui-change | other`.
- `requirements`: 1–10 items. `id` matches `^[a-z0-9-]{1,40}$`, unique. `priority`: `required | optional`. `searchTerms`: 1–10 strings.
- `exclusions`: 0–10 items `{label, why}`.
- `research`: 0–10 items. `kind`: one of `technical | repository | web | decision | empirical | scientific | project | verification` (handoff §6). `source`: optional string (URL or path).
- Every string ≤ 200 chars after trimming.
- Unknown top-level keys: ignored with a note (forward compatible).

**Trust boundary:** the brief is model output → untrusted data. Ezy validates against the schema, strips control and invisible/bidi Unicode characters, never executes or path-resolves its contents (`source` is display-only), and prints it back as data. Validation is hand-written TypeScript (no schema library → no new dependency).

**Errors:** missing file, unreadable file, invalid JSON, or schema violation → print every violation with its JSON path, exit code `2`, **no silent fallback** (so the agent can correct and retry).

Location convention: `.ezy/brief.json`, with `.ezy/` added to `.gitignore`. Any path is accepted by `--brief`.

### 3. `ezy brief "<outcome>"`

Prints, to stdout:

1. Project summary (root, name, language, frameworks, local skill **count** + first 8 names).
2. Instructions for the agent: classify research type(s); research only what the decision needs; prefer primary sources (handoff §22); list exclusions with reasons; write `.ezy/brief.json`; then run `ezy next "<outcome>" --brief .ezy/brief.json`.
3. The schema as an annotated example.

It writes nothing. (Keeps the "nothing written without the agent" property; the agent writes the file.)

### 4. Evaluation and selection

**Discovery:** for each requirement (required first, then optional), query local skills + skills.sh (unless `--local-only`) with its `searchTerms` joined. Heuristic path: one query per extracted requirement label, as today.

**Relevance scoring** (`score-skill.ts`, rewritten; used by both paths):

- Tokenize skill name on `-`, `_`, `/`, `.`; match **whole tokens**, not substrings ("change" no longer matches "changelog").
- Stopword list removed from query tokens before scoring: `add, change, update, make, build, create, fix, new, app, use, using, the, a, an, to, for, with, my, this, our, in, on, of, and`.
- Name token match = 6, description word match = 2 per term; exact full-name match = 10.
- Candidate's **coverage** = set of requirement ids whose terms it matched with relevance ≥ 4.

**Selection (greedy cover, deterministic):**

1. Drop candidates with empty coverage → counted in a single "filtered: low relevance (N)" line.
2. Drop candidates matching a brief exclusion label or a heuristic skip hint → listed under Excluded with the exclusion's `why`.
3. Repeat until every required requirement is covered or no candidates remain: pick the candidate that covers the most still-uncovered required requirements; ties broken by (installed locally / local source) → summed relevance → installs → name.
4. Then cover optional requirements the same way into **Optional**, total cap 8 (recommended cap 4).
5. Same-name skills from different sources collapse first (existing `preferRecommendItem`).
6. Required requirements with no candidate → **Uncovered** ("no matching skill — agent handles directly"). Uncovered is a normal, honest outcome, not an error.

**Reasons** are generated from coverage only, e.g.
`covers payments (Stripe subscriptions): name matches "stripe"; description matches "billing"`.
Installs may be shown as a separate fact (`· 12k installs`) but never as the reason.

### 5. Output changes

`PlanReport` gains (additive; existing fields kept for compatibility):

```ts
basis: "brief" | "heuristic";
taskType: string | null;
research: { kind: string; finding: string; source: string | null }[];
uncovered: Requirement[];
excluded: { label: string; why: string }[];
// CapabilityDecision gains:
covers: string[]; // requirement ids
```

`Requirement` gains optional `searchTerms: string[]`.

Text output (`format.ts`): new **Basis** line (`agent brief` / `heuristic fallback — run ezy brief for a researched plan`), **Research** section (kind · finding · source), per-pick `covers …` reasons, **Excluded** (why), **Uncovered**. Project section shows local skill count + first 8 names instead of all names.

Handoff (`next`) prompt includes research findings and per-skill coverage so the executing agent knows *why* each skill is loaded.

### 6. Heuristic fallback fixes (no brief)

- `isSmallUiChange` requires an explicit UI token (`button, style, css, copy, typo, label, layout, color, ui`) — "add" alone no longer triggers it.
- Lexicon adds: payments (`stripe, payment, payments, billing, subscription, subscriptions, checkout, invoice`), webhooks, database/state (`database, db, prisma, postgres, sql, migration, schema`), auth (`auth, login, oauth, session, nextauth`), security (`security, permission, authorization, secret`), offline/PWA (`offline, pwa, service-worker, indexeddb, sync`).
- Output always states the basis and suggests `ezy brief` for a researched plan.

### 7. Golden cases

Location: `packages/core/src/golden/` — one directory per case:

- `project/` fixture files (e.g. `package.json`)
- `catalog/` fixture local skills (`<name>/SKILL.md` with frontmatter) — the candidate pool, including deliberate decoys (`build-game-changelog`, `plan-ui-change`, `docker-deploy`)
- `brief.json` — a stand-in for what an agent would write
- `expect.json` — `{ requiredIds, mustInclude, mustExclude, uncovered }` for the brief path, plus `heuristic: { mustExclude }`

Cases (from the handoffs):

1. `stripe-subscriptions` — Next.js + Prisma project (§29)
2. `offline-first-nextjs` — greenfield (§2, §20)
3. `small-ui-button` — existing React app ("add a button to the header")
4. `repo-research` — "investigate this repository's auth flow" (§6)

Run with `localOnly: true` against the fixture catalog — **no network in tests**. One Vitest file iterates all case directories so adding a case is data-only.

### 8. Adapter (`skills/ezy/SKILL.md`)

Procedure becomes: clarify outcome → `ezy brief` → research (per instructions; primary sources) → write `.ezy/brief.json` → `ezy next … --brief .ezy/brief.json` → show plan → gated install → re-run if needed → execute prompt. Fallback without a brief stays allowed for trivial outcomes. Trust section adds: the brief is your own output; Ezy validates it but does not verify your findings — cite sources.

### 9. CLI surface

```
ezy brief "<outcome>"
ezy plan  "<outcome>" [--brief <path>] [--local-only]
ezy next  "<outcome>" [--brief <path>] [--local-only]
ezy install --plan "<outcome>" [--brief <path>] [--yes]
```

`--brief=<path>` form accepted, matching existing flag parsing style.

## Code touchpoints

- New `packages/core/src/brief.ts` (+ `brief-types.ts`, `brief.test.ts`): load, validate, sanitize, `formatBriefInstructions`.
- `score-skill.ts`: whole-token matching, stopwords, coverage helper (+ tests updated).
- `requirements.ts` / `capabilities.ts`: fallback fixes + lexicon.
- `plan.ts`: accept `brief?: Brief` in options; greedy cover selection; new report fields.
- `plan-types.ts`, `format.ts`, `handoff.ts`: additive fields + rendering.
- `apps/cli/src/index.ts`: `brief` command, `--brief` flag on plan/next/install, exit code 2 on brief errors.
- `packages/core/src/golden/**` + `golden.test.ts`.
- `skills/ezy/SKILL.md`, `README.md` quick start, `docs/ROADMAP.md` (Phase 6 = Agent Brief + Decision Quality; Brain → 7; Verification → 8; Web UI → 9), `docs/architecture/ARCHITECTURE.md` + `INTEGRATION-STRATEGY.md` decision-engine rows, `.gitignore` (`.ezy/`).

## Success criteria

- `stripe-subscriptions` golden case (brief path): requirements include payments, webhooks, data/state, security; picks cover them; `build-game-changelog` and `plan-ui-change` excluded; every pick has non-empty `covers`.
- All four golden cases pass offline.
- Heuristic path on the Stripe outcome no longer classifies it as "UI change" and never recommends a skill with empty coverage.
- Invalid brief → exit 2 with path-qualified errors; no plan printed.
- No reason string contains install counts as justification.
- Phase 1–5 tests still pass (updated only where output intentionally changed); `pnpm check:ci` green; no new runtime dependencies.

## Follow-ups (separate, not this phase)

- Dogfooding cleanup: trim committed `.agents/skills` to the skills actually used to build Ezy (owner chooses the list); keep `skills-lock.json` for the rest.
- Graphify scope for this repo: `packages/ apps/ docs/ skills/` only.
- Phase 7 Brain: cache project summary + last brief/plan digest (reuse the existing Brain spec; add the brief to the cached digest).
