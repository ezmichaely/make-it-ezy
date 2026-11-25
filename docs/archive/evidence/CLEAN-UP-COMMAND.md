# Historical Cleanup Command

> **Status: COMPLETED — HISTORICAL EVIDENCE**
>
> This file records the one-time repository cleanup/source-of-truth routing instruction used during the repository reconciliation. It is archived for provenance only and is **not** an active agent instruction or work order.

---

You are working inside the Make It Ezy repository.

Your task is to establish a reliable **LLM/agent boot protocol** for this repository.

## Objective

When any LLM/agent starts working in this repository, it must NOT form its initial understanding from a stale or oversized README.

Create a clear hierarchy where:

1. `AGENTS.md` is the agent boot/router instruction.
2. `docs/STATUS.md` is the authoritative current product/runtime truth.
3. `docs/ARCHITECTURE.md` is the authoritative architecture description.
4. `README.md` is primarily human-facing project documentation and must not be treated as the authoritative runtime state.
5. Audits, research, conversations, transcripts, historical handoffs, and generated artifacts are evidence/history — NOT current product truth.

The repository must make this distinction obvious to both humans and LLMs.

---

# IMPORTANT CONSTRAINTS

Do NOT:

- perform a broad repository rewrite
- implement new product functionality
- wire the lifecycle into production
- invent new architecture
- create another audit
- create another research report
- delete the existing audit/research corpus yet
- blindly trust existing documentation
- assume README.md is currently correct
- treat audit documents as runtime truth

This is a **documentation/source-of-truth routing task**, not a product implementation task.

Before editing anything, inspect the current repository and verify the actual implementation state.

---

# PHASE 1 — INSPECT CURRENT TRUTH

Inspect:

- `AGENTS.md`
- `README.md`
- `docs/ARCHITECTURE.md`
- `docs/ROADMAP.md`
- `docs/MVP-SPECIFICATION.md`
- `packages/core/`
- `apps/`
- relevant CLI entrypoints
- current lifecycle implementation
- current planner/runtime path
- current tests
- `.gitignore`

Also inspect the existing repository audit:

`docs/audits/FULL-REPOSITORY-AUDIT.md`

Use it as evidence, not as unquestionable truth.

Verify important claims against the current source.

The current known runtime model is approximately:

`analyze → requirements → search → select → plan → handoff`

The lifecycle contracts currently exist in:

`packages/core/src/lifecycle.ts`

but must NOT be described as production runtime behavior unless the current source proves that they are actually wired into the runtime.

---

# PHASE 2 — CREATE AUTHORITATIVE STATUS DOCUMENT

Create:

`docs/STATUS.md`

This should be intentionally short.

It must answer:

## What is Make It Ezy?

Describe the actual current product.

## Current Runtime

Show the actual production flow.

## Lifecycle Status

Explicitly distinguish:

- lifecycle contracts that exist
- lifecycle tests that exist
- lifecycle exports
- lifecycle functionality actually used by production runtime

Do not blur these together.

## Current Phase

State the current development phase based on the actual repository.

## Implemented

List only functionality that is actually implemented and reachable.

## Not Implemented

List important capabilities that are documented/planned but not actually implemented.

Examples may include:

- runtime lifecycle orchestration
- trust/quality evaluation gate
- outcome verification
- autonomous execution
- catalog/trust registry

Only include an item if repository inspection confirms it.

## Source-of-Truth Rules

Explain which files are authoritative for:

- agent instructions
- current product status
- architecture
- roadmap
- historical audits
- research
- conversations/transcripts

## Verification Rule

State clearly:

> When documentation conflicts with implementation, verify against the current source code before making product claims.

Keep this document concise. It should be something an LLM can read in seconds.

---

# PHASE 3 — FIX AGENTS.MD

Update `AGENTS.md` so it becomes the primary agent boot router.

At the beginning, establish an explicit reading order.

Recommended structure:

1. `docs/STATUS.md`
2. `docs/ARCHITECTURE.md`
3. relevant source code
4. relevant tests
5. README and other documentation only when useful

Explicitly state:

- README is human-facing documentation.
- README is NOT authoritative for current implementation state.
- `docs/STATUS.md` is authoritative for current product/runtime state.
- audit/research/session documents are historical/evidence material.
- do not assume a planned feature exists because documentation describes it.
- verify runtime behavior in source.

The instructions should be strong enough that an LLM cannot reasonably interpret README as the first source of truth.

Do not make `AGENTS.md` excessively long.

---

# PHASE 4 — UPDATE README

Do NOT rewrite the entire README.

Instead:

1. Correct any materially stale product-status claims.
2. Add a concise current-status section near the top.
3. Point agents/readers to `docs/STATUS.md`.
4. Make clear that `docs/STATUS.md` is the authoritative current runtime status.
5. Keep README primarily human-facing.

The README should remain useful as an introduction to the project.

Do not turn it into another giant status/audit document.

---

# PHASE 5 — CHECK ARCHITECTURE DOC

Review:

`docs/ARCHITECTURE.md`

Only make changes necessary to prevent it from contradicting `docs/STATUS.md` or the actual implementation.

Do not expand the architecture document unnecessarily.

If architecture decisions are unresolved, state that they are unresolved rather than inventing a decision.

---

# PHASE 6 — CHECK ROADMAP

Review:

`docs/ROADMAP.md`

Ensure it does not claim that future lifecycle/runtime functionality is already shipped.

Do not redesign the roadmap.

Only correct factual status contradictions discovered during this task.

---

# PHASE 7 — CHECK FOR BOOT-CONFLICTS

Search for instructions that could cause an LLM to incorrectly treat README or historical documents as authoritative.

Look for:

- "read README first"
- "README is the source of truth"
- claims that planned features are shipped
- instructions that contradict `AGENTS.md`
- stale phase/status claims
- instructions referencing nonexistent paths as current runtime components

Fix only relevant conflicts.

Do not perform a massive documentation cleanup.

---

# PHASE 8 — VALIDATE

After changes:

1. Re-read `AGENTS.md`.
2. Re-read `docs/STATUS.md`.
3. Re-read the top section of `README.md`.
4. Compare the stated runtime flow against the actual CLI/planner source.
5. Verify lifecycle claims against `packages/core/src/lifecycle.ts` and its callers.
6. Check that no new documentation contradicts itself.
7. Run the relevant documentation/test/typecheck validation that is available.

Do NOT modify production behavior.

---

# REQUIRED RESULT

The final repository boot flow should effectively be:

AGENTS.md
    ↓
docs/STATUS.md
    ↓
docs/ARCHITECTURE.md
    ↓
relevant source/tests
    ↓
README / other docs as needed

And NOT:

README.md
    ↓
old assumptions
    ↓
audit archaeology
    ↓
confusion

---

# FINAL RESPONSE

After completing the work, report:

1. Files changed.
2. What was changed in each.
3. The new source-of-truth hierarchy.
4. The verified current runtime flow.
5. Any remaining documentation contradictions.
6. Whether tests/typecheck/build were run and their result.
7. Anything that could NOT be verified.

Do not claim something was fixed unless you actually inspected and changed it.
Do not create additional audit documents.
Do not implement product features.