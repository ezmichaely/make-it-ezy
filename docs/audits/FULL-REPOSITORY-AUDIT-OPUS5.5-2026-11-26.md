> **Diagnostic evidence — not current instructions.** Findings and proposed plan from a read-only audit of `analysis/full-scan-reconciliation` @ `c0ace2a` (2026-11-26). Proposed tasks are not approved work orders until accepted per `AGENTS.md`.

# Make It Ezy — Full Repository Audit + Sequential Execution Plan

- **Branch audited:** `analysis/full-scan-reconciliation` @ `c0ace2a`
- **Date:** 2026-11-26
- **Mode:** read-only. The working repository was not modified; its tree is clean apart from gitignored build output that already existed. All build, test, pack and install verification ran in an isolated clone: `scratchpad/clone`.
- **Previous audit:** Sonnet 5.5 Medium, verdict "ALIGNED WITH MINOR DOC CLEANUP". Treated as an untrusted hypothesis.

---

## 0. Verification ledger (what was actually executed)

| Check | Command (in isolated clone) | Result | Status |
|---|---|---|---|
| Install | `pnpm install --frozen-lockfile --prefer-offline` | exit 0 | VERIFIED |
| Build | `pnpm build` | exit 0 (core tsc → cli tsc → prepare-package) | VERIFIED |
| Lint | `pnpm lint` | exit 0 | VERIFIED |
| Typecheck | `pnpm typecheck` | exit 0 | VERIFIED |
| Tests (full, cold) | `pnpm exec vitest run --reporter=verbose` | **1 failed / 188 passed (21 files)**. `apps/cli/src/cli.test.ts > ezy CLI > prints help` timed out at 5000 ms (took 5578 ms) | **FAILED** |
| Tests (CLI file, warm ×2) | `vitest run apps/cli/src/cli.test.ts` | 26/26 pass; "prints help" took ~1.9 s | VERIFIED (flaky) |
| Dependency audit | `pnpm audit --prod --audit-level=high` | No known vulnerabilities | VERIFIED |
| Package creation | `npm pack` in `apps/cli` | 150 files, 72.3 kB, `dist/` + README + package.json | VERIFIED |
| Clean install | `npm install --global --prefix <tmp> <tgz>` | "added 1 package"; `ezy` bin linked | VERIFIED |
| CLI execution from packaged install, outside monorepo | `ezy --help`, `doctor`, `analyze`, `plan --local-only`, `brain`, `next --brief … --local-only`, unknown command | All behave as coded; exit codes correct | VERIFIED |
| npm registry publication status | not queried, to avoid sending project identifiers to an external service | — | NOT VERIFIED |
| Windows / Node 20 runtime | no environment available | — | NOT VERIFIED |
| GitHub Actions CI result for this branch | not queried | — | UNKNOWN |

The interrupted first in-repo run (`scratchpad/test.log`) had also ended in `ELIFECYCLE Test failed`, which corroborates the cold-start failure.

---

## 1. Repository inventory

There are 222 tracked files.

| Area | Files | What matters |
|---|---|---|
| `packages/core/src` | 98 tracked, about 53 non-fixture `.ts` files, 6,634 LOC including tests | The real product. Contains analyze, requirements, capabilities lexicon, search (local + skills.sh), score, select, plan, handoff, contractors, brief, brain, install, inspect, doctor, format, and lifecycle (reserved). It has 4 golden fixtures (`golden/*`). |
| `apps/cli` | 7 files | `src/index.ts` (515 LOC, hand-rolled argv dispatch), `src/select.ts` (TTY picker), `scripts/prepare-package.mjs` (bundles core into `dist/core`, rewrites imports), `cli.test.ts` (26 tests via `tsx`, run against **source** rather than `dist`). |
| `skills/` | 2 | `skills/ezy/SKILL.md` is the end-user host-agent adapter. `skills/ci-before-push/SKILL.md` is a developer helper. |
| `scripts/` | 3 | Builder-skill bootstrap, link and clean scripts. These are development tooling, not product. |
| `catalog/` | `.gitkeep` only | Reserved and empty (`docs/architecture/ARCHITECTURE.md:L70`). |
| Root configuration | `package.json`, `pnpm-workspace.yaml`, `tsconfig*.json`, `eslint.config.js`, `vitest.config.ts`, `skills-lock.json`, `release-please-config.json`, `.release-please-manifest.json` | Workspace is `apps/*` and `packages/*`. Node ≥20. pnpm 10.33.2. |
| CI/CD | `.github/workflows/ci.yml`, `codeql.yml`, `release-please.yml` | CI runs build → lint → typecheck → test → audit on Node 22 / ubuntu only. release-please tags and changelogs `apps/cli` only. **There is no publish job.** |
| Authority docs | `AGENTS.md`, `docs/STATUS.md`, `ROADMAP.md`, `MVP-SPECIFICATION.md`, `HOW-IT-WORKS.md`, `PRODUCT-DIRECTION.md`, `AGENT-WORKFLOW.md`, `docs/decisions/*` | See §2. |
| Architecture docs | `docs/architecture/*` (8 files) | FUTURE-ECOSYSTEM (477 lines), ARCHITECTURE, ARCHITECTURE-EXPLAINED, CAPABILITY-MODEL, INTEGRATION-STRATEGY, SECURITY-MODEL, SHARED-EVIDENCE-LEARNING, README. |
| Plans and specs | `docs/superpowers/{plans,specs,archive}` | Phase 8 spec "In progress" plus plan. Broker spec "Approved". |
| Evidence and history | `docs/handoff` (2,826-line long handoff plus archive), `docs/research`, `docs/skill-scan` (including an `.xlsx`), `docs/audits`, `docs/convo`, `docs/archive` (35 files) | Correctly labelled as evidence, with one exception noted in §4. |
| Reference | `docs/ezy-routing/LOCAL-AI-MODEL-ROUTING.md` | Explicitly "Reference / design document", "not a Make It Ezy application feature yet" (L3, L11, L191). |

**Runtime dependencies:** none. The CLI has only `devDependencies: { "@make-it-ezy/core": "workspace:*" }` (`apps/cli/package.json:L23-L25`). Core has none (`packages/core/package.json`). The only external package imported by product code is `@make-it-ezy/core` (`apps/cli/src/index.ts:L32`). There is no LLM SDK, no Graphify and no Soft-C.

---

## 2. Source-of-truth / authority model (as the repo actually establishes it)

```text
Explicit user instruction
   │
   ├── Agent operating rules ........ AGENTS.md  (→ docs/AGENT-WORKFLOW.md)
   ├── Durable decisions ............ docs/decisions/  (only 1 real decision: Git-as-shared-memory)
   │
   ├── CURRENT TRUTH
   │     Phase/status ............... docs/ROADMAP.md       (ROADMAP.md:L3, L21 "only this file controls phase ordering")
   │     Shipped behavior (claimed) . docs/MVP-SPECIFICATION.md (L3)
   │     Current flow ............... docs/HOW-IT-WORKS.md  (defers to MVP/ROADMAP, L3)
   │     Current-state dashboard .... docs/STATUS.md        (derived summary; not in AGENTS.md hierarchy)
   │     Current architecture ....... docs/architecture/ARCHITECTURE.md (+ SECURITY-MODEL, CAPABILITY-MODEL)
   │     ACTUAL behavior ............ code + tests  ← final arbiter (AGENTS.md:L43, decisions/README.md:L44)
   │
   ├── DIRECTION
   │     Product intent ............. docs/PRODUCT-DIRECTION.md (L3: future-facing, not implemented)
   │     Architectural compass ...... docs/architecture/FUTURE-ECOSYSTEM.md (AGENTS.md:L54-L70 "authoritative long-term destination", "compass, not backlog")
   │     Trust/intent context ....... docs/handoff/MAKE-IT-EZY-HANDOFF.md (L1, L7: context, not authority)
   │
   └── EVIDENCE ONLY
         specs/plans, research, audits, skill-scan, convo, archive, ezy-routing (reference)
```

### Conflicts and ambiguities in the authority model

| # | Issue | Evidence | Class | Sev |
|---|---|---|---|---|
| A1 | **Precedence order differs.** AGENTS.md puts itself above decisions; decisions/README puts decisions above AGENTS.md. The two are scoped ("for agent operating rules" vs "for product/architecture questions"), so they are compatible, but an agent must notice the qualifiers. | `AGENTS.md:L36-L38` vs `docs/decisions/README.md:L31-L35, L48` | AUTHORITY AMBIGUITY | P3 |
| A2 | **AGENTS.md never mentions STATUS.md or PRODUCT-DIRECTION.md.** Its start sequence and hierarchy omit both, and so does AGENT-WORKFLOW. Every other index includes them (STATUS, handoff/README, the handoff, research, INTEGRATIONS). Four different reading orders exist. | `AGENTS.md:L6-L19, L34-L46`; `docs/AGENT-WORKFLOW.md:L7`; `README.md:L101-L115`; vs `docs/STATUS.md:L63-L69`, `docs/handoff/README.md:L5-L11`, `docs/handoff/MAKE-IT-EZY-HANDOFF.md:L1, L10` | AUTHORITY AMBIGUITY | P2 |
| A3 | **"Product intent" has two homes.** AGENTS.md routes product intent to the handoff. The handoff itself says PRODUCT-DIRECTION.md is product direction. The README doc map routes "Product intent/trust" to the handoff and omits PRODUCT-DIRECTION and FUTURE-ECOSYSTEM. | `AGENTS.md:L44`; `README.md:L113`; `docs/handoff/MAKE-IT-EZY-HANDOFF.md:L10` | AUTHORITY AMBIGUITY | P3 |
| A4 | **The Phase 8 spec contradicts shipped distribution.** See finding F3. | — | CONTRADICTORY | P1 |
| A5 | PRODUCT-DIRECTION and FUTURE-ECOSYSTEM split cleanly into intent and architectural compass. They do not conflict. | `PRODUCT-DIRECTION.md:L3, L143, L239-L240`; `FUTURE-ECOSYSTEM.md:L3-L5` | NOT A CONFLICT | — |
| A6 | INTEGRATIONS.md (forward map) and INTEGRATION-STRATEGY.md (phase status table, defers to ROADMAP) overlap without contradiction. | `INTEGRATIONS.md:L3, L9`; `INTEGRATION-STRATEGY.md:L12-L31` | MINOR DUPLICATION | P4 |

---

## 3. Actual runtime / data flow (traced from source)

### 3.1 `ezy plan "<outcome>" [--brief p] [--local-only]`

```text
apps/cli/src/index.ts:L466-L491
  extractBriefPath → loadBrief (validate + sanitize; exit 2 on error)       brief.ts:L155-L200
  planOutcome(outcome, {localOnly, brief})                                   core/plan.ts
    analyzeProject({cwd})                         (fs only)                  plan.ts:L90
    loadLocalSkills(projectRoot)                  (.agents/skills/*/SKILL.md + skills-lock.json)
    requirements = brief ? brief.requirements : extractRequirements()        plan.ts:L95-L110
        extractRequirements → capabilities lexicon → token fallback          requirements.ts:L58-L144, capabilities.ts:L101-L108
    for ≤MAX_QUERIES requirements: searchSkills(query)                       plan.ts:L122-L127
        local hits (boost +1.5)  + skills.sh GET unless localOnly            search.ts:L70-L81, search-remote.ts:L40
    selectCapabilities(scoreCandidates(hits, reqs), reqs, exclusions)        plan.ts:L130, select.ts
    contractors = shouldUseSuperpowers(brief?.taskType) ? [SUPERPOWERS] : [] plan.ts:L201-L203
    persistBrainAfterPlan(cwd, report)  ← WRITES .ezy/brain.json             plan.ts:L205, brain.ts:L357-L381
  formatPlan → stdout (human text only; no machine-readable mode)
```

### 3.2 `ezy next`

`next` runs the same path, then calls `buildHandoff` → `composeHandoffFromItems` → `buildWorkflow` (contractor → recommended skills → uncovered custom stages) → `buildPrompt` (`handoff.ts:L49-L94, L229-L333`). It **also writes the brain**, because it calls `planOutcome`.

### 3.3 `ezy install`

```text
index.ts:L282-L354
  parseInstallArgs: UNKNOWN --flags SILENTLY DROPPED (L172-L174) → --local-only ignored
  --plan  → planOutcome(no localOnly) → skills.sh + brain write (L213)
  --query → recommendSkills(no localOnly) → skills.sh (L224)
  buildInstallPreview: no --source → searchSkills (network); source = exact-name hit ?? hits[0] (install.ts:L62-L76)
  approval: --yes or TTY confirm; non-TTY without --yes → exit 1 (L330-L343)
  runInstall: spawn("npx", ["skills","add",source,"--skill",name], env=process.env) (install.ts:L30-L36, L175)
  on success with --plan: appendInstallHandoff → buildHandoff → planOutcome AGAIN (network + second brain write) (L265-L271)
```

### 3.4 Other commands

| Command | Reads | Network | Writes | Subprocess |
|---|---|---|---|---|
| `doctor` | PATH, project markers | no | no | `pnpm --version`, `git --version` (`doctor.ts:L6-L16, L34, L42`) |
| `analyze` | project files | no | no | no |
| `search` / `recommend` | `.agents/skills`, `skills-lock.json` | skills.sh unless `--local-only` | no | no |
| `inspect` | local skill dir | skills.sh unless `--local-only` (`inspect-skill.ts:L190-L196`) | no | no |
| `brief` | project summary | no | no | no |
| `brain` | `.ezy/brain.json` | no | no | no |
| `brain refresh` | project | no | **`.ezy/brain.json`** | no |
| `brain enrich` | project summary | no | no | no |
| `plan` / `next` | project + skills | skills.sh unless `--local-only` | **`.ezy/brain.json`** | no |
| `install` | as above | **always**, unless `--source` and an explicit name are given | via `npx skills` (`.agents/skills/…`) | **`npx skills add`** (latest, unpinned) |

**Answer: does `--local-only` keep the tool local?**
- For `search`, `inspect`, `recommend`, `plan` and `next`: yes.
- For `install`: no. The flag is accepted and silently discarded, and `install --plan` / `--query` / install without `--source` always query skills.sh.

The help text only advertises `--local-only` for the other five commands (`index.ts:L69`), so this is not a broken promise. It is a silent-ignore trap.

---

## 4. Findings (classified)

Severity scale: P0 = blocks progress, P1 = high impact, P2 = important, P3 = useful cleanup, P4 = cosmetic.

### Correctness / behavior

| ID | Finding | Evidence | Class | Sev |
|---|---|---|---|---|
| F1 | **The test suite is red on a cold run.** `cli.test.ts` spawns `node tsx src/index.ts` per test with the default 5 s timeout; the first spawn took 5.58 s. Warm runs take ~1.9 s, so it is flaky. Fresh CI runners are cold. Whether CI actually fails is UNVERIFIED. | `apps/cli/src/cli.test.ts:L42-L53`; `vitest.config.ts:L3-L6` (no `testTimeout`) | TEST GAP | **P1** (P0 if CI reproduces) |
| F2 | **The broker slice routes to a contractor without checking it exists.** A `feature` brief produces "Contractor superpowers … Load its skills under .agents/skills/" even when `.agents/` does not exist. No checklist install line, no "(install first)" marker (skills get one), no installed flag. Reproduced on the packaged CLI. | `handoff.ts:L58-L68, L101-L112, L271-L276`; `plan.ts:L201-L203`; `contractors.ts:L22-L38` | PARTIAL / UNDERENGINEERED | **P1** |
| F3 | **The Phase 8 spec and plan contradict shipped distribution.** The spec (status "In progress") selects two published packages and rejects bundling. The plan's checked boxes claim `private` was removed and `@make-it-ezy/cli` was documented. In reality there is one `make-it-ezy` package, core is `private: true`, and core is bundled. No decision record covers the reversal. Phase 8 is the current phase, so an agent "continuing Phase 8" would follow the wrong design. | Spec: `docs/superpowers/specs/2026-11-18-phase8-launch-design.md:L3, L12, L25-L26, L35`. Plan: `docs/superpowers/plans/2026-11-18-phase8-launch.md:L7, L23-L24, L32, L41`. Reality: `apps/cli/package.json:L2`, `packages/core/package.json:L4`, `apps/cli/scripts/prepare-package.mjs:L13-L18`, `docs/MVP-SPECIFICATION.md:L37`, `docs/STATUS.md:L33` | CONTRADICTORY / STALE | **P1** |
| F4 | **`ezy install` silently ignores unknown flags**, including `--local-only`. `install --plan` / `--query` / no-`--source` always hit skills.sh. | `apps/cli/src/index.ts:L172-L174, L213, L224`; `install.ts:L62-L67` | ARCHITECTURAL RISK (privacy expectation) | P2 |
| F5 | **Two stopword lists disagree.** The capabilities fallback skips only glue words, so verbs such as "add" become requirements. Reproduced: "add a settings page with a form" produced the requirements `add`, `settings`, `page`. | `capabilities.ts:L105-L108` vs `score-skill.ts:L9-L11` | DUPLICATED / bug | P2 |
| F6 | **Brain staleness is implemented but never surfaced.** The adapter tells agents to act "if machine data is stale", but `ezy brain` never reports staleness. | `brain.ts:L65` (only caller: `brain.test.ts:L111-L122`); `skills/ezy/SKILL.md:L48`; `format.ts` (no "stale") | DEAD / doc promise unsatisfied | P2 |
| F7 | **`install --plan` plans twice** (two network passes, two brain writes). | `index.ts:L213, L265-L271` | PERFORMANCE RISK (minor) | P3 |
| F8 | **`inspect` attributes another skill's install count.** When the name doesn't match exactly, it reports the remote install count of `hits[0]`. `install` similarly falls back to `hits[0]`'s source. | `inspect-skill.ts:L196-L198`; `install.ts:L68-L69` | correctness | P3 |
| F9 | **A unit test writes into the developer's repository.** `planOutcome(…, {localOnly:true})` with no `cwd` writes `<repo>/.ezy/brain.json` and overwrites the real `lastPlan` (observed in the clone). | `packages/core/src/plan.test.ts:L136` | TEST GAP / side effect | P3 |
| F10 | **Output notes say "Discovery only — nothing was installed or executed"** while the same run wrote `.ezy/brain.json`. Not false, but incomplete. | observed `next` output; `plan.ts:L205-L207` | doc/UX | P4 |

### Security / packaging

| ID | Finding | Evidence | Class | Sev |
|---|---|---|---|---|
| S1 | **Install executes an unpinned remote CLI.** `npx skills add` runs whatever `skills` version is current on npm. In non-TTY mode npx auto-confirms package download. | `install.ts:L30-L36, L175` | SECURITY RISK (supply chain) | P2 |
| S2 | **No shape validation on `name` or `source`.** `--source` consumes the next token even if it starts with `-`, and remote `source` is only control-char sanitized. That allows argument injection into the `skills` CLI (no shell injection, since spawn uses an array). `name` is joined into paths (`isSkillInstalledLocally`), so `../x` style names produce misleading "already installed" results. Mitigations: preview plus explicit approval. This was flagged in the prior audit and is still open. | `index.ts:L148-L150`; `search-remote.ts:L59-L60`; `install.ts:L24-L28, L46-L49`; `docs/audits/FULL-REPOSITORY-DIRECTION-AUDIT.md:L25` | SECURITY RISK | P2 |
| S3 | **`spawn("npx", …)` without a shell fails on Windows** (needs `npx.cmd`). `engines` does not restrict the OS, and CI is ubuntu-only. Not runtime-verified. | `install.ts:L33, L115`; `.github/workflows/ci.yml:L15` | PACKAGING RISK | P2 |
| S4 | **No `prepack`/`prepublishOnly` build and no clean step.** A manual `npm publish` can ship stale `dist/`. `cpSync` overlays onto any existing `dist/core`, so deleted modules would still ship. There is no publish workflow (release-please only tags). | `apps/cli/package.json:L20-L22`; `prepare-package.mjs:L12-L13`; `.github/workflows/release-please.yml` | PACKAGING RISK | P2 |
| S5 | **The packaged artifact is never tested by CI.** CLI tests run `src/index.ts` through tsx, not `dist`. The self-contained claim was verified only manually, in this audit. | `cli.test.ts:L9-L10, L43`; `ci.yml:L31-L41` | TEST GAP | P1 |
| S6 | **The tarball has no LICENSE file** (MIT is claimed); `apps/cli` has no LICENSE. | `npm pack` file list | PACKAGING RISK | P3 |
| S7 | **`workspace:*` is left in the packed `devDependencies` when using npm pack.** Harmless for consumers (install verified) but untidy. | packed `package.json` | PACKAGING RISK | P4 |
| S8 | **`engines.node >=20`, but CI runs only Node 22.** | `apps/cli/package.json:L11-L13`; `ci.yml:L24` | TEST GAP | P3 |
| S9 | **Root and CLI packages share the name `make-it-ezy`.** | `package.json:L2`; `apps/cli/package.json:L2` | DUPLICATED | P4 |
| S10 | **Remote discovery is name-only.** skills.sh hits get the description "Catalog hit from X", and relevance comes from the name plus `log10(installs)`. | `search-remote.ts:L62-L68` | UNDERENGINEERED (deliberate?) | P3 |
| S11 | **Brief and remote text are control/bidi-sanitized and length-limited**, and reach the host prompt only as data. No issues found. | `brief.ts:L34-L74`; `search-remote.ts:L59-L60` | IMPLEMENTED | — |

### Documentation

| ID | Finding | Evidence | Class | Sev |
|---|---|---|---|---|
| D1 | **The shipped-behavior spec omits brain auto-write on plan/next and the `brain refresh` / `brain enrich` subcommands.** Both appear only in ARCHITECTURE-EXPLAINED, the adapter and the long handoff. | Code: `plan.ts:L205`, `index.ts:L435, L444`. Docs: `MVP-SPECIFICATION.md:L23, L71-L78`. Elsewhere: `ARCHITECTURE-EXPLAINED.md:L84, L127`, `MAKE-IT-EZY-HANDOFF.md:L25` | DOCUMENTATION GAP | P2 |
| D2 | **The MVP spec does not say which commands contact skills.sh, that network is the default, or that install ignores `--local-only`.** | `MVP-SPECIFICATION.md:L9-L26`; code §3.4 | DOCUMENTATION GAP | P2 |
| D3 | **SECURITY-MODEL's "safe by default" table omits `.ezy` writes.** It calls inspect's remote lookup "optional" though it is on by default, and it carries a dated 2026-11-05 licence snapshot as current text. | `SECURITY-MODEL.md:L9-L15, L36-L39` | STALE | P3 |
| D4 | **SHARED-EVIDENCE-LEARNING says lifecycle contracts are "now implemented"** and "provide structured outcome evidence". They are unwired (an accurate but easily misread statement), and the file is listed as a "Key current document". | `SHARED-EVIDENCE-LEARNING.md:L9-L18`; `architecture/README.md:L17-L19` | AMBIGUOUS | P3 |
| D5 | **CAPABILITY-MODEL's Workflow row says Superpowers is "STUDY/OPTIONAL"** although contractor routing is shipped. | `CAPABILITY-MODEL.md:L11` vs `MVP-SPECIFICATION.md:L84-L87` | STALE | P3 |
| D6 | **The roadmap horizon stops at domain expansion.** Agent control, multi-agent execution, the router, hybrid execution and the Home Node (FUTURE-ECOSYSTEM's evolution order) have no roadmap placement, yet PRODUCT-DIRECTION calls ROADMAP "the accepted path … toward the destination". "Web UI" (Phase 10, "same core decision layer") and the FUTURE-ECOSYSTEM "control cockpit" are different things under similar names. | `ROADMAP.md:L95-L143`; `FUTURE-ECOSYSTEM.md:L321-L347, L411-L435`; `PRODUCT-DIRECTION.md:L241` | DOCUMENTATION GAP / terminology | P3 |
| D7 | **The help banner is stale.** It says "(Phase 6 brief + Phase 7 project brain)"; the current phase is 8. The help also says `inspect` "Inspect[s] a local skill" while it queries skills.sh by default. | `apps/cli/src/index.ts:L35, L58` | STALE | P4 |
| D8 | **CONTRIBUTING and CI.md link to `.agents/skills/ci-before-push/SKILL.md`**, a gitignored path that is absent in fresh clones. The tracked file is `skills/ci-before-push/SKILL.md`. | `CONTRIBUTING.md:L45`; `docs/CI.md:L24`; `.gitignore` (`.agents/skills/`) | STALE | P4 |
| D9 | **Literal `\`` escapes render as raw backslash-backticks.** | `PRODUCT-DIRECTION.md:L143`; `FUTURE-ECOSYSTEM.md:L181, L286, L313` (+2) | cosmetic | P4 |

### Architecture

| ID | Finding | Evidence | Class | Sev |
|---|---|---|---|---|
| R1 | **There is no machine-readable output contract** (no `--json`). Host agents consume a text prompt. Roadmap Phase 9 (verification) and Phase 10 (Web UI on "the same core") both need a stable structured plan and handoff. | `index.ts` (no json flag); `format.ts`; `ROADMAP.md:L99`; prior audit `docs/audits/FULL-REPOSITORY-DIRECTION-AUDIT.md:L15` | MISSING (prerequisite) | P2 |
| R2 | **Three requirement shapes:** planner `Requirement` (`priority`, `rationale`), `BriefRequirement` (`priority`, `why`), and lifecycle (`required: boolean`, plus `IntentIntake.requirements: string[]`). Wiring `evaluateOutcome` in Phase 9 needs an adapter or a unified type. | `plan-types.ts:L5-L11`; `brief-types.ts:L20-L26`; `lifecycle-types.ts:L9-L18, L69-L74` | DUPLICATED | P3 |
| R3 | **Two selection engines:** `recommend.ts` (`RECOMMENDED_MAX = 3`, `STRONG_SCORE`) and `select.ts` (`RECOMMENDED_MAX = 4`, coverage-based). `install --query` uses the first and `install --plan` the second. | `recommend.ts:L6-L8`; `select.ts:L6-L8` | DUPLICATED | P3 |
| R4 | **About 370 LOC of lifecycle contracts are reserved and unwired.** They are referenced only by `index.ts:L120, L135` re-exports and tests. They are documented consistently as not-current, so this is acceptable, but it is the most likely place for accidental over-building. | `lifecycle.ts`, `lifecycle-types.ts`; `ARCHITECTURE.md:L54` | FUTURE (reserved) / mild OVERENGINEERED | P4 |
| R5 | **The contractor is a single hard-coded constant.** That is appropriate for the first slice; a registry would be premature. | `contractors.ts:L22-L38`; `MVP-SPECIFICATION.md:L89-L94` | IMPLEMENTED (intentionally minimal) | — |
| R6 | **The core is modular and testable.** Small pure modules, with injectable `fetchImpl` and `spawnImpl`. Tests are hermetic for network (all remote paths use `localOnly`, `skipRemote` or `fetchImpl`). There are no runtime dependencies. | `search.ts:L13`; `install.ts:L15-L18`; test grep | SOLID | — |
| R7 | **Composition over rebuilding is followed.** Install delegates to `npx skills`, discovery reuses skills.sh and the Agent Skills format, Superpowers is routed to rather than reimplemented, and there is no LLM inside Ezy. | `install.ts:L30-L36`; `search-remote.ts:L40`; `handoff.ts:L106` | SOLID | — |

---

## 5. Concept / domain audit

| Concept | Meaning in this repo | Where | Status | Notes |
|---|---|---|---|---|
| Domain | Type of work (coding, finance …) | `FUTURE-ECOSYSTEM.md:L47-L62`; `ROADMAP.md:L137-L143` | FUTURE | Code handles coding only; brief `taskType` is not a domain. Defer. |
| Capability | A requirement label (lexicon or brief) | `capabilities.ts`, `requirements.ts`, `CAPABILITY-MODEL.md:L8` | IMPLEMENTED | Overloaded: "capability" = requirement label in code and = broad ecosystem piece in FUTURE-ECOSYSTEM. |
| Skill | Agent Skills `SKILL.md` | `load-local-skills.ts`, `search-remote.ts`, `install.ts` | IMPLEMENTED | Remote matching is name-only (S10). |
| Agent | External host executor | `HOW-IT-WORKS.md:L26-L38`; `FUTURE-ECOSYSTEM.md:L92-L105` | REFERENCE (host) / FUTURE (Ezy-controlled) | Boundary shift "Ezy decides" → "Ezy controls agents" has no decision gate. |
| Runtime | Host runtime / adapter | `CAPABILITY-MODEL.md:L12`; `skills/ezy` | PARTIAL | Adapter #0 (`.agents/skills`) and #1 (`skills/ezy`) exist. |
| Provider | Model provider | FUTURE-ECOSYSTEM L107-L118, L350-L383 | DOCUMENTED ONLY / FUTURE | |
| Execution | Running the work | Host only today | FUTURE (for Ezy) | `AGENTS.md:L126-L134`. |
| Workflow | Ordered stages in a handoff | `handoff.ts:L49-L94` | IMPLEMENTED | |
| Brain | `.ezy/brain.json` machine + agent slices | `brain.ts` | IMPLEMENTED (partial: staleness unused, F6) | Auto-written by plan/next (D1). |
| Lifecycle | Intake / eval / compose / outcome / evidence contracts | `lifecycle.ts` | PARTIAL (contracts, unwired) | Reserved seed for Phase 9. |
| Planner | `planOutcome` | `plan.ts` | IMPLEMENTED | |
| Search | local + skills.sh | `search.ts`, `search-remote.ts` | IMPLEMENTED | |
| Contractor | Skill set that owns its workflow | `contractors.ts` | PARTIAL | One entry, no presence check (F2). |
| Handoff | Checklist + prompt + workflow | `handoff.ts`, `format.ts` | IMPLEMENTED | Text only (R1). |
| Adapter | Host integration | `skills/ezy/SKILL.md`; install to `.agents/skills` | IMPLEMENTED | |
| Router | Provider/model routing | FUTURE-ECOSYSTEM L268-L280, L350-L383; `ezy-routing/LOCAL-AI-MODEL-ROUTING.md:L3, L11` | FUTURE / REFERENCE | No code. |
| RAG | Retrieval | `FUTURE-ECOSYSTEM.md:L77-L90`; `PRODUCT-DIRECTION.md:L171` | FUTURE | |
| MCP | Tools | `FUTURE-ECOSYSTEM.md:L120-L134`; `SECURITY-MODEL.md:L5` | FUTURE | Not even discovered today. |
| ECC | Context system | `FUTURE-ECOSYSTEM.md:L79`; handoff §15 | REFERENCE | |
| Superpowers | Optional contractor | `contractors.ts:L22-L29` | IMPLEMENTED (optional) | Not a dependency. |
| T3 | Control-cockpit inspiration | `PRODUCT-DIRECTION.md:L106-L108`; `FUTURE-ECOSYSTEM.md:L255-L266` | REFERENCE | No accidental dependency. |
| OmniRoute | Router inspiration | `PRODUCT-DIRECTION.md:L110`; `FUTURE-ECOSYSTEM.md:L268-L280` | REFERENCE | |
| Linger | Local personal-agent study | `PRODUCT-DIRECTION.md:L131-L143`; `FUTURE-ECOSYSTEM.md:L179-L253` | REFERENCE (study; "may eventually be an integration target" L225) | |
| Home Ezy Node | Self-hosted destination | `FUTURE-ECOSYSTEM.md:L385-L409` | FUTURE | Last in the evolution order. |

---

## 6. Architecture verdict

- **Modularity:** good. Small single-purpose modules with an injection seam for I/O. CLI arg parsing is hand-rolled and duplicated per command (`index.ts:L377-L420`), which is acceptable at this size.
- **Over-engineered:** only the reserved lifecycle layer (R4), and it is honestly labelled. The documentation volume (about 3,000 lines of authority plus architecture docs, a 2,826-line handoff, and 35 archive files) is heavier than the 2.4k-LOC product it governs. Its weight is mostly governance, not wrong content.
- **Under-engineered:**
  - Contractor presence (F2).
  - Install input validation and pinning (S1, S2).
  - Release automation (S4, S5).
  - Machine-readable contract (R1).
  - Heuristic requirement quality (F5).
- **Coupling:** low. One coupling smell: `planOutcome` always performs a filesystem write (the brain side effect inside a "planning" function, `plan.ts:L205`). That makes "plan" impure and is what lets tests write into the repo (F9).
- **Long-term alignment:** the decide-then-hand-off core does not block the ecosystem. The missing seam is a structured output contract (R1), which every future layer (verification, UI, adapters, orchestration) would consume.

---

## 7. Previous-audit challenge

| Previous conclusion | Verified? | Evidence | My conclusion |
|---|---|---|---|
| Verdict "ALIGNED WITH MINOR DOC CLEANUP" | **No** | F1, F2, F3, F4, S1–S5 | Does not hold. The docs largely describe the code correctly, but there is a red/flaky test, a broken-instruction path in the shipped broker slice, a current-phase spec that contradicts shipped packaging, install-path network leakage, and unaddressed install hardening. Verdict: **RECONCILIATION + TESTING REQUIRED + PACKAGING WORK REQUIRED**. The core is SOLID. |
| "No material documentation conflicts" | Wrong | F3 (Phase 8 spec vs shipped), A1 | One real conflict (F3); one minor precedence ambiguity (A1). |
| CLI commands match docs; `brain refresh/enrich` missing from spec | Right | `index.ts:L435, L444`; `MVP:L23` | Confirmed (D1). |
| Brain auto-write undocumented in spec | Right | `plan.ts:L205` | Confirmed. It also missed F6 (staleness never surfaced) and F9 (tests write the repo brain). |
| Lifecycle = exported contracts only | Right | `index.ts:L120, L135`; no runtime importers | Confirmed. It also missed the requirement-shape mismatch R2. |
| Package self-contained | Asserted, unverified | — | **Now VERIFIED** by pack, clean install and run outside the repo. It missed S4–S7 and the absence of any CI check of the artifact (S5). |
| Superpowers optional | Right | `contractors.ts:L35-L38` | Confirmed. It missed that routing ignores whether Superpowers is installed (F2). |
| Network gating aligned | Partially wrong | `index.ts:L172-L174, L213, L224` | Aligned for 5 commands; `install` silently ignores `--local-only` (F4). |
| Tests: "41/41 pass" | Under-scoped | Full suite | The full suite is 188/189, with one cold-start timeout (F1). |
| CAPABILITY-MODEL Workflow row stale | Right | `CAPABILITY-MODEL.md:L11` | Confirmed (D5). |
| PRODUCT-DIRECTION vs FUTURE-ECOSYSTEM not a conflict | Right | §2 A5 | Confirmed. It missed the roadmap-horizon gap (D6) and README/AGENTS routing product intent to the handoff (A3). |
| LOCAL-AI-MODEL-ROUTING resolved | Right | L3, L11, L191 | Confirmed. |
| Confidence MEDIUM-HIGH | Overstated | — | It ran 5 of 21 test files, no build, no pack, and read no plan/spec docs. |
| Missed entirely | — | S1–S3, F5, F7, F8, F10, D2–D4, D6–D8, R1, R3 | See §4. |

---

## 8. Current-state verdict

**RECONCILIATION + TESTING REQUIRED + PACKAGING WORK REQUIRED**, with the core pipeline **SOLID — DO NOT REDESIGN**.

- Nothing needs a redesign.
- Nothing needs removal beyond archiving the superseded Phase 8 spec and plan.
- "BUILD NEXT" is justified only after Phases 0–3 below. The first build target is the structured output contract that unlocks roadmap Phases 9 and 10.

---

## 9. Sequential execution plan

Phases are derived from findings, not from the template. Repo roadmap phases are cited as "RM-n".

### PHASE 0 — Establish truth and make the gate green
**Objective:** make CI trustworthy, and give agents one consistent authority path and one packaging truth.

**Why this phase exists:** F1 (red/flaky gate), F3 (contradictory current-phase spec) and A2 (fragmented routing). Every later task is validated through the test gate and steered by these documents.

**Entry criteria:** none.

**Effort:** S. **Risk:** LOW. **Confidence:** HIGH.

**0.1 — Fix the cold-start CLI test timeout**
- Priority: P1. Status: FAILED (flaky).
- Why: the gate reports false failures, and every later task needs a reliable gate.
- Evidence: §0 ledger; `cli.test.ts:L42-L53`; `vitest.config.ts`.
- Action: raise the timeout for `apps/cli/src/cli.test.ts` only (for example `describe(…, { timeout: 30_000 })`, or a `testTimeout` scoped to that file). Do not change CLI behavior. Optionally warm up `tsx` once in a `beforeAll`.
- Dependencies: none. Blocks: everything validated by `pnpm test`.
- Risk if skipped: random red CI; agents may "fix" production code to chase a timing failure.
- Validation: in a **fresh clone**, `pnpm install && pnpm build && pnpm exec vitest run` reports 189/189 three consecutive times.
- Scope: test configuration only.

**0.2 — Record the distribution decision and supersede the Phase 8 spec and plan**
- Priority: P1. Status: CONTRADICTORY.
- Why: the current phase's only spec selects the opposite packaging design.
- Evidence: F3.
- Action:
  1. Add `docs/decisions/DECISION-SINGLE-PACKAGE-DISTRIBUTION.md`, recording one public `make-it-ezy` package, core private and bundled via `prepare-package.mjs`, and the options considered.
  2. Mark `docs/superpowers/specs/2026-11-18-phase8-launch-design.md` and `docs/superpowers/plans/2026-11-18-phase8-launch.md` as "Superseded by …" and move them to `docs/superpowers/archive/`.
  3. Add a row to `docs/decisions/README.md`.
- Dependencies: none. Blocks: 2.x (release hardening needs one target design).
- Risk if skipped: an agent "finishing Phase 8" re-splits the packages.
- Validation: `grep -rn "@make-it-ezy/cli" docs --include=*.md` returns only archive paths. The decision row exists.
- Scope: documentation only; no packaging changes.

**0.3 — Unify authority routing**
- Priority: P2. Status: AUTHORITY AMBIGUITY.
- Why: there are four reading orders, and AGENTS.md omits STATUS.md and PRODUCT-DIRECTION.md.
- Evidence: A1, A2, A3.
- Action:
  1. Add STATUS.md (current-state dashboard, derived) and PRODUCT-DIRECTION.md (product intent) to the AGENTS.md start sequence and hierarchy.
  2. Make `docs/AGENT-WORKFLOW.md:L7`, `README.md:L101-L115` and `docs/STATUS.md:L63-L69` **point to** the AGENTS.md order instead of restating it.
  3. Make `docs/decisions/README.md:L31-L35` reference AGENTS.md precedence rather than duplicate it, or state the scoping explicitly.
  4. Point README's "Product intent" row at PRODUCT-DIRECTION.md, with the handoff as "trust context".
- Dependencies: 0.2 (so the decision lands first). Blocks: 3.x (docs reconciled against a single authority).
- Risk if skipped: agents read docs in different orders and resolve conflicts differently.
- Validation: exactly one file contains a full reading order; every other index links to it.
- Scope: navigation text only; do not rewrite content.

**Phase 0 exit criteria**
- [ ] Fresh-clone full test run passes 3/3 consecutively.
- [ ] `pnpm check:ci` passes.
- [ ] Packaging decision recorded; Phase 8 spec and plan archived as superseded.
- [ ] One canonical reading order (AGENTS.md); others link to it.

### PHASE 1 — Correct the shipped behavior (current MVP, RM-8)
**Objective:** make the shipped broker slice and the install path do what users and agents are told.

**Why this phase exists:** F2, F4, F5, F6, F7 and F8. These are behavior defects in shipped surfaces, so they precede documentation (docs should describe the fixed behavior once).

**Entry criteria:** Phase 0 exit criteria met (green gate).

**Effort:** M. **Risk:** LOW–MEDIUM. **Confidence:** HIGH.

**1.1 — Contractor presence check and install guidance**
- Priority: P1. Status: PARTIAL.
- Why: the handoff instructs agents to load Superpowers skills that may not exist.
- Evidence: F2; reproduced output.
- Action:
  1. In `buildWorkflow` / `composeHandoffFromItems`, detect whether the contractor is present under `.agents/skills/`. The minimal heuristic is that at least one known Superpowers skill directory exists; use the same `isSkillInstalledLocally` helper.
  2. Add `installed` to the contractor `WorkflowStage`.
  3. When it is absent, emit a checklist line (`ezy install <skill> --source obra/superpowers`, or a documented manual step) and "(install first)" in the prompt.
  4. Never auto-install.
- Dependencies: 0.1. Blocks: 3.1, 4.1 (the contract shape includes `installed`).
- Risk if skipped: the first broker slice produces unexecutable instructions for new users.
- Validation: a new `handoff.test.ts` case covers both contractor-absent (install line plus marker) and contractor-present (no install line). Also check the `next` output on an empty fixture.
- Scope: no contractor registry, no automatic installation (`MVP-SPECIFICATION.md:L89-L94`).

**1.2 — Make `install` honor `--local-only` and reject unknown flags**
- Priority: P2. Status: ARCHITECTURAL RISK.
- Evidence: F4.
- Action:
  1. Parse `--local-only` in `parseInstallArgs` and thread `localOnly` into `planOutcome`, `recommendSkills`, `buildInstallPreview` and `buildHandoff`.
  2. When local-only and the source is unresolved, fail with "pass --source".
  3. Treat unknown `--flags` as a usage error (exit 1) rather than dropping them.
- Dependencies: 0.1. Blocks: 3.2.
- Risk if skipped: users who believe they are offline still send queries to skills.sh.
- Validation: CLI test showing `install --plan x --local-only` with a `fetchImpl`/no-network guard does not query; `install foo --bogus` exits 1.
- Scope: CLI parsing and option threading only.

**1.3 — Plan once in `install --plan`**
- Priority: P3. Status: PERFORMANCE RISK.
- Evidence: F7.
- Action: reuse the first `PlanReport` to compose the handoff (`composeHandoffFromItems`) instead of calling `buildHandoff` again.
- Dependencies: 1.2.
- Validation: a spy or counting test shows `planOutcome` is called once.
- Scope: no output changes.

**1.4 — Single stopword source**
- Priority: P2. Status: DUPLICATED / bug.
- Evidence: F5.
- Action: replace the inline `skip` set in `capabilities.ts:L106` with `STOPWORDS` from `score-skill.ts`. Re-run the golden tests; update the golden `expect.json` only where the change is a demonstrable improvement.
- Dependencies: 0.1.
- Validation: "add a settings page with a form" no longer yields `add`; all four golden scenarios still pass.
- Scope: do not redesign the lexicon.

**1.5 — Surface brain staleness**
- Priority: P2. Status: DEAD / doc promise.
- Evidence: F6; `skills/ezy/SKILL.md:L48`.
- Action: in `ezy brain` (`index.ts:L452-L463`), compute `computeFingerprint(root)` and print "stale — run ezy brain refresh" when `isBrainStale` is true.
- Dependencies: 0.1.
- Validation: a CLI test with a modified fingerprint shows the stale marker.
- Scope: read-only display; no auto-refresh.

**1.6 — Exact-match-only remote attribution**
- Priority: P3. Status: correctness.
- Evidence: F8.
- Action:
  - In `inspect`, set `remoteInstalls` only for an exact name match.
  - In `install`, when there is no exact match, require `--source` instead of falling back to `hits[0]`, or label the fallback explicitly in the preview.
- Dependencies: 1.2.
- Validation: unit tests with a mismatched `fetchImpl` response.

**Phase 1 exit criteria**
- [ ] With a feature brief and no Superpowers installed, `next` prints a contractor install step and marker (test).
- [ ] `install … --local-only` performs zero fetches (test); unknown flags exit 1.
- [ ] No verb stopwords appear as requirements (golden tests still pass).
- [ ] `ezy brain` reports staleness (test).
- [ ] Gate green.

### PHASE 2 — Release and distribution hardening (the real remaining RM-8 work)
**Objective:** make "npm install -g make-it-ezy" safe and reproducible, and keep it continuously proven.

**Why this phase exists:** S1–S9. The self-contained claim is true today but proven only manually; the install boundary still has open audit findings.

**Entry criteria:** Phase 0 complete (0.2 fixes the target design). It can run in parallel with Phase 1.

**Effort:** M. **Risk:** MEDIUM (touches release). **Confidence:** HIGH.

**2.1 — Packaged-artifact smoke test in CI**
- Priority: P1. Status: TEST GAP.
- Evidence: S5.
- Action:
  1. Add a CI step after build: `cd apps/cli && npm pack`.
  2. Install the tarball into a temp prefix.
  3. In a temp directory outside the repo, run `ezy --help` and `ezy plan "x" --local-only`, and assert exit 0 with no `@make-it-ezy/core` resolution error.
  4. Optionally add the same as a vitest test against `dist`.
- Dependencies: 0.1. Blocks: 2.2, any publish.
- Validation: CI job passes; deliberately breaking the import rewrite makes it fail.
- Scope: verification only.

**2.2 — Build-on-pack and clean dist**
- Priority: P2. Status: PACKAGING RISK.
- Evidence: S4.
- Action: add `"prepack": "pnpm run build"` (or an equivalent) in `apps/cli/package.json`. Make `prepare-package.mjs` remove `dist/core` before `cpSync`, and ensure the tsc output directory is cleaned first.
- Dependencies: 2.1.
- Validation: a stale file planted in `dist/core` does not appear in the `npm pack` listing.

**2.3 — Install-boundary hardening**
- Priority: P2. Status: SECURITY RISK. This item is open since the prior audit.
- Evidence: S1, S2.
- Action:
  1. Validate `name` against `/^[A-Za-z0-9._-]{1,100}$/` and `source` against `^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$`, rejecting any leading `-`. Apply this to CLI input **and** remote hits before they reach the preview.
  2. Pin the installer as `npx --yes skills@<exact version>` and record the version in one constant.
  3. Show the pinned command in the preview.
- Dependencies: 1.2.
- Validation: unit tests for malicious names and sources (`../x`, `--flag`, `a/b/c`) are rejected; the preview shows a pinned version.
- Scope: no deep static analysis or trust scoring (these are explicitly not shipped, `SECURITY-MODEL.md:L26`).

**2.4 — Windows-safe spawn decision**
- Priority: P2. Status: PACKAGING RISK (unverified at runtime).
- Evidence: S3.
- Action: either resolve `npx.cmd` on `win32` (no `shell: true`, to keep injection-safety), or document "macOS/Linux only" in the README and MVP spec plus an `os` hint. Add a `windows-latest` CI job if Windows is supported.
- Dependencies: 2.3.
- Validation: a Windows CI job running the install preview with a stubbed spawn, or the documented limitation.

**2.5 — Node 20 in the CI matrix**
- Priority: P3. Status: TEST GAP.
- Evidence: S8.
- Action: matrix `node-version: [20, 22]`.
- Validation: both jobs green.

**2.6 — Publish procedure and licence**
- Priority: P2/P3.
- Evidence: S4, S6; no publish workflow.
- Action:
  1. Decide manual versus automated publish and record it in the 0.2 decision.
  2. Write a short maintainer checklist (version from release-please → `pnpm build` → artifact smoke → `npm publish`).
  3. Copy LICENSE into the package (`files` or a copy step).
  4. Verify whether the npm name is published or owned. This is a maintainer action; the audit did not query the registry.
- Dependencies: 2.1, 2.2.
- Validation: the tarball lists LICENSE; the checklist exists in one place (MVP or CONTRIBUTING).

**2.7 — Cosmetic release hygiene**
- Priority: P4.
- Evidence: S7, S9, D7.
- Action: rename the root package (for example `make-it-ezy-workspace`), update the help banner (`index.ts:L35`), and make the `inspect` help text mention remote metadata.
- Validation: `pnpm -r ls` shows unique names; the help text matches the MVP spec.

**Phase 2 exit criteria**
- [ ] CI builds, packs, installs and runs the artifact outside the repo.
- [ ] Pack always rebuilds from clean.
- [ ] Install validates name and source and pins the installer.
- [ ] Platform support is stated and tested.
- [ ] Node 20 and 22 green.
- [ ] LICENSE ships.
- [ ] Publish procedure documented.

### PHASE 3 — Reconcile documentation to the fixed behavior
**Objective:** the authoritative docs describe exactly the post-Phase-1/2 behavior, side effects included.

**Why this phase comes after code:** Phases 1–2 change install flags, contractor output and the installer command. Documenting first would mean documenting twice. (Phase 0 handled the documentation that steers agents.)

**Entry criteria:** Phases 1 and 2 merged.

**Effort:** S. **Risk:** LOW. **Confidence:** HIGH.

**3.1 — MVP-SPECIFICATION completeness**
- Priority: P2.
- Evidence: D1, D2.
- Action: add `brain refresh` / `brain enrich`; state that `plan`, `next` and `install --plan` write `.ezy/brain.json`; state the network-default table (§3.4); describe the contractor install guidance; give platform support.
- Validation: every command in `index.ts:L35-L74` help appears in the MVP spec, and every side effect in §3.4 is listed.

**3.2 — SECURITY-MODEL refresh**
- Priority: P3.
- Evidence: D3.
- Action: add the `.ezy` writes and the default-on remote calls; describe install validation and pinning; move the dated licence snapshot into research.

**3.3 — Architecture doc wording**
- Priority: P3.
- Evidence: D4, D5.
- Action: in SHARED-EVIDENCE, replace "now implemented" with "contracts exist, not wired"; update the CAPABILITY-MODEL Workflow row.

**3.4 — Roadmap horizon placement**
- Priority: P3.
- Evidence: D6.
- Action: add one "Beyond Phase 14 — unscheduled" list to ROADMAP that points at the FUTURE-ECOSYSTEM evolution order (agent control → multi-agent → routing → memory/RAG → hybrid → Home Node). Disambiguate RM-10 "Web UI" (planner UI) from the future "control cockpit".
- Validation: no future concept appears in FUTURE-ECOSYSTEM without either a roadmap phase or an "unscheduled" placement.

**3.5 — Small fixes**
- Priority: P4.
- Evidence: D8, D9.
- Action: fix the `ci-before-push` path and the escaped backticks.

**Phase 3 exit criteria**
- [ ] A doc-vs-code checklist (commands, flags, side effects, network) is all ✓.
- [ ] No "current" doc references superseded designs.
- [ ] Roadmap places every future concept.

### PHASE 4 — Core contract stabilization (prerequisite for RM-9 and RM-10)
**Objective:** expose a versioned, machine-readable plan/handoff contract and remove the duplicated models that would fork under new consumers.

**Why this phase exists:** R1, R2 and R3. Both verification and Web UI "use the same core" (`ROADMAP.md:L99`), and both need structured data rather than prose.

**Entry criteria:** Phase 3 complete. Explicit approval is needed, because this is new behavior under `AGENTS.md:L195`; JSON output adds no dependencies.

**Effort:** M. **Risk:** MEDIUM. **Confidence:** MEDIUM.

**4.1 — `--json` for `plan` and `next`**
- Priority: P2. Status: MISSING.
- Action: emit `{ schemaVersion: 1, …PlanReport }` and `{ schemaVersion: 1, …HandoffReport }`. Document the schema in the MVP spec. Golden-test the JSON shape. Ensure there is no human text on stdout in JSON mode.
- Dependencies: 1.1 (the contractor `installed` field is part of the shape).
- Validation: snapshot tests; `ezy next … --json | node -e 'JSON.parse(…)'` works in the CLI test.
- Scope: no new commands; no API server.

**4.2 — One requirement model**
- Priority: P3. Status: DUPLICATED.
- Action: define one exported `Requirement` (with `priority`), and an adapter for lifecycle `{required}` (or migrate lifecycle-types to `priority`). Keep the brief schema stable (it is a user-facing file format).
- Dependencies: 4.1.
- Validation: typecheck; lifecycle tests are updated mechanically only.

**4.3 — One selection engine, or a documented distinction**
- Priority: P3. Status: DUPLICATED.
- Action: either make `recommendSkills` call `selectCapabilities` with query-derived requirements, or document why `recommend` is intentionally distinct (quick shortlist) in the MVP spec.
- Validation: `recommend.test.ts` and `select.test.ts` both green; the decision is recorded.

**4.4 — Make planning pure; isolate the brain write**
- Priority: P3. Status: ARCHITECTURAL RISK (side effect inside the planner).
- Action: move `persistBrainAfterPlan` from `planOutcome` into the CLI command handlers, or behind an option such as `persistBrain: true` that defaults on in the CLI only.
- Validation: unit tests no longer write any `.ezy` (fixes F9); CLI behavior is unchanged (test).
- Scope: same on-disk format.

**Phase 4 exit criteria**
- [ ] JSON contract v1 is documented and golden-tested.
- [ ] One requirement type is used across planner and lifecycle.
- [ ] The selection-engine decision is recorded.
- [ ] Core planning has no hidden filesystem writes.

### PHASE 5 — RM-9 Outcome Verification (reuse the lifecycle contracts)
**Objective:** let the host agent report verification evidence and let Ezy evaluate it against the plan's requirements, with Ezy **not executing anything**.

**Why this phase exists:** it is the next accepted roadmap phase. `evaluateOutcome` already exists unwired (`lifecycle.ts:L124`), so this phase is about reusing it.

**Entry criteria:** Phase 4 (JSON plan contract, unified requirements). A decision record for the verification scope.

**Effort:** M. **Risk:** MEDIUM. **Confidence:** MEDIUM.

- **5.1 (P2) Decision record — verification scope.** Ezy evaluates host-supplied evidence (tests passed, build passed, unmet requirements); Ezy does not run tests itself. Validation: an accepted decision exists.
- **5.2 (P2) `ezy verify --plan <json> --evidence <json>`** (name to be decided in 5.1). Wire `evaluateOutcome`; output PASS/FAIL/UNCERTAIN plus reasons (the existing contract semantics, `lifecycle.test.ts:L59-L70`). Validation: CLI tests for each decision.
- **5.3 (P3) Record the last outcome in the brain** (a `lastOutcome` machine field, schema v1 additive). Validation: the brain round-trip test preserves the agent slice.
- **5.4 (P3) Adapter update.** `skills/ezy/SKILL.md` adds a "report evidence → ezy verify" step. Validation: the adapter text matches the CLI help.
- **Scope:** no telemetry, no shared evidence upload, no autonomous retries (`STATUS.md:L51-L59`).

**Exit criteria**
- [ ] The verify command is wired to `evaluateOutcome` with tests.
- [ ] The MVP and HOW-IT-WORKS docs move verification from "future" to shipped for exactly the implemented scope.
- [ ] Lifecycle docs are updated to say which contract is now wired.

### PHASE 6 — RM-10 Web UI (read-only view over the core contract)
**Objective:** a local UI that renders plan, handoff, workflow, brain and verification from the JSON contract.

**Why this phase exists:** it is the accepted roadmap phase. Phase 4 makes it possible without a second architecture (`ROADMAP.md:L99`).

**Entry criteria:** Phases 4–5. A decision record for the UI stack, preferring reuse of an existing framework over a bespoke one, and for local-only serving.

**Effort:** L. **Risk:** MEDIUM–HIGH (new surface). **Confidence:** LOW (no requirements exist yet).

- **6.1 (P2) Decision and spec:** scope, which is a read and trigger layer for existing commands and **not** the T3-style agent cockpit.
- **6.2 (P2) Implementation:** consumes only `--json` outputs and core functions; no new planning logic.
- **6.3 (P3) Tests:** contract-driven UI tests.
- **Scope:** no agent sessions, no provider routing.

**Exit criteria**
- [ ] The UI renders every field of the JSON v1 contract.
- [ ] Zero planning logic lives outside core.
- [ ] Local-only by default.

### PHASE 7 — RM-11 to RM-13: capability ecosystem, host integration, continuity (evidence-gated)
**Objective:** improve discovery quality and trust state, prove one or two hosts end-to-end, and strengthen continuity.

**Entry criteria:** Phases 5–6 shipped; real usage evidence shows where planning fails (for example, recorded verify outcomes).

**Effort:** L–XL. **Risk:** MEDIUM. **Confidence:** LOW.

- **7.1 (P3) Remote discovery depth decision (S10).** Decide whether to fetch descriptions or `SKILL.md` for skills.sh hits, with caching, size limits and sanitization. Decide only when evidence shows name-only matching is the bottleneck.
- **7.2 (P3) Contractor entries beyond Superpowers.** Only after 1.1 holds and a second contractor has a concrete user need; keep it a static list, not a registry (`MVP-SPECIFICATION.md:L91`).
- **7.3 (P3) Host integration.** Prove Claude Code and Codex end-to-end via `skills/ezy` before building any adapter (`INTEGRATIONS.md:L86-L94`).
- **7.4 (P3) Continuity.** Brain resume/recovery (RM-13) builds on the `lastOutcome` field from 5.3.

### PHASE 8 — Beyond the accepted roadmap (decision gates only, no build)
Agent control, multi-agent execution, the router, RAG/memory, MCP, hybrid execution and the Home Ezy Node remain **unscheduled**. Each requires the decision in §11 first. FUTURE-ECOSYSTEM's evolution order (`L413-L435`) is the sequence to respect.

---

## 10. Dependency graph, critical path, parallelism

```text
PHASE 0 Truth & green gate
  0.1 fix CLI timeout ──┬──────────────────────────────────────────────┐
  0.2 packaging decision┼──► PHASE 2 Release hardening                 │
  0.3 authority routing │       2.1 artifact smoke ─► 2.2 prepack/clean │
                        │       2.3 install validation+pin ◄─ 1.2      │
                        │       2.4 Windows ─ 2.5 Node20 ─ 2.6 publish  │
                        ▼                                               │
                PHASE 1 Shipped-behavior fixes  (parallel with Phase 2) ◄┘
                  1.1 contractor presence  1.2 install --local-only ─► 1.3 plan-once
                  1.4 stopwords  1.5 brain stale  1.6 exact-match
                        │
                        ▼
                PHASE 3 Doc reconciliation (after 1+2)
                        │
                        ▼
                PHASE 4 JSON contract ─► unified Requirement ─► pure planner
                        │
                        ▼
                PHASE 5 RM-9 Verify (wire lifecycle.evaluateOutcome)
                        │
                        ▼
                PHASE 6 RM-10 Web UI (read-only over contract)
                        │
                        ▼
                PHASE 7 RM-11..13 (evidence-gated)
                        │
                        ▼
                PHASE 8 decision gates: agent control → routing → memory/RAG → hybrid → Home Node
```

**Critical path:** 0.1 → 1.1 → 3.1 → 4.1 → 5.2 → 6.2. This is the shortest sequence that turns today's text-only planner into a verifiable, UI-consumable core, which is the foundation every future layer consumes.

| Category | Items |
|---|---|
| Hard blockers | 0.1 (gate); 0.2 (release target); 4.1 (any structured consumer) |
| Soft blockers | 1.2 before 2.3 (shared parsing); 1.1 before 4.1 (shape) |
| Parallel | Phase 1 ∥ Phase 2; within Phase 1, 1.4/1.5/1.6 are independent; 0.3 ∥ 0.1 |
| Optional | 2.7, 3.5, 4.3 (if documented instead), 1.3 |
| Must NOT happen yet | anything in Phase 8; a contractor registry; trusted-auto install; telemetry |

---

## 11. EXPLICITLY DEFERRED / DO NOT BUILD YET

| What | Why tempting | Why wait | Unlocked by |
|---|---|---|---|
| Ezy Router / provider routing (OmniRoute-style) | Heavily documented (`FUTURE-ECOSYSTEM.md:L268-L280, L350-L383`) | Ezy does not execute anything; there is nothing to route | An accepted "Ezy executes or controls agents" decision; a verify loop (Phase 5) to measure routing quality |
| Multi-agent orchestration / agent control | Vision diagrams; T3 study | Contradicts current boundary (`AGENTS.md:L128-L134`) | A decision record changing the boundary, after host integration (7.3) is proven |
| T3-style control cockpit | Linked to the Web UI | RM-10 is a planner UI; the cockpit needs agent control first | Phase 8 agent-control decision |
| RAG / vector memory | Brain plus "context" vision | Brain is small structured JSON; no retrieval need is demonstrated (`requirements.ts:L40` even lists "vector database — not required") | Evidence that brain or brief context is insufficient (RM-13 findings) |
| MCP discovery / integration | FUTURE-ECOSYSTEM tools layer | Skills discovery is not mature; MCP adds a new trust surface | Phase 7 discovery quality plus a security decision |
| Local model routing / local inference | `ezy-routing` reference doc | Explicitly a reference, not a feature (`LOCAL-AI-MODEL-ROUTING.md:L11`) | Router decision |
| Linger integration | Rich capability overlap | Study reference; "not automatically an Ezy dependency" (`FUTURE-ECOSYSTEM.md:L225`) | A USE/ADAPT/WRAP evaluation once local execution is in scope |
| Home Ezy Node | Final destination | Last in the evolution order (`FUTURE-ECOSYSTEM.md:L430`) | Every stage above |
| Contractor registry / catalog | `catalog/` exists; contractor abstraction | One contractor; `catalog/` is reserved (`ARCHITECTURE.md:L70`); "giant catalog" is deliberately not current (`STATUS.md:L56`) | A second real contractor with a user need (7.2) |
| Trusted-auto install, deep skill verification, trust scores | Long trust model in the handoff | Explicitly not shipped (`SECURITY-MODEL.md:L26`); needs evidence infrastructure | Phase 5 evidence plus a decision |
| Shared evidence / telemetry | Lifecycle `aggregateEvidence` exists | No consent model; hosted telemetry is deliberately not current (`STATUS.md:L57`) | A privacy and consent decision (`SHARED-EVIDENCE-LEARNING.md:L18`) |
| LLM inside Ezy | Better requirement extraction | Brief-from-host-agent is the design; "no LLM" is a stated invariant (`MVP-SPECIFICATION.md:L57`) | Evidence that heuristics plus brief fail, and an explicit product decision |
| Domain expansion beyond coding | Vision | "Only after the coding workflow is stable" (`ROADMAP.md:L141`) | Phases 5–7 exit |
| Wiring the remaining lifecycle contracts (intake, composeSkillSpec, proposeImprovement) | They already exist | No consumer; speculative | A specific phase that needs one |

---

## 12. Architectural decision points (do not decide prematurely)

| Decision | Current recommendation | Why | Evidence required | Revisit when | Would change if |
|---|---|---|---|---|---|
| Distribution shape | **Decide now (0.2):** keep the single bundled package | It is what ships and works (verified) | Done | Core needs independent consumers | A third-party wants `@make-it-ezy/core` as a library |
| Publish automation | Manual with checklist until 2.1 exists; then consider CI publish | No artifact test yet | 2.1 green for a few releases | After Phase 2 | Release frequency grows |
| Contractor installation policy | Detect and guide; never auto-install | Trust model; `MVP:L92` | — | 7.2 | Verified, pinned contractor sources exist |
| Remote discovery depth | Stay name-only now | Avoid fetching untrusted content before validation exists | Recorded plan misses attributable to name-only matching | Phase 7 | Verify outcomes show discovery misses |
| Output contract versioning | JSON v1 with `schemaVersion`, additive changes only | UI and verify consumers | — | Phase 4 | A breaking consumer need |
| Verification scope | Evaluate host-supplied evidence only | Ezy does not execute (`HOW-IT-WORKS.md:L33-L38`) | — | Phase 5 | A boundary-change decision |
| Ezy executes/controls agents (boundary shift) | **Not now** | Contradicts the current product truth | Host-integration proofs; a user need for orchestration | After Phase 7 | Users repeatedly need cross-agent coordination Ezy cannot hand off |
| Router: build vs reuse | Reuse/WRAP an existing router before BUILD (`FUTURE-ECOSYSTEM.md:L227-L238`) | Composition principle | A provider-routing requirement | After the boundary shift | No suitable router fits |
| Persistence model | Keep JSON files in `.ezy/` | "No database first" (handoff §35) | Size or concurrency problems | RM-13 | Multi-project or Home Node |
| RAG / memory | Defer | No demonstrated retrieval gap | Brief or brain insufficiency evidence | RM-13 | — |
| MCP strategy | Defer | New trust surface | Skill pipeline maturity; security decision | Phase 7+ | — |
| Local models | Keep the reference doc only | Not a product feature | Router decision | Phase 8 | — |
| Home Node architecture | Defer | Last stage | All of the above | — | — |
| Windows support | Decide in 2.4 | Spawn behavior differs | User demand | Phase 2 | — |

---

## 13. MASTER TODO LIST (execution order)

```text
[ ] P1 — Fix cold-start CLI test timeout; fresh-clone suite green 3/3 (Phase 0 / 0.1)
[ ] P1 — Record single-package distribution decision; archive superseded Phase 8 spec+plan (Phase 0 / 0.2)
[ ] P2 — Canonical reading order in AGENTS.md; other indexes link to it; README intent row → PRODUCT-DIRECTION (Phase 0 / 0.3)
[ ] P1 — Contractor presence check + install guidance in handoff (Phase 1 / 1.1)
[ ] P1 — Packaged-artifact smoke test in CI (pack → install → run outside repo) (Phase 2 / 2.1)   ∥ Phase 1
[ ] P2 — install: honor --local-only, reject unknown flags (Phase 1 / 1.2)
[ ] P2 — Unify stopwords (capabilities fallback uses STOPWORDS) (Phase 1 / 1.4)
[ ] P2 — Show brain staleness in `ezy brain` (Phase 1 / 1.5)
[ ] P2 — prepack build + clean dist/core before copy (Phase 2 / 2.2)
[ ] P2 — Validate install name/source; pin `skills` installer version (Phase 2 / 2.3)
[ ] P2 — Windows spawn decision (+ windows CI job or documented limitation) (Phase 2 / 2.4)
[ ] P3 — install --plan: plan once (Phase 1 / 1.3)
[ ] P3 — Exact-match-only remote attribution in inspect/install (Phase 1 / 1.6)
[ ] P3 — Node 20+22 CI matrix (Phase 2 / 2.5)
[ ] P2 — Publish checklist + LICENSE in tarball + confirm npm name/publication (maintainer) (Phase 2 / 2.6)
[ ] P4 — Rename root workspace package; update help banner + inspect help (Phase 2 / 2.7)
[ ] P2 — MVP-SPEC: brain subcommands, brain writes, network table, contractor guidance, platform (Phase 3 / 3.1)
[ ] P3 — SECURITY-MODEL refresh (Phase 3 / 3.2)
[ ] P3 — SHARED-EVIDENCE + CAPABILITY-MODEL wording (Phase 3 / 3.3)
[ ] P3 — ROADMAP "Beyond Phase 14 — unscheduled" + Web UI vs cockpit disambiguation (Phase 3 / 3.4)
[ ] P4 — ci-before-push path; escaped backticks (Phase 3 / 3.5)
[ ] P2 — [needs approval] --json contract v1 for plan/next (Phase 4 / 4.1)
[ ] P3 — One Requirement model across planner/lifecycle (Phase 4 / 4.2)
[ ] P3 — Consolidate or document recommend vs select engines (Phase 4 / 4.3)
[ ] P3 — Move brain persistence out of planOutcome (fixes test writing repo .ezy) (Phase 4 / 4.4)
[ ] P2 — Decision: verification scope (Phase 5 / 5.1)
[ ] P2 — ezy verify wired to evaluateOutcome (Phase 5 / 5.2)
[ ] P3 — Brain lastOutcome; adapter verify step (Phase 5 / 5.3–5.4)
[ ] P2 — Decision + spec: Web UI scope (planner UI, not cockpit) (Phase 6 / 6.1)
[ ] P2 — Web UI over JSON contract (Phase 6 / 6.2–6.3)
[ ] P3 — Evidence-gated: discovery depth, 2nd contractor, host proofs, continuity (Phase 7)
[ ] —  Phase 8 items: decision records only; no implementation
```

---

## 14. AI coding agent handoff cards

Every card requires reading `AGENTS.md` first. In every card's validation, "gate" means `pnpm check:ci`.

**P0-1 (0.1)**
- **Goal:** CLI tests never time out on a cold start.
- **Files:** `apps/cli/src/cli.test.ts`; optionally `vitest.config.ts`.
- **Context:** §0 ledger; F1.
- **Dependencies:** none.
- **Boundary:** test configuration only.
- **Tests:** existing suite.
- **Validate:** fresh clone; `pnpm install && pnpm build && pnpm exec vitest run` passes 3 times.
- **Expected:** 189/189.
- **Do not touch:** `apps/cli/src/index.ts`.

**P0-2 (0.2)**
- **Goal:** one recorded packaging truth.
- **Files:** `docs/decisions/` (new file plus README row), `docs/superpowers/specs/2026-11-18-phase8-launch-design.md`, `docs/superpowers/plans/2026-11-18-phase8-launch.md` (moved to `docs/superpowers/archive/`).
- **Context:** F3.
- **Boundary:** documentation only.
- **Validate:** `grep -rn "@make-it-ezy/cli" docs` hits only archive paths.
- **Do not touch:** `package.json` files.

**P1-1 (1.1)**
- **Goal:** contractor stage reports install state and guidance.
- **Files:** `packages/core/src/handoff.ts`, `handoff-types.ts`, `format.ts`, `handoff.test.ts`; possibly `contractors.ts` (a marker skill name list).
- **Context:** F2; `install.ts:L24-L28` (`isSkillInstalledLocally`).
- **Dependencies:** P0-1.
- **Boundary:** no auto-install, no registry.
- **Tests:** contractor absent and present.
- **Validate:** `pnpm exec vitest run packages/core/src/handoff.test.ts`, then the gate.
- **Expected:** a checklist line plus "(install first)" when absent.
- **Do not touch:** `plan.ts` selection logic.

**P1-2 (1.2 + 1.3)**
- **Goal:** install respects `--local-only`, rejects unknown flags, and plans once.
- **Files:** `apps/cli/src/index.ts` (`parseInstallArgs`, `resolveInstallTarget`, `appendInstallHandoff`, `handleInstall`), `packages/core/src/install.ts` (pass `localOnly`), `apps/cli/src/cli.test.ts`.
- **Dependencies:** P0-1.
- **Boundary:** CLI parsing and option threading.
- **Tests:** `--local-only` performs no fetch; an unknown flag exits 1.
- **Validate:** gate.
- **Do not touch:** the approval gating (`index.ts:L330-L343`).

**P1-3 (1.4)**
- **Goal:** one stopword list.
- **Files:** `packages/core/src/capabilities.ts`, `score-skill.ts`; golden fixtures only if justified.
- **Tests:** a requirements test for the "add a … page" case; golden tests.
- **Validate:** `pnpm exec vitest run packages/core/src/requirements.test.ts packages/core/src/golden.test.ts`.
- **Do not touch:** the lexicon entries.

**P1-4 (1.5)**
- **Goal:** `ezy brain` shows staleness.
- **Files:** `apps/cli/src/index.ts:L432-L464`, `packages/core/src/format.ts` (`formatBrainHuman`), `brain.ts` (existing `isBrainStale`, `computeFingerprint`).
- **Tests:** a CLI test.
- **Do not touch:** the brain file format.

**P2-1 (2.1 + 2.2)**
- **Goal:** the CI-proven self-contained artifact.
- **Files:** `.github/workflows/ci.yml`, `apps/cli/package.json` (`prepack`), `apps/cli/scripts/prepare-package.mjs` (clean step).
- **Validate:** a CI step running `npm pack` → install into a temp prefix → `ezy --help` and `ezy plan x --local-only` in a temp directory.
- **Do not touch:** core source.

**P2-2 (2.3)**
- **Goal:** a safe install boundary.
- **Files:** `packages/core/src/install.ts`, `apps/cli/src/index.ts` (`--source` parsing), `packages/core/src/search-remote.ts` (drop or flag invalid sources), `install.test.ts`.
- **Tests:** rejection cases (`../x`, `-x`, `a/b/c`); pinned command in the preview.
- **Do not touch:** the approval flow.

**P3-x (3.1–3.5)**
- **Goal:** docs equal post-fix behavior.
- **Files:** `docs/MVP-SPECIFICATION.md`, `docs/architecture/SECURITY-MODEL.md`, `SHARED-EVIDENCE-LEARNING.md`, `CAPABILITY-MODEL.md`, `docs/ROADMAP.md`, `CONTRIBUTING.md`, `docs/CI.md`, `docs/PRODUCT-DIRECTION.md`, `docs/architecture/FUTURE-ECOSYSTEM.md` (escapes only).
- **Validate:** a manual checklist mapping help text to the MVP spec, and §3.4 side effects to the MVP spec.
- **Do not touch:** the FUTURE-ECOSYSTEM content.

**P4-1 (4.1)** (needs approval)
- **Goal:** `--json` for plan and next.
- **Files:** `apps/cli/src/index.ts`, `packages/core/src/plan-types.ts`, `handoff-types.ts`, a new golden JSON fixture, `cli.test.ts`.
- **Boundary:** additive flag.
- **Validate:** `JSON.parse` of the output in a test; snapshot.

---

## 15. Effort / risk summary

| Phase | Effort | Risk | Confidence |
|---|---|---|---|
| 0 Truth & green gate | S | LOW | HIGH |
| 1 Shipped-behavior fixes | M | LOW–MED | HIGH |
| 2 Release hardening | M | MED | HIGH |
| 3 Doc reconciliation | S | LOW | HIGH |
| 4 Core contract | M | MED | MED |
| 5 RM-9 Verify | M | MED | MED |
| 6 RM-10 Web UI | L | MED–HIGH | LOW |
| 7 RM-11..13 | L–XL | MED | LOW |
| 8 Beyond roadmap | — (decisions only) | VERY HIGH if built early | LOW |

---

## FINAL VERDICT

1. **What is Make It Ezy today?** A dependency-free, local-first TypeScript CLI (about 2.4k LOC of product code) with a single deterministic planning pipeline. It analyzes the project, takes requirements from an agent-written brief or a keyword heuristic, discovers skills locally and on skills.sh, and selects a coverage-based minimum set. When the brief's task type matches, it routes optionally to one hard-coded contractor (Superpowers). It prints a text handoff and workflow, gates `npx skills add` behind approval, and caches project facts in `.ezy/brain.json`. It ships as one self-contained npm package, which this audit verified end to end.
2. **Solid; do not change:**
   - The `analyze → requirements → search → select → plan → handoff` design.
   - Zero runtime dependencies, with I/O injection seams.
   - Brief validation and sanitization.
   - Approval-gated install.
   - The bundled packaging approach.
   - Hermetic network tests.
   - The decide-versus-execute boundary.
3. **Broken:**
   - A cold-start test timeout makes the suite red/flaky (F1).
   - The handoff routes to an absent contractor (F2).
   - `install` silently ignores `--local-only` (F4).
   - Verb stopwords leak into requirements (F5).
4. **Incomplete:**
   - Install validation and pinning (S1, S2), still open from the prior audit.
   - Release automation and artifact testing (S4, S5).
   - Brain staleness surfacing (F6).
   - A machine-readable contract (R1).
   - Windows support (S3).
5. **Undocumented:**
   - Brain writes on plan/next/install, and `brain refresh` / `brain enrich` in the spec (D1).
   - The network-default matrix (D2).
   - SECURITY-MODEL side effects (D3).
6. **Over-engineered:** mildly, the reserved lifecycle layer and the documentation volume relative to the code. Neither needs removal.
7. **Under-engineered:**
   - Contractor handling.
   - The install boundary.
   - Release pipeline.
   - Heuristic requirement extraction.
   - Name-only remote discovery.
8. **Future-only:** domains beyond coding, agent control, multi-agent execution, the router, providers, RAG, MCP, hybrid local/cloud execution, the Home Ezy Node, shared evidence, and the T3, OmniRoute and Linger references.
9. **To remove:** nothing from the code. Archive the superseded Phase 8 spec and plan.
10. **Build next:** after Phases 0–3, the versioned `--json` plan/handoff contract (4.1), then wire `evaluateOutcome` for roadmap Phase 9.
11. **Do NOT build yet:** everything in §11, especially the router, agent control, RAG, MCP, a contractor registry, trusted-auto install, telemetry and the Home Node.
12. **Critical path:** green gate (0.1) → correct broker slice (1.1) → reconciled spec (3.1) → JSON contract (4.1) → `ezy verify` over lifecycle (5.2) → Web UI over the contract (6.2) → evidence-gated ecosystem (7) → boundary-shift decision before any agent control or routing (8).
13. **Does "ALIGNED WITH MINOR DOC CLEANUP" hold?** **No.** The docs mostly match the code they describe, but the repository has a red/flaky gate, a shipped-behavior defect in the broker slice, a current-phase spec that contradicts shipped packaging, install-path network leakage, and open install hardening. The correct verdict is **RECONCILIATION + TESTING REQUIRED + PACKAGING WORK REQUIRED (core SOLID)**.

## EXACTLY FIVE IMMEDIATE NEXT TASKS

1. Fix the cold-start CLI test timeout so the fresh-clone suite is green 3/3 (Phase 0 / 0.1).
2. Record the single-package distribution decision and archive the superseded Phase 8 spec and plan (Phase 0 / 0.2).
3. Add contractor presence detection and install guidance to the handoff and workflow (Phase 1 / 1.1).
4. Add the packaged-artifact smoke test to CI: pack, install into a clean prefix, run `ezy` outside the repo (Phase 2 / 2.1).
5. Make `ezy install` honor `--local-only`, reject unknown flags, and plan only once (Phase 1 / 1.2 + 1.3).

## UNVERIFIED / REQUIRES FOLLOW-UP

| Item | Why unverified | Needed |
|---|---|---|
| Whether GitHub Actions CI fails on F1 | Did not query GitHub | Check recent CI runs for this branch or `main` |
| npm publication status and name ownership of `make-it-ezy` | Deliberately did not query the registry (privacy) | Maintainer runs `npm view make-it-ezy` |
| Windows behavior of `spawn("npx")` | No Windows environment | A Windows CI job |
| Node 20 runtime | Only Node 24 locally; CI uses 22 | A Node 20 job |
| The actual install location used by `npx skills add` (does it match `.agents/skills/<name>`?) | Did not run a real install (it would download and execute third-party code) | A sandboxed install test |
| Whether `npx` non-TTY auto-confirms the download in all npm versions | Relies on npm's documented behavior; not executed | Same sandboxed test |
| FUTURE-ECOSYSTEM `L240-L254` (Linger research backlog) and the 2,826-line handoff body | Read headers only; not line-by-line | A targeted read if Phase 8 decisions begin |
| `docs/AGENT-WORKFLOW.md` beyond L7, and `docs/BUILDER-SKILLS.md` | Spot-checked only | A read before task 0.3 |
| `codeql.yml` contents | Not opened | A read during Phase 2 |
| Heuristic quality across realistic outcomes | One manual sample plus golden fixtures | A small outcome corpus evaluated after 1.4 |
