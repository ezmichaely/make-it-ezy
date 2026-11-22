# Conversation Synthesis — 2026-11-22

## Purpose

Capture the **new product-level conclusions from the recent Make It Ezy conversations** that are not yet cleanly represented in the current handoff/roadmap.

This is a decision-synthesis document, not a transcript. Historical `docs/convo/` material remains research/archive material. Only conclusions that survive review belong here.

## Current conclusion

Make It Ezy should stay a **decision, composition, and routing layer**.

It should not become:

- another coding agent
- a generic multi-agent runtime
- a giant skill bundle
- a model-hosting service
- a replacement for Cursor, Claude Code, Codex, Qwen Code, or similar execution hosts

The useful abstraction is:

```text
User outcome
    ↓
Make It Ezy
    ├─ understand task + project
    ├─ decide required capabilities
    ├─ choose a suitable workflow / contractor
    ├─ choose specialist capabilities where needed
    ├─ preserve trust + approval gates
    └─ hand off an ordered plan
              ↓
      execution host / runtime
              ↓
          actual work
```

## 1. Contractor / orchestrator direction

The recent broker work clarified an important distinction:

- **Ezy is the broker/router.**
- A **contractor** is a reusable workflow unit that can own an internal methodology.
- A downstream execution host performs the work.

Superpowers is the current concrete coding contractor example. Ezy should not flatten a contractor into every internal skill it contains.

### Future domain expansion

A promising future shape is **one strong contractor/orchestrator per domain**, rather than spawning a large number of agents by default.

For example:

```text
                  Ezy
                   │
        ┌──────────┼──────────┐
        ↓          ↓          ↓
     Coding     Research    Documents
   contractor  contractor   contractor
        │          │          │
     specialist  specialist specialist
      skills      skills      skills
```

This is a **design direction, not a Phase 8 requirement**.

The reason to prefer this shape is simplicity: Ezy chooses the right domain workflow first, then fills genuine capability gaps. It avoids rebuilding a general-purpose agent swarm.

## 2. Superpowers vs ECC

The recent comparison should be reflected as a clear distinction.

### Superpowers

Best understood as an **engineering methodology / workflow system**.

In Ezy today it is useful as:

- builder process for developing Ezy
- a coding contractor/workflow reference
- a concrete example of a workflow-owned capability set

### ECC

`affaan-m/ECC` is valuable **prior art and a research source** for:

- engineering skills
- agents
- hooks/rules
- plan → implement → test → review → verify → remember loops

But ECC should **not** be installed wholesale into Ezy or treated as the default contractor.

The lesson is to extract useful patterns and route only the minimum relevant capabilities.

**Decision:** keep ECC as study/reference material; keep Superpowers as the current builder methodology and coding-contractor example.

## 3. Graphify

Graphify remains valuable for **structural project understanding**, but embedding the entire Graphify system into Ezy is unnecessary.

The useful architectural boundary is:

```text
Ezy
  ↓
Knowledge / project-context interface
  ↓
Graphify (optional provider)
```

Ezy should be able to use a project knowledge provider without making one implementation mandatory.

### Storage principle

Do not add a vector database merely because semantic retrieval is interesting.

For the current coding launch:

- local files / Project Brain remain the simple baseline
- structural code intelligence can come from an optional Graphify-style provider
- semantic/vector retrieval can be added only when a real use case justifies the extra storage and indexing complexity

This preserves the local-first architecture and avoids premature infrastructure.

## 4. OmniRoute

OmniRoute represents a **different layer** from Ezy.

It is about model/provider/runtime routing and can sit closer to the execution infrastructure:

```text
Ezy
  ↓
Which workflow / capability is appropriate?
  ↓
Execution host
  ↓
OmniRoute or equivalent
  ↓
Which model/provider/runtime should serve the execution?
```

Therefore OmniRoute should **not** become a core Ezy dependency.

It is a useful future integration/reference for runtime routing, especially if Ezy eventually needs to reason about:

- model availability
- provider fallback
- local vs hosted models
- cost/capability trade-offs
- execution runtime selection

For now it is a research/future integration topic, not a Phase 8 blocker.

## 5. Paperclip and other agent runtimes

Paperclip AI and similar systems are useful for understanding **agent runtime/orchestration infrastructure**.

They should remain study/reference material unless a concrete integration solves a problem Ezy should actually own.

The rule remains:

> Reuse strong open-source infrastructure when it fits the boundary; do not rebuild it merely because it exists, and do not absorb it into Ezy just because it is interesting.

## 6. Local / Home AI

A local AI workstation or Home AI should be treated as an **execution environment**, not as the Ezy product itself.

This keeps the architecture flexible:

```text
                    Make It Ezy
                         │
              decides / routes / hands off
                         │
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
       Claude          Codex          Qwen/local
       Code            / host          model
          │              │              │
          └──────────────┴──────────────┘
                         ↓
                    actual work
```

A local model can be cheaper/private and a hosted model can be stronger. Ezy should not hard-code the assumption that one runtime or provider is always best.

## 7. Ezy learning from real usage

The new shared-evidence direction is consistent with the recent discussion about Ezy improving over time.

The important distinction is:

**Ezy should learn from verified outcomes, not copy private user context.**

Useful shared signals can answer questions such as:

- Which capability works well for a task class?
- Which workflow has a high verified success rate?
- Which skill repeatedly fails verification?
- Which host/model combination performs well for a particular class of work?

Private material must remain local:

- source code
- repositories
- conversations
- Project Brain
- credentials
- private execution details

The learning loop is:

```text
Observe
  ↓
Aggregate privacy-safe evidence
  ↓
Evaluate
  ↓
Propose improvement
  ↓
Validate
  ↓
Approve
  ↓
Deploy
```

Not:

```text
Observe
  ↓
Automatically rewrite Ezy
```

This is now a meaningful long-term differentiator, but it is **not required to complicate the current Phase 8 launch**.

## 8. What this changes — and what it does not

### Strengthened

1. Ezy is a **broker/router**, not the executor.
2. Contractor routing is a first-class abstraction.
3. Domain-specific contractors are a plausible future scaling model.
4. Superpowers and ECC have different roles.
5. Graphify is an optional knowledge provider, not a required core dependency.
6. OmniRoute belongs to model/provider/runtime routing, not capability selection.
7. Paperclip belongs to runtime/orchestration research, not automatic Ezy dependency.
8. Shared learning should use privacy-safe verified evidence.
9. Local/Home AI is an execution environment, not the product boundary.

### Explicitly not changed

- Phase 8 remains the current launch/distribution phase.
- No LLM is added inside the Ezy CLI merely because these ideas were discussed.
- No general multi-agent swarm is added.
- No vector database is introduced without a concrete need.
- No external skill is silently installed or executed.
- No third-party project becomes a mandatory runtime dependency without an explicit architecture decision.

## 9. Recommended next architectural question

Before adding more machinery, the next useful question is:

> **What is the smallest stable interface between Ezy's capability broker and downstream contractors/execution runtimes?**

If that boundary is clean, Ezy can later integrate:

- Superpowers
- ECC-derived specialist skills
- Graphify-like project knowledge
- OmniRoute-like runtime routing
- local models
- hosted models
- other domain contractors

without turning the core into a giant orchestration framework.

## Bottom line

The project is converging toward a simpler architecture:

> **Ezy decides what kind of work should happen and what capabilities/workflow are needed. The execution ecosystem does the work.**

The more Ezy can make that decision reliably — using project context, trust, evidence, and verified outcomes — the less reason it has to become another execution platform.


## 10. Intent-to-outcome pipeline

The latest discussion exposed a missing architectural layer in the previous synthesis: Ezy does not only route an already-well-specified task. A core Ezy responsibility is turning ambiguous user intent into a sufficiently understood, executable objective.

The important distinction is between **Ezy-owned orchestration responsibilities** and the specialized capabilities Ezy may invoke.

A representative pipeline is:

```text
User intent
   ↓
Understand
   ↓
Prompt formulation / Prompt Master
   ↓
Clarify uncertainty when needed / Grill Me
   ↓
Capability inspection / Skillspector
   ↓
Capability discovery / Find Skills
   ↓
Skill evaluation
   ↓
Skill specification / composition
   ↓
Contractor / workflow selection
   ↓
Execution host
   ↓
Outcome evaluation
   ↓
Deliver / iterate / escalate
```

This is a **capability pipeline, not a mandatory linear sequence**. Ezy should decide which stages are necessary for a given request.

For example:

- a clear request may not need Grill Me
- a request with no capability gap may not need Find Skills
- a task may require several selected skills, while another needs none
- Humanizer-like capabilities should be invoked when communication quality or transformation is actually part of the task, not applied universally

### Role separation

The recent discussion also clarified that several similarly named capabilities solve different problems:

- **Prompt Master:** formulate/structure the user's intent into a stronger task specification
- **Grill Me:** expose ambiguity, assumptions, missing requirements, and unresolved decisions
- **Skillspector:** inspect the available skill/capability landscape
- **Find Skills:** discover candidate skills/capabilities for a concrete need
- **Skill Evaluator:** judge discovered candidates for relevance, quality, trust, overlap, safety, and fit
- **Skill Spec / composition:** formalize selected capabilities so they can be composed into the downstream workflow
- **Humanizer:** improve user-facing communication or output when that capability is relevant
- **Contractor:** own the domain/workflow methodology and execute through an appropriate host

The exact implementations of these capabilities may change. Ezy should depend on **stable roles/interfaces**, not on hard-coding one particular external project into core.

## 11. Two different evaluators

Evaluation occurs at two distinct levels and should not be collapsed.

### Skill evaluation

This happens **after skill discovery**:

```text
Find Skills
    ↓
Skill Evaluator
    ↓
Select / reject / request alternatives
    ↓
Skill Spec / composition
```

The question is:

> **"Is this capability a good choice for the work?"**

Relevant signals can include task fit, quality, trust, safety, overlap, dependencies, and expected reliability.

### Outcome evaluation

This happens **after execution**:

```text
Execution
    ↓
Outcome Evaluator
    ↓
Pass → deliver
Fail/uncertain → iterate, replan, or escalate
```

The question is:

> **"Did the resulting work actually satisfy the user's intended outcome?"**

This is different from a contractor's internal test or verification. Tests can pass while the implementation still fails the user's actual intent.

The resulting control loop is:

```text
Execute
  ↓
Evaluate outcome
  ↓
Decide
 ├─ Pass → Deliver
 └─ Fail/uncertain → Replan / Fix → Execute again
```

This also connects directly to the shared-evidence architecture: **verified outcomes become evidence for future capability/workflow decisions**.

## 12. Revised Ezy boundary

The previous shorthand "Ezy is a broker/router" remains directionally correct but is incomplete.

A more precise working definition is:

> **Make It Ezy is an intent-to-outcome orchestration layer: it understands user intent, invokes the capabilities needed to clarify and formulate the work, discovers and evaluates suitable skills, composes a workflow/contractor, delegates execution, evaluates the outcome, and decides whether to deliver, iterate, or escalate.**

This does **not** mean Ezy should implement every capability itself.

The core should remain small. Specialized capabilities can remain external, replaceable, or provider-backed.

The architectural goal is therefore:

> **Ezy owns the decision protocol and lifecycle; capabilities and contractors provide specialized work; execution hosts perform the work.**

