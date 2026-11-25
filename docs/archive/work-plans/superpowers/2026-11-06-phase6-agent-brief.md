# Phase 6 — Agent Brief + Decision Quality Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `ezy plan` / `ezy next` accept an agent-written brief and return a relevance-first, requirement-covering, explained minimum skill set; the no-brief fallback stops misfiring.

**Architecture:** New pure modules — `brief.ts` (validate/sanitize/load the agent brief), `select.ts` (coverage scoring + greedy cover) — sit between the existing `analyzeProject` / `searchSkills` and `planOutcome`. `planOutcome` builds requirements from the brief (or the fixed heuristic), discovers per requirement, selects, and reports `basis`, `covers`, `excluded`, `uncovered`, `research`. CLI adds `ezy brief` and `--brief`.

**Tech Stack:** TypeScript (ESM, `.js` import suffixes), Node built-ins only, Vitest, pnpm workspace (`packages/core`, `apps/cli`).

**Spec:** `docs/superpowers/specs/2026-11-06-phase6-agent-brief-design.md`

## Global Constraints

- No LLM / API calls inside Ezy; no new runtime dependencies (hand-written validation).
- Brief limits: `version` = `1`; `requirements` 1–10; `searchTerms` 1–10 per requirement; `exclusions` 0–10; `research` 0–10; every string ≤ 200 chars after trim; requirement `id` matches `^[a-z0-9-]{1,40}$` and is unique.
- `taskType` ∈ `feature | bugfix | refactor | greenfield | research | ui-change | other`.
- `research.kind` ∈ `technical | repository | web | decision | empirical | scientific | project | verification`.
- Brief errors → every violation printed with its JSON path, exit code `2`, no plan, no fallback.
- Stopwords: `add, change, update, make, build, create, fix, new, app, use, using, the, a, an, to, for, with, my, this, our, in, on, of, and`.
- Scoring weights: exact full-name = 10; name token = 6; description word = 2; requirement covered when relevance ≥ 4.
- Caps: recommended 4, total (recommended + optional) 8.
- Installs never appear in a reason string as justification.
- Tests never hit the network (`localOnly: true` or a stub `fetchImpl`).
- `pnpm check:ci` green before any push.

## Review Focus

- Brief file saved with a UTF-8 BOM or CRLF line endings (Windows editors) → parses normally (Task 2).
- `--brief` given a relative path → resolved against the process cwd, not the project root (Task 7).
- A requirement whose `searchTerms` are all stopwords (e.g. `["add","new"]`) → validation passes, requirement lands in **Uncovered**, no crash (Task 3).
- skills.sh unreachable while using a brief → plan still produced from local skills with the "unavailable" note (Task 5).
- Requirement ids that collide only by case (`Payments` vs `payments`) → rejected by the id regex, reported with path (Task 2).

---

### Task 1: Whole-token relevance scoring

**Files:**
- Modify: `packages/core/src/score-skill.ts`
- Test: `packages/core/src/score-skill.test.ts`

**Interfaces:**
- Produces:
  - `STOPWORDS: ReadonlySet<string>`
  - `significantTokens(text: string): string[]` — `tokenizeQuery(text)` minus `STOPWORDS`, deduped, order kept
  - `nameTokens(name: string): string[]` — lowercased, split on `-`, `_`, `/`, `.`, whitespace
  - `scoreSkillText(queryTokens: string[], name: string, description: string): number` — same signature; drops stopwords from `queryTokens`; whole-token matching with the Global weights
  - `requirementRelevance(terms: string[], name: string, description: string): { score: number; nameHits: string[]; descHits: string[] }` — terms tokenized via `significantTokens(terms.join(" "))`; per token: exact full-name → +10 (nameHit), else name token → +6 (nameHit), else description word → +2 (descHit)
- `tokenizeQuery` unchanged (lexicon still needs raw tokens).

- [ ] **Step 1: Write failing tests**

```ts
it("does not match substrings inside name tokens", () => {
  expect(scoreSkillText(["change"], "build-game-changelog", "")).toBe(0);
});
it("ignores stopwords in the query", () => {
  expect(scoreSkillText(["add", "new"], "add-feature", "add new things")).toBe(0);
});
it("scores whole name tokens and description words", () => {
  expect(scoreSkillText(["stripe"], "stripe-billing", "")).toBe(6);
  expect(scoreSkillText(["stripe"], "stripe", "")).toBe(10);
  expect(scoreSkillText(["billing"], "payments", "Stripe billing helpers")).toBe(2);
});
it("requirementRelevance reports hits", () => {
  const r = requirementRelevance(["stripe", "billing"], "stripe-integration", "Billing and subscriptions");
  expect(r).toEqual({ score: 8, nameHits: ["stripe"], descHits: ["billing"] });
});
```
Keep the two existing tests; adjust only if they relied on substring matching.

- [ ] **Step 2: Run** `pnpm vitest run packages/core/src/score-skill.test.ts` — Expected: new tests FAIL.
- [ ] **Step 3: Implement** the Interfaces above in `score-skill.ts`; export the new names from `packages/core/src/index.ts`.
- [ ] **Step 4: Run** `pnpm vitest run` — Expected: score tests PASS. Fix any other test whose expectation depended on substring matches (note which in the commit body).
- [ ] **Step 5: Commit** `feat(score): whole-token relevance with stopwords`

---

### Task 2: Brief types, validation, sanitizing, loading

**Files:**
- Create: `packages/core/src/brief-types.ts`, `packages/core/src/brief.ts`
- Test: `packages/core/src/brief.test.ts`

**Interfaces:**
- Produces (`brief-types.ts`):
```ts
export type BriefTaskType = "feature" | "bugfix" | "refactor" | "greenfield" | "research" | "ui-change" | "other";
export type ResearchKind = "technical" | "repository" | "web" | "decision" | "empirical" | "scientific" | "project" | "verification";
export type BriefRequirement = { id: string; label: string; priority: "required" | "optional"; why: string; searchTerms: string[] };
export type Exclusion = { label: string; why: string };
export type ResearchFinding = { kind: ResearchKind; finding: string; source: string | null };
export type Brief = { version: 1; outcome: string; taskType: BriefTaskType; requirements: BriefRequirement[]; exclusions: Exclusion[]; research: ResearchFinding[] };
export type BriefResult = { ok: true; brief: Brief; notes: string[] } | { ok: false; errors: string[] };
```
- Produces (`brief.ts`):
  - `sanitizeText(s: string): string` — replace C0/C1 control chars (including `\n`, `\t`) with a space, strip zero-width (`U+200B–U+200F`, `U+FEFF`) and bidi controls (`U+202A–U+202E`, `U+2066–U+2069`), trim
  - `parseBrief(raw: unknown): BriefResult` — validates per Global Constraints; errors are `"<json.path>: <problem>"` (e.g. `requirements[1].id: must match ^[a-z0-9-]{1,40}$`); `exclusions` / `research` default to `[]` when absent; `source` default `null`; unknown top-level keys → note `ignored unknown field "<key>"`
  - `loadBrief(path: string): BriefResult` — read UTF-8, strip leading BOM, `JSON.parse` (error → `{ok:false, errors:["<path>: invalid JSON: <message>"]}`), missing/unreadable file → `{ok:false, errors:["<path>: cannot read file"]}`, then `parseBrief`

- [ ] **Step 1: Write failing tests** in `brief.test.ts` — a `validBrief()` factory (the spec's Stripe example) plus:
  - `parseBrief(validBrief())` → `ok: true`, research `source` preserved, exclusions present
  - missing `requirements` → error containing `requirements:`
  - 11 requirements → error containing `requirements: at most 10`
  - `id: "Payments"` → error `requirements[0].id: must match ^[a-z0-9-]{1,40}$`
  - duplicate ids → error `requirements[1].id: duplicate "payments"`
  - 201-char label → error `requirements[0].label: at most 200 characters`
  - `taskType: "epic"` → error naming allowed values
  - `version: 2` → error `version: must be 1`
  - unknown key `extra` → `ok: true`, note `ignored unknown field "extra"`
  - finding containing `"‮evil​"` → sanitized to `"evil"`
  - `loadBrief` on a temp file written with BOM + CRLF → `ok: true`
  - `loadBrief` on a nonexistent path → error ending `cannot read file`
  - `loadBrief` on `{bad json` → error containing `invalid JSON`
  - `searchTerms: ["add", "new"]` → `ok: true` (all-stopword terms are allowed; handled in Task 3)
- [ ] **Step 2: Run** `pnpm vitest run packages/core/src/brief.test.ts` — Expected: FAIL (module missing).
- [ ] **Step 3: Implement** both files per Interfaces; collect all errors (do not stop at first). Export types and functions from `index.ts`.
- [ ] **Step 4: Run** the test file — Expected: PASS.
- [ ] **Step 5: Commit** `feat(brief): validate and sanitize agent briefs`

---

### Task 3: Coverage scoring and greedy selection

**Files:**
- Create: `packages/core/src/select.ts`
- Modify: `packages/core/src/plan-types.ts` (add `searchTerms?: string[]` to `Requirement`)
- Test: `packages/core/src/select.test.ts`

**Interfaces:**
- Consumes: `requirementRelevance`, `significantTokens`, `nameTokens` (Task 1); `Exclusion` (Task 2); `Requirement` (plan-types); `SkillHit`.
- Produces:
```ts
export type Candidate = { hit: SkillHit; covers: string[]; relevance: number; evidence: string[] };
export type Selection = { recommended: Candidate[]; optional: Candidate[]; excluded: Exclusion[]; uncovered: Requirement[]; filteredCount: number };
export function scoreCandidates(hits: SkillHit[], requirements: Requirement[]): Candidate[];
export function matchesExclusion(hit: SkillHit, exclusion: Exclusion): boolean;
export function selectCapabilities(candidates: Candidate[], requirements: Requirement[], exclusions: Exclusion[]): Selection;
export function coverageReason(candidate: Candidate, requirements: Requirement[]): string;
```
- `scoreCandidates`: per requirement, `requirementRelevance(req.searchTerms ?? [req.label], hit.name, hit.description)`; requirement id added to `covers` when score ≥ 4; `relevance` = sum over covered requirements; `evidence` per covered requirement e.g. `name matches "stripe"; description matches "billing"`. Same-name hits collapse first via existing `preferRecommendItem` logic (move the comparison into `select.ts` or import it — do not duplicate).
- `matchesExclusion`: true when every `significantTokens(exclusion.label)` token appears in `nameTokens(hit.name)` ∪ `significantTokens(hit.description)`; false when the label has no significant tokens.
- `selectCapabilities` algorithm (spec §4): drop empty-coverage candidates (count into `filteredCount`); move candidates matching any exclusion out (the exclusion goes to `excluded` once, deduped by label; excluded skill names are appended as `{label: name, why: "matches exclusion: <label>"}`); greedy loop over required ids picking max newly-covered count, ties → local/installed first → higher `relevance` → higher `installs` → name asc; stop at 4 recommended; then same for optional requirements into `optional` until total 8; required ids still uncovered → `uncovered`. Every brief exclusion appears in `excluded` even if no candidate matched it.
- `coverageReason`: `covers <id> (<label>): <evidence>` joined with ` | ` for multiple; append ` · <n> installs` only when `installs != null`.

- [ ] **Step 1: Write failing tests** in `select.test.ts` with a local `hit()` factory:
  - decoys `build-game-changelog`, `plan-ui-change` vs requirement `{id:"payments", searchTerms:["stripe","billing"]}` → both filtered (`filteredCount` 2), `uncovered` contains payments
  - `stripe-integration` + `webhook-handler` + `prisma-schema` vs three requirements → all three recommended, each `covers` non-empty
  - one skill covering two requirements beats two skills covering one each (fewer picks)
  - tie on coverage: local hit chosen over remote hit with 50k installs
  - exclusion `{label:"Docker", why:"no deployment change"}` removes `docker-deploy`; `excluded` contains both the Docker exclusion and `docker-deploy`
  - requirement with `searchTerms:["add","new"]` → in `uncovered`, no throw
  - more than 4 required matches → recommended length 4
  - `coverageReason` never contains `installs` text unless `installs` non-null, and never the words "strong match" / "high installs"
- [ ] **Step 2: Run** `pnpm vitest run packages/core/src/select.test.ts` — Expected: FAIL.
- [ ] **Step 3: Implement** `select.ts` per Interfaces.
- [ ] **Step 4: Run** the test file — Expected: PASS.
- [ ] **Step 5: Commit** `feat(select): requirement-coverage selection`

---

### Task 4: Heuristic fallback fixes

**Files:**
- Modify: `packages/core/src/requirements.ts`, `packages/core/src/capabilities.ts`
- Test: `packages/core/src/requirements.test.ts`, `packages/core/src/capabilities.test.ts`

**Interfaces:**
- Produces: `extractRequirements(outcome, analysis): RequirementsResult` (same signature) where every requirement now has `searchTerms` (the label's significant tokens plus the outcome tokens that activated its lexicon entry), and a new field `exclusions: Exclusion[]` derived from skip hints (`label` = text before ` — `, `why` = text after). Keep `skipHints` for compatibility.
- Graphify skip hint label becomes `Graphify` (text: `Graphify — full codebase graph is overkill for a small UI change`).

- [ ] **Step 1: Write failing tests**
  - `extractRequirements("add Stripe subscriptions to this Next.js app", nextAnalysis)` → no requirement labelled `UI change`; labels include `payments`
  - `"add a button to the header"` on a React analysis → still `UI change` (existing test keeps passing)
  - `extractCapabilities` maps: `stripe` → `payments`, `webhook` → `webhooks`, `prisma` → `database / state`, `nextauth` → `authentication`, `security` → `security review`, `offline` → `offline / PWA`
  - every returned requirement has non-empty `searchTerms`
  - Graphify exclusion present for the small-UI case with `label: "Graphify"`
- [ ] **Step 2: Run** `pnpm vitest run packages/core/src/requirements.test.ts packages/core/src/capabilities.test.ts` — Expected: FAIL.
- [ ] **Step 3: Implement** — `isSmallUiChange` requires one of `button, style, css, copy, typo, label, layout, color, ui` and no heavy token; add the six lexicon entries from spec §6 with the capability labels above.
- [ ] **Step 4: Run** — Expected: PASS.
- [ ] **Step 5: Commit** `fix(requirements): stop "add" misfire; extend lexicon`

---

### Task 5: Plan integration

**Files:**
- Modify: `packages/core/src/plan.ts`, `packages/core/src/plan-types.ts`
- Test: `packages/core/src/plan.test.ts`

**Interfaces:**
- Consumes: `Brief` (Task 2); `scoreCandidates`, `selectCapabilities`, `coverageReason` (Task 3); `extractRequirements` (Task 4); `searchSkills`.
- Produces:
  - `export type PlanOptions = SearchOptions & { brief?: Brief };`
  - `planOutcome(outcome: string, options?: PlanOptions): Promise<PlanReport>`
  - `PlanReport` adds `basis: "brief" | "heuristic"`, `taskType: string | null`, `research: ResearchFinding[]`, `uncovered: Requirement[]`, `excluded: Exclusion[]`; `CapabilityDecision` adds `covers: string[]`. `notNeeded` = `excluded.map(e => \`${e.label} — ${e.why}\`)` plus `low relevance: <n> candidates filtered` when `filteredCount > 0`.
- Requirements from a brief: `{ id, label, rationale: why, priority, searchTerms }`.
- Discovery: one `searchSkills(req.searchTerms.join(" "), {...options, limit: options.limit ?? 12})` per requirement (required first, max 10), hits concatenated → `scoreCandidates` → `selectCapabilities`. `recommended` / `optional` remain `RecommendItem[]` with `reason = coverageReason(...)`.
- Notes: replace `"Heuristic planning, not a model."` with `"Basis: agent brief."` or `"Basis: heuristic fallback — run ezy brief for a researched plan."`; add `"Brief outcome differs from CLI outcome; using CLI outcome."` when they differ (case-insensitive trim compare); keep remote-unavailable notes.

- [ ] **Step 1: Write failing tests** in `plan.test.ts` (fixture project with local skills under `.agents/skills`, `localOnly: true`):
  - with a Stripe brief → `basis: "brief"`, every `decisions[i].covers` non-empty, `build-game-changelog` not in recommended/optional
  - without brief → `basis: "heuristic"`, notes include `heuristic fallback`
  - brief outcome `"something else"` → note about differing outcome; `report.outcome` equals CLI argument
  - brief + `localOnly: false` with `fetchImpl` rejecting → report still has local picks and a note containing `unavailable`
  - uncovered requirement shows in `report.uncovered`
  - Update existing tests only where output intentionally changed (reason text, notes).
- [ ] **Step 2: Run** `pnpm vitest run packages/core/src/plan.test.ts` — Expected: new tests FAIL.
- [ ] **Step 3: Implement** per Interfaces; remove the old `shouldSkipSkill` (exclusions now cover it).
- [ ] **Step 4: Run** `pnpm vitest run` — Expected: all PASS (handoff tests may need Task 6; if they fail only on reason text, adjust expectations there in Task 6 and note it).
- [ ] **Step 5: Commit** `feat(plan): brief-driven, coverage-based planning`

---

### Task 6: Explained output and handoff carry-through

**Files:**
- Modify: `packages/core/src/format.ts` (`formatPlan`, `formatHandoff`), `packages/core/src/handoff.ts`, `packages/core/src/handoff-types.ts`
- Test: `packages/core/src/handoff.test.ts`, new `packages/core/src/format-plan.test.ts`

**Interfaces:**
- Consumes: `PlanReport` additions (Task 5).
- Produces: `HandoffSkill.covers: string[]`; `HandoffReport.research: ResearchFinding[]`; `HandoffReport.basis: "brief" | "heuristic"`; `buildHandoff(outcome, options: BuildHandoffOptions & { brief?: Brief })`.

`formatPlan` sections, in order: Outcome, **Basis** (`agent brief` | `heuristic fallback — run ezy brief for a researched plan`), Project (local skills shown as `Local skills: <count> (<first 8 names>…)`), Requirements, **Research** (`- <kind> · <finding> (<source>)`, omitted when empty), Recommended (`<n>. <name> (<where>) — <coverage reason>`), Optional, **Excluded** (`- <label> — <why>`), **Uncovered** (`- <label> — no matching skill; agent handles directly`), Next, Notes. Handoff prompt adds a "Why these skills" list (name → covers) and a "Research" list when present.

- [ ] **Step 1: Write failing tests**
  - `formatPlan` of a brief-based report contains `Basis: agent brief`, `Research`, `Excluded`, `Uncovered`, and `covers payments`
  - `formatPlan` with 54 local skills prints `Local skills: 54` and at most 8 names
  - no line in `formatPlan` output contains `strong match` or `high installs`
  - `buildHandoff` with a brief → `skills[0].covers` non-empty; `prompt` contains `Why these skills` and the research finding text
- [ ] **Step 2: Run** `pnpm vitest run packages/core/src/format-plan.test.ts packages/core/src/handoff.test.ts` — Expected: FAIL.
- [ ] **Step 3: Implement** per Interfaces.
- [ ] **Step 4: Run** `pnpm vitest run` — Expected: PASS.
- [ ] **Step 5: Commit** `feat(output): explain coverage, exclusions, research`

---

### Task 7: CLI — `ezy brief` and `--brief`

**Files:**
- Modify: `apps/cli/src/index.ts`, `packages/core/src/brief.ts` (add instructions formatter)
- Test: `apps/cli/src/cli.test.ts`, `packages/core/src/brief.test.ts`

**Interfaces:**
- Consumes: `loadBrief` (Task 2), `planOutcome` (Task 5), `buildHandoff` (Task 6), `analyzeProject`, `loadLocalSkills`.
- Produces: `formatBriefInstructions(outcome: string, project: PlanProjectSummary): string` in `brief.ts` — prints project summary (count + first 8 skills), numbered agent instructions from spec §3, and the annotated schema example; ends with the exact next command `ezy next "<outcome>" --brief .ezy/brief.json`.
- CLI: `brief "<outcome>"` command (writes nothing); `--brief <path>` and `--brief=<path>` on `plan`, `next`, `install --plan`; path resolved with `resolve(process.cwd(), path)`; on `{ok:false}` print `Invalid brief:` then one `- <error>` line each to stderr and `process.exitCode = 2`; brief notes printed under the plan's Notes. Help text gains the four usage lines from spec §9.

- [ ] **Step 1: Write failing tests**
  - `formatBriefInstructions` output contains `.ezy/brief.json`, `searchTerms`, `primary sources`, and the next command
  - CLI `brief "add stripe"` exits 0 and prints `searchTerms`
  - CLI `plan "x" --brief missing.json` exits 2, stderr contains `cannot read file`, stdout has no `Recommended`
  - CLI `plan "add stripe" --brief ./brief.json` (relative, cwd = temp fixture) exits 0 and prints `Basis: agent brief`
  - CLI `next "add stripe" --brief=./brief.json --local-only` prints `Why these skills`
  - CLI `--help` lists `ezy brief`
- [ ] **Step 2: Run** `pnpm build && pnpm vitest run apps/cli/src/cli.test.ts` — Expected: FAIL.
- [ ] **Step 3: Implement** per Interfaces.
- [ ] **Step 4: Run** `pnpm build && pnpm vitest run` — Expected: PASS.
- [ ] **Step 5: Commit** `feat(cli): ezy brief and --brief`

---

### Task 8: Golden cases

**Files:**
- Create: `packages/core/src/golden/<case>/project/package.json`, `packages/core/src/golden/<case>/project/.agents/skills/<skill>/SKILL.md`, `packages/core/src/golden/<case>/brief.json`, `packages/core/src/golden/<case>/expect.json` for cases `stripe-subscriptions`, `offline-first-nextjs`, `small-ui-button`, `repo-research`
- Test: `packages/core/src/golden.test.ts`

Deviation from spec §7: the candidate catalog lives at `project/.agents/skills/` (where `loadLocalSkills` already reads) instead of a separate `catalog/` directory.

**Interfaces:**
- Consumes: `loadBrief`, `planOutcome` (`localOnly: true`, `cwd` = a temp copy of `project/`).
- `expect.json` shape: `{ "outcome": string, "requiredIds": string[], "mustInclude": string[], "mustExclude": string[], "uncovered": string[], "heuristic": { "mustExclude": string[] } }`.

Each catalog includes the decoys `build-game-changelog` ("Generate changelogs for game builds"), `plan-ui-change` ("Plan small UI changes"), `docker-deploy` ("Containerize and deploy with Docker"), plus case-relevant skills:
- `stripe-subscriptions` (Next.js + Prisma `package.json`): `stripe-integration`, `webhook-handler`, `prisma-schema`, `security-review`, `vitest-testing`. Brief requirements: payments, webhooks, data-state, security, testing (optional). mustInclude the first four; mustExclude decoys; uncovered `[]`; heuristic mustExclude `build-game-changelog`, `plan-ui-change`.
- `offline-first-nextjs` (empty `package.json`): `nextjs-app-router`, `pwa-offline`, `indexeddb-dexie`, `sync-conflicts`. Brief adds exclusion Docker. mustExclude `docker-deploy`, decoys.
- `small-ui-button` (React `package.json`): `react-components`, `frontend-design`, `graphify`. Brief taskType `ui-change`, exclusion Graphify. mustInclude `react-components`; mustExclude `graphify`, `docker-deploy`.
- `repo-research` (TS `package.json`): `codebase-research`, `auth-flow-tracing`. Brief taskType `research`, requirement `auth-hardening` with terms `["saml","scim"]` → expected uncovered `["auth-hardening"]`.

- [ ] **Step 1: Write** fixtures and `golden.test.ts` (one `describe.each` over case dirs: brief path checks `requiredIds ⊆ requirements`, `mustInclude ⊆ recommended∪optional`, `mustExclude ∩ picks = ∅`, uncovered ids equal; every decision has non-empty `covers`; heuristic path checks `heuristic.mustExclude ∩ picks = ∅`).
- [ ] **Step 2: Run** `pnpm vitest run packages/core/src/golden.test.ts` — Expected: PASS (Tasks 1–6 done). If a case fails, fix code, not the expectation, unless the expectation contradicts the spec — then stop and report.
- [ ] **Step 3: Run** the original repro offline: `node apps/cli/dist/index.js plan "add Stripe subscriptions to this Next.js app" --local-only` from the stripe fixture project — Expected: no `UI change`, no `build-game-changelog`.
- [ ] **Step 4: Commit** `test(golden): handoff examples as offline regression cases`

---

### Task 9: Adapter, docs, ignore rules

**Files:**
- Modify: `skills/ezy/SKILL.md`, `README.md`, `docs/ROADMAP.md`, `docs/architecture/ARCHITECTURE.md`, `docs/architecture/INTEGRATION-STRATEGY.md`, `.gitignore`

- [ ] **Step 1:** `skills/ezy/SKILL.md` procedure → clarify → `ezy brief "<outcome>"` → research per its instructions (primary sources, record `source`) → write `.ezy/brief.json` → `ezy next "<outcome>" --brief .ezy/brief.json` → show → gated install → re-run if needed → execute prompt. Trivial outcomes may skip the brief. Trust section adds: "The brief is your output; Ezy validates its shape but does not verify your findings — cite sources."
- [ ] **Step 2:** `.gitignore` add `.ezy/`. README quick start adds the brief → next pair. ROADMAP: Phase 6 = Agent Brief + Decision Quality (spec + plan links), Brain → 7, Verification → 8, Web UI → 9. ARCHITECTURE / INTEGRATION-STRATEGY decision-engine rows → "brief-driven (agent research) with heuristic fallback".
- [ ] **Step 3: Run** `pnpm check:ci` — Expected: build, lint, typecheck, all tests, audit pass.
- [ ] **Step 4: Commit** `docs: phase 6 agent brief flow`
