# Make It Ezy — Full Repository Direction Audit

Audit target: `analysis/full-scan-reconciliation`.

This canonical report is the synthesis of the repository audit performed against the requested branch. The repository is a real pnpm workspace with `apps/cli`, `packages/core`, repo-owned adapter skills, extensive documentation, broker/contractor design, and generated research artifacts.

## Executive conclusion

Make It Ezy currently has a coherent deterministic core: project inspection → requirements → local/remote skill discovery → scoring → minimum-set selection → optional contractor routing → handoff → gated install / host-agent execution.

The repository's broader architectural language describes a larger intent-to-outcome system with intent intake, clarification, evaluation, composition, outcome verification, and evidence learning. Those broader lifecycle contracts exist in `packages/core/src/lifecycle.ts`, but they are not the controlling CLI/planner pipeline today.

The correct restoration path is therefore **not a rewrite**. It is to freeze the product boundary, distinguish runtime from contracts/future work, harden the install/inspect trust boundary, introduce a stable machine-readable plan contract, add only the smallest real evaluation state, keep contractors/providers replaceable, reduce generated-documentation exhaust, and defer outcome verification / evidence learning until the current boundary is stable.

## Highest-priority findings

| Priority | Finding | Recommendation |
|---|---|---|
| P0 | Lifecycle/runtime ownership is still a recurring source of conflicting implementation instructions | Record one accepted product-truth decision and archive superseded implementation handoffs |
| P0 | `docs/skill-scan/` and `graphify-out/` dominate repository size and tracked-file count | Move raw generated evidence out; keep concise summaries, hashes and reproduction notes |
| P0 | Conversation/session exports are tracked historical material | Quarantine/remove through an explicit retention/privacy decision |
| P1 | Trust/evaluation language is stronger than runtime enforcement | Add a minimal evaluation boundary using only evidence that actually exists |
| P1 | `ezy install` is the most sensitive runtime boundary | Validate source/name, harden `npx` invocation, and verify installed content |
| P1 | `ezy inspect` exposes skill-derived terminal content | Sanitize all untrusted skill-derived output before formatting |
| P1 | Project Brain is mostly persistent context rather than an active planning input | Keep it small; consume only clearly valuable fields such as rejected skills when justified |
| P1 | Contractor routing is a first slice, currently centered on Superpowers | Do not build a generalized catalog until a second real contractor exists |
| P2 | `plan` can issue several sequential remote searches | Optimize after the planner contract is stable |
| P2 | Unknown flags can be silently ignored | Reject unknown flags deterministically |
| P2 | “Recommended” has multiple meanings across search/recommend/plan/contractor routing | Canonicalize candidate/selected/recommended/reviewed/installed terminology |

## Current architecture

```text
CLI
 └─ core
     ├─ analyze
     ├─ requirements
     ├─ search
     ├─ score
     ├─ select
     ├─ plan
     ├─ handoff
     ├─ install
     ├─ inspect
     └─ brain
```

The core/CLI dependency direction is sound. The strongest implementation is the deterministic selector and its associated tests. The main architectural problem is a **boundary mismatch**, not a fundamentally broken codebase.

## Target architecture

```text
User intent
    ↓
Intent / requirement understanding
    ↓
Project context
    ↓
Candidate discovery
    ↓
Evaluation / trust state
    ↓
Selection
    ↓
Workflow / contractor composition
    ↓
Machine-readable plan
    ↓
Host runtime adapter
    ↓
Execution
    ↓
Outcome verification
    ↓
Privacy-safe evidence
```

Ezy should own the **decision protocol and lifecycle boundaries**, not the execution engines.

Superpowers, Graphify, ECC-like ecosystems, OmniRoute-like runtime routers, local models, hosted models, and host agents should remain replaceable providers/integrations rather than mandatory core dependencies.

## Product identity

The current repository supports a precise statement:

> Make It Ezy is a local-first intent-to-capability decision layer for coding work. It identifies what a requested outcome needs, selects a minimum useful capability/workflow stack, and prepares a handoff for a host execution agent.

It is **not** itself a coding agent, multi-agent swarm, model host, giant skill marketplace, or mandatory Superpowers/Graphify runtime.

## Documentation truth

Current authoritative sources should remain centered on:

1. `AGENTS.md`
2. `docs/ROADMAP.md`
3. `docs/MVP-SPECIFICATION.md`
4. `docs/HOW-IT-WORKS.md`
5. `docs/architecture/`
6. `docs/decisions/`
7. current `docs/handoff/`

Historical conversation/session material must not become product authority.

## Critical contradictions

### Lifecycle

`packages/core/src/lifecycle.ts` provides real contracts for intent intake, skill evaluation, composition, outcome evaluation, evidence aggregation, and improvement proposals. The planner does not currently call those contracts. Future documents must state clearly whether they are internal boundaries or active runtime behavior.

### Catalog

The broker design describes a catalog as necessary, while `catalog/` is empty and contractor routing is currently implemented as a small hard-coded Superpowers entry. That is acceptable as a first slice but should not be described as a mature general catalog.

### Trust

Discovery, recommendation, evaluation, approval, installation, and execution are separate concepts. Current selection is deterministic and relevance-oriented; it is not yet a formal trust certification gate.

## Security findings

### Install boundary

`packages/core/src/install.ts` executes `npx skills add <source> --skill <name>`. This boundary should receive the highest concrete hardening priority: input validation, argument safety, installer pinning/version policy, and post-install verification.

### Inspect boundary

`packages/core/src/inspect-skill.ts` reads untrusted skill metadata and content and returns filenames/description/body preview. Its shallow scan is useful but not a security audit. User-visible formatting must sanitize skill-derived strings consistently.

### Provenance

Hashes in `skills-lock.json` are valuable only if local content is actually compared against them. Recording provenance without verification should not be described as verification.

### Privacy

`docs/convo/` and `docs/opencode/` / `docs/gpt/` are historical artifacts. Their retention should be an explicit repository decision, not an implicit part of the product source tree.

## Repository hygiene

The repository itself records that approximately 224 MB of `docs/skill-scan/` and roughly 14 MB of `graphify-out/` are generated research/graph outputs. They materially increase clone, review and CI cost and can create redistribution questions for captured third-party content.

Recommendation: retain human-useful summaries, workbook, reproduction recipe and hashes; move the raw generated corpus out of the product repository and enforce size/count policies so it cannot silently return.

## Testing status

Static test structure is healthy enough to support continued work, especially around scoring, selection, planning, handoff and lifecycle contracts. However, a fresh build/test/typecheck/lint run was not performed in this audit. Therefore current live green status is **UNKNOWN**.

High-value future coverage includes hostile skill output, install validation, structured plan/handoff contracts, contractor routing, trust state transitions, and exact CLI exit/flag behavior.

## Keep / Fix / Remove / Decide

### KEEP

- deterministic requirement/selection core
- `apps/cli` → `packages/core` separation
- no-LLM/no-database/no-hosted-backend baseline
- gated install approval
- host-agent execution boundary
- provider independence
- Superpowers as a first contractor/workflow example
- Graphify as an optional structural-knowledge provider

### FIX

- lifecycle/product-truth documentation conflict
- install validation and execution safety
- inspect output sanitization
- machine-readable plan/handoff contract
- CLI unknown-flag behavior
- terminology around recommendation/trust/review
- generated-artifact policy

### REMOVE / ARCHIVE

- raw generated SkillEvaluator outputs from the product repository when the retention decision is approved
- session/conversation dumps that do not serve a durable documentation role
- obsolete/empty historical placeholders where policy permits
- stale generated Graphify snapshots when they are superseded

### DECIDE

- whether lifecycle contracts remain internal until a later phase or begin wiring now
- exact retention/distribution policy for research corpus
- exact privacy retention policy for conversation/session exports
- when a second contractor justifies a generalized contractor catalog

## Restoration plan

### Phase 0 — Freeze product truth

Create one accepted decision that defines which lifecycle responsibilities are runtime, boundary contracts, or deferred. Archive conflicting implementation handoffs. Validate all authoritative docs against this decision.

### Phase 1 — Harden trust boundaries

Sanitize skill-derived output, validate install inputs, harden `npx` invocation, and verify installed content. Add malicious/hostile fixtures and regression tests.

### Phase 2 — Establish a machine-readable plan contract

Expose stable JSON for the existing `PlanReport`/handoff decision. Keep it as output, not a second planner implementation.

### Phase 3 — Introduce minimal evaluation state

Use the existing `evaluateSkillCandidate` contract with only real evidence. Distinguish eligible/review/rejected without inventing unsupported quality metrics.

### Phase 4 — Improve intent quality

Make insufficiently specified inputs honest rather than manufacturing confident heuristic requirements. Use the existing brief path for richer host-led research.

### Phase 5 — Stabilize contractor interface

Keep Superpowers as one contractor provider. Generalize only when a real second contractor demonstrates a need.

### Phase 6 — Reduce repository exhaust

Move raw research/session artifacts out of the product repository and add mechanical size/link/status gates.

### Phase 7 — Outcome verification

After the handoff/execution boundary is stable, wire outcome verification and PASS/FAIL/UNCERTAIN semantics. Keep execution with the host runtime.

### Phase 8 — Evidence-based learning

Use verified outcomes as privacy-safe aggregate evidence. Generate reversible proposals; do not let Ezy silently rewrite itself.

## Validation matrix

| Area | Current state | Target state | Action | Priority |
|---|---|---|---|---|
| Product identity | Mostly coherent | One precise definition | Freeze docs | P0 |
| Lifecycle | Contracts, not pipeline | Explicitly bounded lifecycle | Decision first | P0 |
| Research corpus | Large generated tree in repo | Distilled evidence | Move raw outputs | P0 |
| Privacy artifacts | Historical exports tracked | Sanitized durable docs | Quarantine/remove | P0 |
| Trust | Shallow/implicit | Explicit review gate | Minimal evaluator integration | P1 |
| Install | Gated but under-hardened | Validated + verified | Security hardening | P1 |
| Plan output | Prose-centric | Stable structured contract | Add JSON | P1 |
| Contractor | One built-in | Stable provider interface | Generalize later | P1 |
| Brain | Persistent context artifact | Selective planning input | Incrementally consume | P2 |
| Outcome verification | Deferred | PASS/FAIL/UNCERTAIN | Phase 9 | P3 |
| Shared learning | Contract only | Privacy-safe verified evidence | Later | P3 |

## Final recommendation

**Do not rewrite Make It Ezy.** The repository already contains a viable, relatively small deterministic product core. Restore coherence by making the architecture language match the implementation, hardening its trust boundaries, formalizing the plan/handoff interface, and reducing repository exhaust. Only then extend toward outcome verification and evidence-based learning.

The strategic constraint should stay simple:

> **Ezy decides what kind of work should happen and what capabilities/workflow are needed. The execution ecosystem does the work.**
