**Phase 1 — Reconcile the implementation boundary**

Continue from `docs/opencode/PHASE-0-BASELINE.md`.

Do NOT restart the investigation and do NOT reread the Phase 0 source documents unnecessarily.

This phase is **read-only investigation**.

### Hard constraints

- Do NOT modify production code.
- Do NOT run CI.
- Do NOT run Graphify.
- Do NOT perform a full-repository scan.
- Do NOT ingest the full session transcripts.
- Do NOT increase the model context.
- Keep reads targeted and small.
- If MLX reports **OOM / Insufficient Memory / Metal Command Buffer OutOfMemory even once, STOP immediately and do not retry.**
- Do not proceed to Phase 2 automatically.

### Step 1 — Resolve git/branch state

Run only the targeted git checks necessary to answer:

1. What commits exist on `analysis/full-scan-reconciliation` that are not on `main`?

Use:

`git log --oneline main..analysis/full-scan-reconciliation`

2. What differs between `main` and the current HEAD?

Use:

`git diff --stat main...HEAD`

3. Resolve the HEAD discrepancy:

- Phase 0 reports current HEAD `310be4e`.
- `docs/skill-scan/REANALYSIS-2026-11-24.md` reportedly references `315e92d`.

Use:

`git log -5 --oneline`

Do not make any changes.

### Step 2 — Confirm the lifecycle implementation directly

Inspect only these files:

- `packages/core/src/lifecycle-types.ts`
- `packages/core/src/lifecycle.ts`
- `packages/core/src/lifecycle.test.ts`
- `packages/core/src/index.ts`
- `packages/core/src/plan.ts`
- `packages/core/src/capabilities.ts`

Confirm from the actual source:

1. Whether all six lifecycle functions exist:
   - `buildIntentIntake`
   - `evaluateSkillCandidate`
   - `composeSkillSpec`
   - `evaluateOutcome`
   - `aggregateEvidence`
   - `proposeImprovement`

2. Their actual signatures and behavior at a high level.

3. Whether tests cover them.

4. Whether they are exported publicly.

5. Whether `plan.ts` actually invokes any lifecycle functions.

6. Whether `capabilities.ts` is merely a capability/outcome-token lexicon or actually acts as a lifecycle-role registry.

Do not modify anything.

### Step 3 — Confirm the actual CLI/runtime path

Use targeted grep/search to locate:

- CLI entrypoint
- recommendation/selection modules
- handoff modules

Then inspect only the relevant files.

Determine whether the runtime/CLI actually invokes:

- intent clarification/intake
- skill evaluation
- skill-spec composition
- contractor/workflow integration
- outcome evaluation
- evidence aggregation
- improvement proposal

Do not infer invocation merely from exports or types. Confirm actual call sites.

### Step 4 — Resolve the CLAUDE fix-pass question

Inspect:

`docs/handoff/CLAUDE-IMPLEMENTATION-COMMAND-REVIEW-FIX-PASS-2026-11-23.md`

Use git history/diff only as necessary to determine whether the work described there is already present in:

- `main`
- the current analysis branch

The question is NOT whether the fix-pass document is a good plan.

The question is:

**Which of its proposed fixes are already implemented, which are partially implemented, and which are genuinely missing?**

Do not implement any of them.

### Step 5 — Resolve the instruction hierarchy carefully

Do not assume that one document automatically overrides another.

Compare:

- `AGENTS.md`
- `docs/handoff/CODING-AGENT-INSTRUCTION-MISSING-EZY-CAPABILITIES-2026-11-23.md`
- `docs/handoff/CLAUDE-IMPLEMENTATION-COMMAND-REVIEW-FIX-PASS-2026-11-23.md`
- `docs/ROADMAP.md`

Determine:

1. Which document defines repository-wide agent rules.
2. Which document defines the current implementation task.
3. Which document is historical/review context.
4. Which document controls Phase 8 vs Phase 9 sequencing.

Preserve the distinction between:
**repository governance**, **current task instruction**, and **historical implementation/review context**.

### Step 6 — Resolve privacy/tracking questions without reading transcripts

Check:

`git status --short --ignored`

and inspect only the existence/tracking/ignore status of:

- `docs/convo/`
- `docs/opencode/Session-11-23-2026.md`
- `docs/opencode/Session-11-23-2026.txt`
- `docs/opencode/2.txt`
- `docs/opencode/session-11-21-2026-continue.txt`
- `graphify-out/`

Do NOT read transcript contents.

### Output

Create:

`docs/opencode/PHASE-1-INSTRUCTION-RECONCILIATION.md`

The report must contain:

## 1. Git/branch reconciliation
- current HEAD
- relevant commits
- main vs analysis branch differences
- explanation of the `315e92d` vs `310be4e` discrepancy

## 2. Lifecycle source verification
For each lifecycle function:
- exists?
- exported?
- tested?
- runtime-called?
- relevant file/call site

## 3. Actual runtime/CLI path
State the verified call flow and identify exactly where lifecycle stages are or are not wired.

## 4. CLAUDE fix-pass status
For each major fix area:
- already implemented
- partially implemented
- missing
- intentionally deferred

## 5. Instruction hierarchy
Separate:
- repository governance
- current implementation instruction
- historical/review context
- roadmap/phase authority

## 6. Privacy/tracking status
Only report tracking/ignore/existence status. Do not inspect transcript contents.

## 7. Verified implementation boundary

Explicitly separate:

**CONFIRMED EXISTING**

**CONFIRMED MISSING**

**PARTIALLY IMPLEMENTED**

**NOT YET VERIFIED**

**PHASE 8**

**PHASE 9**

## 8. Recommended next inspection

List only the files/areas that genuinely need Phase 2 inspection.

Do not propose implementation yet.

### STOP CONDITION

After writing `docs/opencode/PHASE-1-INSTRUCTION-RECONCILIATION.md`:

**STOP.**

Do not start Phase 2.
Do not edit production code.
Do not run CI.
Do not run Graphify.

Report the Phase 1 findings and wait for the next instruction.