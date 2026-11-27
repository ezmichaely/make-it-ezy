# FULL REPOSITORY AUDIT — ADVERSARIAL / EVIDENCE-DRIVEN

> **Diagnostic audit — not an implementation task, not authority, not approval.**
> Evidence gathered from read-only inspection and command execution in this workspace on 2026-11-27.

## 0. Repository and execution context

| Field | Value | Evidence |
|---|---|---|
| Repository | `make-it-ezy` | [`package.json`](/Users/michael.yucor/Documents/GitHub/make-it-ezy/package.json), git remote |
| Remote | `https://github.com/ezmichaely/make-it-ezy.git` | `git remote -v` |
| Branch | `analysis/full-scan-reconciliation` | `git branch --show-current` |
| HEAD | `6d2bc90 docs: add post-batch reconciliation task 016` | `git log --oneline -5` |
| Working tree | Dirty/untracked audit files present: `docs/audits/FULL-REPOSITORY-AUDIT-OPUS5.5-2026-11-26.md`, `docs/audits/REPO-AUDIT-HANDOFF-ICEMAN-FREE-2026-11-27.md`; `.ezy/brain.json` modified locally but gitignored | `git status --short`, `git check-ignore -v .ezy/brain.json` |
| Current phase | Phase 8 — Launch and Distribution (current); Phases 0–7 shipped | [`docs/ROADMAP.md`](/Users/michael.yucor/Documents/GitHub/make-it-ezy/docs/ROADMAP.md), [`docs/STATUS.md`](/Users/michael.yucor/Documents/GitHub/make-it-ezy/docs/STATUS.md) |
| Intended boundary | Local-first capability/context decision layer for coding tasks; Ezy decides, host agent executes | [`AGENTS.md`](/Users/michael.yucor/Documents/GitHub/make-it-ezy/AGENTS.md), [`docs/HOW-IT-WORKS.md`](/Users/michael.yucor/Documents/GitHub/make-it-ezy/docs/HOW-IT-WORKS.md) |
| Runtime entrypoints | CLI: `apps/cli/src/index.ts` (source), `apps/cli/dist/index.js` (built); Core: `packages/core/src/index.ts` exports | source inspection |
| Tests/verification | `pnpm test`, `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm check:ci` | [`package.json`](/Users/michael.yucor/Documents/GitHub/make-it-ezy/package.json) scripts |

**Audit method:** Read AGENTS/AGENT-WORKFLOW and key docs; inspected code/config/tests; ran build/lint/typecheck/test; ran CLI smoke commands; inspected package contents (`npm pack --dry-run`); searched for TODO/FIXME and lifecycle wiring. Did not modify application code.

## 1. Source-of-truth hierarchy

### Document classification (relevant set)

| Document | Classification | Notes |
|---|---|---|
| [`AGENTS.md`](/Users/michael.yucor/Documents/GitHub/make-it-ezy/AGENTS.md) | Authoritative (agent operating rules) | Required first read; defines workflow, boundaries, verification discipline. |
| [`docs/AGENT-WORKFLOW.md`](/Users/michael.yucor/Documents/GitHub/make-it-ezy/docs/AGENT-WORKFLOW.md) | Authoritative/dependent (workflow detail) | Expands AGENTS. |
| [`docs/ROADMAP.md`](/Users/michael.yucor/Documents/GitHub/make-it-ezy/docs/ROADMAP.md) | Authoritative (phase order/status) | Explicitly owns phase ordering. |
| [`docs/MVP-SPECIFICATION.md`](/Users/michael.yucor/Documents/GitHub/make-it-ezy/docs/MVP-SPECIFICATION.md) | Authoritative (claimed shipped behavior) | Must be reconciled with implementation/tests. |
| [`docs/HOW-IT-WORKS.md`](/Users/michael.yucor/Documents/GitHub/make-it-ezy/docs/HOW-IT-WORKS.md) | Dependent/current summary | Defers to MVP spec and roadmap. |
| [`docs/STATUS.md`](/Users/michael.yucor/Documents/GitHub/make-it-ezy/docs/STATUS.md) | Dependent/dashboard | Useful, but not listed in AGENTS mandatory start sequence; can drift. |
| [`docs/PRODUCT-DIRECTION.md`](/Users/michael.yucor/Documents/GitHub/make-it-ezy/docs/PRODUCT-DIRECTION.md) | Direction/future-facing | Not implementation authority. |
| [`docs/architecture/*`](/Users/michael.yucor/Documents/GitHub/make-it-ezy/docs/architecture) | Dependent/authoritative for current architecture where stated | `ARCHITECTURE.md` current; `FUTURE-ECOSYSTEM.md` compass, not backlog. |
| [`docs/decisions/*`](/Users/michael.yucor/Documents/GitHub/make-it-ezy/docs/decisions) | Authoritative (accepted durable decisions) | Only accepted decisions count. |
| [`docs/EXECUTION-PLAN.md`](/Users/michael.yucor/Documents/GitHub/make-it-ezy/docs/EXECUTION-PLAN.md) | Not found in current tree | Referenced by audit prompt; I did not locate it. Treat as absent/unknown, not authority. |
| Previous audits in `docs/audits/` | Evidence/historical | Not work orders. |
| Handoffs in `docs/handoff/` | Context/historical depending file | Long handoff is intent/trust context, not implementation truth. |
| Generated outputs (`dist`, `.ezy`, scan reports) | Generated/evidence | Not authority. |

### Conflicts / ambiguities

```text
Finding: Source-of-truth precedence/navigation has minor inconsistencies
Severity: P3
Evidence: AGENTS.md mandatory sequence lists README/HOW-IT-WORKS/ROADMAP/MVP-SPEC/decisions/architecture/impl but omits STATUS.md and PRODUCT-DIRECTION.md; STATUS.md and handoff/README prescribe different read orders including STATUS/PRODUCT-DIRECTION. decisions/README.md gives a different precedence ordering for product/architecture questions than AGENTS hierarchy.
File(s): AGENTS.md, docs/STATUS.md, docs/handoff/README.md, docs/decisions/README.md, docs/AGENT-WORKFLOW.md
Relevant code path: Documentation navigation only; no runtime code path.
Observed behavior: Multiple plausible reading orders exist.
Expected behavior: One clear navigation path with explicitly scoped precedence rules.
Why it matters: New agents can pick different "authoritative" docs and drift.
Reproduction / verification: Compare AGENTS.md "Mandatory start sequence"/"Source-of-truth hierarchy" with docs/STATUS.md "If I come back after six months", docs/handoff/README.md, docs/decisions/README.md.
Confidence: High
```

## 2. Product contract audit

### Intended boundary

Docs consistently state: Make It Ezy is a local-first capability/context decision layer for coding tasks; Ezy decides, host agent executes. No coding-agent/runtime/model-host/marketplace/mandatory Superpowers/implicit trust install. This is supported by AGENTS, README, HOW-IT-WORKS, STATUS, ROADMAP, ARCHITECTURE.

### Reality check

| Contract element | Observed | Status |
|---|---|---|
| Analyze project | `analyzeProject` exists; CLI `analyze` works | Implemented |
| Derive requirements | `extractRequirements`/brief requirements used by plan | Implemented (heuristic/brief-driven) |
| Discover capabilities | local `.agents/skills` + skills.sh remote search | Implemented |
| Filter/select minimum useful set | `scoreCandidates`, `selectCapabilities`, exclusions/contractor logic | Implemented (heuristic) |
| Plan/handoff | `planOutcome`, `buildHandoff`, `formatPlan`, `formatHandoff` | Implemented |
| Host agent executes | CLI prints handoff/checklist/prompt; no skill execution engine | Implemented boundary |
| Install gated | `install` previews, requires `--yes` or TTY confirm; uses external `npx skills add` | Implemented with caveats |
| Lifecycle autonomous pipeline | `lifecycle.ts` exported only; no CLI wiring found | Documented/contract-only, not controlling |

**Assessment:** The documented conceptual flow is **largely implemented** for the CLI/planner slice, with heuristic decision quality and explicit non-execution boundary. It is **not** a full autonomous lifecycle.

**Boundary leaks observed:** None proving Ezy executes skills or hosts models. Install delegates to external `npx skills` command after approval - this is an execution boundary crossing by design, but it means install trust/safety depends partly on external tool behavior.

## 3. End-to-end CLI audit

### Command evidence matrix

| Command | Entrypoint | Observed behavior | Exit/adversarial | Filesystem/network | Match docs? |
|---|---|---|---:|---|---|
| `--help` | `apps/cli/src/index.ts` | Printed usage/commands/flags | 0 | none | Yes |
| `doctor` | `runDoctor` | Reported Node/pnpm/Git/OS/project root | 0 on OK | read-only local checks | Yes |
| `analyze` | `analyzeProject` | Not smoke-run in this pass; covered by tests | n/a | read-only expected | Likely |
| `search --local-only` | `searchSkills` | Returned local-only report; no remote query note | 0 | local fs; no remote when localOnly | Yes |
| `inspect ../../etc/passwd --local-only` | `inspectSkill` | "not found locally", no crash/path escape observed | 0 (not found reported as status) | local lookup | Reasonable |
| `recommend` | `recommendSkills` | Not smoke-run; tests pass | n/a | local/remote depending flags | Likely |
| `brief` | `formatBriefInstructions` | Not smoke-run; tests pass | n/a | stdout only | Likely |
| `brain` | `loadBrainFile`/format | Not smoke-run; tests exist | n/a | reads `.ezy/brain.json` | Likely |
| `plan --local-only` | `planOutcome` | Produced requirements/recommended/optional/excluded/uncovered/notes; wrote `.ezy/brain.json` | 0 | writes `.ezy/brain.json` (gitignored); local-only skips remote | Mostly yes; side effect important |
| `next --local-only` | `buildHandoff` | Not smoke-run this pass; tests pass; code path calls planOutcome | n/a | writes brain via planOutcome | Likely |
| `install` (no args) | `handleInstall` | Usage error | 1 | none | Yes |
| `plan --brief` missing value | arg parsing | `Invalid brief: --brief requires a path` | 2 | none | Yes |
| unknown command | CLI dispatch | Printed unknown + help | 1 | none | Yes |

**Observed CLI smoke commands:**

```text
node apps/cli/dist/index.js --help        -> exit 0
node apps/cli/dist/index.js doctor         -> exit 0, Status OK
node apps/cli/dist/index.js unknown-cmd    -> exit 1
node apps/cli/dist/index.js search "testing" --local-only -> exit 0, local-only note
node apps/cli/dist/index.js plan "add tests" --local-only -> exit 0, wrote .ezy/brain.json (gitignored)
node apps/cli/dist/index.js inspect "../../etc/passwd" --local-only -> not found locally
node apps/cli/dist/index.js plan --brief   -> exit 2, invalid brief
node apps/cli/dist/index.js install       -> exit 1, usage
```

```text
Finding: `plan`/`next` have a persistent filesystem side effect (`.ezy/brain.json`)
Severity: P3
Evidence: `plan "add tests" --local-only` output included "Cached project summary at .ezy/brain.json (updated)"; `.ezy/brain.json` exists and is gitignored.
File(s): packages/core/src/plan.ts, packages/core/src/brain.ts, .gitignore
Relevant code path: planOutcome -> persistBrainAfterPlan/write; next uses buildHandoff/planOutcome path.
Observed behavior: Read-looking planning command writes project-local cache/state file.
Expected behavior: Acceptable if documented; should be explicit in command contract.
Why it matters: Users/agents may assume plan/next are pure; can surprise in clean-tree expectations.
Reproduction / verification: Run `node apps/cli/dist/index.js plan "add tests" --local-only`; inspect `.ezy/brain.json` and `git check-ignore -v .ezy/brain.json`.
Confidence: High
```

## 4. Core decision-engine audit

### Requirements
- `extractRequirements` and brief-driven requirements exist. Plan output showed required requirements derived from outcome tokens ("add", "tests").
- Distinction between explicit/inferred/optional is partial: brief schema supports structured requirements; heuristic extraction is simpler.

### Discovery
- `search.ts` merges local and remote; `localOnly` skips `searchSkillsSh`. Remote uses `https://skills.sh/api/v1/skills/search`.
- Observed local-only mode note and no remote query in smoke.

### Selection
- Selection/scoring code exists (`select.ts`, `score-skill.ts`, `capabilities.ts`, `contractors.ts`). Tests pass.
- I did not perform deep fuzzing for nondeterminism/stability; code uses sorts/maps and deterministic inputs in normal cases. Confidence medium.

### Planning/Handoff
- Plan output included recommended/optional/excluded/uncovered/next. Handoff composition exists and tests pass.
- I did not prove all edge cases where selected capability disappears or unselected appears; no obvious defect observed in smoke.

```text
Finding: Decision quality is heuristic and can under-select for generic outcomes
Severity: P4
Evidence: `plan "add tests" --local-only` in this repo returned no recommended skills and marked "add"/"tests" uncovered; notes said "No matching skills found".
File(s): packages/core/src/plan.ts, packages/core/src/requirements.ts, packages/core/src/select.ts
Relevant code path: planOutcome requirement extraction + local skill search/selection.
Observed behavior: Generic coding outcome produced no useful capability selection.
Expected behavior: Acceptable for MVP heuristic, but should be understood as limitation.
Why it matters: Users may over-trust "minimum useful set" when it is empty due heuristic mismatch.
Reproduction / verification: `node apps/cli/dist/index.js plan "add tests" --local-only`.
Confidence: High
```

## 5. Trust-boundary and security audit

### Observed boundaries
- Discovery/inspect/plan are read-only/reporting oriented.
- Install requires explicit approval (`--yes` or interactive confirm; non-TTY without `--yes` refused).
- Install executes external `npx skills add <source> --skill <name>` via spawn args array (no shell string), reducing command-injection risk.
- Remote skill content/metadata treated as untrusted in docs; code still relies on external ecosystem behavior on install.

### Concerns

```text
Finding: Install path/name validation appears weak for skillName
Severity: P2
Evidence: `buildInstallPreview` computes destination as `join(skillsDir(projectRoot), name)` and uses `name` directly in command args; `isSkillInstalledLocally` joins name directly. No explicit rejection of path separators, absolute paths, or `..` was observed in install.ts.
File(s): packages/core/src/install.ts
Relevant code path: buildInstallPreview/isSkillInstalledLocally/runInstall.
Observed behavior: Code accepts trimmed string name; safety depends on downstream behavior and absence of malicious input paths.
Expected behavior: Skill name should be validated against a strict safe pattern before filesystem join or external command execution.
Why it matters: Path traversal or surprising filesystem targets could occur if untrusted names reach install paths; also trust boundary for install target integrity.
Reproduction / verification: Code inspection of install.ts lines 24-36, 42-105. I did not attempt exploitative install.
Confidence: Medium
```

```text
Finding: Install delegates trust to third-party `npx skills` ecosystem after approval
Severity: P3
Evidence: install command builds `npx skills add <source> --skill <name>` and executes it.
File(s): packages/core/src/install.ts, apps/cli/src/index.ts
Relevant code path: runInstall -> runSpawn(npx skills add...).
Observed behavior: Ezy gates approval but does not itself verify remote skill content integrity beyond preview/metadata.
Expected behavior: Acceptable if clearly documented as gated delegation; not equivalent to safe/verified install.
Why it matters: Approved install can still fetch/execute third-party installer behavior/content outside Ezy's control.
Reproduction / verification: Inspect install.ts and CLI install flow.
Confidence: High
```

No evidence of arbitrary shell-command injection via spawn args array, no credential exposure found by quick inspection. No exploit proof performed.

## 6. Installation and filesystem audit

- Install destination: `<projectRoot>/.agents/skills/<name>`.
- `--yes`/TTY confirmation gates execution in CLI. Non-TTY without `--yes` refuses.
- `isSkillInstalledLocally` checks for dir or SKILL.md.
- Unresolved source is rejected before run.
- I did not test actual remote install, overwrite behavior, rollback/uninstall (no uninstall command observed), or path escape exploit.

```text
Finding: No uninstall/rollback command observed for install flow
Severity: P4
Evidence: CLI help/dispatch includes `install` but no `uninstall/remove`; install.ts has no rollback.
File(s): apps/cli/src/index.ts, packages/core/src/install.ts
Relevant code path: CLI command surface.
Observed behavior: Install exists; removal/rollback not first-class.
Expected behavior: May be acceptable for current phase; should be explicit.
Why it matters: Users need manual cleanup after bad/undesired installs.
Reproduction / verification: Inspect CLI help and source.
Confidence: High
```

## 7. Local-only behavior

- `search --local-only` smoke: reported "Local-only mode: skills.sh was not queried."
- `plan --local-only` smoke: reported "Local-only mode: skills.sh was not queried."
- Code path: `search.ts` returns early on remote fetch when `localOnly` true.

**Assessment:** Local-only appears enforced in inspected path; I did not run network tracing/packet capture. Confidence medium-high.

## 8. Packaging and distribution audit

### Evidence
- `pnpm build` passed; prepare-package rewrote `@make-it-ezy/core` to `./core/index.js` and copied core dist.
- `npm pack --dry-run` in `apps/cli` produced `make-it-ezy-0.1.5.tgz`, 150 files, 72.3 kB unpacked 345.6 kB, includes `dist/` and `package.json` (and README as reported by npm notice usually; dry-run showed dist files/package.json entries).
- CLI package declares bin `ezy -> ./dist/index.js`.

### Verification gap

```text
Finding: Tests mostly exercise source/tsx, not packaged artifact
Severity: P2
Evidence: `apps/cli/src/cli.test.ts` runs CLI via `process.execPath [tsx, apps/cli/src/index.ts, ...args]`; test suite passes against source. Package build/pack is separate.
File(s): apps/cli/src/cli.test.ts, apps/cli/scripts/prepare-package.mjs, package.json
Relevant code path: CLI test harness; packaging prepare script.
Observed behavior: Green tests prove source behavior under tsx; they do not prove packed/npm-installed `dist` behavior.
Expected behavior: At least smoke tests against built dist/packed tarball for release confidence.
Why it matters: Packaging/bundling regressions can escape source-green tests.
Reproduction / verification: Inspect cli.test.ts lines 9-45; compare to `npm pack --dry-run` artifact.
Confidence: High
```

I did not install the tarball in a clean temp env in this pass (time/risk tradeoff). Packaging is **not fully verified**.

## 9. Test-quality audit

### Commands run

| Command | Result |
|---|---|
| `pnpm build` | PASS |
| `pnpm lint` | PASS |
| `pnpm typecheck` | PASS |
| `pnpm test` | PASS (21 files, 189 tests) |
| `pnpm check:ci` | NOT RUN (includes audit; build/lint/typecheck/test individually passed) |
| `pnpm audit --prod --audit-level=high` | NOT RUN separately |

### Assessment
- Tests cover many core units and CLI behaviors. Good sign.
- CLI tests are integration-ish but source-based through tsx.
- No evidence of packaged-artifact smoke tests, Windows/Node 20 matrix in CI, or network-isolated local-only enforcement beyond unit logic.
- Passing tests do **not** equal full product verification.

## 10. Architecture-boundary audit

- CLI -> core boundary is clear through `@make-it-ezy/core` imports.
- Core exports lifecycle contracts, but CLI/planner do not consume them; grep showed only lifecycle/index/dist references. This matches docs.
- `prepare-package.mjs` bundles core into CLI dist, avoiding runtime workspace dependency - good for distribution.
- No dead code proven; lifecycle appears intentionally reserved.

```text
Finding: Lifecycle API is exported publicly from core but non-operational in runtime pipeline
Severity: P4
Evidence: `packages/core/src/index.ts` exports lifecycle functions/types; grep found no consumers in src outside lifecycle files/index; docs say not controlling CLI/planner.
File(s): packages/core/src/index.ts, packages/core/src/lifecycle.ts, docs/ROADMAP.md, docs/STATUS.md
Relevant code path: package exports.
Observed behavior: API surface larger than active runtime pipeline.
Expected behavior: Acceptable if clearly labeled/intentional; can confuse integrators.
Why it matters: External consumers may assume lifecycle exports imply active lifecycle engine.
Reproduction / verification: `grep -rn` for lifecycle symbols outside lifecycle files/index; read docs.
Confidence: High
```

## 11. Documentation/reality reconciliation matrix

| Area | Documentation claims | Implementation observed | Verified? | Status |
|---|---|---|---:|---|
| CLI | Commands doctor/analyze/search/inspect/recommend/brief/brain/plan/next/install | Present in CLI dispatch/help | Partial (smoke+tests) | Mostly aligned |
| Discovery | Local + skills.sh; local-only skips remote | Code and smoke support this | Partial | Aligned |
| Selection | Minimum useful capability set | Heuristic selection exists; quality varies | Partial | Partially aligned (heuristic) |
| Planning | Project-aware plan, requirements, exclusions, uncovered | Observed in smoke | Partial | Aligned |
| Handoff | Checklist/prompt/workflow; host agent executes | Code/tests support; smoke limited | Partial | Aligned |
| Install | Gated suggest-then-go, no silent install | Approval gate exists; delegates to npx skills | Partial | Aligned with caveats |
| Packaging | One npm package, self-contained | Build/pack dry-run supports; no clean-install smoke | No | Partially verified |
| Tests | pnpm test/check gates | build/lint/typecheck/test pass | Yes for run commands | Aligned but incomplete confidence |
| Security | Untrusted external content, no implicit trust | Docs strong; install name validation/path hardening unclear | Partial | Needs caution |

## 12. Dead, incomplete, and suspicious work

| Item | Classification | Evidence | Notes |
|---|---|---|---|
| `catalog/` empty | INTENTIONAL DESIGN / INCOMPLETE BY PHASE | `catalog/.gitkeep`, ARCHITECTURE says reserved | Not a defect. |
| `lifecycle.ts` not wired | INTENTIONAL DESIGN | Docs + grep | Reserved boundary contracts. |
| No TODO/FIXME in src TS | POSITIVE / LIMITED | `grep -rn TODO/FIXME/HACK/XXX ...` returned none | Not exhaustive for all debt. |
| Untracked audit files in worktree | DOCUMENTATION DRIFT / WORKTREE NOISE | `git status --short` | Not product code defect; avoid confusing as authoritative. |
| `docs/EXECUTION-PLAN.md` referenced by prompt but absent | HISTORICAL / NO LONGER RELEVANT or UNKNOWN | file search not found | Audit prompt assumption stale. |

## 13. Error handling and failure behavior

- Unknown command returns exit 1 with help.
- Missing args return exit 1 with usage.
- Invalid brief returns exit 2 in observed cases.
- Install non-TTY without `--yes` refuses. Unresolved source refused.
- I did not exhaust failure paths (network errors, malformed skill files, permission errors, partial install failures).

## 14. Performance and complexity

No credible high-impact perf defect observed in this audit. Search/planning scans local skills and may call remote API unless local-only; acceptable for CLI scale. No measurement performed.

## 15. Reality-vs-plan audit

| Item | Status | Evidence |
|---|---|---|
| Phases 0-7 | Claimed shipped | ROADMAP/STATUS/docs; not fully re-proven |
| Phase 8 Launch/Distribution | Current | ROADMAP/STATUS; packaging scripts exist; publish workflow not fully audited |
| Broker workflow first slice | Claimed shipped | Docs + contractors/handoff code present |
| Phase 9 Outcome Verification | Later/not shipped | ROADMAP; lifecycle contracts exist but not controlling |
| Phase 10 Web UI | Later | ROADMAP |

No approved execution-plan file found; cannot compare against `docs/EXECUTION-PLAN.md`.

## 16. Previous-audit reconciliation

| Previous artifact | Status | Notes |
|---|---|---|
| `docs/audits/FULL-REPOSITORY-AUDIT-2026-11-26.md` (untracked) | Unable to fully verify in this pass | File exists/untracked; I read opening only. Treat as evidence, not authority. |
| `docs/audits/FULL-REPOSITORY-AUDIT-OPUS5.5-2026-11-26.md` (untracked) | Unable to verify | Present in worktree; not reviewed. |
| `docs/audits/REPO-AUDIT-HANDOFF-ICEMAN-FREE-2026-11-27.md` (untracked) | Created earlier in session | Handoff snapshot; not authoritative. |

## 17. Evidence standard — key findings

Findings are included inline above in required format. Additional key findings:

```text
Finding: CLI smoke wrote `.ezy/brain.json` during audit
Severity: P4
Evidence: After `plan "add tests" --local-only`, `.ezy/brain.json` existed/updated under gitignored `.ezy/`.
File(s): packages/core/src/brain.ts, packages/core/src/plan.ts
Relevant code path: persistBrainAfterPlan.
Observed behavior: Audit command caused local ignored state write.
Expected behavior: Expected by design; auditors/operators should know.
Why it matters: Can confuse "read-only audit" expectations; no repo-tracked change.
Reproduction / verification: Run plan command; inspect `.ezy/`.
Confidence: High
```

## 18. Positive findings

- **Clear product boundary in docs and code shape:** CLI hands off; no model hosting/execution engine observed.
- **Local-only mode is visible and code-path enforced:** `search.ts` skips remote when `localOnly`.
- **Install is gated:** non-TTY refuses without `--yes`; explicit preview/confirmation flow.
- **Build/lint/typecheck/test all pass** on this workspace state.
- **Packaging script bundles core into CLI dist**, reducing workspace runtime dependency risk for published package.
- **No TODO/FIXME markers in core/cli TS source** (quick grep).
- **Lifecycle contracts are explicitly documented as non-controlling**, reducing accidental overclaim.

## 19. Final verdict

### Product integrity
**Mostly aligned.** The repo implements a local-first decision/handoff CLI consistent with the stated product boundary. Main risks are heuristic decision quality, packaging verification gap, and install trust hardening.

### Functional integrity
**Partially proven.** Core tests pass; basic CLI smoke commands work. Not all commands/paths were adversarially exercised end-to-end.

### Architectural integrity
**Good with caveats.** CLI/core boundary is real; lifecycle boundary is documented. Public export of lifecycle contracts may confuse consumers.

### Security integrity
**Moderate / not fully proven.** No obvious shell injection in install spawn args; trust boundaries documented. Install name/path validation and delegated `npx skills` trust need scrutiny.

### Distribution integrity
**Not fully proven.** Build and pack dry-run succeed; no clean-environment tarball install smoke test was run in this audit.

### Verification integrity
**Medium.** Source-level tests and static checks pass; packaged/runtime/Windows/publish-path confidence remains incomplete.

```text
RELEASE READINESS:
READY WITH CONDITIONS

PRIMARY BLOCKERS:
1. Packaged-artifact verification gap: tests/build do not prove clean npm-installed tarball behavior.
2. Install input/path hardening not fully evidenced: skillName/source validation needs explicit security review.
3. Distribution/release path not fully audited end-to-end (publish workflow, clean install smoke, Node 20/Windows).

HIGHEST-VALUE NEXT VERIFICATIONS:
1. Run `pnpm check:ci`, then `npm pack` in apps/cli and smoke-test install/run in a clean temp env outside repo.
2. Security-review `install.ts` for skillName/source validation, path traversal, overwrite behavior, and delegated `npx skills` trust assumptions.
3. Adversarial CLI matrix: malformed brief/schema edges, large inputs, remote failure modes, local-only network isolation, and install behavior on existing/nonexistent paths.
```

## 20. Audit limitations

- Did not run `pnpm check:ci` as a single command; ran build/lint/typecheck/test separately. Did not run `pnpm audit --prod --audit-level=high` separately.
- Did not perform clean-environment tarball install smoke test.
- Did not test actual remote `install` execution or `npx skills` behavior.
- Did not test Windows, Node 20 minimum runtime, or GitHub Actions remote results.
- Did not exhaustively exercise every CLI command with adversarial inputs.
- Did not perform network capture to prove local-only has zero network activity at OS level.
- Did not fully review large docs (`MVP-SPECIFICATION.md` full text, long handoff, previous audit bodies).
- Worktree contained pre-existing untracked audit files; I did not modify application code but I did create audit/handoff files.
- `docs/EXECUTION-PLAN.md` referenced in prompt was not found; comparison limited.

## 21. Required audit report filename

Saved as: `docs/audits/FULL-REPOSITORY-AUDIT-OPENCODE-ICEMAN-FREE-2026-11-27.md` (this file).

## 22. Behavioral rules

I inspected, executed safe checks, reported evidence and uncertainty. I did not modify application code, fix findings, or convert findings into approved tasks.

## 23. Final principle

**Where reality would surprise a new engineer trusting docs:**

- `plan`/`next` look read-only but write `.ezy/brain.json` (gitignored).
- `pnpm test` green does not prove packaged npm artifact behavior; CLI tests run source via tsx.
- "Lifecycle" exports exist in core but are not the active CLI/planner pipeline.
- `--local-only` is a strong code-path contract, but I did not OS-level prove zero network.
- Install is gated by Ezy, but actual install delegates to external `npx skills` and skill name/path hardening needs review.

**Bottom line:** The core decision/handoff product boundary appears real and the main checks pass, but distribution and install-trust hardening are not fully proven for release confidence.