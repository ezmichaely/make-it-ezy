**STOP. Do not continue the previous session as-is.**

The previous sessions hit repeated MLX Metal OOM. The model is now running with a **32K context limit**, so memory stability is a hard constraint.

Before doing any further repository analysis:

1. Do **NOT** attempt to increase the context size.
2. Do **NOT** load the entire repository into context.
3. Do **NOT** read the entire `Session-11-23-2026.md`.
4. Do **NOT** run Graphify, full-repository scans, CI, or other expensive operations yet.
5. Work in small phases and persist findings to `docs/opencode/`.
6. Do not repeatedly reread files that have already been analyzed.
7. If the MLX runner reports **OOM / Insufficient Memory / Metal Command Buffer OutOfMemory even once**, **STOP IMMEDIATELY**. Do not retry.
8. Do not modify production code.
9. Use one local analysis branch only.

### Phase 0 — Establish the baseline

Inspect **only**:

- current git branch and HEAD
- working tree status
- repository top-level structure
- `docs/handoff/CODING-AGENT-INSTRUCTION-MISSING-EZY-CAPABILITIES-2026-11-23.md`
- `docs/handoff/CLAUDE-IMPLEMENTATION-COMMAND-REVIEW-FIX-PASS-2026-11-23.md`
- `docs/skill-scan/ANALYSIS.md`
- `docs/skill-scan/REANALYSIS-2026-11-24.md`

Do **not** read the entire session transcript yet.

Create:

`docs/opencode/PHASE-0-BASELINE.md`

Include:

- current branch/HEAD
- working-tree state
- instruction hierarchy
- authoritative vs historical documents
- confirmed existing implementation
- confirmed missing implementation
- unresolved questions
- exact files that need inspection in Phase 1

Then **STOP**.

Do not proceed to Phase 1 automatically.

Report the Phase 0 findings and wait for the next instruction.

### Critical rule

The goal is **not maximum analysis in one session**.

The goal is a reliable, checkpointed investigation that survives the local model's memory limits.

Prefer targeted searches and small file reads over large context ingestion.