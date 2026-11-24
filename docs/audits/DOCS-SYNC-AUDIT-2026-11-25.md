# Docs sync audit — 2026-11-25

**Scope:** every tracked markdown file outside `docs/skill-scan/` and `graphify-out/` — 111 files, ~25,000 lines — checked for status drift, contradictions and broken relative links, then synchronized against the code at `c06b9f7` + this branch.
**Method:** path/claim scan (`Phase 8`, `shipped`, `current`, status lines), link resolution by script over all 111 files, targeted reads of the authoritative docs, and cross-checks against `packages/core/src` and `apps/cli/src`.
**Not run:** `pnpm check:ci`, the test suite, the build. `node_modules` is absent; no dependency was installed. Every code claim below is static reading, not execution.

## 1. What was stale, and what changed

| # | File | Defect | Fix |
|---|---|---|---|
| 1 | `README.md` | Badge image said "phase 8 launch" but its `alt` text still said "Phase 7 shipped" (the 2026-11-24 pass fixed only the visible text) | `alt="Phase 8 launch"` |
| 2 | `README.md` | Status table had no pointer to the full audit or the follow-up plan | Added one line with audit, plan and corpus-plan links |
| 3 | `docs/ROADMAP.md` | Phase 8 heading lost its `(**current**)` marker; the marker sat alone on line 91 under the lifecycle block | Marker moved onto `## Phase 8 — Launch and Distribution (**current**)`, orphan removed |
| 4 | `docs/ROADMAP.md` | Lifecycle slice did not say the contracts are unwired | Added the fact + audit §6 / plan item 1 pointer |
| 5 | `docs/MVP-SPECIFICATION.md` | Section heading said "Broker workflow (approved — **not in CLI output yet**)" while its own body said "Shipped (first slice)" and `ROADMAP` agreed | Heading → "(first slice shipped)" |
| 6 | `docs/MVP-SPECIFICATION.md` | Phase 8 section did not mention the lifecycle contracts at all, so readers could infer they were CLI features | Added an explicit "not CLI behavior" paragraph |
| 7 | `docs/handoff/README.md` | Precedence table said MVP covers behavior "through Phase 7" | "through the Phase 8 first slice" |
| 8 | `docs/handoff/README.md` | Index omitted the full audit, the work plan and the corpus plan; listed only one of the two 2026-11-23 instructions | Added three rows; both instructions listed with the conflict noted |
| 9 | `docs/architecture/ARCHITECTURE.md` | Repo layout line omitted `decisions/`, `audits/`, `work-plan/` | Layout updated |
| 10 | `docs/architecture/ARCHITECTURE.md` | Boundary claim had no evidence pointer | Linked audit §6 + plan item 1 |
| 11 | `docs/architecture/ARCHITECTURE-EXPLAINED.md` | Listed Phase 8 under "Wala pa" although it is the current phase; footer said "Last aligned: 2026-11-18" | Marked Phase 8 current; footer re-dated with the lifecycle caveat |
| 12 | `AGENTS.md` | "Current path — 2026-11-19"; no audit/plan reference; two links to `.qwen/settings.json`, a file `.gitignore:20` forbids (both broken) | Re-dated 2026-11-25; review-inputs bullet added; both links replaced with "gitignored; create locally" |
| 13 | `docs/handoff/MAKE-IT-EZY-HANDOFF.md` | Shipped row stopped at Phases 0–7, omitting the shipped broker slice; Next row still called all of Phase 8 "not shipped yet" | Shipped row includes the Phase 8 first slice; Next row says "remaining Phase 8 work" |
| 14 | `docs/handoff/CODING-AGENT-…-2026-11-23.md` | States "the remaining work is wiring these contracts into the runtime/CLI" as current direction | Historical-status banner + conflict pointer (no content rewritten) |
| 15 | `docs/handoff/CLAUDE-…-2026-11-23.md` | "The evaluator must not remain a dead contract" presented as current; also targets another branch/PR #21 | Historical-status banner + conflict pointer |
| 16 | `docs/audits/2026-11-07-codebase-gaps.md` | No link to the full audit; a reader could think it is the only audit | Scope note added; findings 1–10 untouched |
| 17 | `docs/superpowers/specs/2026-11-06-phase6-agent-brief-design.md` | Status "pending review" although Phase 6 shipped | `shipped (Phase 6, 2026-11-06)` |
| 18 | `docs/superpowers/plans/2026-11-18-broker-workflow.md` | Task 3 "Partial (confirm build)" vs ROADMAP "documentation sync present" | "Done (build/test not run in this environment)" |
| 19 | `docs/skill-scan/README.md` | `skill-eval`/`skill-evaluator` bullets duplicated; no size, no disposition pointer, no reproduction recipe | Rewritten (see file) |
| 20 | `CONTRIBUTING.md` | Doc-sync checklist did not include the audit, plan, corpus plan or corpus README — the exact set that drifted | Four rows added |
| 21 | `docs/research/RESEARCH-INVENTORY.md` | No pointer to the corpus disposition | Section added |
| 22 | `docs/work-plan/FOLLOW-UP-WORK-PLAN.md` | Item 13 said "move the corpus" without a destination | Points at the corpus plan; item marked unimplemented |

## 2. Added documents

- `docs/research/SKILL-SCAN-CORPUS-PLAN.md` — where the 224 MB corpus should live, options A–E, recommendation, migration steps, acceptance criteria. **Nothing moved.**
- This file.

## 3. Link-check results

Script over all 111 product markdown files (relative links only, anchors and non-path schemes stripped): 230 links checked.

**After the sync: 38 broken**, and every one is in a class that is deliberately excluded from the gate:

- `.agents/skills/*` — **14** links in `AGENTS.md`/`CONTRIBUTING.md`. Gitignored symlinks created by `pnpm skills:install`; correct by design on a provisioned checkout, absent on a bare clone.
- `docs/handoff/archive/*` — **24** links across 4 superseded snapshots whose relative paths assumed a different directory layout. `CONTRIBUTING.md` says not to rewrite historical snapshots, so these stay.
- `docs/convo/*` — **0** counted: the imported exports' `sandbox:/mnt/data/...` targets are not paths. They are dead either way; the checker now skips the scheme.

**2 links were fixed** in this pass (the two `.qwen/settings.json` targets). The count did not drop further because the remaining defects are policy exclusions, not documentation errors — which is exactly why the future gate (work-plan item 6) must skip `docs/convo/`, `docs/handoff/archive/` and `.agents/`, and nothing else.

The link gate that should enforce this (work-plan item 6) must therefore skip `docs/convo/`, `docs/handoff/archive/` and `.agents/`, and must not skip anything else.

## 4. Claims checked and deliberately left alone

- **"180 tests green"** (`docs/audits/2026-11-07-codebase-gaps.md:9`) — a recorded past run. Static count on this branch is 178 `it` blocks + 6 parameterized cases. Not reconciled: neither number proves the other, and no test run was possible here.
- **Phase 8 scope bullets** (`ROADMAP`, `MVP`, `README`) — consistent with each other; not reworded.
- **`docs/opencode/`, `docs/gpt/`, `docs/convo/`** — session transcripts and research exports. Read for contradictions, not edited: `AGENTS.md` says not to reconstruct direction from them.
- **`docs/decisions/`** — one accepted decision, no status drift.
- **`docs/research/REANALYSIS-2026-11-05.md`, `PROJECT-COMPARISON.md`, `REFERENCE-DIRECTORY.md`** — research snapshots with dates; no phase claims to sync.

## 5. Remaining known drift (not fixed, by design)

1. **The lifecycle conflict itself** — banners now mark the two 2026-11-23 instructions as historical, but nothing decides the question. That is work-plan item 1 (an ADR). Editing the architecture to "wire it" would have been a product decision made by a docs pass.
2. **No mechanical gate** — nothing stops the next drift. Work-plan item 6.
3. **`docs/skill-scan/` size** — unchanged; the plan exists, the move is not approved.
4. **`.gitignore` commented-out rules** (`#graphify-out/`, `# skill-scan/*`) — left as-is because enabling them without moving the files would make tracked content look ignored.

## 6. Verification performed

- Every edited file re-read at the edited line after the edit.
- Link script re-run over all 111 files: 230 links checked, 38 broken, all classified above.
- Phase/status scan re-run: `README`, `ROADMAP`, `MVP-SPECIFICATION`, `HOW-IT-WORKS`, `ARCHITECTURE`, `ARCHITECTURE-EXPLAINED`, `handoff/README`, `AGENTS.md` now agree that Phase 0–7 are shipped, the Phase 8 broker slice is shipped, Phase 8 launch work remains current, and lifecycle contracts are unwired.
- **Not verified:** build, tests, CLI output. No dependency installation was performed.
