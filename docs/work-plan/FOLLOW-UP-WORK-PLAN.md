# Follow-up work plan — proposal only

**Date:** 2026-11-25
**Inputs:** `docs/audits/FULL-REPOSITORY-AUDIT.md` (this branch), the repository's own docs/roadmap, and the working tree at `c06b9f7`.
**Status:** Proposal. **Nothing in this document has been started.** No source, config, test, CI or documentation file other than this plan was changed.

## What "value" means here

Items are ranked by, in order:

1. **How much uncertainty or risk it removes** (identity confusion, security, privacy, irreversibility).
2. **How much later work it unblocks** (does it make other items cheaper or testable?).
3. **Cost** — the smallest version that delivers the benefit, not the ideal version.
4. **Fit with the product's stated boundary** (local-first, no LLM in the CLI, host agent executes, discovery ≠ recommendation).

Effort keys: **S** ≈ under a day, **M** ≈ 1–3 days, **L** ≈ a week or more.

Ideas marked **[new]** are not in the audit's own §18 recommendations.

Item numbers are a **stable ID, not a rank**: the table below is ordered by rank, so an item added later can carry a high number while sitting near the top. Item 18 is new and slots in at rank 4 without renumbering 1–17.

---

## Ranked list

| # | Work | Value driver | Effort | Depends on |
|---|---|---|---|---|
| 1 | Product-truth ADR + retire competing handoffs | Ends the decision tax on every future change | S | — |
| 2 | Machine-readable plan receipt (`--json`, `.ezy/plan.json`) **[new]** | Makes recommendations a contract instead of prose | M | 1 |
| 3 | Trust artifact + hash verification loop **[new]** | Makes the trust claim real with no LLM and no service | M | 1, 2 |
| 18 | Intent intake + per-step skill mapping (Prompt Master, Grill-me, steps-to-skills table) **[new]** | Closes the gap between the design and the product: steps have no skills bound to them | M–L | 1, 2 |
| 4 | Security hardening batch + malicious fixture corpus **[new]** | Closes the four HIGH security findings cheaply | S–M | — |
| 5 | Network opt-in by default **[new]** | Inverts the privacy default; fixes silent egress | S | 1 |
| 6 | `pnpm docs:check` consistency gate **[new]** | Prevents the exact contradiction class the audit found | S | — |
| 7 | Typechecked tests + shared fixture factory | Stops tests drifting from the domain model | S | — |
| 8 | Property-based tests for scoring and selection **[new]** | Guards greedy/cap logic where silent regressions live | S–M | 7 |
| 9 | skills.sh record/replay cassettes + description fix **[new]** | Gives the default network path its first real coverage | M | 7 |
| 10 | `ezy coverage` — local capability-gap report **[new]** | Honest, data-driven alternative to a fake catalog | M | 2 |
| 11 | Machine-readable handoff + adapter conformance **[new]** | Makes the broker slice testable and host-agnostic | M | 2 |
| 12 | `plan` stops mutating the repository **[new]** | Least-surprise fix for a read-only-sounding command | S | 1 |
| 13 | Split/archive the research corpus + repo size gate in CI | Repo becomes reviewable; policy becomes enforced | S–M | — |
| 14 | Privacy decision + transcript quarantine gate | Removes irreversible-exposure risk | S | — |
| 15 | `pnpm release:check` — repeatable pack verification **[new]** | Makes launch repeatable instead of manual | S | — |
| 16 | Shadowed-skill transparency **[new]** | Shows what selection hid and why | S | 2 |
| 17 | Exit-code + output contract **[new]** | Makes the CLI scriptable and testable by hosts | S | — |

---

## Tier 1 — resolve identity, then make the trust claim honest

### 1. Product-truth ADR + retire the competing handoffs
**Why worth doing.** The architecture docs and the two 2026-11-23 handoffs disagree about the lifecycle. `docs/architecture/ARCHITECTURE.md:56` states "Lifecycle contracts are exported from core but remain an architectural boundary, not a runtime pipeline", and `docs/architecture/CAPABILITY-MODEL.md:37` states "They are currently boundary contracts". By contrast, `docs/handoff/CLAUDE-IMPLEMENTATION-COMMAND-REVIEW-FIX-PASS-2026-11-23.md:63` says "The evaluator must not remain a dead contract or helper", and `docs/handoff/CODING-AGENT-INSTRUCTION-MISSING-EZY-CAPABILITIES-2026-11-23.md:8` says "The remaining work is wiring these contracts into the runtime/CLI". `AGENTS.md` does not mention the lifecycle at all. Any agent can therefore justify wiring it, deferring it, or ignoring it — all from the repository itself. One ADR that states today's truth, names the deferral condition, and moves the two 2026-11-23 handoffs to `docs/handoff/archive/` costs hours and removes the largest recurring source of wasted effort in the repo.

**Smallest version.** One `docs/decisions/DECISION-LIFECYCLE-RUNTIME.md` (status: accepted / superseded-by), one paragraph edited into `AGENTS.md`'s "Current path", and the two handoffs archived with a pointer. No code.

**Unblocks:** every later trust/lifecycle item, and the docs reconciliation that follows.

### 2. Machine-readable plan receipt (`--json`, `.ezy/plan.json`) **[new]**
**Why worth doing.** Today the entire result is prose. Nothing can diff two plans, assert on a rejected candidate, or hand a host agent a stable object. A receipt containing the requirement set, the candidate pool with scores, per-requirement coverage evidence, exclusions *with the skill that triggered them*, uncovered requirements, the contractor decision, and an input hash (CLI outcome + brief + project fingerprint) would:
- let golden tests assert structure instead of `stdout` substrings;
- let `install --plan` and `skills/ezy` reuse one plan instead of re-deriving it;
- become the payload any future trust registry or evidence loop needs, without designing those yet;
- make "why was this recommended?" answerable without inventing a UI.

This is the highest-leverage *new* item because it is a precondition for 3, 10, 11, 16 and for any credible explainability claim — and it needs no lifecycle decision.

**Smallest version.** `--json` on `plan`/`next` that serialises the existing `PlanReport` (`packages/core/src/plan-types.ts:29`) and `HandoffReport` (`packages/core/src/handoff-types.ts:42`), plus optional `.ezy/plan.json` write. No new schema concepts beyond an input hash.

**Risk to watch:** do not let the receipt become a second source of truth for the planner's logic. It is an output format.

### 3. Trust artifact + hash verification loop **[new]**
**Why worth doing.** "Wire the evaluator" is big and needs item 1; the smallest real version is a file plus a read. Have `inspect` write `.ezy/trust/<skill>.json` (recomputed SHA-256 of the skill tree, declared source from `skills-lock.json`, the regex findings already produced by `scanFindings` (`packages/core/src/inspect-skill.ts:50-103`, attached to the report at `:228` and `:255`), a `reviewState` of `unreviewed|reviewed|rejected`, and the inspect timestamp). Have `plan` read it: `rejected` filters the skill out, `unreviewed` annotates it and counts as a reason, `reviewed` is neutral. That is a complete discovery → evaluation loop with no LLM, no service, no telemetry, and it makes audit findings F-02 and F-15 real rather than documented.

**Why not more.** Full quality/maintenance/compatibility evidence has no honest data source yet. Fake signals would be worse than none.

**Depends on:** item 1 (so the lifecycle decision is settled before code), item 2 (so the annotation surfaces in the receipt).

### 4. Security hardening batch + malicious fixture corpus **[new]**
**Why worth doing.** The only place the product executes external code is also its least validated surface (`packages/core/src/install.ts:31-34` builds `npx skills add <source> --skill <name>` and `:92` prints it; unpinned, no `--`, no name/source validation), and the only command whose job is "inspect before trusting" prints untrusted text raw (`description`, file names, body preview). Both are HIGH findings, both are small, and both are testable. Add a `fixtures/security/` corpus used by regression tests: a skill whose `description` contains OSC/ANSI sequences, a file name with a bidi override, a skill directory named `../escape`, a skill name beginning with `-`, an oversized `SKILL.md`, and a `scripts/install.sh`. That corpus turns "we sanitise" into a checked claim and protects the next refactor.

**Smallest version.** One `renderUntrusted()`/`safeText()` chokepoint used by every formatter that prints skill-derived text, plus validation + `--` + a pinned installer in `packages/core/src/install.ts`. No behavioural redesign.

**Independent** of items 1–3 and 5.

### 5. Network opt-in by default **[new]**
**Why worth doing.** The repository's identity is local-first, but the default is the opposite: every command except `--local-only` contacts `skills.sh`, `install --plan/--query` never passes a `localOnly` option at all (`apps/cli/src/index.ts:212-224`: `planOutcome` at :213, `recommendSkills` at :224, neither given `localOnly`), and flags are collected by filtering `--` prefixes into a `Set` (`apps/cli/src/index.ts`, per command), so a typo such as `--local-onyl` is silently dropped and becomes a network call. A production-trust product should make egress explicit. Store `network: "never" | "ask" | "always"` in `.ezy/config.json` (default `ask` on TTY, `never` in non-TTY/CI), replace the negative `--local-only` flag with `--online` (keeping the old flag as a deprecated alias), and reject unknown flags. This turns a security footnote into a product property and kills audit findings F-13, F-14 and most of S7.

**Why now.** It is small, but it is hard to retrofit once hosts and docs assume the current default.

---

## Tier 2 — make regressions visible (cheap compounding quality)

### 6. `pnpm docs:check` consistency gate **[new]**
**Why worth doing.** The audit found a whole class of defects, not isolated typos: broker "shipped" vs "not in CLI output yet" five lines apart, a Phase 8 heading whose `(current)` marker is orphaned, indexes pointing at superseded scope, a badge alt text one phase behind, and a documented config file that `.gitignore` forbids (`AGENTS.md:106,108` vs `.gitignore:20`). Each is individually trivial and collectively expensive, because these are the files that tell agents and newcomers what exists. A small script that parses phase/status claims from `README.md`, `docs/ROADMAP.md`, `docs/MVP-SPECIFICATION.md`, `docs/architecture/ARCHITECTURE.md`, `AGENTS.md` and the phase specs/plans, and fails on disagreement, broken relative links, empty `.md` files, and `docs/` files referenced nowhere, would have caught every one of them at commit time and prevents recurrence.

**Smallest version.** Node script + `pnpm docs:check` wired into `check:ci`. Rules first, cleverness later.

### 7. Typechecked tests + shared fixture factory
**Why worth doing.** Test files are excluded from both package tsconfigs (`packages/core/tsconfig.json` excludes `src/**/*.test.ts`; the CLI has the same pattern), so `pnpm typecheck` (`package.json:12`) never sees them. The suite currently builds `SkillHit` objects with `sourceKind: "remote"` (not a member of the union) and omits the required `id`. The tests are therefore not type-safe evidence about the production model, and a union change can leave them passing against a shape that no longer exists. Add a test tsconfig to `typecheck` and a single `makeHit()`/`makePlan()` factory built from the real types.

**Why before the rest of tier 2.** Every new test benefits, and it is a prerequisite for items 8 and 9 being trustworthy.

### 8. Property-based tests for scoring and selection **[new]**
**Why worth doing.** The riskiest logic in the repo is a greedy set-cover with two caps, local-first preference, exclusion matching on name tokens, and dedupe-by-name. The current tests are examples; they do not state invariants. Properties worth checking: never two picks with the same lowercased name; a pick always has non-empty `covers`; no required requirement left uncovered unless the total cap was hit; output is deterministic for the same input; adding a local copy of a skill never makes a required requirement newly uncovered; exclusions never remove a different-named skill. These are exactly the failure modes that would look plausible in output and be missed by prose goldens.

**Cost note.** Do it with a small hand-rolled generator or `fast-check` as a **devDependency only** (the product bans runtime dependencies; test-time is a separate decision to make explicitly).

### 9. skills.sh record/replay cassettes + description fix **[new]**
**Why worth doing.** The default path — network on — has zero real coverage: every planner and handoff test sets `localOnly: true` (`packages/core/src/golden.test.ts:57,81`; `packages/core/src/handoff.test.ts:49,127,182,216,306,345`; `packages/core/src/plan.test.ts:72-249`), and the only remote coverage is hand-written `fetchImpl` stubs (`packages/core/src/search.test.ts`, `packages/core/src/recommend.test.ts`, `packages/core/src/install.test.ts:95`) plus a throwing offline stub in `packages/core/src/plan.test.ts:221-234`. That is how `packages/core/src/search-remote.ts` ships a real defect: the API's description is never mapped, the hit is scored against `"<name> from <source>"`, and what the user sees is a synthetic "Catalog hit from `<source>`". Record real responses once into fixtures (including empty, error, legacy shape, and a large page), replay them in tests, and fix the description/score path against real data. This also gives future ranking changes something honest to measure.

**Depends on:** item 7 for typed fixtures.

### 12. `plan` stops mutating the repository **[new]**
**Why worth doing.** `ezy plan` reads as a query, but it writes `.ezy/brain.json` on every run (`packages/core/src/plan.ts:205` calls `persistBrainAfterPlan`, defined at `packages/core/src/brain.ts:357`). That is a surprising side effect for a command documented as "never installs/runs", and it makes `plan` unusable in read-only or sandboxed contexts. Move the write behind `ezy brain sync` (or `plan --save`), and if the brain is ever consumed for planning, do it explicitly. Small, principled, and it removes a class of "why did my repo change?" confusion.

### 16. Shadowed-skill transparency **[new]**
**Why worth doing.** Selection silently collapses same-named skills from different sources (`preferHit`, `packages/core/src/select.ts:22,43`), and that is the right behaviour — but the user never learns that a second `stripe-billing` was dropped, or why. Emitting "shadowed: `alice/skills` by `bob/skills` (local/installs/score)" in the receipt and in `plan`'s output is a few lines, prevents "why did it pick the wrong one?" distrust, and is a prerequisite for any honest trust narrative. It also exposes a real risk: a better-matching **unreviewed** skill can be shadowed by a worse local one.

---

## Tier 3 — product depth without scope creep

### 10. `ezy coverage` — local capability-gap report **[new]**
**Why worth doing.** The broker design says a catalog is "necessary", but `catalog/` is empty and no one knows what belongs in it. Instead of guessing (or building a marketplace), aggregate what plans already say: every `uncovered` requirement, every exclusion trigger, and every shadowed skill, accumulated in `.ezy/` across runs, then print the top gaps for this repository. That gives a data-driven answer to "what specialists do we lack?", is 100% local, needs no telemetry, and is a far more honest foundation for a future catalog than a hand-written list. It also gives Phase 8's "rank with evidence" claim something real to stand on.

**Depends on:** item 2 (structured plan output) and, ideally, item 12 (an explicit place to persist).

### 11. Machine-readable handoff + adapter conformance **[new]**
**Why worth doing.** `skills/ezy/SKILL.md` is the shipped interface, and it currently tells a host agent to read prose and re-run commands. Two improvements compound:
- emit `handoff.json` (ordered stages, install commands, paths, uncovered work) so any host can consume the workflow without parsing markdown;
- generate the adapter's command/flag references from the same table that produces `--help`, and add a conformance test asserting the adapter mentions every shipped command and no removed one.

The second is the novel part: it treats the adapter as an interface with a contract, which is what the repo already claims ("keep the adapter in sync", `CONTRIBUTING.md` doc-sync checklist). Every phase so far has required a manual adapter edit; this makes forgetting a test failure.

**Depends on:** item 2 for the structured payload.

---

### 18. Intent intake + a steps-to-skills table **[new]**

**Rank.** 4th by the criteria above — the highest product ambition in this plan and close to its highest cost. It belongs after item 1 (which must record the decision) and is cheapest after item 2 (which gives its output a machine-readable shape).

**Why worth doing.** The design that motivated this product puts two pieces at opposite ends of a run, and neither exists in the runtime.

- **Intake.** `docs/convo/Recommend_Kindox_Or_Finance_Tracker.md:1878` asks where Prompt Master goes; `:1882` answers "**Prompt Master shouldn't be a separate stage in the pipeline**" and puts it "right at the front", drawn as the first box at `:1891`, named "Intent / Task Interpreter" at `:1996`, and defined negatively at `:1966` ("Prompt Master ≠ prompt rewriting"). Grill-me follows as a **conditional gate** — `:991` ("Challenges the user's idea with questions before implementation"), `:1988` ("Should Grill-me be activated?"), chained at `:1304` ("**Grill-me → Brainstorm → To-spec**") — and Prototype is explicitly conditional at `:993`, which is why a step needs a gate rather than a fixed position.

  The code already has the exact data contract for that layer and no wire: `buildIntentIntake` (`packages/core/src/lifecycle.ts:13`), `IntentIntake` (`packages/core/src/lifecycle-types.ts:9`) with `clarificationRequired: boolean` (`:16`) and `ClarificationQuestion` (`:3`), exported at `packages/core/src/index.ts:114-119`. Its only caller is `packages/core/src/lifecycle.test.ts:13`. Audit finding F-01 records the same for all six lifecycle functions.

- **Per-step mapping.** The broker design states the requirement in one sentence: Ezy should "tell the host agent **which skill to use at each step**" (`docs/superpowers/specs/2026-11-18-broker-orchestrated-skills-design.md:11`, repeated at `:136`), and the product promise is "The user should not need to know which skill performs each step" (`docs/convo/1 - Video_Summary_and_Skills.md:1375`). What ships binds skills to **requirements**, never to **steps**: `WorkflowStage` has exactly three shapes — `contractor`, `skill`, `custom` (`packages/core/src/handoff-types.ts:16-38`) — and the only step routing in the codebase is one hard-coded predicate, `shouldUseSuperpowers(taskType)` (`packages/core/src/contractors.ts:35`).

  Process skills are therefore **structurally unreachable**: the requirement lexicon is a list of product capabilities — `frontend`/`UI/UX`/`testing` at `packages/core/src/capabilities.ts:16`, `payments` at `:32`, `code understanding` at `:57` — so no outcome phrasing yields a search term that matches "grill-me", "to-spec" or "prompt-master". They can enter only as the Superpowers contractor, which is why today's workflow reads as a plan of *installs* rather than a plan of *phases*.

**Smallest honest version.** Two changes, one new file each:

1. **`--clarify` on `brief`/`next`.** Call `buildIntentIntake` with the outcome and any `--answer` pairs; print `questions` when `clarificationRequired`; refuse to plan on blocking questions unless `--no-clarify`. Persist to `.ezy/intake.json` — a new file, because `brief.json`'s `KNOWN_KEYS` is a strict allowlist (`packages/core/src/brief.ts:32`) and a new key there would mean a schema version bump.
2. **`.ezy/steps.json`, user-authored, never bundled.** An ordered table of phases: `phase`, `capability` (a label, not a vendor), `gate`, `fallback`, `carry` (what evidence flows to the next phase). Resolution per phase: entry in the user's file → installed skill under `.agents/skills` → `skills-lock.json` → `uncovered` with instructions, reusing the existing `uncovered` stage shape. The shipped default table contains **phase names and capability labels only**; it names no vendor.

**Why the table must be user-authored (this is the trap).** `AGENTS.md` ("Building Make It Ezy") says: "**Do not** wire Superpowers, Ponytail, or Graphify into the Ezy CLI as runtime dependencies", and the handoff rule is "skills that help **build Ezy** ≠ skills Ezy **recommends**". A table shipping `grill-me`/`ponytail`/`graphify` as default steps would violate both and reduce the product to a reseller of one stack. Capability labels keep the promise ("which skill at each step") while leaving the vendor choice to config — and stay honest for a user who has none of those skills installed. If the owner wants named defaults, that is a product decision to record in item 1's ADR first, not a code default.

**What it unblocks.** `WorkflowStage` gains a `phase` field; item 2's receipt becomes an executable workflow rather than a list; item 11's adapter conformance test has a contract to conform to; and `buildIntentIntake` stops being a fossil. `evaluateSkillCandidate` and `evaluateOutcome` stay deferred — this item does not need them (see "Deliberately not proposed").

**Do not** generalise this into a runtime agent, a phase engine with retries, or autonomous stage execution. It is an ordered, printed table plus one gate.

---

## Tier 4 — hygiene, privacy, release

### 13. Split/archive the research corpus + repo size gate
**Why worth doing.** `docs/skill-scan/` (224 MB) and `graphify-out/` (14 MB) together account for 1,921 of the 2,133 tracked files (90%) and ~98% of the 242 MB working tree. They are scanned by CodeQL, contain third-party content of unknown redistribution status, and directly contradict `docs/BUILDER-SKILLS.md:47` ("Keeps GitHub language stats and repo size honest"). Destination, options, migration steps and acceptance criteria are worked out in [`../research/SKILL-SCAN-CORPUS-PLAN.md`](../research/SKILL-SCAN-CORPUS-PLAN.md) (recommendation: keep the workbook + reports < 1 MB, publish the capture as one release asset). Keep a short README, the workbook summary and a pinned reproduction recipe, and add a CI gate that fails when tracked files exceed a size/count threshold or when `graphify-out`/`skill-eval` paths are added. The gate is the novel part: it converts a documented policy into an enforced one.

### 14. Privacy decision + transcript quarantine gate
**Why worth doing.** `docs/convo/` holds ~1.1 MB of raw AI conversations in a public repository, and the repo's own 2026-11-23 handoff asks for remediation but nothing happened. Exposure is irreversible once cloned/indexed, and the content was not reviewed for secrets. Decide explicitly (remove with a documented history decision, or replace with a distilled summary), then add an ignore rule plus a CI check that blocks new transcript-shaped files under `docs/`. Small, but it is the only finding in the audit with potentially irreversible consequences.

### 15. `pnpm release:check` **[new]**
**Why worth doing.** `docs/superpowers/plans/2026-11-18-phase8-launch.md:35` records that someone manually ran `pnpm build` and `pnpm pack` for both packages, inspected the tarball manifests, installed both tarballs offline and ran `ezy --help`. That verification is exactly what should be repeatable, and it is currently prose in a completed checklist. A script that builds, packs to a temp dir, asserts `bin`/`files`/`engines`/`repository`/dependency rewrite, and smoke-runs the packed CLI would make every future release cheap and would catch the workspace-dependency packaging failure mode before npm does.

### 17. Exit-code + output contract **[new]**
**Why worth doing.** Exit codes currently mean 0 for success, 1 for almost every failure, and 2 only for a missing or unreadable `--brief` (`apps/cli/src/index.ts:286,291,470,482`). None of it is documented, and `inspect` returns 1 for not-found (`apps/cli/src/index.ts:404`), which is arguably not an error for a query. Hosts and CI cannot distinguish "no project", "no candidates", "invalid input", "declined approval". A short documented contract (0 success, 2 invalid input, 3 not found, 4 missing capability, 5 approval declined, 6 network unavailable) plus `--json` on every command makes the CLI usable as plumbing rather than only by humans — and makes the adapter's failure handling testable.

---

## Dependency graph

```
1 (identity) ──┬─> 3 (trust artifact) ──> 10 (coverage)
               ├─> 2 (plan receipt) ──┬─> 3
               │                      ├─> 10
               │                      ├─> 11 (handoff + conformance)
               │                      └─> 16 (shadowed skills)
               ├─> 12 (plan no-mutation)
               └─> 5 (network default)
18 (intent + steps) — needs 1; stage labels surface in 2 and 11
7 (typed tests) ──┬─> 8 (property tests)
                  ├─> 9 (cassettes)
                  └─> 3, 10 (their tests)
4 (security)   — independent, do early
6 (docs:check) — independent; catches the drift 1 creates
13, 14, 15, 17 — independent
```

## Recommended first three

1. **Item 1** (ADR + archive the competing handoffs) — hours of work, removes the recurring decision tax, and every other architectural item needs the answer.
2. **Item 4** (security batch + malicious fixtures) — the only executing surface is currently the least validated, and this is independent of every decision above.
3. **Item 2** (plan receipt) — the cheapest change that turns the product's output into something testable, explainable and reusable by hosts, and the foundation for the trust loop without committing to it.

Then **item 7 → 8/9** as a single quality tranche, and **item 6** immediately after item 1 so the doc contradictions cannot come back.

**Item 18 is the deliberate exception.** It is the only item here that changes what the product *is* rather than how well it works, so it should not be bundled into a quality tranche: take it as its own tranche after 1 and 2, starting with the `--clarify` half (small, self-contained) and only then the steps table.

## Deliberately not proposed

- **Building the catalog now.** Without a data source (item 10) it would be a hand-written list pretending to be a labor pool. Item 10 produces the evidence first.
- **Autonomous self-improvement / hosted telemetry.** Explicitly out of scope in `docs/architecture/SHARED-EVIDENCE-LEARNING.md`; the existing contracts plus a privacy-safe local source are the honest ceiling for now.
- **Implementing `evaluateSkillCandidate` in full.** Quality, maintenance and compatibility evidence have no credible source today; item 3 wires only what can be computed honestly.
- **Merging `recommend` and `plan` into one command.** They answer different questions; item 2 makes the difference explicit, which is cheaper and less disruptive than unification.
- **Touching the deferred roadmap items** (Soft-C, trusted-auto, Web UI, multi-domain expansion).
- **Reordering the roadmap.** Phase 8/9/10 sequencing is coherent and owned by `docs/ROADMAP.md`; this plan sits inside it.

## Citation check (2026-11-25)

Every file reference and line anchor above was re-read against the working tree after the plan was written. Corrections applied:

| Claim | Was | Now | Evidence |
|---|---|---|---|
| Lifecycle boundary line | `ARCHITECTURE.md:47` | `docs/architecture/ARCHITECTURE.md:56` | :47 is inside the layer diagram; the sentence is at :56 |
| Capability-model path | `CAPABILITY-MODEL.md:37` | `docs/architecture/CAPABILITY-MODEL.md:37` | line was already correct; path was not |
| Handoff attribution | both 2026-11-23 handoffs quoted "dead contract" | CLAUDE…:63 quotes it; CODING-AGENT…:8 says "wiring these contracts into the runtime/CLI" | grep of both files |
| Golden/remote coverage | "four golden cases force `localOnly: true`" | `packages/core/src/golden.test.ts` has 2 cases; all planner and handoff tests set `localOnly: true` | `packages/core/src/golden.test.ts:57,81`; `packages/core/src/plan.test.ts:72-249` |
| Repo size share | 89% of tracked index | 90% (1,921 of 2,133 files) | `git ls-files` counts |
| Hygiene rationale | `BUILDER-SKILLS.md` (root) | `docs/BUILDER-SKILLS.md:47` | file lives under `docs/` |
| Phase 8 pack verification | "Phase 8's plan records…" | pinned to `docs/superpowers/plans/2026-11-18-phase8-launch.md:35` | checklist line |
| Convo: Prompt Master is the intake layer | "Prompt Master is a stage" (my earlier summary) | intake layer, first box, not a stage: `docs/convo/Recommend_Kindox_Or_Finance_Tracker.md:1882,1891,1966,1996` | sed read of each line |
| Convo: Grill-me gate | "Grill-me is a stage" | conditional gate: `…Recommend_Kindox_Or_Finance_Tracker.md:991,1304,1988`; Prototype conditional at `:993` | sed read |
| Convo: per-step promise | — | `docs/convo/1 - Video_Summary_and_Skills.md:1375` | literal line |
| Broker per-step sentence | — | `docs/superpowers/specs/2026-11-18-broker-orchestrated-skills-design.md:11,136` | literal line |
| Lifecycle has no runtime caller | "exported" | `packages/core/src/lifecycle.ts:13,33,94,124,202,232`; only caller `packages/core/src/lifecycle.test.ts:13` | grep across `*.ts` |
| Stage union shape | "stages are phases" | three shapes only: `packages/core/src/handoff-types.ts:16-38` | code read |
| Single step-routing rule | "per-step routing exists" | `shouldUseSuperpowers` at `packages/core/src/contractors.ts:35` | code read |
| Lexicon is domain-only | "lexicon covers process" | `packages/core/src/capabilities.ts:16,32,57` (`frontend`, `payments`, `code understanding`) | code read |
| Brief key allowlist | "add a brief field" | strict `KNOWN_KEYS` at `packages/core/src/brief.ts:32`; use a separate file | code read |
| Exit codes | "2 = invalid brief" | 2 only for a missing/unreadable `--brief`; 1 for everything else | `apps/cli/src/index.ts:286,291,470,482` |
| Install command shape | bare `npx skills add` | `packages/core/src/install.ts:31-34` builds it, `:92` prints it | code read |
| `install --plan/--query` egress | "ignores the flag" | proven: no `localOnly` passed at `apps/cli/src/index.ts:212-224` | code read |
| Brain write | `persistBrainAfterPlan` | `packages/core/src/plan.ts:205` → `packages/core/src/brain.ts:357` | code read |
| Inspect findings | "already produced" | `scanFindings` at `packages/core/src/inspect-skill.ts:50-103`, attached at `:228` and `:255` | code read |

Anchors not listed above were confirmed at the cited lines. Line numbers are valid for `c06b9f7` plus the uncommitted files on this branch; re-check them if the docs move.

## Status

- Nothing implemented.
- No repository file other than this plan was created or modified.
- Verification of the audit claims referenced above lives in `docs/audits/FULL-REPOSITORY-AUDIT.md` (§6 contradictions, §12 S1–S12, §15 F-01–F-28, §16 table).
