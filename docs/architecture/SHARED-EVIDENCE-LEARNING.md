# Shared Evidence & Self-Improvement

## Purpose

Define how Make It Ezy can learn from real usage across many independent users without mixing or exposing their private project context.

This document extends the existing evidence-driven self-improvement direction. It does not make user conversations, repositories, Project Brains, or private files part of a shared knowledge pool.

## Implementation status

Privacy-safe lifecycle **contracts and local helpers** are implemented in:
- `packages/core/src/lifecycle-types.ts`
- `packages/core/src/lifecycle.ts`
- `packages/core/src/lifecycle.test.ts`

They provide exported contracts for structured outcome evidence, local aggregation (`aggregateEvidence`), and reversible improvement proposals. They are **boundary contracts, not wired into the controlling CLI/planner pipeline**. No CLI command currently uses them as the controlling lifecycle. They do **not** upload telemetry, require a hosted service, or automatically modify Ezy. See `docs/MVP-SPECIFICATION.md` “Lifecycle contracts.”

A future shared-learning service remains out of scope until there is an explicit product decision and privacy/consent model.

## Core Principle

**Share evidence about outcomes, not private user context.**

Each Ezy installation keeps its own private context:

- Project Brain
- files and repositories
- conversations
- preferences
- local agent configuration
- private execution details

Only privacy-safe, structured outcome signals may contribute to shared Ezy learning.

## Learning Loop

```
Task
  ↓
Plan
  ↓
Capability / skill selection
  ↓
Execution
  ↓
Verification
  ↓
Outcome
  ↓
Structured evidence
  ↓
Aggregate evidence
  ↓
Evaluate
  ↓
Improvement proposal
  ↓
Controlled validation
  ↓
Approved improvement
```

Ezy must not treat a single successful or failed task as proof that a capability is better or worse.

## Evidence Events

A shared evidence event should contain the minimum information needed to evaluate performance.

Example:

```json
{
  "taskClass": "typescript_refactor",
  "capabilities": ["code-analysis", "testing"],
  "skills": ["skill-x"],
  "agent": "claude-code",
  "outcome": "success",
  "verification": {
    "testsPassed": true,
    "buildPassed": true
  },
  "durationMs": 84200
}
```

The event should **not** contain source code, private conversation content, repository contents, credentials, Project Brain data, or other user-specific material unless a future explicitly consented feature requires it.

## Two Different Registries

Security and performance are separate concerns.

### Skill Trust Registry

Answers:

> Is this exact skill artifact acceptable under the current security policy?

Identity should include the artifact/content hash, not only the skill name.

Example fields:

- skill identity
- source
- version/commit
- content hash
- SkillSpector version
- scan mode
- policy version
- risk/result
- trust status

A skill update creates a new artifact identity and requires re-evaluation.

### Skill Performance Registry

Answers:

> How well does this capability perform for a particular class of task?

Useful signals include:

- task class
- capability
- skill
- agent/model
- verified outcome
- failure rate
- success rate
- sample size
- confidence
- evaluation version

A skill can therefore be **safe but ineffective**, or **safe and high-performing**.

## Privacy Boundary

The architecture must preserve a hard separation:

```
User A private context ─┐
User B private context ─┼── X ──> shared user context
User C private context ─┘

User A outcome ─┐
User B outcome ─┼──> aggregated evidence
User C outcome ─┘
```

Shared learning should be derived from structured evidence rather than copying private context into a global Project Brain.

## Self-Improvement Policy

Ezy should use:

**Observe → Aggregate → Evaluate → Propose → Validate → Approve → Deploy**

not:

**Observe → Automatically rewrite Ezy**

Improvement proposals may change:

- skill ranking
- capability routing
- planning heuristics
- verification strategies
- model selection
- workflow recommendations

Changes should be evidence-backed and reversible.

## Dogfooding Across Users

With many users, Ezy can accumulate evidence about real-world capability performance.

For example:

```
User A → Skill X → verified success
User B → Skill X → verified success
User C → Skill X → failure
User D → Skill X → verified success
```

This becomes an aggregate signal, not access to those users' private work.

A larger sample can increase confidence, but sample size alone does not prove causality. Task class, agent/model, environment, and verification method must be considered when comparing outcomes.

## Local vs Shared Ezy

Ezy can operate in two layers:

### Local Ezy

Contains private:

- Project Brain
- local skill cache
- local trust registry
- local execution history
- local preferences

### Shared Ezy Learning

Contains only approved aggregate evidence and derived improvement artifacts.

A user's Home AI remains private. Shared learning must never become an implicit gateway into another user's Home AI, files, models, or Project Brain.

## Security and Trust

Skill security should remain independent from performance learning.

Recommended flow:

```
Find candidate
  ↓
Check local/shared trust record
  ↓
Content hash unchanged?
  ├─ Yes → reuse valid result
  └─ No  → scan again
  ↓
SkillSpector static scan
  ↓
Optional deeper semantic analysis
  ↓
Trust decision
  ↓
Install / reject / review
```

A scanner update should not automatically trigger an expensive LLM rescan of every registered skill. Existing results can become stale and be revalidated lazily or by priority. Static checks should remain the cheap baseline.

## Important Non-Goals

This design does **not** require:

- sharing user conversations
- sharing private repositories
- sharing Project Brain contents
- training a global model directly on private user data
- rescanning every skill with an LLM whenever SkillSpector changes
- making the user's Home AI publicly accessible
- automatically modifying Ezy's own code from raw user activity

## Future Direction

The long-term goal is a distributed evidence loop:

```
Many independent Ezy users
        ↓
verified task outcomes
        ↓
privacy-safe evidence
        ↓
aggregate evaluation
        ↓
better routing / skills / workflows
        ↓
better outcomes
        ↓
more evidence
```

The value of the network comes from **verified experience**, while each user's private context remains isolated.
