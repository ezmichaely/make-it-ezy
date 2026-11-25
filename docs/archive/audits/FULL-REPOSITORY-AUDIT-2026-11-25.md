# Full Repository Audit — Make It Ezy

**Audit date:** 2026-11-25
**Requested branch:** `analysis/full-scan-reconciliation`
**Worktree branch used for this audit:** `freebuff/834b092621829b4c22472f30` (worktree of the requested branch's content; local `freebuff-base` is an unrelated orphan scaffold commit — see §10)
**HEAD at audit time:** `c06b9f7` — `add: opencode-review & graphify-out` (2026-11-25)
**Commits in history:** 149
**Nature of this document:** READ-ONLY audit. No source, config, test, CI or documentation file was modified. The only file created is this report.

---

## 0. Executive summary

Make It Ezy is, today, a **working local TypeScript CLI that does deterministic, rule-based capability discovery and planning for coding tasks**, plus a thin agent adapter skill. The parts that are genuinely implemented and coherent are:

- project inspection (`analyze`, `doctor`, framework/package-manager detection, monorepo-aware root finding),
- local + `skills.sh` discovery and shallow inspection,
- deterministic requirement extraction (lexicon + keyword scoring, or a validated agent-written `.ezy/brief.json`),
- requirement-coverage selection with exclusions and uncovered reporting,
- a paste-ready handoff (`ezy next`) with a contractor-first ordered workflow,
- a gated installer (`npx skills add`) and a `.ezy/brain.json` project-memory cache.

The parts that are **not** implemented in the runtime, despite substantial documentation, are the trust/quality/security evaluation gate, the explicit lifecycle (intake → clarification → evaluation → spec/composition → outcome verification), the skill catalog/labor pool, and any execution or outcome-verification path. `packages/core/src/lifecycle.ts` exists, is exported, and is unit-tested, but **nothing in the CLI or planner calls it**. The repository's own architecture documentation admits this; its own implementation handoffs demand the opposite.

The strongest structural problems in the repository are not in the 3.3k lines of product source. They are:

1. **A 224 MB, 1,287-file research corpus (`docs/skill-scan/`) plus 14 MB of tracked `graphify-out/` build artifacts** dominate a 242 MB working tree and a 2,133-file index, while the project's stated hygiene policy says artifacts stay out of git.
2. **Raw conversation exports (`docs/convo/`, ~1.1 MB) and session transcripts (`docs/opencode/`, 492 KB) remain in a public repository** — a privacy issue the repository itself flagged as unresolved in a 2026-11-23 handoff.
3. **Documentation is internally contradictory** in several load-bearing places (broker workflow "shipped" vs "not in CLI output yet"; `catalog/` declared necessary and simultaneously "reserved (empty)"; lifecycle contracts described as a boundary and simultaneously as work that "must not remain a dead contract").
4. **The audit's own findings 5–10 were never fixed** and are still present in code, although the roadmap frames the project as launch-ready.

### Verdict in one line

> The shipped product is a **discovery-and-planning CLI**. The documentation and handoffs describe an **intent-to-outcome orchestration layer with a trust gate and a lifecycle**. The gap between those two things is deliberate in places, accidental elsewhere, and in at least three places the repository contradicts itself about which is true.

---

## 1. Repository inventory

### 1.1 Indexed size

| Measure | Value |
|---|---|
| Tracked files (`git ls-files`) | 2,133 |
| Working-tree size | 242 MB |
| Product source (`packages/core/src` + `apps/cli/src`, excluding tests/golden) | ~3,300 lines |
| Tests | 21 files, 178 `it` declarations (+ 6 parameterized `it.each` cases) |
| Documentation files under `docs/` | 1,366 (of which 1,278 are captured SkillEvaluator output) |

Distribution of tracked files by area:

| Area | Files |
|---|---|
| `docs/skill-scan/` (research corpus) | 1,287 |
| `graphify-out/prepare` (graph cache) | 613 |
| `packages/core/` (source + golden fixtures) | 98 |
| `docs/superpowers/` (specs + plans) | 21 |
| `docs/handoff/` (current + archive) | 11 |
| `docs/convo/` (raw conversation exports) | 11 |
| `docs/opencode/` (session logs) | 7 |
| `docs/gpt/` (phase notes, 5 of 7 files empty) | 7 |
| `docs/architecture/` | 7 |
| `apps/cli/` | 6 |
| `docs/research/` | 5 |
| `graphify-out/2026-11-05`, `backup-2026-11-05` | 9 |
| `.github/workflows/` | 3 |
| root config + docs | ~20 |

### 1.2 Repository map (purpose, not just names)

| Path | What it actually is |
|---|---|
| `apps/cli/src/index.ts` (515 lines) | Hand-rolled command parser and every command handler. No argument library. Formatting is delegated to `core`; the TTY arrow picker lives in `select.ts`. |
| `apps/cli/src/select.ts` (99 lines) | `readline`-free raw-mode arrow picker and y/N confirm. Returns `null` on non-TTY. |
| `packages/core/src/` | The actual product logic: detection (`analyze`, `detect-*`, `find-project-root`, `is-git-repo`), discovery (`search`, `search-remote`, `load-local-skills`), scoring (`score-skill`), selection (`select`, `requirements`, `capabilities`), planning (`plan`), handoff (`handoff`, `contractors`), brief contracts (`brief`), brain (`brain`), install (`install`), inspection (`inspect-skill`, `parse-skill-frontmatter`), output (`format`), plus the unwired lifecycle contracts. |
| `packages/core/src/golden/` | Four fake mini-projects with local `.agents/skills` fixtures, a brief, and an `expect.json`. These are the only behavioral regression tests for plan/selection. |
| `packages/core/src/index.ts` | The public surface of core — including exports that no consumer uses (§9). |
| `skills/ezy/SKILL.md` | The shipped agent adapter (adapter #1). Describes the intended host-agent procedure: brief → next → gated install → execute workflow stages → brain. |
| `skills/ci-before-push/SKILL.md` | Repo-owner skill describing `pnpm check:ci`. Not shipped to users. |
| `skills-lock.json` | Pins 52 Layer-A builder skills (source repo, path, SHA-256, install mode). Not the product catalog. |
| `scripts/*.mjs` (3 files) | Bootstrap a machine-level builder-skills home (`~/.local/share/make-it-ezy-builder-skills`), symlink it into `.agents/skills`, clean symlinks. `bootstrap-global-skills.mjs` can run `npx skills install -y` over the network. |
| `catalog/` | `.gitkeep` only. **Empty.** The broker design calls the catalog "necessary"; the architecture doc calls it "reserved (empty)". |
| `docs/architecture/` | Current architecture intent: `ARCHITECTURE.md`, `ARCHITECTURE-EXPLAINED.md` (Taglish), `CAPABILITY-MODEL.md`, `INTEGRATION-STRATEGY.md`, `SECURITY-MODEL.md`, `SHARED-EVIDENCE-LEARNING.md`, index `README.md`. |
| `docs/decisions/` | Two-file decision log. Currently one decision (git as shared memory across Claude/Cursor/Codex), status "Accepted direction; implementation not yet specified". |
| `docs/handoff/` | Current product handoff (2,823 lines), three 2026-11-22/23 implementation handoffs, a README defining precedence, and `archive/` with five superseded handoff snapshots. |
| `docs/superpowers/specs/` + `plans/` | Eleven phase specs and eleven plans (Phases 2–8 + broker workflow). Status markers are inconsistent with each other (§6). |
| `docs/audits/` | The 2026-11-07 gap audit (findings 1–10) and a Qwen span-notes file. |
| `docs/skill-scan/` | **Research workspace, not runtime.** A SkillEvaluator 1.0.1 wrapper, one captured run against `alirezarezvani/claude-skills` (1,278 generated artifacts: 429 JSON, 427 HTML, BENCHMARK.md files), an xlsx inventory summary, and two analysis documents. 224 MB. |
| `docs/convo/` | Eleven raw AI-conversation exports (~1.1 MB), including a 280 KB `make-it-ezy convo.txt` and a 304 KB video-summary dump. Explicitly declared non-authoritative by the repo itself. |
| `docs/opencode/`, `docs/gpt/` | Session logs and phase notes from other agent runs, committed to the repo. `docs/gpt/phase-2..5.md` and `s.txt` are 0 bytes. |
| `docs/ezy-routing/` | A single orphan reference document about routing local Ollama models. Not linked from any index; explicitly "not a Make It Ezy application feature yet". |
| `docs/research/` | 2026-11-05 ecosystem research, comparison matrices, a `skills-to-verify.json`. |
| `graphify-out/` | A committed Graphify code graph (5.4 MB `graph.json`, 613 cache files, HTML report) plus older snapshots. The broker plan itself says this graph "is stale (built Nov 6)". |
| `.github/workflows/` | CI (build → lint → typecheck → test → audit), CodeQL, release-please. |
| Root config | `package.json` (private workspace root, pnpm 10.33.2), `pnpm-workspace.yaml` (`apps/*`, `packages/*`), strict `tsconfig.base.json`, project references, `eslint.config.js` (strictTypeChecked + stylistic, ignores `docs/handoff`, `docs/skill-scan`, `graphify-out`), `vitest.config.ts` (includes a non-existent `tests/**`), `release-please-config.json` + manifest at 0.1.5, `CHANGELOG.md`. |

### 1.3 What is *not* in the repository

- No `node_modules`/lockfile-installed state at audit time (dependencies not installed; nothing was installed for this audit).
- No `.agents/`, `.claude/`, `.cursor/`, `.qwen/`, `.ezy/` directories. They are gitignored and created by `pnpm skills:install`. Consequently **many paths cited in `AGENTS.md` and docs do not exist in a clean checkout**.
- No `tests/` directory, despite `vitest.config.ts` including `tests/**/*.test.ts`.
- No execution path, no runtime adapter code that talks to a host agent, no server, no database.

---

## 2. Architecture audit

### 2.1 Boundaries that are real (enforced by code and configuration)

| Boundary | Enforced by | Evidence |
|---|---|---|
| `core` has no CLI concerns; `cli` has no business logic | Dependency direction: `apps/cli` depends on `@make-it-ezy/core` (`workspace:*`); core imports nothing from the CLI | `apps/cli/package.json`, `packages/core/package.json` |
| No AI SDK, no DB, no HTTP server in the product | Only network call is `https://skills.sh/api/v1/skills/search`; only process spawns are `execFileSync` for `pnpm`/`git` version probing and `spawn` for `npx skills add` | `search-remote.ts:52`, `doctor.ts:5-14`, `install.ts:30-36,120` |
| Untrusted skill text is sanitized **on the search/plan path** | `sanitizeText` applied in `load-local-skills.ts:57-60` and `search-remote.ts:59-60` | — (but *not* on the inspect path, §12) |
| Untrusted brief JSON is validated as data, never executed | `parseBrief` with size/count/regex limits and unknown-key notes | `brief.ts:157-232` |
| Skill installation is approval-gated | `--yes` or TTY confirm required before `runInstall` | `apps/cli/src/index.ts:355-375` |
| Strict TypeScript at the package boundary | `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, composite project references | `tsconfig.base.json`, `packages/core/tsconfig.json` |

### 2.2 Boundaries that exist only in documentation

| Claimed boundary | Reality |
|---|---|
| A **catalog** is the broker's "searchable labor pool of known skills" | `catalog/` is an empty directory with a `.gitkeep`. There is no catalog reader, writer, schema, or index. Contractor routing is a single hard-coded constant in `contractors.ts`. |
| A **trust / security / compatibility gate** between discovery and recommendation | There is no gate. `planOutcome` goes `search → score → select`. `inspect` is a separate, optional, human-invoked regex scan. `lifecycle.evaluateSkillCandidate` exists but is never called. |
| **Lifecycle stages** (intake, clarification, evaluation, specification/composition, outcome verification) | All six lifecycle functions are pure helpers with no caller outside `lifecycle.test.ts`. |
| **Skill registry / trusted pool / recommendation engine** as three distinct registries | One flat `SkillHit` type, one score, one greedy selector. `docs/handoff/MAKE-IT-EZY-HANDOFF.md` §6–§10 describe registry, trusted pool, trust levels, and a hard security gate that do not exist in code. |
| **Runtime adapter** abstraction ("Cursor / Claude / Codex") | There is no adapter interface in code. The "adapter" is a markdown file (`skills/ezy/SKILL.md`) and a prompt string. |
| **Domain extension point** `packages/core/src/domains/<domain>/` | Not created. `capabilities.ts` holds one global lexicon, including non-coding domains (video, structural engineering). |

### 2.3 Dependency graph (actual)

```
apps/cli/src/index.ts
  └─ @make-it-ezy/core (index.ts)  ── formats + all command logic
       ├─ analyze ─ find-project-root, is-git-repo, detect-frameworks, detect-package-manager
       ├─ search ─ load-local-skills, search-remote ─ score-skill, parse-skill-frontmatter, brief.sanitizeText
       ├─ recommend ─ search ─ score-skill
       ├─ inspect-skill ─ find-project-root, load-local-skills(loadSkillsLock), parse-skill-frontmatter, search-remote
       ├─ plan ─ analyze, requirements ─ capabilities, select ─ score-skill, search, contractors, brain
       ├─ handoff ─ plan, install(isSkillInstalledLocally), find-project-root
       ├─ install ─ search, find-project-root
       ├─ brain ─ analyze, load-local-skills, find-project-root, brief.sanitizeText
       └─ lifecycle ─ (nothing)
```

There is no cycle, and the layering inside core is sane. The only structurally wrong edge is missing, not present: **nothing depends on `lifecycle.ts`**.

### 2.4 Control-flow shape

The CLI is a flat `if (command === …)` dispatcher over `argv` with per-command ad-hoc flag filtering. There is no shared flag parser, so each command re-implements (or omits) flag handling — which is the root cause of findings 9 and 30 in this report.

---

## 3. Actual runtime execution paths

Each path below was traced from the CLI entry point through core to output.

### 3.1 `ezy doctor`

`index.ts` → `runDoctor()` → `execFileSync("pnpm"/"git", …)` (5 s timeouts) → `formatDoctor` → stdout. Exit 1 only if a **fail** check (Node < 20) is present; missing pnpm/git are warnings.

### 3.2 `ezy analyze`

`index.ts` → `analyzeProject()` → `findProjectRoot` (walk up; prefer `.agents/skills` or `pnpm-workspace.yaml`, else nearest marker) → `readPackageJson` → `detectFrameworks` (11 hard-coded rules) → `detectPackageManager` (lockfile sniffing) → `isGitRepository` → `formatAnalysis`.
**No side effects. No writes.**

### 3.3 `ezy search <query>`

`index.ts` → `searchSkills(query, {localOnly})` → `findProjectRoot` (fallback `cwd`) → `loadLocalSkills(projectRoot, query)` (read `.agents/skills/*/SKILL.md`, parse frontmatter, score, keep score > 0) + `searchSkillsSh` (single HTTP GET, 8 s timeout) → `mergeHits` (dedupe by `source/name`, max score +1 for a local/remote collision) → sort by score/installs/name → `formatSearch`.
**Note:** remote hits are scored against `"<name> from <source>"`, and their displayed description is replaced with `"Catalog hit from <source>"` — real skill descriptions from skills.sh are discarded (`search-remote.ts:62-70`).

### 3.4 `ezy inspect <skill>`

`inspectSkill()` → resolve skill dir (exact dir name → frontmatter name → unique partial match) → read `SKILL.md` → `parseSkillFrontmatter` → `loadSkillsLock` for source/hash/installMode → `listSkillFiles` (≤ 40) → `scanFindings` (5 regex heuristics: scripts present, network/exec mentions, secret mentions, destructive commands, package.json) → optional `searchSkillsSh` for install count → `formatInspect`.
**Unsanitized fields escape to the terminal** (description, file names, 12-line body preview).

### 3.5 `ezy recommend <query>`

`recommendSkills()` → `searchSkills` → take 6 hits → "strong" if `score ≥ 6` or installed/local, max 3 recommended, rest optional → `notNeededForQuery` emits **canned** strings ("multi-agent swarm — overkill…", "vector database — not required…") for any query containing frontend/design/ui/ux → `formatRecommend`.

### 3.6 `ezy brief "<outcome>"`

Pure print. Builds a project summary via `buildProjectSummary(cwd)` (which runs `analyzeProject` + local skills) and prints instructions, an annotated `.ezy/brief.json` schema, and the next command. **Writes nothing**; the host agent is expected to write the file.

### 3.7 `ezy brain` / `brain refresh` / `brain enrich`

`brain` → `findProjectRoot` → `loadBrainFile` (version check, project object check, optional `agent` slice validated and dropped if invalid) → `formatBrainHuman`.
`brain refresh` → `analyzeProject` + local skills → `projectFromSummary` → `computeFingerprint` (sha256 over `package.json` bytes + sorted skill dir names) → `mergeBrainMachine` (preserves a valid agent slice) → `saveBrainFile` (≤ 8 KB, writes `.ezy/brain.json`).
`brain enrich` → prints the agent-slice schema and instructions.

### 3.8 `ezy plan "<outcome>" [--brief path] [--local-only]`

`planOutcome()`:
1. `analyzeProject({cwd})`; `projectRoot = analysis.projectRoot ?? cwd`.
2. `loadLocalSkills(projectRoot, "")` for the project summary.
3. Requirements: from the validated brief, **or** `extractRequirements(outcome, analysis)` (lexicon match → small-UI normalization → token fallback; exclusions generated from skip hints).
4. Order required then optional, cap 10; build one search query per requirement (or the raw outcome).
5. **Loop sequentially** over queries: `await searchSkills(query, {…options, cwd, limit: 12})`, accumulating hits (max 10 × 8 s = up to 80 s of network).
6. `scoreCandidates` (dedupe by name, per-requirement relevance ≥ 4 to "cover") → `selectCapabilities` (exclusions by name-token match; greedy required coverage **local pool first**, then remote, up to 8 picks; then optional coverage).
7. Build `PlanReport` (capabilities = requirement labels, decisions, recommended/optional, exclusions, uncovered, notes, contractors = Superpowers if the brief task type is coding).
8. `persistBrainAfterPlan(cwd, report)` → writes `.ezy/brain.json` (side effect on a read-only-sounding command).
9. `formatPlan`.

### 3.9 `ezy next "<outcome>" [--brief] [--local-only]`

`buildHandoff` → `planOutcome` → `composeHandoffFromItems` → `mapItems` (dedupe, `isSkillInstalledLocally`, predict `.agents/skills/<name>` path) → `buildWorkflow` (contractor stage → recommended skill stages → custom uncovered stages) → `buildPrompt` → `formatHandoff` (Skills, Excluded, Uncovered, Workflow, Checklist, Prompt, Notes).

### 3.10 `ezy install …`

`handleInstall` → strict `--brief` extraction (exit 2 if the value is missing) → `parseInstallArgs` (`--yes/-y`, `--source`, `--plan`, `--query`; **all other `--flags` silently dropped**) → target resolution:
- explicit name, or
- `--plan` → `planOutcome` + TTY arrow picker, or
- `--query` → `recommendSkills` + TTY arrow picker.

→ `buildInstallPreview` (may call `searchSkills` to guess a source; destination `.agents/skills/<name>`; predicted `npx skills add <source> --skill <name>`) → print preview → already-installed short-circuit → unresolved-source refusal → approval (`--yes` or TTY confirm; non-TTY without `--yes` exits 1) → `runInstall` (`spawn("npx", …)`) → print result → on success, re-print the plan/query handoff.

### 3.11 Implemented but unreachable

| Symbol | Where | Why unreachable |
|---|---|---|
| `buildIntentIntake` | `lifecycle.ts:13` | No caller outside `lifecycle.test.ts` |
| `evaluateSkillCandidate` | `lifecycle.ts:33` | Same |
| `composeSkillSpec` | `lifecycle.ts:94` | Same |
| `evaluateOutcome` | `lifecycle.ts:124` | Same |
| `aggregateEvidence` | `lifecycle.ts:202` | Same |
| `proposeImprovement` | `lifecycle.ts:232` | Same |
| `SearchOptions.remoteOnly` | `search.ts:11,66` | Never set by any caller |
| `RequirementsResult.skipHints` | `requirements.ts:114-143` | `planOutcome` uses only `.exclusions`; only tests read `skipHints` |
| `isBrainStale` | `brain.ts:65` | Exported and tested; never called by the CLI |
| `SUPERPOWERS_TASK_TYPES` | `contractors.ts:34` | Not re-exported from `index.ts`; used only inside the module |
| Non-coding lexicon entries (`video scripting`, `domain analysis`, …) | `capabilities.ts:20-40` | Reachable only if a user asks for a video/structural outcome; README says the product targets coding only, and no golden case covers them |

---

## 4. Lifecycle architecture audit

### 4.1 What exists

`packages/core/src/lifecycle-types.ts` (122 lines) defines: `LifecycleDecision` (`PASS|FAIL|UNCERTAIN`), `IntentIntake`, `ClarificationQuestion`, `SkillReviewState`, `SkillEvaluationInput/Output`, `SkillSpec`, `OutcomeVerification`, `OutcomeEvaluationInput`, `OutcomeEvaluation`, `SharedEvidenceEvent`, `EvidenceAggregate`, `ImprovementProposal`.

`packages/core/src/lifecycle.ts` (252 lines) implements six pure functions with no IO, no clock dependency (except none at all), and deterministic output. They are exported from `index.ts:112-135`.

`packages/core/src/lifecycle.test.ts` (115 lines, 7 tests) asserts: blocking decisions force clarification, an eligible skill can still carry reasons, a composition spec round-trips, unmet requirements beat passing tests (`FAIL`), completed execution without evidence yields `UNCERTAIN`, single-event aggregation yields rate 1.0, and a proposal appears only above sample/failure thresholds.

### 4.2 Per-stage determination

| Lifecycle stage | Contract | Unit tests | Runtime integration | Verdict |
|---|---|---|---|---|
| Intent intake / objective shaping | `buildIntentIntake` | 1 test | **None** — `planOutcome` takes the raw CLI string | **IMPLEMENTED BUT UNUSED** |
| Clarification boundary | `IntentIntake.clarificationRequired`, `questions` | 1 test | None; a vague outcome silently produces token pseudo-requirements | **IMPLEMENTED BUT UNUSED** (and behaviourally contradicted: the runtime *does* manufacture certainty) |
| Capability extraction | `capabilities.ts`, `requirements.ts` | 19 tests | `planOutcome` | **IMPLEMENTED** |
| Discovery | `search.ts` (local + skills.sh) | 9 tests | `search`, `recommend`, `plan`, `install`, `inspect` | **IMPLEMENTED** |
| Skill inspection | `inspect-skill.ts` | 4 tests | `ezy inspect` only (never inside `plan`) | **PARTIALLY IMPLEMENTED** (separate command, not a gate) |
| Skill evaluation (fit/provenance/security/compatibility/overlap/cost) | `evaluateSkillCandidate` + `SkillEvaluationInput` | 1 test | **None** — selection uses numeric score only | **IMPLEMENTED BUT UNUSED** |
| Skill specification / composition | `composeSkillSpec` | 1 test | None; handoff emits markdown, not `SkillSpec` | **IMPLEMENTED BUT UNUSED** |
| Contractor / workflow selection | `contractors.ts` + `buildWorkflow` | 1 test | `planOutcome` → `buildHandoff` | **IMPLEMENTED** (single hard-coded contractor, brief-driven only) |
| Host execution | — | — | None | **MISSING** (documented as host-owned) |
| Outcome evaluation | `evaluateOutcome` | 2 tests | None | **IMPLEMENTED BUT UNUSED**; full verification is **DEFERRED** to Phase 9 |
| Evidence aggregation | `aggregateEvidence` | 1 test | None; no event source exists | **IMPLEMENTED BUT UNUSED** |
| Improvement proposals | `proposeImprovement` | 1 test | None | **IMPLEMENTED BUT UNUSED** |
| Controlled approval of improvements | — | — | None | **DOCUMENTED ONLY** |
| Skill trust registry | — | — | None | **DOCUMENTED ONLY** |
| Performance registry | — | — | None | **DOCUMENTED ONLY** |

### 4.3 Assessment

The lifecycle slice is **honest code with no consumer**. Two things are simultaneously true and are stated differently in different documents:

- `docs/architecture/ARCHITECTURE.md:47`, `CAPABILITY-MODEL.md:37`, `HOW-IT-WORKS.md` §"What discover → evaluate means here", and `docs/skill-scan/REANALYSIS-2026-11-24.md` all say: contracts exist, runtime is not wired, verification is Phase 9. **This matches the code.**
- `docs/handoff/CLAUDE-IMPLEMENTATION-COMMAND-REVIEW-FIX-PASS-2026-11-23.md:41-47,§3-§5` and `docs/handoff/CODING-AGENT-INSTRUCTION-MISSING-EZY-CAPABILITIES-2026-11-23.md:8` say the evaluator "must not remain a dead contract or helper", that clarification must become "a real boundary", and that `SkillSpec` must "become useful to the planner/handoff flow". **This does not match the code and was never done.**

Both sets of documents are live in the repository, and `AGENTS.md` (the single shared agent guide) mentions neither the lifecycle contracts nor the outstanding wiring demand. An agent reading only `AGENTS.md` would not know the lifecycle exists; an agent reading the handoffs would start implementing it; an agent reading `ROADMAP.md` would defer it to Phase 9.

---

## 5. Skills system audit

| Question | Finding |
|---|---|
| How are skills discovered? | Two sources only: local `.agents/skills/*/SKILL.md` (read directly, no symlink following logic) and the public `skills.sh` search API (one GET per query). |
| How are skills represented? | One flat `SkillHit` (`id`, `name`, `description`, `source`, `sourceKind: "local"\|"skills.sh"`, `path`, `installs`, `score`, `installedLocally`, `url`). There is no representation of a skill *set*, a contractor, a version, a license, a hash, a review state, or a capability role inside a hit. |
| How are skills evaluated? | Numeric keyword score only (`score-skill.ts`: name-token 6/10, description 2; stopwords removed; naive plural stemming). Optional, human-invoked regex risk scan in `inspect`. |
| How are recommendations produced? | Threshold bucketing (`score ≥ 6` → recommended, cap 3). For `plan`, greedy set-cover over requirement coverage, local-first, cap 8. |
| How are skills selected? | `selectCapabilities`: dedupe by name → exclusion filter (name tokens must all be present) → greedy required coverage (local pool, then remote) → greedy optional coverage. |
| How are skills installed? | `npx skills add <source> --skill <name>` spawned in the project root; result captured; no verification that the installed tree matches `skills-lock.json`. |
| Metadata handling | Only `name` and `description` are parsed from frontmatter. `skills-lock.json` supplies `source` (and is displayed only by `inspect`). There is no validation that a lock entry exists for a local skill, and no hash verification. |
| Provenance | `source` string from the lock or from skills.sh. Unknown sources become `"local"` or `"unknown"`. No commit pinning, no license capture. |
| Security | Regex heuristics in `inspect` only. Not part of planning. Not enforced at install. |
| Quality / maintenance | `installs` count from skills.sh, used as a ranking tiebreaker and printed. No update activity, no license, no maintenance signal. |
| Discovery vs recommendation separation | **Correctly separated in code**: `search` never recommends; `recommend` never installs; `plan` never installs. This is the repository's strongest realized principle. |
| Is `skill-scan` runtime infrastructure? | **No.** It is a captured research run (Python SkillEvaluator 1.0.1, local Ollama) with no import path from product code. Its README says so explicitly. |
| Catalog ↔ skill definition duplication | `catalog/` is empty, so there is no duplication *inside the catalog*. But the same skill definitions are duplicated across four golden fixtures (e.g. `build-game-changelog` and `docker-deploy` appear in four separate `project/.agents/skills/` trees), and the 52 pinned builder skills are duplicated conceptually between `skills-lock.json` and the machine-level global home. |

### 5.1 Missing lifecycle connections (concrete)

1. `plan` never calls `evaluateSkillCandidate`, so trust/security/overlap/context-cost are absent from every plan.
2. `plan` never calls `inspectSkill`, so a skill's files/scripts are never considered before recommendation.
3. `handoff` never builds `SkillSpec` objects, so composition role/order is expressed only as prose in a markdown prompt.
4. Nothing consumes `aggregateEvidence`, so no outcome ever informs ranking.
5. `aggregateEvidence` groups by `taskClass|capability|skill`, and a multi-capability event increments every combination — a known counting hazard flagged in the repository's own review handoff (`CLAUDE-IMPLEMENTATION…:§7`), still unaddressed.
6. `proposeImprovement` targets `"skill-ranking"` but no ranking code can read a proposal.

---

## 6. Documentation ↔ code reconciliation

Legend: **TRUE** = code matches; **PARTIAL** = partly true; **STALE** = was true, no longer; **CONTRADICTED** = code/Docs disagree within the repo; **PLANNED** = explicitly future; **UNDOCUMENTED** = code exists, docs don't say.

| # | Claim (source) | Verdict | Evidence |
|---|---|---|---|
| 1 | "Local-first capability and context decision layer; host agent performs the work" (`README.md:21`, `AGENTS.md`) | **TRUE** | No execution/spawn of host agents anywhere; only `npx skills add` |
| 2 | "No AI SDK. No database. No mandatory hosted backend." (`ARCHITECTURE.md:54`) | **TRUE** | Only dependency is `node:*`; single HTTP call to skills.sh |
| 3 | "Phases 0–7 shipped; Phase 8 current" (`README.md`, `ROADMAP.md`, `AGENTS.md`) | **PARTIAL** | Commands exist and are tested; but "Phase 4 — Install + adapters" is labelled "mostly done" in `ROADMAP.md:52` while `MVP-SPECIFICATION.md` calls it done, and Phase 8's own spec status is "In progress" |
| 4 | "Broker workflow first slice shipped: contractor routing + ordered Workflow in `ezy next`" (`ROADMAP.md:11`, `MVP-SPECIFICATION.md:74`, broker spec §Implementation status) | **TRUE** | `contractors.ts`, `handoff.buildWorkflow`, `formatHandoff` Workflow section |
| 5 | "Broker workflow (approved — **not in CLI output yet**)" (`MVP-SPECIFICATION.md:69`) | **CONTRADICTED** | Same file, line 74, and `handoff.ts` show it is in CLI output |
| 6 | "The catalog is necessary: Ezy's searchable labor pool" (broker spec §Catalog) | **CONTRADICTED** | `catalog/` contains only `.gitkeep`; `ARCHITECTURE.md:51` says "reserved (empty)"; no catalog code exists |
| 7 | "Lifecycle contracts are exported boundary contracts, not a runtime pipeline" (`ARCHITECTURE.md:47`, `CAPABILITY-MODEL.md:37`) | **TRUE** | `lifecycle.ts` has no caller outside tests |
| 8 | "The evaluator must not remain a dead contract or helper" (`CLAUDE-IMPLEMENTATION…:43-47`, `CODING-AGENT-INSTRUCTION…:8`) | **CONTRADICTED by the codebase and by docs #7** | `evaluateSkillCandidate` is a dead helper today |
| 9 | "Project Brain does not drive planning in v1" (`MVP-SPECIFICATION.md:64`) | **TRUE** | `planOutcome` never reads `.ezy/brain.json` |
| 10 | "Ezy can be your context router; Brain prevents the next agent rediscovering the repo" (`README.md` context-router section, `HOW-IT-WORKS.md` step 6) | **PARTIAL / MISLEADING** | Brain is written on `plan`/`next` and displayed by `ezy brain`; nothing feeds it back into planning or handoff generation |
| 11 | "Discovery does not equal recommendation" (AGENTS/README/HOW-IT-WORKS) | **TRUE** | Separate commands and separate code paths |
| 12 | "Skill metadata is sanitized at load for search/plan output; inspect/format may still need defense-in-depth" (`AGENTS.md` trust paragraph) | **TRUE and self-admitted** | `load-local-skills.ts:57-60`, `search-remote.ts:59-60` sanitize; `inspect-skill.ts`/`format.ts` do not |
| 13 | "Install preview + explicit approval" (`SECURITY-MODEL.md`) | **TRUE** | `index.ts:355-375` |
| 14 | "Hard security gate / trust levels / trust registry" (`MAKE-IT-EZY-HANDOFF.md` §6–§10) | **PLANNED, presented as target** | Document does carry a Shipped/Next/Future table at the top, but §6–§12 read as current architecture |
| 15 | "Audit findings 1–4 fixed; 5–10 optional" (`AGENTS.md`, `ROADMAP.md`, audit doc) | **TRUE for 1–4; 5–10 still open** | Findings 5, 6, 7, 8, 9, 11 all reproducible in current code (§14) |
| 16 | "Test suite green" (audit doc "180 tests green") | **UNKNOWN** | Tests were **not run** for this audit (dependencies not installed, per instructions). 178 `it` + 6 parameterized cases are declared. |
| 17 | "The repo's `.qwen/settings.json` sets 15 m request / 10 m stream-idle…" (`AGENTS.md:108`) | **CONTRADICTED** | `.qwen/` does not exist and `.gitignore:20` ignores it; `AGENTS.md:106` also links to a non-existent file |
| 18 | "`docs/convo/` is archived research only" (audit doc, handoff README) | **TRUE as policy, violated in spirit** | 1.1 MB of raw exports remain tracked and are linked from `/workspace`-level docs; a 2026-11-23 handoff demands remediation |
| 19 | "Builder skills are not in git to keep repo size honest" (`BUILDER-SKILLS.md`) | **CONTRADICTED in practice** | 224 MB `docs/skill-scan` + 14 MB `graphify-out` are tracked |
| 20 | "graphify-out graph is stale (built Nov 6)" (broker plan, Global Constraints) | **TRUE** | `graphify-out/2026-11-05/` snapshot; HEAD commit adds it fresh, contradicting the warning |
| 21 | "MVP spec documents CLI behavior through Phase 7" (`docs/handoff/README.md:25`) | **STALE** | MVP spec contains a Phase 8 section |
| 22 | "Key current documents: Architecture Explained, Shared Evidence" (`docs/architecture/README.md:17-19`) | **STALE / incomplete** | Omits `ARCHITECTURE.md`, `CAPABILITY-MODEL.md`, `SECURITY-MODEL.md`, `INTEGRATION-STRATEGY.md` |
| 23 | Status badge "phase 8 launch" with alt text "Phase 7 shipped" (`README.md:14`) | **STALE alt text** | Cosmetic but visible to screen readers |
| 24 | "Phase 8 — Launch and Distribution (**current**)" with a `### Lifecycle contract slice` subsection inserted before the `(**current**)` marker (`ROADMAP.md:84-91`) | **STRUCTURALLY BROKEN** | The `(**current**)` token is orphaned after the lifecycle subsection, so the phase heading reads as if its body is the lifecycle slice |
| 25 | Phase 8 publishes to npm | **PLANNED** | `release-please.yml` only creates GitHub releases; no publish workflow; version 0.1.5 predates broker + lifecycle code |
| 26 | Non-coding domains are "later, one at a time" (`ROADMAP.md` Scope) | **PARTIAL** | `capabilities.ts` already ships video and structural-engineering lexicon entries; no golden coverage, no detection |
| 27 | "`ezy install --plan` / `--query` reprint the handoff" (`MVP-SPECIFICATION.md`) | **TRUE** | `appendInstallHandoff` |
| 28 | "Local-only skips skills.sh" (`HELP`, MVP) | **TRUE for search/inspect/recommend/plan/next** | `install --plan/--query` ignores `--local-only` entirely (UNdocUMENTED divergence) |
| 29 | Lifecycle contract slice listed inside Phase 8 (`ROADMAP.md:85-90`) | **UNDOCUMENTED in `AGENTS.md` and `skills/ezy/SKILL.md`** | Neither mentions lifecycle/evidence at all |

### 6.1 Documentation health summary

- **Accurate and useful:** `MVP-SPECIFICATION.md` (except line 69), `HOW-IT-WORKS.md`, `CONTRIBUTING.md`, `docs/CI.md`, `BUILDER-SKILLS.md`, `ARCHITECTURE-EXPLAINED.md`, the 2026-11-07 audit (self-aware about staleness).
- **Accurate but heavy:** `MAKE-IT-EZY-HANDOFF.md` (2,823 lines) — its own "Shipped → next → future" table saves it, but §6–§12 describe a registry/trust system that does not exist.
- **Conflicting:** the two 2026-11-23 implementation handoffs vs `ROADMAP.md`/`AGENTS.md`/`ARCHITECTURE.md` on whether lifecycle wiring is current work.
- **Stale indexes:** `docs/architecture/README.md`, `docs/handoff/README.md:25`, `README.md:14`.
- **Research docs dressed as product docs:** `docs/skill-scan/ANALYSIS.md` ("100% Complete!") refers to an external workbook; the doc was patched once to add caveats, but the "ALL 40 DOMAINS DONE ✅ / 100% Complete!" framing still reads like product status.
- **Orphans:** `docs/ezy-routing/LOCAL-AI-MODEL-ROUTING.md` (not linked from any index); `docs/gpt/` (7 files, 5 empty); `docs/opencode/` session logs.

---

## 7. Agent / instruction audit

### 7.1 Files that carry agent instructions

| File | Scope | Loaded by |
|---|---|---|
| `AGENTS.md` (144 lines) | Repository root; product goal, phase path, source-of-truth table, builder stack (Superpowers/Ponytail/Graphify), Qwen notes, dogfood procedure | Codex, Cursor, Qwen (directly); Claude via `CLAUDE.md` |
| `CLAUDE.md` (7 lines) | Claude Code bridge: `@AGENTS.md` plus a "keep Claude-specific guidance minimal" rule | Claude Code |
| `CONTRIBUTING.md` | Humans + agents: develop/check/PR, roadmap-phase doc-sync checklist | Humans, referenced from AGENTS |
| `skills/ezy/SKILL.md` | End-user adapter (shipped to users' repos) | Host agent when `/ezy` is invoked |
| `skills/ci-before-push/SKILL.md` | This repo only | Contributor agents |
| `docs/handoff/*-2026-11-23.md` | Addressed to "the coding agent" | Agents handed the task |
| `skills-lock.json` + `.agents/skills/*` (after install) | Nested `AGENTS.md` under vendored skills (e.g. Superpowers, Ponytail, Graphify) | Any agent in this repo after `pnpm skills:install` |
| `.github/PULL_REQUEST_TEMPLATE.md` | PR authors | GitHub |

Absent: `.cursor/rules`, `.claude/settings.json`, `.qwen/settings.json`, `.superpowers/`, `.ezy/`. The docs mention several of these as if they exist.

### 7.2 Declared hierarchy

`AGENTS.md` → topic sources (`docs/architecture/` → `docs/decisions/` → `docs/handoff/` → implementation), with nested `AGENTS.md` allowed to add file-local constraints only. `CLAUDE.md` imports `AGENTS.md`. `CONTRIBUTING.md` defers to `AGENTS.md`. This hierarchy is clear and consistently stated in three places.

### 7.3 Duplication

- The "product goal / trust rules" paragraph appears verbatim-ish in `AGENTS.md`, `README.md`, `HOW-IT-WORKS.md`, `ARCHITECTURE.md`, `CAPABILITY-MODEL.md`, `MAKE-IT-EZY-HANDOFF.md`.
- The Shipped/Next/Future table exists in `MAKE-IT-EZY-HANDOFF.md`, `ROADMAP.md`, `README.md`, `ARCHITECTURE.md` (shipped table), `HOW-IT-WORKS.md`, `INTEGRATION-STRATEGY.md`, `MVP-SPECIFICATION.md`, `ARCHITECTURE-EXPLAINED.md`. Six of eight are consistent; the two exceptions are documented in §6 (#3, #21).
- The "layers A/B" rule is stated in `AGENTS.md`, `ARCHITECTURE.md`, `INTEGRATION-STRATEGY.md`, `BUILDER-SKILLS.md`, `HOW-IT-WORKS.md`.

### 7.4 Stale or non-existent targets in instructions

| Instruction reference | Reality |
|---|---|
| `.qwen/settings.json` (AGENTS.md:106,108) | Does not exist; `.gitignore:20` ignores it |
| `.agents/skills/using-superpowers/SKILL.md`, `ponytail/SKILL.md`, `graphify/skill.md`, `brainstorming/SKILL.md`, etc. (AGENTS.md) | Absent until `pnpm skills:install` runs; `node_modules` is also absent in a fresh checkout, so neither step works before install |
| `.claude/skills`, `.cursor/skills` (docs/CI.md) | Created only by `scripts/link-builder-skills.mjs` |
| `graphify-out/` query tools (AGENTS.md) | The graph is committed but stale (built 2026-11-05); no Graphify CLI is installed by the repo |
| `.agents/skills/ci-before-push/SKILL.md` (CONTRIBUTING.md) | Only exists after install; the repo-owned source is `skills/ci-before-push/SKILL.md` |

### 7.5 Behavioural conflicts an agent can hit

1. **"Do not add runtime dependencies/LLM" (AGENTS.md)** vs **handoffs demanding lifecycle wiring into the runtime.** The handoffs are careful to avoid asking for an LLM, but they do ask for behavioural change during a "launch" phase whose roadmap excludes it.
2. **"Smallest complete change" (AGENTS.md)** vs **"implement the missing lifecycle… do not stop at analysis" (CODING-AGENT-INSTRUCTION).** An agent obeying the first will not do the second.
3. **"Vendored builder skills are always on" (AGENTS.md)** vs **"do not rely on vendored `.agents/skills` for tests" (ci-before-push).** Both are true in different contexts; the guide never states which wins inside `packages/core` tests.
4. **"Do not use historical handoffs or conversation exports to decide current work" (AGENTS.md)** vs `docs/convo/` (1.1 MB) and `docs/opencode/` session logs being tracked and adjacent to authoritative docs, with a 2026-11-23 handoff instructing the agent to review `docs/convo/`.
5. **`AGENTS.md` never mentions lifecycle contracts**, yet `ROADMAP.md` lists them as part of the current phase. An agent reading only the guide cannot know they exist.

### 7.6 Which instructions apply where

| Path | Applicable instructions |
|---|---|
| `packages/**`, `apps/**` | AGENTS (builder stack), Ponytail, Superpowers (TDD/verification), `CONTRIBUTING` doc-sync checklist |
| `skills/ezy/**` | AGENTS "keep the adapter in sync with shipped commands"; user-facing, so changes require doc sync |
| `docs/skill-scan/**` | Its own README: untrusted evidence, no scripts executed, keep `.venv`/`.qwen` untracked — but the same folder is excluded from ESLint and left in CodeQL scope |
| `docs/handoff/**`, `docs/convo/**`, `docs/opencode/**` | Ignored by ESLint; "historical, not authoritative" for convo/archive |
| `.agents/skills/**` (after install) | Nested skill `AGENTS.md`/`SKILL.md`; explicitly subordinate to root product intent |

---

## 8. Test audit

### 8.1 Inventory

| File | Tests | What it actually verifies |
|---|---|---|
| `apps/cli/src/cli.test.ts` | 26 | Spawns the CLI through `tsx`; help text, each command's happy path, missing-argument exits, invalid-brief exits, `--brief` edge cases, unknown command. Depends on `node_modules/tsx` and (for `analyze`) on the real repo. |
| `packages/core/src/golden.test.ts` | 2 × 4 cases | Brief path and heuristic path against four fixtures with `mustInclude`/`mustExclude`/`uncovered`. **Always `localOnly: true`.** |
| `select.test.ts` | 18 | Greedy coverage, local-before-remote, exclusions, caps (4/8), uncovered, coverage reasons |
| `brief.test.ts` | 23 | Schema validation, limits, unknown keys, sanitization (ANSI/bidi), BOM/CRLF, terminal-escape sanitization |
| `plan.test.ts` | 11 | Heuristic + brief planning, dedupe, installs tiebreak, remote-unavailable note, uncovered |
| `handoff.test.ts` | 12 | Installed/missing skills, checklist, prompt sections, coverage/research carry, contractor stage, 6-pick checklist |
| `requirements.test.ts` | 12 | Lexicon mapping, small-UI normalization, exclusions, stopword-only terms |
| `score-skill.test.ts` | 10 | Token weighting, stopwords, plurals, `ss` guard |
| `lifecycle.test.ts` | 7 | The six lifecycle helpers in isolation |
| `brain.test.ts` | 6 | Agent-slice validation, save/load round-trip, fingerprint staleness |
| `install.test.ts` | 5 | Already-installed detection, preview, injected spawn, unresolved source |
| `search.test.ts` | 5 | Local-only, remote merge with fake fetch, legacy response shape, soft failure |
| `format-plan.test.ts` | 6 | Section presence/absence, local-skill cap, brief hint |
| `capabilities.test.ts` | 7 | Lexicon + 6 parameterized mappings |
| `inspect-skill.test.ts` | 4 | Findings, missing skill, missing SKILL.md, empty name |
| `detect-package-manager.test.ts` | 5 | Lockfile sniffing |
| `detect-frameworks.test.ts` | 4 | Deps + tsconfig detection, parse error |
| `find-project-root.test.ts` | 4 | Upward walk, monorepo preference |
| `parse-skill-frontmatter.test.ts` | 4 | Simple, folded, chomped, absent |
| `analyze.test.ts` | 2 | Non-project and simple TS project |
| `recommend.test.ts` | 4 | Local strong match, empty query, optional bucket, canned not-needed |

Totals: 21 test files, 178 `it` declarations plus 6 parameterized `it.each` cases.

### 8.2 What is well tested

Validation/sanitization (`brief.ts`), scoring (`score-skill.ts`), selection (`select.ts`), and plan/handoff composition. These are the highest-risk pure functions and their tests are behavior-oriented.

### 8.3 What is not tested

| Gap | Evidence |
|---|---|
| **Lifecycle integration** | `lifecycle.test.ts` only exercises helpers. No test asserts (or would fail if) the planner never calls them. |
| **Lifecycle reachability** | No test ties `lifecycle.ts` to the CLI; the suite stays green whether the contracts are wired or not. |
| **Trust gate** | No test for "an unreviewed/unknown-provenance skill must not be recommended", because no such behaviour exists. The 2026-11-23 handoff's acceptance criteria (§12.4, §12.5) are unimplemented and untested. |
| **Clarification boundary** | No test that a vague outcome refuses to manufacture requirements. `requirements.test.ts:96` instead asserts a token fallback. |
| **Outcome evaluation in a real flow** | No execution path exists to test. |
| **`doctor.ts`** | No dedicated unit test; only the CLI happy path (Node present) is covered. |
| **`is-git-repo.ts`** | No direct test; indirectly covered by `analyze.test.ts` (`.git` present only). |
| **`format.ts` (other than plan/handoff)** | `formatDoctor`, `formatAnalysis`, `formatSearch`, `formatInspect`, `formatRecommend`, `formatInstallPreview/Result` are only covered through CLI string-contains assertions. |
| **`inspect` → `plan` interaction** | None (they do not interact). |
| **CLI `install` real spawn** | Deliberately mocked; no test of actual `npx` behaviour. |
| **Golden cases with network** | All four run `localOnly: true`; the only network-shaped test mocks `fetch` (`plan.test.ts`). |
| **`--local-only` on `install`** | No test; the flag is silently dropped. |
| **Unknown flags** | No test; `--local-ony` silently searches the network (audit finding 9). |
| **`tests/**` directory** | Included by `vitest.config.ts` but does not exist. |

### 8.4 Tests that test the wrong thing / can pass while runtime is disconnected

1. **`lifecycle.test.ts` passes with zero runtime integration.** This is the canonical "green tests, dead feature" case.
2. **Golden tests freeze *today's* selection behaviour** (e.g. `mustInclude: ["react-components"]`) and run only offline, so they cannot catch a regression on the network path the product uses by default.
3. **Fixture types do not match production types.** `plan.test.ts:13` and `handoff.test.ts:102,151` construct `SkillHit` objects with `sourceKind: "remote"`, which is **not** a member of `SkillSourceKind = "local" | "skills.sh"`, and `plan.test.ts`'s `hit()` omits the required `id` field. Test files are excluded from both package `tsconfig.json`s (`exclude: ["src/**/*.test.ts"]`), so `pnpm typecheck` never sees them. The suite therefore compiles fixtures the production type system forbids.
4. **`cli.test.ts` asserts `analyze` output against the real repository**, so it is sensitive to the machine (package-manager detection) rather than to the code under test.
5. **Canned recommendation hints are asserted as behaviour** (`recommend.test.ts:70`) — the test locks in the hard-coded "swarm/vector" strings.

### 8.5 Duplicated/stale tests

- Two `formatPlan` assertions of "never mentions install-count justifications" overlap with `coverageReason` tests.
- `handoff.test.ts` repeats the `composeHandoffFromItems` defaults check in two shapes.
- No test is obviously dead; the suite is compact (about 3,900 test lines for 3,300 source lines).

**Not run in this audit:** `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm build`. Dependencies are not installed and the brief forbids installing them or running CI. All test statements above are static analysis.

---

## 9. Dead code / duplication audit

| Finding | Evidence | Kind |
|---|---|---|
| `lifecycle.ts` entire module unreachable | 6 exports, only caller is `lifecycle.test.ts`; `grep -rn lifecycle apps/` → **no matches** | Unreachable module (deliberate boundary, but dead) |
| `evaluateSkillCandidate` / `composeSkillSpec` / `evaluateOutcome` / `aggregateEvidence` / `proposeImprovement` / `buildIntentIntake` | `packages/core/src/index.ts:112-135` exports; no consumers | Unused exports |
| `SearchOptions.remoteOnly` | `search.ts:11` declared, `:66` used; no caller sets it | Unused option |
| `RequirementsResult.skipHints` | `requirements.ts:114-143`; `plan.ts` uses only `extracted.exclusions`; tests read `skipHints` | Duplicate representation of exclusions (audit finding 11, still open) |
| `isBrainStale` | `brain.ts:65`, exported, tested, never called | Unused export |
| `SUPERPOWERS_TASK_TYPES` | `contractors.ts:34`, not re-exported | Unused export |
| `InspectRiskLevel` `"unknown"` | `inspect-types.ts:1`; never produced | Unused union member |
| `CapabilityDecision.decision: "skip"` | `plan-types.ts:13`; `decide()` only emits `use`/`install`/`optional` | Unused union member |
| `PlanReport.capabilities` | "Back-compat: requirement labels"; only rendered as a fallback when `requirements` is empty | Compatibility layer, possibly removable |
| `make-it-ezy-final.xlsx` + `ANALYSIS.md` | Only referenced by `docs/skill-scan/README.md`; no code reads either | Research artifact |
| `graphify-out/` | No product code reads it; no Graphify binary installed | Build artifact treated as source |
| `docs/gpt/phase-2..5.md`, `docs/gpt/s.txt` | 0 bytes each | Empty committed placeholders |
| `catalog/.gitkeep` | Empty directory preserved for a component that does not exist | Placeholder |
| Golden fixture decoys | `build-game-changelog`, `docker-deploy`, `plan-ui-change` repeated in 4 fixture trees; they exist purely as `mustExclude` targets | Intentional duplication, and the only decoy coverage |
| Two "not needed" mechanisms | `requirements.skipHints` → `exclusions`; `recommend.notNeededForQuery` → canned hints | Duplicate concepts with different ownership |
| Two plan-shaping lanes | `requirements.ts` heuristic vs `brief.ts` brief | Intentional, documented |
| Two handoff builders | `buildHandoff` and `composeHandoffFromItems` | Intentional (plan vs query path), well-factored |
| `recommend.ts` vs `select.ts` selection logic | `recommend` uses a flat score threshold; `plan` uses greedy coverage; both feed `install` | Two different "recommended" definitions for the same word — user-visible inconsistency (C13) |

---

## 10. Git / branch / history audit

| Item | Value |
|---|---|
| Current worktree branch | `freebuff/834b092621829b4c22472f30` (contains the requested branch content) |
| Requested branch | `analysis/full-scan-reconciliation` (not present as a local ref) |
| Other local ref | `freebuff-base` → `fa62cf7 "Initial cloud project"` — an **unrelated root commit with no merge base** (verified: `git merge-base HEAD freebuff-base` returns nothing) |
| HEAD | `c06b9f7` `add: opencode-review & graphify-out` (2026-11-25) |
| Commit count | 149 |
| First commit | `273f9f8` `chore(init): scaffold monorepo foundation` (2026-11-05) |

### 10.1 Evolution, in order

1. **2026-11-05** — scaffold, docs, then Phases 1–4 in a single day (doctor/analyze → search/inspect/recommend → plan → gated install + `next`).
2. **2026-11-06/07** — Phase 5 (project-aware planning), Phase 6 (brief), audit 1–4 fixes, and the 2026-11-07 gap audit.
3. **2026-11-17/18** — audit 1–4 landed (`33899ff`, `255ee0e`), Phase 7 Project Brain (`15d1ca1`), release 0.1.5, builder skills moved out of git (`f74e9da`, `91b372a`).
4. **2026-11-22** — `bd6ce7a feat: start Phase 8 launch and broker workflow handoff` adds `contractors.ts`, `WorkflowStage`, workflow output. Merge PR #19 (`feat/phase8-launch`).
5. **2026-11-23** — `8e137de feat(core): add intent lifecycle and evidence contracts` — the only commit that produces `lifecycle.ts`/`lifecycle-types.ts`/`lifecycle.test.ts`. Same day: the decision log, the shared-evidence architecture doc, the conversation synthesis, and **two implementation handoffs** telling a coding agent to wire the lifecycle in.
6. **2026-11-24** — heavy documentation churn (`6d17b7e`…`c0f4b34`), skill-scan workspace added (`5034af0`) and then "reconciled", the 2026-11-24 re-analysis report, local scan runtime state removed twice (`206f7b4`, `315e92d`).
7. **2026-11-25** — HEAD adds `docs/gpt/`, `docs/opencode/` session logs, and 14 MB of `graphify-out/`.

### 10.2 Observations

- **Commit types are dominated by docs**: 59 `docs:` subjects vs roughly 35 feat/fix/ci/chore subjects across 149 commits.
- **Major architecture exists only on this analysis line.** The lifecycle contracts landed 2026-11-23 in a documentation-heavy branch. The local history contains no `main` ref, so whether `main` has them is **UNKNOWN** from this worktree. `docs/skill-scan/REANALYSIS-2026-11-24.md` §1 names a baseline branch `doc/skill-scan-analysis` and states the analysis branch is "1 commit ahead of main" — consistent with lifecycle code being merged before this branch, but unverified here.
- **The last two commits are the least architectural**: session transcripts plus a stale code-graph dump, added on top of an audit branch.
- **Contradiction inside the history**: the commits that removed local runtime state (`206f7b4`, `315e92d`) are followed by a commit that adds `graphify-out/cache` and session logs.
- **No release for broker or lifecycle work**: `CHANGELOG.md` stops at 0.1.5 (2026-11-18); `.release-please-manifest.json` agrees; nothing tags the Phase 8 slice.
- **Declared branch in the 2026-11-23 handoff** (`docs/shared-evidence-self-improvement`, PR #21) does not appear in this worktree's history by name; PR/merge metadata available locally is limited to two merge commits (#17, #19).

---

## 11. CI / CD and configuration audit

| Item | State | Assessment |
|---|---|---|
| `package.json` (root) | private, pnpm 10.33.2, Node ≥ 20; scripts: `build`, `typecheck`, `lint`, `test`, `check`, `check:ci` (adds `pnpm audit --prod --audit-level=high`), `ezy`, `dev:ezy`, `skills:*` | Consistent with `docs/CI.md` |
| `pnpm-workspace.yaml` | `apps/*`, `packages/*` | Matches the layout |
| `tsconfig.base.json` | ES2022/NodeNext, `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, declarations, source maps | Strong |
| `tsconfig.json` (root) | solution file, references both packages | Fine |
| `packages/core/tsconfig.json`, `apps/cli/tsconfig.json` | composite, `exclude: src/**/*.test.ts` | **Tests are never typechecked** — why invalid fixtures survive (§8.4) |
| `tsconfig.eslint.json` | includes tests, `eslint.config.js`, `vitest.config.ts` | Lint sees tests, but type mismatches are not lint errors |
| `eslint.config.js` | strictTypeChecked + stylistic; ignores `docs/handoff/**`, `docs/skill-scan/**`, `graphify-out/**`, `.agents/**` | Consistent with intent |
| `vitest.config.ts` | includes `packages/**`, `apps/**`, `tests/**` | `tests/` does not exist (harmless, but stale) |
| `.github/workflows/ci.yml` | build → lint → typecheck → test → `pnpm audit` on push to main and every PR, Node 22, `--frozen-lockfile` | Matches `docs/CI.md` and `skills/ci-before-push` |
| `.github/workflows/codeql.yml` | JS/TS security-and-quality, weekly cron, ignores `.agents` | Fine; **does not ignore** `docs/skill-scan` (427 HTML / 429 JSON files of third-party content are analyzed) |
| `.github/workflows/release-please.yml` | GitHub releases only | Matches "publishing is a maintainer action" |
| `release-please-config.json` + manifest | root + `packages/core` + `apps/cli`, component tags, workspace plugin, all at 0.1.5 | Consistent |
| `.gitignore` | ignores `node_modules`, `dist`, `coverage`, `.env*`, `.agents/skills`, `.claude/skills`, `.cursor/skills`, `.ezy/`, `.qwen/*`; **`#graphify-out/` and `# skill-scan/*` are commented out** | The commented-out lines are the mechanism by which 238 MB of artifacts are tracked |
| Environment/config handling | No `.env` usage; `BUILDER_SKILLS_HOME`, `MAKE_IT_EZY_ROOT`, `SKILL_EVAL_*` read by scripts/docs; `process.env` passed wholesale to the install child (`install.ts:120`) | Simple; env passthrough broader than needed |
| Package metadata | Both packages public-access config, Node ≥ 20, MIT, repository directories | Ready for npm, not yet published |

### 11.1 Configuration vs architecture

Configuration is **clean and disciplined**; it is the best-maintained part of the repository. The one architectural mismatch is that the ignore policy no longer reflects the artifact policy documented in `BUILDER-SKILLS.md`.

---

## 12. Security / privacy audit

No exploit was attempted. Findings are static.

| # | Surface | Risk | Evidence |
|---|---|---|---|
| S1 | **Install command construction** | `npx skills add <source> --skill <name>` is built from user/CLI-supplied strings with **no validation and no `--` separator**. A name beginning with `-` becomes a flag; `../x` escapes `.agents/skills`; `source` can be any token. `spawn` without a shell blocks *shell* injection but not argument injection. Also **`npx skills` is unpinned**, so every install fetches and executes the current npm package. | `install.ts:30-36`, `:120`; audit finding 6 still open |
| S2 | **Untrusted skill text reaches the terminal on `inspect`** | `inspectSkill` returns raw `description`, raw relative file names, and a raw 12-line body preview; `formatInspect` prints all three. A malicious local `SKILL.md` or a file named with an ANSI/OSC sequence can rewrite the terminal, change the window title, or hide text. Finding 1 of the 2026-11-07 audit was fixed for `search`/`plan` only. | `inspect-skill.ts:230-247`; `format.ts:157-184`; `AGENTS.md` trust paragraph admits "inspect/format may still need defense-in-depth" |
| S3 | **Raw conversation exports in a public repository** | `docs/convo/` holds 11 transcripts (~1.1 MB), including a 280 KB project conversation and a 304 KB video-summary dump. These routinely contain personal context, names, and possibly pasted configuration. The repository's own handoff (§10) calls this out as a live public-repo privacy issue and asks for a remediation decision. **Their full contents were not read for this audit**; whether credentials are present is **UNKNOWN**. | `docs/handoff/CLAUDE-IMPLEMENTATION-COMMAND-REVIEW-FIX-PASS-2026-11-23.md:§10`; `git log -- docs/convo` |
| S4 | **Third-party content and session logs committed** | `docs/skill-scan/skill-eval/` contains 429 JSON + 427 HTML evaluator reports and third-party `BENCHMARK.md` files from `alirezarezvani/claude-skills`, plus a 4.1 MB `skill-catalog.json`. Redistribution terms are unknown, CodeQL scans it, and `docs/opencode/` adds ~4,100 lines of agent session logs. | `find docs/skill-scan/skill-eval -name "*.json" | wc -l` = 429; `docs/opencode/*` |
| S5 | **No verification after install** | `runInstall` trusts exit code 0. Nothing compares the installed tree to `skills-lock.json` hashes even for pinned builder skills; nothing scans what was written. | `install.ts:112-160` |
| S6 | **Provenance is a string** | A skill's "source" is whatever `skills-lock.json` says or what skills.sh returns, sanitized only for control characters. There is no commit pin, license, or hash check in the recommendation path. | `load-local-skills.ts:59-63`; `inspect-skill.ts:236-240` (hash displayed only) |
| S7 | **Network egress is silent by default** | `search`, `recommend`, `plan`, `next`, `install` and even `install --plan/--query` contact skills.sh unless `--local-only` is passed; `install` drops the flag entirely. The query (user intent) is sent in a URL. | `plan.ts:122`; `search-remote.ts:52`; `apps/cli/src/index.ts` `parseInstallArgs` |
| S8 | **Builder bootstrap can execute remote code** | `scripts/bootstrap-global-skills.mjs` runs `npx skills install -y` inside the global home when the lock changes, downloading 52 external skill trees. It is documented, but `pnpm skills:install` (a normal contributor step) triggers network + third-party content automatically. | `scripts/bootstrap-global-skills.mjs:60-70` |
| S9 | **Brain file write path** | `saveBrainFile` creates `.ezy/` and writes JSON; if `.ezy` is a symlink to an attacker-chosen path, `mkdirSync(recursive)` + write follows it. Low practical risk (local-only tool), noted for completeness. | `brain.ts:213-221` |
| S10 | **Env passthrough to child process** | `spawn(..., { env: process.env })` gives the `npx` child every environment variable, including any local secrets. | `install.ts:120` |
| S11 | **Prompt-injection surface in handoff** | The handoff prompt embeds requirement labels, reasons, research findings and skill names derived from untrusted brief/skill content. `sanitizeText` strips control characters but not instruction-like text; the prompt is then pasted into a host agent. The repo states this is untrusted, but there is no delimiter beyond a markdown code block. | `handoff.ts:120-200`; `format.ts:400-420` |
| S12 | **Telemetry** | None. No analytics, no identifiers, no persistence beyond `.ezy/brain.json` (gitignored). Evidence contracts are local-only and never emitted. | Whole-tree inspection |

### 12.1 What is genuinely safe by design

- No shell interpolation (`spawn` array args; `execFileSync` with fixed args).
- Brief and Brain inputs are validated with explicit limits and control-character stripping.
- Installs require approval; the CLI refuses non-TTY installs without `--yes`.
- No credential handling, no key storage, no server, no database.

---

## 13. Missing capabilities

### 13.1 Expected by authoritative docs, absent from the implementation

| Capability | Expected by | Status |
|---|---|---|
| Skill trust/evaluation gate between discovery and recommendation | `MAKE-IT-EZY-HANDOFF.md` §6–§11, `SECURITY-MODEL.md`, `CAPABILITY-MODEL.md`, both 2026-11-23 handoffs | Contract exists (`evaluateSkillCandidate`), **no integration** |
| Intent clarification as a planning boundary | `CONVERSATION-SYNTHESIS-2026-11-22.md` §10, `CODING-AGENT-INSTRUCTION…` §3 | Contract exists, **unused** |
| Skill specification / composition in handoff | `CODING-AGENT-INSTRUCTION…` §5 | Contract exists, **unused** |
| Outcome verification (PASS/FAIL/UNCERTAIN) after execution | `ROADMAP.md` Phase 9, synthesis §11 | Contract exists, **unused**; execution itself absent |
| Skill catalog / labor pool | Broker spec §Catalog ("necessary") | **Missing** (`catalog/` empty) |
| Trust registry keyed by content hash | `SECURITY-MODEL.md`, `SHARED-EVIDENCE-LEARNING.md` | **Missing** (hash recorded, never checked) |
| Performance registry / shared evidence service | `SHARED-EVIDENCE-LEARNING.md` | Explicitly future; aggregation helper exists |
| Token/context-cost awareness in ranking | 2026-11-07 audit theme A, handoff §31 | **Missing** (only a `contextCost` field in an unused type) |
| Detection of existing agent config (`.claude/`, `CLAUDE.md`, `.mcp.json`) | audit theme F | **Missing** |
| Version/content-hash pinning at recommendation time | audit theme D | Hash stored and displayed, **never verified** |
| Non-JS project markers (`pyproject.toml`, `go.mod`, `Cargo.toml`) | audit finding 8; roadmap "Python next" | **Missing** |
| Broader GitHub discovery beyond skills.sh | Broker spec (marked Future) | **Missing, explicitly deferred** |
| Version awareness / update activity in evidence | handoff §33 | **Missing** |
| Trusted-auto installs, Soft-C spawning, Web UI | ROADMAP "deliberately not scheduled" | **Deferred by decision** |

### 13.2 Implemented but undocumented (or barely documented)

| Capability | Documentation state |
|---|---|
| Whole lifecycle contract module | Absent from `AGENTS.md` and `skills/ezy/SKILL.md`; described only in architecture docs and two handoffs |
| `ezy install --query` | In `HELP` and MVP spec; absent from README quick start |
| Project Brain fingerprint + `lastPlan` digest + staleness helper | Only implied by "machine slice"; `isBrainStale` is never used, so staleness is never surfaced |
| Brain agent-slice schema/limits (10 entries, 200 chars, graphify block) | `brain enrich` prints it; docs describe it loosely |
| Canned "not needed" heuristics ("multi-agent swarm", "vector database") | Not documented anywhere as behaviour |
| Non-coding lexicon entries (video, structural engineering, SEO, research) | Contradicts "coding tasks only" framing; no doc mentions them |
| `--source` inference from search when installing | Mentioned in audit docs, not in user docs |
| `search --remote-only` | Option exists in core, no CLI flag |

### 13.3 Classification

- **Intentional future work:** trust registry, shared evidence service, GitHub discovery, Web UI, Soft-C, trusted-auto, deep verification.
- **Deferred by phase decision:** outcome verification (Phase 9), the full execution loop.
- **Accidental omissions:** catalog implementation, lifecycle wiring, `.qwen/settings.json`, `tests/` directory, non-JS markers, `--local-only` on install, flag validation.
- **Architectural gaps:** no execution/host-integration contract at all; no representation of skill *sets* inside `SkillHit`; two competing definitions of "recommended".

---

## 14. Contradictions

Each item includes evidence. This section is deliberately separate from §6 so the contradictions are countable and citable (C-numbers are referenced from §15 and §16).

**C1 — Broker workflow: shipped or not shipped?**
`docs/MVP-SPECIFICATION.md:69` heading: "Broker workflow (approved — **not in CLI output yet**)". Line 74 of the same file: "**Shipped (first slice):** … `ezy next` prints an ordered **Workflow** section". Code: `handoff.ts:86-130` and `format.ts:363-386` produce exactly that. **Two statements in one file, 5 lines apart; the code sides with line 74.**

**C2 — Is the catalog necessary?**
Broker spec: "The catalog is necessary: it is Ezy's searchable labor pool…". `docs/architecture/ARCHITECTURE.md:51`: "catalog/ — reserved (empty)". Filesystem: `catalog/.gitkeep` and no catalog code anywhere. **The approved design's central premise is unimplemented and simultaneously described as intentionally empty.**

**C3 — Is the lifecycle a settled boundary or unfinished work?**
`ARCHITECTURE.md:47`, `CAPABILITY-MODEL.md:37`, `HOW-IT-WORKS.md`: contracts exist and are deliberately not a runtime pipeline. `CLAUDE-IMPLEMENTATION…:41-47,§3-§5`: the evaluator "must not remain a dead contract", clarification must be "a real boundary", `SkillSpec` must "become useful". `AGENTS.md`: silent. **Three positions in one repository.**

**C4 — Does this repo have a `.qwen/settings.json`?**
`AGENTS.md:106` links to it; `AGENTS.md:108` says "This repo's `.qwen/settings.json` sets 15 m request / 10 m stream-idle and `tools.shell.defaultTimeoutMs` 300000". `.gitignore:20` ignores it and the directory does not exist. **A configuration value is documented as present that the repository refuses to track.**

**C5 — "Repo size honest" vs 238 MB of committed artifacts.**
`docs/BUILDER-SKILLS.md` "Why": keep GitHub language stats and repo size honest; vendored skills are not in git. Reality: `docs/skill-scan` 224 MB + `graphify-out` 14 MB are tracked (`.gitignore` lines for both are commented out). **The stated policy and the ignore file disagree.**

**C6 — "graphify-out is stale" vs committing it.**
`docs/superpowers/plans/2026-11-18-broker-workflow.md` Global Constraints: "The graphify-out graph is stale (built Nov 6); verify all code details against current sources." HEAD commit `c06b9f7` adds a *new* `graphify-out/` snapshot and 613 cache files. **The plan warns against trusting the artifact that the branch then commits.**

**C7 — "No raw transcripts as authority" vs adding raw transcripts.**
`AGENTS.md`: do not reconstruct direction from conversation exports. `docs/decisions/`: prefer structured knowledge over a raw-chat archive. HEAD: adds `docs/opencode/Session-11-23-2026.txt/.md`, `logs/phase-00.md` (980 lines), `logs/phase-1.md` (713 lines), `2.txt`. **Policy and commit trail disagree.**

**C8 — Tests describe a type the product cannot produce.**
`SkillSourceKind = "local" | "skills.sh"` (`search-types.ts:1`), yet `plan.test.ts:13`, `handoff.test.ts:102,151` use `sourceKind: "remote"` and `plan.test.ts`'s `hit()` omits the required `id`. Because both package tsconfigs exclude `*.test.ts`, `pnpm typecheck` cannot catch it. **Tests and production disagree about the domain model, and CI is configured not to notice.**

**C9 — The audit says findings 5–10 are "optional maintenance"; the product status says "launch".**
`AGENTS.md`, `ROADMAP.md`, `README.md` all call Phase 8 launch current. Findings 5–10 are all still reproducible: 80 s sequential network loop (`plan.ts:122` + `search-remote.ts:34`), unvalidated install args (`install.ts:30-36`), junk heuristic requirements (`capabilities.ts:100-110`), JS-only markers (`find-project-root.ts:4`), silently ignored flags (`index.ts` flag sets), dead `skipHints` (`requirements.ts:114`). **"Launch-ready" and "known unfixed defects" are both asserted.**

**C10 — README presents two different products.**
Scope says "today, Ezy targets coding tasks in your repo". The context-router section promises "what does that stack need to know, so the next agent doesn't rediscover the whole repo" — which the code supports only by writing a project snapshot that nothing reads (`brain.ts` write path; `plan.ts` never loads it). **The "context router" half of the product is advertised, not routed.**

**C11 — `docs/handoff/README.md:25` says the MVP spec is "through Phase 7"** while `MVP-SPECIFICATION.md` contains a Phase 8 section and the broker slice. **Stale cross-reference.**

**C12 — Phase 8 heading structure.**
`ROADMAP.md:84-91`: the `### Lifecycle contract slice` block is inserted between the `## Phase 8` heading and the orphaned ` (**current**)` marker, so the phase's body now starts with lifecycle contracts and the "(current)" label attaches to nothing. **A reader cannot tell what Phase 8 is.**

**C13 — Two conflicting definitions of "recommended".**
`ezy recommend` recommends any hit with `score ≥ 6` (or installed) up to 3, regardless of requirement coverage. `ezy plan`/`next` recommends only skills that cover a requirement (greedy), up to 8. The same word means two different sets depending on the command, and `install --query` vs `install --plan` therefore produce different candidate lists for the same topic. **Undocumented behavioural inconsistency.**

**C14 — `AGENTS.md` tells agents to read `.agents/skills/...` files that a clean checkout does not contain**, while `CONTRIBUTING.md`'s doc-sync list and `docs/CI.md` assume `.claude/skills` / `.cursor/skills` exist. They are all created by a script that requires network access. **Instruction prerequisites are not stated at the point of use.**

---

## 15. Findings

Every finding below was verified against the current tree. Where a claim could not be verified it is marked UNKNOWN.

Findings are listed in discovery order. Each carries a stable `F-` ID; §16 is the ID index, and §17–§18 cite these IDs.

---

### Finding: Lifecycle contracts are implemented, exported, tested — and never called

**ID:** F-01

**Severity:** HIGH
**Category:** Architecture / Runtime
**Status:** Implemented but unused

**Evidence:**
- `packages/core/src/lifecycle.ts` (252 lines): `buildIntentIntake`, `evaluateSkillCandidate`, `composeSkillSpec`, `evaluateOutcome`, `aggregateEvidence`, `proposeImprovement`
- `packages/core/src/lifecycle-types.ts` (122 lines)
- `packages/core/src/index.ts:112-135` re-exports all six functions and twelve types
- `packages/core/src/lifecycle.test.ts` (7 tests)
- `grep -rn "lifecycle" apps/` → **no matches**
- `packages/core/src/plan.ts:66-205` (`planOutcome`) imports and calls none of them
- `packages/core/src/handoff.ts` calls none of them

**What actually happens:**
The entire lifecycle module is a library of pure helpers with one consumer: its own test file. No CLI command, planner branch, selector, inspect step or handoff step invokes intake, evaluation, composition, outcome evaluation, aggregation or proposals. A plan is still produced by the pre-lifecycle path `analyze → requirements → search → score → select → handoff`.

**What should happen:**
Two documents in the repository state incompatible intentions. `docs/architecture/ARCHITECTURE.md:47` and `docs/architecture/CAPABILITY-MODEL.md:37` say the contracts are deliberately a boundary and not a runtime pipeline. `docs/handoff/CLAUDE-IMPLEMENTATION-COMMAND-REVIEW-FIX-PASS-2026-11-23.md:41-47` and `docs/handoff/CODING-AGENT-INSTRUCTION-MISSING-EZY-CAPABILITIES-2026-11-23.md:8` say the evaluator "must not remain a dead contract or helper" and that clarification/spec composition must be wired in. The repository must pick one and rewrite the other.

**Impact:**
The product's advertised differentiator — "trustworthy capability selection" — has no runtime. Any consumer reading `docs/handoff/MAKE-IT-EZY-HANDOFF.md` §6–§11 will believe a trust/security gate exists. Any agent asked to "continue the lifecycle work" will implement a second path next to an existing planner.

**Confidence:** HIGH

---

### Finding: No trust, security, quality or compatibility gate in the recommendation path

**ID:** F-02

**Severity:** HIGH
**Category:** Architecture / Security
**Status:** Missing

**Evidence:**
- `packages/core/src/plan.ts:118-140`: hits are collected then passed straight to `scoreCandidates`
- `packages/core/src/select.ts:100-160`: selection filters only on requirement coverage and name-token exclusions
- `packages/core/src/recommend.ts:60-85`: buckets by numeric score and install count
- `packages/core/src/inspect-skill.ts` is reachable only from `ezy inspect`
- docs claiming the gate: `docs/architecture/SECURITY-MODEL.md` ("Hard Security Gate" is in `MAKE-IT-EZY-HANDOFF.md` §9), `docs/architecture/CAPABILITY-MODEL.md`

**What actually happens:**
A skill discovered on `skills.sh` with a matching keyword and any install count can appear in `Recommended` in the same run, with no provenance check, no review state, no security scan, no compatibility check, and no overlap detection. The only signals are keyword overlap, local-vs-remote, and installs.

**What should happen:**
Per the repository's own documents, discovery must not equal recommendation, and a candidate must carry an explicit review/evaluation state (eligible / review / rejected) with reasons before it is recommended.

**Impact:**
This is the repository's own stated core promise and its primary differentiator versus plain skill search. Today `ezy plan` is a ranked search with set-cover, not a trust decision. Users can be nudged toward unvetted external code with no visible evidence gap.

**Confidence:** HIGH

---

### Finding: `ezy inspect` prints unsanitized untrusted skill content

**ID:** F-03

**Severity:** HIGH
**Category:** Security
**Status:** Partial (finding 1 of the 2026-11-07 audit fixed only on the search path)

**Evidence:**
- `packages/core/src/inspect-skill.ts:236-247` returns `description: fm.description` (raw) and `bodyPreview` (raw slice of `SKILL.md`)
- `packages/core/src/inspect-skill.ts:44-140` `listSkillFiles` returns raw file names
- `packages/core/src/format.ts:157-184` prints `report.description`, every `report.files` entry and `report.bodyPreview` with no sanitization
- Sanitization exists and is applied elsewhere: `packages/core/src/brief.ts:51` (`sanitizeText`), used in `load-local-skills.ts:57-60` and `search-remote.ts:59-60`
- `AGENTS.md` trust paragraph already admits "inspect/format may still need defense-in-depth"
- `packages/core/src/inspect-skill.test.ts` does not test control characters in any of these fields

**What actually happens:**
Running `ezy inspect <skill>` on a malicious or careless local skill can emit ANSI/OSC control sequences from the skill's `description`, its file names, or its first twelve body lines. The 2026-11-07 audit demonstrated this exact class of attack ("a test skill changed the window title and the text colour") and fixed it only for `search`/`plan` output.

**What should happen:**
Sanitize every field that crosses from untrusted skill content to the terminal, including file names and body previews, at load time (not at format time) so later formatters cannot forget.

**Impact:**
The command whose entire purpose is "inspect before you trust" is itself the highest-risk rendering surface. It is also the command an agent is told to run before installing anything.

**Confidence:** HIGH

---

### Finding: Install command is built from unvalidated input and runs an unpinned `npx`

**ID:** F-04

**Severity:** HIGH
**Category:** Security
**Status:** Missing (audit finding 6, still open)

**Evidence:**
- `packages/core/src/install.ts:30-36` `buildCommand` → `["skills", "add", source, "--skill", skillName]`
- `packages/core/src/install.ts:120` `spawn(command, args, { cwd, env: process.env })`, no shell, no validation, no `--` separator
- `packages/core/src/install.ts:47-52` destination is `join(skillsDir(projectRoot), name)`
- `docs/audits/2026-11-07-codebase-gaps.md` finding 6 explicitly recommends `^[\w.-]+/[\w.-]+$` for source and `^[a-z0-9][\w.-]*$` for name, plus pinning `skills@<version>`
- No test asserts rejection of malformed names (`install.test.ts` only covers the happy paths)

**What actually happens:**
`ezy install "../evil" --source x` produces `npx skills add x --skill ../evil`; a name beginning with `-` is parsed as a flag by the child; `npx skills` resolves the latest published package on every run.

**What should happen:**
Validate source and skill name against explicit patterns, reject leading `-` and path traversal, insert `--` before positionals, and pin the installer version. The repository already documented this fix.

**Impact:**
Argument injection into a third-party installer, writes outside `.agents/skills`, and supply-chain exposure on every install. It is the only place in the product that executes external code, and it is the least validated.

**Confidence:** HIGH

---

### Finding: 238 MB of generated artifacts and third-party content are committed

**ID:** F-05

**Severity:** HIGH
**Category:** Duplication / Configuration / Licensing
**Status:** Implemented (unintentionally as source of truth)

**Evidence:**
- `docs/skill-scan/` = 224 MB, 1,287 tracked files: 429 JSON, 427 HTML evaluator reports, 4.1 MB `skill-catalog.json`, third-party `BENCHMARK.md` files from `alirezarezvani/claude-skills`
- `graphify-out/` = 14 MB, 622 tracked files including 5.4 MB `graph.json` and 613 cache files, added in HEAD `c06b9f7`
- `.gitignore:9` contains a **commented-out** `#graphify-out/`; `.gitignore:22-23` contains a commented-out `# skill-scan/*`
- `docs/BUILDER-SKILLS.md` "Why" section states the repo deliberately avoids vendoring artifacts to keep repo size and language stats honest
- `docs/superpowers/plans/2026-11-18-broker-workflow.md` Global Constraints: "The graphify-out graph is stale (built Nov 6)"
- `docs/skill-scan/README.md` says the workspace "is **not part of the Ezy runtime**"

**What actually happens:**
Four-fifths of the tracked index and virtually all repository weight are a one-off research run and a stale graph dump. They are excluded from ESLint, are still scanned by CodeQL (`codeql.yml` ignores only `.agents`), and contain third-party content whose redistribution terms are unknown.

**What should happen:**
Per the repository's own artifact policy, generated evaluation output and graph caches belong outside git (or as a small summary + a pinned, reproducible run recipe).

**Impact:**
Clone/checkout cost, review noise (any repository diff is dominated by generated files), licensing ambiguity for redistributed third-party benchmark files, and a false signal about project size and scope. It also directly contradicts the documented hygiene principle.

**Confidence:** HIGH

---

### Finding: Raw conversation exports remain in a public repository

**ID:** F-06

**Severity:** HIGH
**Category:** Security / Privacy
**Status:** Unresolved (self-flagged, not remediated)

**Evidence:**
- `docs/convo/` 11 files, ~1.1 MB: `make-it-ezy convo.txt` (280 KB), `1 - Video_Summary_and_Skills.md` (304 KB), `2 - Compare_Agents_Skills_Tools.md` (148 KB), `3 - Multi_Agent_Group_Chat_Setup.md` (104 KB), plus 7 more
- `docs/handoff/CLAUDE-IMPLEMENTATION-COMMAND-REVIEW-FIX-PASS-2026-11-23.md` §10: "The repository is public again… Those files contain raw historical conversation exports and are not appropriate as a public source-of-truth architecture surface… identify exactly what should be removed/sanitized; check whether any sensitive material is present"
- `docs/handoff/README.md` and `docs/audits/2026-11-07-codebase-gaps.md` call them non-authoritative
- `git log -- docs/convo` shows they were "segregated" and updated as recently as 2026-11-23 (`1796936`), not removed

**What actually happens:**
Raw AI conversations — which routinely contain personal context, machine paths, pasted config and half-formed credentials — are distributed with the source. The repository knows this and has an open instruction to assess it.

**What should happen:**
Follow the repo's own remediation options: audit for sensitive material, then either remove from the current tree with a documented history decision, or replace with a distilled, reviewed summary. Do not treat transcripts as architecture.

**Impact:**
Irreversible exposure risk if a transcript contains a key, token, customer name or file path tied to a person. Also a legal/consent issue for third-party conversation content. Their full contents were **not** read for this audit, so whether secrets are present is **UNKNOWN**.

**Confidence:** HIGH (presence and policy conflict); UNKNOWN (secret content)

---

### Finding: Tests construct a domain model the production types forbid, and CI cannot see it

**ID:** F-07

**Severity:** MEDIUM
**Category:** Testing
**Status:** Contradicted

**Evidence:**
- `packages/core/src/search-types.ts:1` `SkillSourceKind = "local" | "skills.sh"`
- `packages/core/src/search-types.ts:2-13` `SkillHit.id` is required
- `packages/core/src/plan.test.ts:10-21` `hit()` returns `sourceKind: "remote"` and omits `id`
- `packages/core/src/handoff.test.ts:102,151` inline fixtures use `sourceKind: "remote"`
- `packages/core/tsconfig.json` and `apps/cli/tsconfig.json` both `exclude: ["src/**/*.test.ts"]`
- `package.json` `typecheck` = `pnpm -r exec tsc -p tsconfig.json --noEmit` (per package, so tests are skipped)
- `tsconfig.eslint.json` includes tests, but type mismatches are not ESLint errors

**What actually happens:**
The suite asserts behaviour against an object shape that the type system rejects. `pnpm typecheck` and `pnpm build` pass because tests are excluded; ESLint runs type-aware rules but does not fail on the mismatch. The tests are therefore not type-safe evidence about the production model.

**What should happen:**
Either test files should be typechecked (a separate tsconfig for tests included in `typecheck`), or fixtures should be built through a shared factory using the real union.

**Impact:**
A field rename or union narrowing in production will silently leave tests passing against stale shapes; test failures/false-passes will not correlate with production correctness. It also means the repository's "strict TypeScript" claim stops at the `src/` boundary.

**Confidence:** HIGH

---

### Finding: The broker catalog does not exist, yet the approved design calls it necessary

**ID:** F-08

**Severity:** MEDIUM
**Category:** Architecture / Documentation
**Status:** Missing

**Evidence:**
- `catalog/.gitkeep` only; `git ls-files catalog` → 1 file
- `docs/superpowers/specs/2026-11-18-broker-orchestrated-skills-design.md` §Catalog and discovery: "The catalog is necessary: it is Ezy's searchable labor pool of known skills… The catalog should distinguish discovered candidates from evaluated/recommended skills"
- `docs/architecture/ARCHITECTURE.md:51` "catalog/ reserved (empty)"
- `packages/core/src/contractors.ts:22-32` hard-codes a single contractor

**What actually happens:**
"Broker routing" is one `if` on `brief.taskType` that appends a constant `SUPERPOWERS_CONTRACTOR`, plus a workflow builder that orders recommended skills after it. There is no pool of known specialists, no catalog lookup, no candidate metadata, no distinction between discovered and evaluated entries.

**What should happen:**
Either implement a minimal catalog representation (even a typed in-memory table of known skills/contractors with capability roles and review state), or rewrite the design to say that discovery is the only pool and contractors are a fixed built-in list.

**Impact:**
The phase's headline feature is substantially smaller than described; planning around "catalog coverage" (an explicit roadmap task for adding domains) has no target to extend.

**Confidence:** HIGH

---

### Finding: Project Brain is written, displayed, and never read by planning

**ID:** F-09

**Severity:** MEDIUM
**Category:** Architecture / Documentation
**Status:** Partial

**Evidence:**
- Written: `packages/core/src/plan.ts:203` `persistBrainAfterPlan(cwd, report)`; `brain.ts:334-360`
- Refreshed: `brain.ts:300-325` `refreshBrainProject`
- Read only for display: `apps/cli/src/index.ts:432-455` (`ezy brain`)
- `planOutcome` reads `analyzeProject` and `loadLocalSkills`, never `loadBrainFile`
- `isBrainStale` (`brain.ts:65`) is exported and tested, never called → staleness is never surfaced
- `docs/MVP-SPECIFICATION.md:64` correctly says "Does not drive planning in v1"
- `README.md` context-router section and `HOW-IT-WORKS.md` step 6 imply the brain reduces rediscovery for the next agent

**What actually happens:**
Every `plan`/`next` overwrites `.ezy/brain.json` with a project snapshot and a digest of the last plan. Nothing consumes it: the next plan re-runs `analyze` and re-reads `.agents/skills` from scratch. The agent slice is printed by `ezy brain` but never injected into a handoff prompt or used to suppress rejected skills.

**What should happen:**
Given the MVP spec, either keep it explicitly as a human-readable/agent-readable cache and stop presenting it as a routing input, or consume it in `plan` (at minimum: honor `agent.rejectedSkills` and the last plan digest).

**Impact:**
The "context router" half of the product statement is not routed. Users will reasonably expect `.ezy/brain.json` to change recommendations; it cannot. `isBrainStale` existing without a caller means staleness detection is dead.

**Confidence:** HIGH

---

### Finding: `plan`/`next` can block for up to ~80 seconds on sequential network calls

**ID:** F-10

**Severity:** MEDIUM
**Category:** Runtime / Performance
**Status:** Missing (audit finding 5, still open)

**Evidence:**
- `packages/core/src/plan.ts:19` `MAX_QUERIES = 10`
- `packages/core/src/plan.ts:118-127` `for (const query of queries) { await searchSkills(...) }` — strictly sequential
- `packages/core/src/search-remote.ts:34` `timeoutMs ?? 8000`
- `docs/audits/2026-11-07-codebase-gaps.md` finding 5 recommends `Promise.all` or short-circuiting after the first failure
- No test covers timing or early abort

**What actually happens:**
A ten-requirement brief against a slow/down skills.sh issues ten sequential requests, each with an 8 s abort, so a `plan` can take ~80 s before printing local results it already had. Local results are computed before the first request but are not rendered until the loop ends.

**What should happen:**
Parallelize with a shared deadline, and/or stop querying after the first network failure (the CLI already prints "remote unavailable" notes).

**Impact:**
This is the default path (`--local-only` is opt-in), triggered by the brief flow the adapter tells agents to use. A hung plan reads as a broken CLI and is the most likely first-run experience on a flaky network.

**Confidence:** HIGH

---

### Finding: The heuristic (no-brief) path manufactures junk requirements

**ID:** F-11

**Severity:** MEDIUM
**Category:** Runtime / Quality
**Status:** Partial (audit finding 7, still open)

**Evidence:**
- `packages/core/src/capabilities.ts:100-110` fallback: "use distinctive tokens as pseudo-capabilities" (stopword list is only 12 words; `make`, `better`, `add` survive)
- `packages/core/src/requirements.ts:79-110` builds a `Requirement` per label with `searchTerms: [label.toLowerCase()]`
- `requirements.test.ts:96` asserts `extractRequirements("xyzzy plugh")` **must** return requirements
- `docs/audits/2026-11-07-codebase-gaps.md` finding 7 recommends returning no requirements plus "run `ezy brief`"
- `lifecycle.buildIntentIntake` (clarification) is unused

**What actually happens:**
"make it better" yields requirements labelled with the raw tokens and searches skills.sh for them; the plan then reports confident-looking coverage or "no matching skills". The output never says "this outcome is too vague to plan".

**What should happen:**
When the lexicon misses, emit no requirements and an explicit instruction to run `ezy brief` (or invoke the existing clarification contract).

**Impact:**
The fallback path is the default for any user who does not use the adapter, and it produces plausible-looking plans built on noise. This is the mechanism by which the unused clarification contract is behaviourally contradicted.

**Confidence:** HIGH

---

### Finding: Non-JS ecosystems are classified as "greenfield"

**ID:** F-12

**Severity:** MEDIUM
**Category:** Runtime
**Status:** Missing (audit finding 8, still open)

**Evidence:**
- `packages/core/src/find-project-root.ts:4` `MARKERS = ["package.json", "pnpm-workspace.yaml", "turbo.json", "nx.json"]`
- `packages/core/src/requirements.ts:104-106` when `analysis.projectRoot` is null → rationale "Greenfield / no project markers"
- `docs/ROADMAP.md` Scope: "JS/TS projects first, Python next"
- `docs/audits/2026-11-07-codebase-gaps.md` finding 8 recommends `pyproject.toml`, `requirements.txt`, `go.mod`, `Cargo.toml`, `.git` fallback

**What actually happens:**
Running `ezy plan` inside a Python, Go or Rust project finds no root, reports "Greenfield / no project markers", and plans as if the repo were empty — including recommending scaffolding skills that conflict with the existing stack.

**What should happen:**
Treat common non-JS manifest files as project markers (even without full language support), so the plan says "existing project, language not yet supported" rather than "greenfield".

**Impact:**
The CLI actively gives wrong advice in the exact "next domain" scenario the roadmap claims will be added later, and it mislabels any non-JS repo today.

**Confidence:** HIGH

---

### Finding: Unknown flags are silently ignored

**ID:** F-13

**Severity:** MEDIUM
**Category:** Runtime / Configuration
**Status:** Missing (audit finding 9, still open)

**Evidence:**
- `apps/cli/src/index.ts:283-290, 305-315, 333-345, 389-395`: flags are collected into a `Set` and only specific members are read; everything else is discarded
- `apps/cli/src/index.ts:141-185` `parseInstallArgs`: `if (a.startsWith("--")) continue;`
- `docs/audits/2026-11-07-codebase-gaps.md` finding 9: `--local-ony` quietly goes to the network
- No test asserts rejection of unknown flags

**What actually happens:**
A typo (`--local-ony`, `--ye`, `--biref`) is treated as an unknown token: for `plan`/`next` it is dropped, so the command silently uses the network or ignores the intended brief. The user believes they changed behaviour and did not.

**What should happen:**
Exit non-zero with "unknown flag" for unrecognized `--flags`.

**Impact:**
Silent privacy/behaviour change (network when local-only was intended) and silent no-ops in the approval flow, on a CLI whose safety story depends on the user knowing what will run.

**Confidence:** HIGH

---

### Finding: `ezy install --plan/--query` ignores `--local-only` and sends the outcome to skills.sh

**ID:** F-14

**Severity:** MEDIUM
**Category:** Security / Runtime
**Status:** Undocumented divergence

**Evidence:**
- `apps/cli/src/index.ts:196-235` `resolveInstallTarget`: `planOutcome(parsed.plan, …)` and `recommendSkills(parsed.query)` are called with no options
- `apps/cli/src/index.ts:141-185` `parseInstallArgs` drops every unrecognized flag, including `--local-only`
- `HELP` documents `--local-only` for search/inspect/recommend/plan/next but not install
- `docs/MVP-SPECIFICATION.md` shows `install --plan` examples without `--local-only`

**What actually happens:**
`ezy install --plan "…" --local-only` issues network searches anyway. The flag is accepted syntactically and has no effect.

**What should happen:**
Either honor `--local-only` on install or reject it explicitly. Silent acceptance is the worst option.

**Impact:**
Users who deliberately avoid the network (offline, privacy, air-gapped) get network calls from the command they thought was local.

**Confidence:** HIGH

---

### Finding: Two different meanings of "recommended" between `recommend` and `plan`

**ID:** F-16

**Severity:** MEDIUM
**Category:** Architecture / UX
**Status:** Contradicted (undocumented)

**Evidence:**
- `packages/core/src/recommend.ts:20-33`: recommended = score ≥ 6 or installed/local, cap 3, coverage not considered
- `packages/core/src/select.ts:100-160`: recommended = requirement-covering greedy set, cap 8
- `apps/cli/src/index.ts:206-235`: `install --query` uses `recommendSkills`, `install --plan` uses `planOutcome` → different candidate lists for the same topic
- No document distinguishes them

**What actually happens:**
`ezy recommend "stripe"` and `ezy plan "add stripe"` produce different "recommended" sets with different size limits and different justifications, and the installer offers whichever list corresponds to the flag used.

**What should happen:**
Either document the two definitions distinctly (query-level relevance vs requirement coverage) or unify them behind one selection model.

**Impact:**
Inconsistent product behaviour that users will read as non-determinism, and a second selection algorithm to maintain.

**Confidence:** HIGH

---

### Finding: Remote search discards skill descriptions and double-counts the name in scoring

**ID:** F-19

**Severity:** LOW
**Category:** Runtime / Quality
**Status:** Partial

**Evidence:**
- `packages/core/src/search-remote.ts:62-70`: `description` is synthesized as `` `${name} from ${source}` ``, used for `scoreSkillText`, and then the emitted hit's `description` is overwritten with `` `Catalog hit from ${source}` ``
- `packages/core/src/search-remote.ts:1-10`: the response type models only `id/source/slug/skillId/name/installs` — no description field at all

**What actually happens:**
Every remote candidate is scored on its name plus its source string, and is displayed with a generic description. Real skill descriptions and summaries from skills.sh are never fetched or shown.

**What should happen:**
If the API exposes descriptions, map and sanitize them; if it does not, say so in output instead of presenting a synthetic description that looks like one.

**Impact:**
Ranking quality and inspectability of remote candidates are materially worse than the UI suggests; users cannot evaluate an unfamiliar skill from `ezy search` output.

**Confidence:** MEDIUM (depends on the unverified skills.sh response shape)

---

### Finding: `recommend`/`plan` "not needed" output is canned text presented as analysis

**ID:** F-20

**Severity:** LOW
**Category:** Runtime / Quality
**Status:** Implemented (misleading)

**Evidence:**
- `packages/core/src/recommend.ts:35-52` `notNeededForQuery`: emits "multi-agent swarm — overkill for a focused UI/design task" and "vector database — not required for skill discovery/recommendation" whenever the query contains `frontend|design|ui|ux`
- `packages/core/src/requirements.ts:47-54` `baseSkipHints`: same policy for plan exclusions
- `packages/core/src/requirements.ts:130-136` "Graphify — full codebase graph is overkill for a small UI change"
- `recommend.test.ts:70`, `requirements.test.ts:120-127` assert these strings as required behaviour

**What actually happens:**
The "Not needed" section is a hard-coded list unrelated to the candidates actually found. It reads as an editorial judgement about the user's query.

**What should happen:**
Derive exclusions from candidates rejected by coverage/exclusion logic, or label the section as a static heuristic.

**Impact:**
Users may infer the tool analysed and rejected these categories. It is the clearest example of output that looks more intelligent than the implementation.

**Confidence:** HIGH

---

### Finding: Skill pinning is recorded but never verified

**ID:** F-15

**Severity:** MEDIUM
**Category:** Security / Architecture
**Status:** Partial

**Evidence:**
- `skills-lock.json`: 52 entries with `source`, `skillPath`, `computedHash`, `installMode`
- `packages/core/src/load-local-skills.ts:41-46` reads only `source` (via `loadSkillsLock`)
- `packages/core/src/inspect-skill.ts:236-240` displays `computedHash` but does not recompute or compare it
- No runtime code computes a hash of a skill directory
- `docs/architecture/SECURITY-MODEL.md` and `SHARED-EVIDENCE-LEARNING.md` describe content-hash-based trust; both are documented as not shipped

**What actually happens:**
A skill directory can be edited or replaced after installation and every command will keep treating it as the pinned artifact. The hash exists only as provenance decoration in `inspect`.

**What should happen:**
Per the repo's own trust registry design: compute the artifact hash at load/inspect, compare with the lock, and surface drift as a review state.

**Impact:**
Provenance is asserted but not enforced; the one anti-tamper mechanism the design specifies is inert. This is the smallest possible implementation of the trust story (one hash comparison) and it is absent.

**Confidence:** HIGH

---

### Finding: Documentation contradicts itself on broker status and Phase 8 structure

**ID:** F-17

**Severity:** MEDIUM
**Category:** Documentation
**Status:** Stale / Contradicted

**Evidence:**
- `docs/MVP-SPECIFICATION.md:69` "Broker workflow (approved — **not in CLI output yet**)" vs `:74` "**Shipped (first slice):** … `ezy next` prints an ordered Workflow section"
- `docs/ROADMAP.md:84-91`: `### Lifecycle contract slice` inserted between `## Phase 8 — Launch and Distribution` and an orphaned ` (**current**)`
- `docs/handoff/README.md:25` "MVP … (through Phase 7)"
- `docs/architecture/README.md:17-19` "Key current documents" lists only two of six architecture docs
- `README.md:14` badge alt text "Phase 7 shipped" for a Phase 8 badge

**What actually happens:**
The two most-read status documents each contain a statement that is false at the time of reading, and the phase heading no longer says what the phase is.

**What should happen:**
Correct the broker heading, restore the Phase 8 heading/`(current)` relationship, refresh the two stale indexes and the badge alt text.

**Impact:**
Low direct runtime risk, high navigation cost: these are the files an agent or new contributor reads first, and `AGENTS.md` explicitly routes agents to them for "what exists today".

**Confidence:** HIGH

---

### Finding: `AGENTS.md` documents a `.qwen/settings.json` the repo does not contain

**ID:** F-23

**Severity:** LOW
**Category:** Documentation / Configuration
**Status:** Stale

**Evidence:**
- `AGENTS.md:106` links `[.qwen/settings.json](.qwen/settings.json)`
- `AGENTS.md:108` "This repo's `.qwen/settings.json` sets 15m request / 10m stream-idle and `tools.shell.defaultTimeoutMs` 300000"
- `.gitignore:20-21` ignores `.qwen/settings.json` and `docs/skill-scan/.qwen/settings.json`
- `ls .qwen` → does not exist
- `docs/skill-scan/REANALYSIS-2026-11-24.md` §5G records that the tracked Qwen settings were deliberately removed

**What actually happens:**
A concrete configuration value is documented as repository state, and the file the guide links to is guaranteed absent in every clone.

**What should happen:**
State the values as recommendations for the user's own `~/.qwen/settings.json`, not as repo content.

**Impact:**
Agents and users following the guide will look for a file that cannot exist, and may "fix" the repo by adding a file the ignore policy forbids.

**Confidence:** HIGH

---

### Finding: Unused exports and unused options accumulate in the public core surface

**ID:** F-21

**Severity:** LOW
**Category:** Duplication
**Status:** Unused

**Evidence:**
- `packages/core/src/index.ts:72-73` exports `searchSkillsSh`; `:80` `isBrainStale`; `:112-135` six lifecycle functions
- `packages/core/src/search.ts:11` `remoteOnly`
- `packages/core/src/contractors.ts:34` `SUPERPOWERS_TASK_TYPES` (not exported from index)
- `packages/core/src/requirements.ts:114-143` `skipHints`
- `packages/core/src/inspect-types.ts:1` `"unknown"` risk level never produced
- `packages/core/src/plan-types.ts:13` `decision: "skip"` never produced

**What actually happens:**
Core's public API advertises capabilities (staleness detection, lifecycle, remote-only search, skip hints) that no caller uses. `core` is a published package (`@make-it-ezy/core`), so these become semver commitments.

**What should happen:**
Either wire them or keep them internal to their modules until a caller exists.

**Impact:**
Contract surface larger than the product, harder to change later, and it makes the implementation look more complete than it is to anyone reading `index.ts` as documentation.

**Confidence:** HIGH

---

### Finding: `tests/` is referenced by Vitest config but does not exist

**ID:** F-24

**Severity:** LOW
**Category:** Configuration / Testing
**Status:** Stale

**Evidence:**
- `vitest.config.ts:5` `include: [..., "tests/**/*.test.ts"]`
- `ls tests` → no such directory
- No lifecycle or skill-system integration suite occupies that slot

**What actually happens:**
The configuration reserves a home for integration tests that was never created, while the only integration-style coverage lives in `apps/cli/src/cli.test.ts`.

**What should happen:**
Either add the integration suite the config anticipates (lifecycle wiring, install-gate, brain consumption) or drop the glob.

**Impact:**
Misleading signal about test architecture; minor.

**Confidence:** HIGH

---

### Finding: Research/session material is committed as if it were documentation

**ID:** F-18

**Severity:** MEDIUM
**Category:** Documentation / Hygiene
**Status:** Implemented (policy drift)

**Evidence:**
- `docs/opencode/`: `Session-11-23-2026.txt` and `.md` (980 lines each), `logs/phase-00.md` (980), `logs/phase-1.md` (713), `2.txt` (338)
- `docs/gpt/phase-2.md`, `phase-3.md`, `phase-4.md`, `phase-5.md`, `s.txt` — all 0 bytes
- `docs/ezy-routing/LOCAL-AI-MODEL-ROUTING.md` — orphan, not linked from `AGENTS.md`, `docs/architecture/README.md`, or `docs/decisions/README.md`
- `docs/decisions/README.md` and `docs/architecture/README.md` both say not to put transcripts/temporary tasks in those areas; `docs/opencode/` sits beside them at the same level
- HEAD commit `c06b9f7` adds these logs

**What actually happens:**
Agent session logs and empty placeholder files are part of the documentation tree, unlinked from the source-of-truth map, and indistinguishable from authoritative docs to a newcomer.

**What should happen:**
Keep session logs out of the repository (or under a clearly quarantined, gitignored directory), delete the empty placeholders, and either link or remove the routing reference.

**Impact:**
Documentation surface noise, review cost, and a second violation of the repo's own "no raw transcripts as authority" rule.

**Confidence:** HIGH

---

### Finding: Phase 8 is declared "current" while its own spec is "In progress" and no release exists

**ID:** F-25

**Severity:** LOW
**Category:** Documentation / Git
**Status:** Stale

**Evidence:**
- `docs/ROADMAP.md:7,84` Phase 8 current
- `docs/superpowers/specs/2026-11-18-phase8-launch-design.md:3` `**Status:** In progress`
- `CHANGELOG.md` latest entry 0.1.5 (2026-11-18), before broker (`bd6ce7a`, 2026-11-22) and lifecycle (`8e137de`, 2026-11-23)
- `.release-please-manifest.json` all 0.1.5
- `docs/superpowers/plans/2026-11-18-phase8-launch.md` has all tasks checked

**What actually happens:**
The phase plan says done, the spec says in progress, the roadmap says current, and no release contains the phase's architecture work.

**What should happen:**
Reconcile the three status markers; the spec is the one that has not been updated.

**Impact:**
Agents cannot tell whether Phase 8 work is closed; release notes will not mention the broker/lifecycle code when it eventually ships.

**Confidence:** HIGH

---

### Finding: `install` prints a handoff only after success, and only for plan/query paths

**ID:** F-26

**Severity:** LOW
**Category:** Runtime / UX
**Status:** Implemented (minor)

**Evidence:**
- `apps/cli/src/index.ts:255-275` `appendInstallHandoff` returns early for neither `plan` nor `query`
- Called only on `alreadyInstalled` (`:330`) and on `result.ok` (`:378`)
- A declined or failed install prints no next step

**What actually happens:**
After a failed install the user is left with a preview and an error, plus the generic `Next: ezy next "<outcome>"` line only on the already-installed path.

**What should happen:**
Consistent recovery guidance in all terminal states.

**Impact:** Minor UX gap; noted for completeness.

**Confidence:** HIGH

---

### Finding: No integration tests for lifecycle, trust-gate or clarification behaviour

**ID:** F-22

**Severity:** LOW
**Category:** Testing
**Status:** Missing

**Evidence:**
- `packages/core/src/lifecycle.test.ts` exercises only the six pure helpers; there is no test that goes through `planOutcome`, `buildHandoff` or the CLI
- `packages/core/src/requirements.test.ts:96` asserts that a nonsense outcome (`"xyzzy plugh"`) **must** yield requirements — the opposite of a clarification-refusal test
- No test references `evaluateSkillCandidate` outside `lifecycle.test.ts`
- `apps/cli/src/cli.test.ts` covers commands but no lifecycle or trust behaviour
- `docs/handoff/CODING-AGENT-INSTRUCTION-MISSING-EZY-CAPABILITIES-2026-11-23.md` §12 lists these as required acceptance criteria (vague-intent case, discovery ≠ recommendation, overlap rejection, PASS/FAIL/UNCERTAIN)

**What actually happens:**
The suite is green and would stay green if `lifecycle.ts` were deleted from the package entirely. There is no regression fence around the behaviours the documentation promises.

**What should happen:**
Integration tests at the planner/CLI boundary once the lifecycle decision (F-01) and trust gate (F-02) are settled; a clarification-refusal test replacing the token-fallback assertion; and an overlap-rejection case.

**Impact:**
Without these, later lifecycle work cannot be verified except by reading code, and the current gap between documentation and runtime is invisible to CI.

**Confidence:** HIGH

---

### Finding: `docs/skill-scan/ANALYSIS.md` reads as product status rather than external inventory

**ID:** F-27

**Severity:** LOW
**Category:** Documentation
**Status:** Stale framing

**Evidence:**
- `docs/skill-scan/ANALYSIS.md` contains "### Status: ALL 40 DOMAINS DONE ✅", "**100% Complete!**", "### All 36 Verified ✅"
- The same file (after the 2026-11-24 reconciliation) does say it is "a research inventory, not the Ezy runtime catalog"
- `docs/skill-scan/README.md` correctly says the workspace is "**not part of the Ezy runtime**"
- No runtime file references the workbook (`make-it-ezy-final.xlsx`)

**What actually happens:**
A reader skimming the analysis document meets completion badges and checkmarks before the caveat, and the numbers (40 domains, 36 meta-skills, 435 skills) have no relationship to what Ezy can actually recommend.

**What should happen:**
Retitle the document as an inventory of an external workbook, move the caveat to the top, and label the badge lines as workbook contents rather than project status.

**Impact:**
Contributes directly to the "documentation says more than the code does" problem, and is the most quotable source of overstated capability claims in the repo.

**Confidence:** HIGH

---

### Finding: Two parallel contractor/selection lanes, with the contractor hard-coded and unextendable

**ID:** F-28

**Severity:** LOW
**Category:** Architecture
**Status:** Implemented (by design, but unmarked)

**Evidence:**
- `packages/core/src/contractors.ts:22-32` `SUPERPOWERS_CONTRACTOR` is the only entry; `shouldUseSuperpowers` is an `if` on `brief.taskType`
- `packages/core/src/plan.ts:197-201` appends the contractor recommendation whenever a brief has a coding task type
- `packages/core/src/select.ts:100-160` selects individual skills independently of contractor choice
- `docs/superpowers/specs/2026-11-18-broker-orchestrated-skills-design.md` describes composing contractors *or* individual skills and choosing between them

**What actually happens:**
There is no decision between "contractor as a unit" and "composed individual skills": a coding brief always gets Superpowers plus whatever coverage selection produced. The two lanes run in parallel and are concatenated in `buildWorkflow`.

**What should happen:**
Either document this as an intentional first-slice simplification (contractor added alongside, never instead of, skills), or add the minimum branch that suppresses redundant individual skills when a contractor owns the workflow.

**Impact:**
Low today (one contractor, brief-driven only), but it is the seam any second contractor will hit, and the docs imply a choice the code does not make.

**Confidence:** HIGH

---

## 16. Prioritized findings

| ID | Severity | Area | Finding | Evidence | Confidence | Recommended Action |
|----|----------|------|---------|----------|------------|--------------------|
| F-01 | HIGH | Architecture/Runtime | Lifecycle contracts implemented, exported, tested, never called | `lifecycle.ts`; `index.ts:112-135`; no `apps/` reference | HIGH | Decide one position in `ARCHITECTURE.md` + `AGENTS.md` + the two handoffs; then either wire or label as internal API |
| F-02 | HIGH | Architecture/Security | No trust/security/quality/compatibility gate before recommendation | `plan.ts:118-140`; `select.ts:100-160`; `recommend.ts:60-85` | HIGH | Add the smallest gate: `evaluateSkillCandidate` adapter after search, before selection, with review state in plan output |
| F-03 | HIGH | Security | `ezy inspect` prints unsanitized description/file names/body preview | `inspect-skill.ts:236-247`; `format.ts:157-184` | HIGH | Sanitize at load in `inspectSkill`; add an escape-sequence regression test |
| F-04 | HIGH | Security | Install args unvalidated; unpinned `npx`; no `--` separator; no post-install verification | `install.ts:30-36,120` | HIGH | Validate source/name patterns, reject `-` prefixes and `..`, pin installer, verify installed tree against lock |
| F-05 | HIGH | Duplication/Config | 224 MB `docs/skill-scan` + 14 MB `graphify-out` tracked | `.gitignore:9,22-23` commented out; `git ls-files` counts | HIGH | Restore ignores, keep a summary + reproducible recipe, decide the history question explicitly |
| F-06 | HIGH | Security/Privacy | Raw conversation exports in a public repo, self-flagged and unresolved | `docs/convo/*`; handoff §10 | HIGH (presence) | Audit for secrets, then remove/sanitize with an explicit history decision |
| F-07 | MEDIUM | Testing | Test fixtures use `sourceKind: "remote"` / omit `id`; tests excluded from typecheck | `plan.test.ts:13`; `handoff.test.ts:102,151`; both tsconfigs | HIGH | Add a test tsconfig to `typecheck`; build fixtures from the real union |
| F-08 | MEDIUM | Architecture/Docs | Broker catalog "necessary" but `catalog/` is empty; routing is one hard-coded contractor | broker spec §Catalog; `contractors.ts`; `ARCHITECTURE.md:51` | HIGH | Implement a minimal typed catalog or rewrite the spec |
| F-09 | MEDIUM | Architecture/Docs | Brain is write-only; staleness helper unused; README implies context routing | `plan.ts:203`; `brain.ts:65`; `MVP-SPECIFICATION.md:64` | HIGH | Consume rejected skills/last plan in `plan`, or demote the claim |
| F-10 | MEDIUM | Runtime/Perf | Up to 10 sequential 8 s remote searches in `plan` | `plan.ts:19,118-127`; `search-remote.ts:34` | HIGH | Parallelize with a shared deadline; short-circuit after first failure |
| F-11 | MEDIUM | Runtime/Quality | Heuristic path manufactures junk requirements; clarification contract unused | `capabilities.ts:100-110`; `requirements.ts:79-110` | HIGH | Return no requirements + "run `ezy brief`" on lexicon miss |
| F-12 | MEDIUM | Runtime | Non-JS projects reported as greenfield | `find-project-root.ts:4`; `requirements.ts:104-106` | HIGH | Add `pyproject.toml`, `requirements.txt`, `go.mod`, `Cargo.toml` markers |
| F-13 | MEDIUM | Runtime/Config | Unknown flags silently ignored | `index.ts` per-command flag sets; `parseInstallArgs` | HIGH | Reject unknown `--flags` with exit 1 |
| F-14 | MEDIUM | Security/Runtime | `install --plan/--query` ignores `--local-only` and sends the outcome to skills.sh | `index.ts:196-235` | HIGH | Honor or reject the flag explicitly |
| F-15 | MEDIUM | Security | Skill hashes recorded but never verified | `skills-lock.json`; `load-local-skills.ts:41-46`; `inspect-skill.ts:236-240` | HIGH | Compute + compare hash at inspect/load; surface drift |
| F-16 | MEDIUM | Architecture/UX | Two incompatible definitions of "recommended" | `recommend.ts:20-33` vs `select.ts:100-160` | HIGH | Unify or document the two models in user docs |
| F-17 | MEDIUM | Docs | Broker status self-contradiction; broken Phase 8 heading; stale indexes/badge | `MVP-SPECIFICATION.md:69,74`; `ROADMAP.md:84-91`; `handoff/README.md:25`; `architecture/README.md:17-19`; `README.md:14` | HIGH | Fix the six statements |
| F-18 | MEDIUM | Hygiene/Docs | Session logs, empty phase files, orphan routing doc committed as docs | `docs/opencode/*`; `docs/gpt/*`; `docs/ezy-routing/*` | HIGH | Quarantine or remove; delete 0-byte placeholders |
| F-19 | LOW | Runtime/Quality | Remote hits scored on name+source; real descriptions discarded | `search-remote.ts:1-10,62-70` | MEDIUM | Map/sanitize description, or state that none is available |
| F-20 | LOW | Runtime/Quality | Canned "not needed" strings presented as analysis | `recommend.ts:35-52`; `requirements.ts:47-54` | HIGH | Derive from rejected candidates or label as static |
| F-21 | LOW | Duplication | Unused exports/options (`isBrainStale`, `remoteOnly`, `skipHints`, lifecycle) inflate the published API | `index.ts:72-135`; `search.ts:11`; `requirements.ts:114` | HIGH | Wire or internalize |
| F-22 | LOW | Testing | No lifecycle integration, no trust-gate, no clarification-refusal test | `lifecycle.test.ts`; `requirements.test.ts:96` | HIGH | Add integration tests as part of F-01/F-02/F-11 |
| F-23 | LOW | Docs | `AGENTS.md` documents a nonexistent `.qwen/settings.json` | `AGENTS.md:106,108`; `.gitignore:20` | HIGH | Reframe as user-machine recommendation |
| F-24 | LOW | Config | `vitest.config.ts` includes nonexistent `tests/**` | `vitest.config.ts:5` | HIGH | Add the suite or drop the glob |
| F-25 | LOW | Docs/Git | Phase 8 "current" vs spec "In progress" vs no release since 0.1.5 | `ROADMAP.md:7`; phase8 spec `:3`; `CHANGELOG.md` | HIGH | Reconcile status; release when the slice ships |
| F-26 | LOW | Runtime/UX | Install recovery guidance missing on failure/decline | `index.ts:255-275,330,378` | HIGH | Print the next step in every terminal state |
| F-27 | LOW | Docs | `docs/skill-scan/ANALYSIS.md` "100% Complete!" framing reads as product status | `ANALYSIS.md` sheet summaries | HIGH | Re-title as an inventory of an external workbook |
| F-28 | LOW | Architecture | Two contractor/selection lanes and a hard-coded contractor with no extension point | `contractors.ts`; `plan.ts:197-201` | HIGH | Leave as is until a second contractor is real; document the constant |

---

## 17. Architecture state

### What is solid

- **The deterministic core.** `score-skill`, `select`, `requirements`, `brief` validation and `format` are small, pure, dependency-free and covered by behavior-oriented tests. The greedy set-cover with local-first ranking is a genuinely good design for the stated constraint (no LLM).
- **The trust *shape*.** Discovery, recommendation, install and execution are separate commands, and `search`/`recommend`/`plan` provably never install. Untrusted brief JSON is validated as data. Skill text is sanitized on the search path.
- **Project inspection.** Monorepo-aware root finding, evidence-only framework detection, and package-manager sniffing are accurate and conservative, with explicit UNKNOWN/fallback notes in output.
- **The handoff artifact.** `ezy next` output is well-structured (Requirements, Skills, Excluded, Uncovered, Workflow, Checklist, Prompt, Notes) and the contractor-first workflow ordering is a sensible first slice.
- **Tooling and configuration.** Strict TS across packages, project references, strict lint, CI that mirrors `check:ci`, CodeQL, release-please with workspace components. The build/release scaffolding is the most mature part of the repo.
- **Documentation discipline where it counts.** `CONTRIBUTING.md`'s phase-shipping checklist, `docs/decisions/` precedence rules and `docs/handoff/README.md`'s precedence table are unusually explicit and mostly followed.

### What is partially implemented

- **Lifecycle** — all six contracts exist with tests; zero integration.
- **Broker workflow** — contractor routing + ordered stages ship; catalog, discovery-driven sourcing and per-stage skill semantics do not.
- **Project Brain** — machine slice + agent slice + fingerprint + staleness helper exist; consumption does not.
- **Trust/security** — shallow `inspect` heuristics and hash recording exist; gate, verification and review state do not.
- **Skills system** — discovery and selection are real; evaluation, composition, provenance verification and quality/maintenance evidence are placeholders.
- **Skill evaluation research** — a captured, reproducible SkillEvaluator run exists as evidence; no bridge from its output to Ezy's evaluation contract.

### What is misleading

- "Context router" language in `README.md`, while `.ezy/brain.json` is never read.
- "Trusted capability selection" language across `README.md`, `HANDOFF` §6–§11 and `SECURITY-MODEL.md`, while selection is keyword coverage.
- "Catalog" described as necessary in an approved design while `catalog/` is empty and the architecture doc calls it reserved.
- `docs/skill-scan/ANALYSIS.md`'s "100% Complete" inventory framing.
- `MVP-SPECIFICATION.md:69` saying the broker is not in CLI output.
- `docs/architecture/README.md` and `docs/handoff/README.md` pointing at superseded scope.

### What is missing

- Skill evaluation gate in the runtime (the product's stated core value).
- Catalog / known-specialist pool.
- Clarification boundary for vague intents.
- `SkillSpec`-shaped handoff composition.
- Outcome verification and any execution boundary (Phase 9).
- Hash verification / review state / trust registry.
- Non-JS project markers.
- Flag validation and `--local-only` on install.
- Any contract for host-agent execution beyond a pasted prompt.

### What is risky

- `ezy inspect` terminal injection from untrusted skill content (F-03).
- Unvalidated install arguments + unpinned `npx` (F-04).
- Raw conversation exports in a public repo (F-06).
- 238 MB of third-party generated content in git, scanned by CodeQL, with unknown redistribution terms (F-05).
- Silent network egress from `install` despite `--local-only` (F-14).
- Provenance hashes that are never checked (F-15), which makes the trust story audit-proof only on paper.
- Documentation that overstates implemented trust, creating a false sense of safety for users and future contributors.

### What should NOT be changed

- **The no-LLM, no-database, no-hosted-backend constraint.** It is the product's differentiator and is consistently stated.
- **Discovery/recommendation/install separation.** It is correct and enforced.
- **Approval-gated install.** Do not weaken it to speed up the adapter flow.
- **Layer A vs Layer B split** (builder skills are not product runtime dependencies).
- **Deterministic scoring/selection** as the baseline; lifecycle evaluation should be added *around* it, not replace it with a model.
- **Deferring** Soft-C spawning, trusted-auto installs, deep verification and the Web UI — those are explicit, reasoned deferrals.
- **The strict TS + strict lint + CI mirror.** Fix the test-typecheck hole; do not loosen the rest.
- **`docs/handoff/archive/` and `docs/convo/` as historical, non-authoritative material** — the fix is quarantine/removal, not promotion into architecture.

---

## 18. Recommended next steps

Not implemented. Ordered by dependency.

### P0 — resolve before any implementation

1. **Decide the lifecycle question once.** Pick one of: (a) contracts are intentionally unwired internal API (then delete the two 2026-11-23 handoffs from the authoritative path and stop describing lifecycle as current work), or (b) wire them (then treat the handoffs as the brief and stop saying Phase 9 defers it). Update `AGENTS.md`, `ARCHITECTURE.md`, `CAPABILITY-MODEL.md`, `HOW-IT-WORKS.md`, `ROADMAP.md` and both handoffs together. **Blocks F-01/F-02/F-22 and every lifecycle-related change.**
2. **Resolve the public-repo privacy question** (`docs/convo/`): scan, then remove or sanitize, with an explicit decision recorded. **Needs no dependency; blocks nothing, but is unsafe to leave open.**
3. **Decide the artifact policy question**: restore `graphify-out/` and `skill-scan` ignores, keep a small reproducible recipe + summary, and record what (if anything) stays. Also decide whether the third-party evaluator output can be redistributed. **Blocks F-05/F-18 and affects review load for every later change.**

### P1 — architectural corrections

4. **Security close-out (small, self-contained):** sanitize `inspect` fields at load; validate install source/name; add `--`; pin the installer; stop passing all of `process.env`. **Independent of 1–3; highest value per line.**
5. **Add the smallest trust gate** using the existing `evaluateSkillCandidate`: map current signals (task fit from coverage, provenance from lock/search, review state from inspect presence, contextCost unknown) into the contract, filter `rejected`, annotate `review` in plan output. **Depends on P0-1 (option b).**
6. **Add hash verification** for local skills at inspect/load and surface drift. **Depends on nothing; small.**
7. **Fix the test typecheck hole** (separate test tsconfig + real fixtures). **Should land before 5, so the gate is testable.**
8. **Make vague intents honest:** lexicon miss → no requirements + "run `ezy brief`"; if P0-1 chose wiring, use `buildIntentIntake` here. **Depends on P0-1 only for the clarification variant.**
9. **Fix `--local-only` on install and reject unknown flags.** Independent.
10. **Fix non-JS project markers.** Independent, tiny.

### P2 — cleanup / improvements

11. Correct the six stale/contradictory doc statements (F-17), the `.qwen` claim (F-23), the Phase 8 status markers (F-25), and the `docs/skill-scan/ANALYSIS.md` framing (F-27).
12. Parallelize/abort remote searches (F-10).
13. Resolve the two "recommended" models — unify or document (F-16).
14. Remove or quarantine session logs and empty placeholder files (F-18).
15. Internalize or wire unused exports (`isBrainStale`, `remoteOnly`, `skipHints`, `SUPERPOWERS_TASK_TYPES`, `SkillHit` `"unknown"`/`"skip"` members) (F-21).
16. Improve remote description handling (F-19) and stop presenting canned exclusions as analysis (F-20).
17. Add install-recovery guidance (F-26), and either add the `tests/` suite or drop the glob (F-24).

### P3 — optional future work

18. Catalog / known-specialist pool (F-08) — only after P0-1 and P1-5, and only with a real second provider; otherwise keep the hard-coded contractor and document it.
19. Consume Project Brain in planning (F-09) — rejected skills first, then last-plan digest.
20. Outcome verification / execution boundary (Phase 9) — depends on P1-5 and on P0-1.
21. Shared evidence aggregation → proposals — depends on a real privacy-safe event source; do not build a service for it yet.
22. Broader discovery beyond skills.sh, multi-domain expansion, Web UI — remain explicitly deferred.

### Dependency summary

```
P0-1 (lifecycle decision) ──┬─> P1-5 (trust gate) ──> P3-20 (outcome verification)
                            └─> P3-18 (catalog)
P1-7 (test typecheck) ──────> P1-5
P0-2 (privacy)              → independent
P0-3 (artifact policy)      → independent; reduces cost of everything after
P1-4 (security close-out)   → independent, do first
P1-6 (hash verify)          → independent, feeds P1-5
P1-8/9/10                   → independent
```

---

## Appendix A — Coverage accounting

| Area | Reviewed | Depth |
|---|---|---|
| `packages/core/src/*.ts` | All 30 source files | Full read |
| `packages/core/src/*.test.ts` | All 21 test files | Full read |
| `packages/core/src/golden/**` | All four cases (`brief.json`, `expect.json`, fixture `SKILL.md` names) | Full read of metadata; fixture skill bodies not read line-by-line |
| `apps/cli/src/**` | All 3 files | Full read |
| Root config | `package.json`, both package manifests, tsconfigs, eslint, vitest, workspace, release-please, `.gitignore`, `CHANGELOG` head, lockfile header | Full read |
| `.github/**` | 3 workflows + PR template presence | Full read |
| Authoritative docs | `README`, `AGENTS`, `CLAUDE`, `CONTRIBUTING`, `ROADMAP`, `MVP-SPECIFICATION`, `HOW-IT-WORKS`, all 7 `docs/architecture`, both `docs/decisions`, `docs/CI`, `BUILDER-SKILLS`, both audit docs, `docs/skill-scan/{README,ANALYSIS,REANALYSIS,skill-evaluator/README}`, `docs/handoff/{README,MAKE-IT-EZY-HANDOFF §1 + headings + §20-26, CONVERSATION-SYNTHESIS §10-12, both 2026-11-23 handoffs}`, broker spec + plan, phase 8 spec/plan statuses | Read to the depth needed for each claim |
| `skills/**` | `ezy/SKILL.md`, `ci-before-push/SKILL.md` | Full read |
| `scripts/*.mjs` | All 3 | Full read |
| `skills-lock.json` | Schema + 52 entries counted; tree not fetched | Structural |
| `docs/skill-scan/skill-eval/**` | 1,287 files | **Classified by path/type/count only** — not individually reviewed |
| `docs/convo/**` | 11 files | **Not read** (privacy + size); presence/policy audited only |
| `docs/opencode/**`, `docs/gpt/**` | Headings, line counts, byte counts | Sampled |
| `docs/research/**`, `docs/ezy-routing/**`, `docs/superpowers/**` (remaining) | Headings + key claims | Sampled |
| `graphify-out/**` | Presence, size, cache counts | Structural |
| Git | 149 commits, per-path history for lifecycle, brokers, skill-scan, graphify-out, convo; working-tree status | Full log scan + targeted path history |

## Appendix B — Audit limitations (honest list)

1. **Tests, lint, typecheck and build were not run.** `node_modules` is absent and the brief forbids installing dependencies or running CI. All test conclusions are static. "Green suite" is **UNKNOWN**.
2. **The CLI was not executed.** Behaviour is derived from reading the handlers end-to-end; no output was observed live.
3. **`main` is not available locally.** `freebuff-base` is an unrelated root commit, so divergence between `main` and this branch could not be measured. The 2026-11-24 re-analysis claims the analysis branch is "1 commit ahead of main"; that is unverified here.
4. **`docs/convo/` was not read.** Whether it contains secrets, personal data or third-party private content is **UNKNOWN**.
5. **`docs/skill-scan/skill-eval/` was not reviewed file-by-file.** 1,278 generated artifacts were counted and classified, not audited.
6. **The skills.sh API response shape is inferred** from the TypeScript type and the one mocked test; the live API was not called.
7. **No network requests were made** during this audit.
8. **The Graphify graph was not queried**; its staleness is taken from the repo's own warning.
