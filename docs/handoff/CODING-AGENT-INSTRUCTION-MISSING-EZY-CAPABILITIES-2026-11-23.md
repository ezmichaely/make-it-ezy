# Coding Agent Instruction — Implement the Missing Ezy Capability Lifecycle

**Target:** current `main` branch  
**Purpose:** Give the coding agent a concrete implementation brief for the architectural gaps identified after reviewing the current `main` against the latest Ezy design discussions.

> **Important:** This is an implementation instruction for the coding agent. It does **not** authorize merging, publishing, adding external runtime dependencies, or turning every named external skill into Ezy core.

> **Branch status:** The stable lifecycle contracts described below are now implemented in `packages/core/src/lifecycle-types.ts` and `packages/core/src/lifecycle.ts`, with unit coverage in `packages/core/src/lifecycle.test.ts`. The remaining work is wiring these contracts into the runtime/CLI without violating the Phase 8 / Phase 9 boundary.

## 1. Goal

Extend the current Ezy coding-task flow so it can move from **raw user intent to a verified outcome**, while keeping Ezy's existing boundary:

- Ezy is the local-first capability/context decision and orchestration layer.
- The host agent still performs research, skill execution, coding, and other heavy work.
- Ezy must not become a coding agent, generic multi-agent runtime, or giant bundled skill collection.
- External skill content remains untrusted and user-approved.
- Keep the implementation small and compatible with the current Phase 8 launch path.

The desired lifecycle is:

```text
User intent
   ↓
Understand
   ↓
Prompt formulation / Prompt Master role
   ↓
Clarify uncertainty when needed / Grill Me role
   ↓
Capability inspection / Skillspector role
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

This is a **decision lifecycle**, not a mandatory linear pipeline. Ezy should skip stages that are unnecessary for a clear, low-risk request.

---

## 2. What is already present on `main`

Do not rebuild these:

- project-aware `plan` / `next`
- agent brief path and `.ezy/brief.json`
- Project Brain
- local + skills.sh discovery
- minimum-useful capability selection
- gated installation
- broker-directed contractor/workflow handoff
- Superpowers as the current coding-contractor example
- host-agent execution model
- no LLM embedded in the Ezy CLI

Treat the existing implementation and its tests as the baseline. Preserve current behavior unless a change is required for the lifecycle below.

---

## 3. Missing capability #1 — Intent clarification

### Problem

The current product can plan from a goal/brief, but the architecture now explicitly recognizes that a vague user request may be insufficiently specified.

Example:

> "Build me a finance app."

Before capability selection, Ezy needs a way to recognize that important decisions are unresolved.

### Implement

Add a **clarification/intake contract** that can represent:

- the user's raw intent
- understood objective
- known requirements
- unknowns / ambiguities
- assumptions
- blocking decisions
- whether clarification is required
- questions suitable for a host-agent clarification workflow

Do **not** implement the full Grill Me skill inside the CLI.

Instead, define the role/interface so an external capability such as **Grill Me** can perform the interrogation and return structured information that Ezy can consume.

A clear request should be able to bypass this stage.

### Expected behavior

```text
clear request → continue
ambiguous request → request/consume clarification → continue
still unresolved → do not pretend certainty
```

Do not invent requirements merely to make planning succeed.

---

## 4. Missing capability #2 — Skill evaluation after discovery

The current architecture distinguishes **finding a skill** from deciding whether that skill should actually be used.

Implement a first-class **Skill Evaluation** concept after discovery.

### Required distinction

```text
Find Skills
    ↓
Skill Evaluator
    ↓
select / reject / seek alternative
    ↓
Skill Spec / composition
```

The evaluator should reason about available evidence such as:

- task fit
- provenance
- security/review state
- quality evidence
- maintenance
- compatibility
- dependencies
- overlap/redundancy
- expected context cost

Do not turn this into an unsafe single numeric "trust score" that hides evidence.

Prefer explicit reasons/evidence and an eligibility/review state.

### Important

**Discovery is not recommendation.**

A skill can be:

- discovered
- inspected
- candidate
- rejected
- eligible
- preferred

without being executed.

External skill instructions must remain untrusted. The evaluator must not execute arbitrary skill instructions merely to inspect them.

---

## 5. Missing capability #3 — Skill specification / composition boundary

After selecting capabilities, Ezy needs a stable representation of what the downstream workflow actually expects.

Define or extend a **Skill Spec / capability specification** that can capture, as appropriate:

- capability identity
- purpose
- inputs
- outputs
- requirements
- constraints
- supported host/runtime
- dependencies
- trust/review state
- evidence
- composition role
- ordering/precedence where needed

Do not force every external skill to conform to a new runtime format.

This is an **Ezy internal decision/handoff contract**, not a replacement for `SKILL.md` or other host-agent formats.

The selected specification should be enough to generate a concise downstream handoff.

---

## 6. Missing capability #4 — Outcome evaluation after execution

The current roadmap already identifies Phase 9 as outcome verification. The implementation should preserve that roadmap sequencing, but the architecture must now explicitly reserve the correct boundary.

The post-execution evaluator asks:

> **Did the resulting work actually satisfy the user's intended outcome?**

This is different from:

- "the command exited 0"
- "tests passed"
- "the contractor said it was done"

A result can pass technical checks while failing the user's actual intent.

### Implement the boundary/contract, not an oversized autonomous evaluator

The outcome evaluator should be able to consume:

- original intent
- clarified requirements
- selected capability/workflow
- execution result
- artifacts/status
- verification/test evidence

and return a structured decision such as:

```text
PASS
FAIL
UNCERTAIN
```

with:

- reasons
- unmet requirements
- evidence
- recommended next action

Next action can be:

- deliver
- fix/iterate
- replan
- escalate to user

Do not add autonomous agent spawning.

---

## 7. Keep the two evaluators separate

There are **two different evaluation problems**:

### Skill Evaluator

**When:** after Find Skills  
**Question:** "Is this capability a good choice for the work?"

### Outcome Evaluator

**When:** after execution  
**Question:** "Did the resulting work satisfy the intended outcome?"

Do not collapse them into one generic evaluator.

The control loop is:

```text
Execute
  ↓
Outcome Evaluate
  ↓
Decide
 ├─ PASS → Deliver
 └─ FAIL / UNCERTAIN → Replan / Fix / Escalate
```

---

## 8. External skills to model as capabilities — not bundle into core

The following recent skills/projects are **examples/providers of capability roles**, not mandatory Ezy dependencies:

| Capability role | Example |
|---|---|
| Intent clarification | Matt Pocock's **Grill Me** |
| Intent/prompt formulation | **Prompt Master** |
| Skill ecosystem inspection | **Skillspector** |
| Skill discovery | **Find Skills** |
| Skill evaluation | **SkillEvaluator / equivalent evaluator** |
| Engineering methodology | **Superpowers**, Ponytail, selected ECC patterns |
| Security specialist | Cloudflare **Security Audit Skill** |
| UI/design specialist | **Impeccable** |
| UI/design alternative | **Hallmark** |
| Visual technical explanation | **Anatomy** |
| Communication refinement | **Humanizer** |
| Project structural context | Graphify / Project Brain |
| Model/provider routing | OmniRoute / equivalent |
| Execution | Codex / Claude Code / Cursor / Qwen / local runtime |

Do **not** install all of these into Ezy.

Ezy should know the **roles/interfaces**, discover candidate providers, evaluate them, and compose the minimum useful set.

Where two capabilities overlap (for example Impeccable and Hallmark), the evaluator should prefer one or justify composition rather than blindly stacking both.

---

## 9. Capability classification

Update the capability model/docs so capabilities can be classified by role rather than only by repository/skill name.

At minimum support these conceptual categories:

- intent / planning
- clarification
- capability inspection
- discovery
- evaluation
- specification / composition
- domain specialist
- contractor / workflow
- context / knowledge
- execution
- outcome verification

This should remain extensible.

Do not create a giant catalog just to represent these categories.

---

## 10. User control and safety constraints

Preserve all existing trust rules.

The implementation must **not**:

- silently install external skills
- silently execute discovered skill instructions
- treat GitHub stars/popularity as a security certification
- add an LLM to Ezy without an explicit product decision
- add a hosted service or telemetry dependency
- spawn Codex/Claude/etc. autonomously
- make Superpowers, ECC, Graphify, OmniRoute, Grill Me, Impeccable, Hallmark, Anatomy, or any other third-party project a mandatory runtime dependency
- turn Ezy into a marketplace

When an external capability is recommended, expose enough provenance/review information for the user/host agent to make an informed decision.

---

## 11. Phase discipline

**Do not silently redefine Phase 8.**

The current roadmap says Phase 8 is **Launch and Distribution** and Phase 9 is **Outcome Verification**.

Therefore:

- Implement only the smallest contracts/adapters needed to establish the missing architecture without breaking the launch path.
- If full outcome verification belongs to Phase 9, create the interface/extension point now but do not pull a large Phase 9 implementation into the Phase 8 release.
- Do not block launch on exhaustive testing of every external skill.
- If a proposed code change materially expands Phase 8 scope, stop and report the conflict instead of deciding unilaterally.

---

## 12. Tests and acceptance criteria

Before claiming completion:

1. Existing tests remain green.
2. Add focused tests for the new contracts/selection behavior.
3. Add at least one vague-intent case showing that Ezy does not manufacture certainty.
4. Add at least one skill-selection case showing **discovery ≠ recommendation**.
5. Add at least one overlapping-skill case showing the evaluator can reject redundancy or choose one candidate.
6. Add an outcome-evaluation contract test covering PASS / FAIL / UNCERTAIN.
7. Ensure no external skill is executed during evaluation tests.
8. Run the repository's required CI/check command before claiming the work is complete.

Use the smallest complete implementation. Do not refactor unrelated code.

---

## 13. Documentation sync

If implementation changes current behavior, update the relevant source-of-truth docs in the same change:

- `docs/MVP-SPECIFICATION.md`
- `docs/ROADMAP.md`
- `docs/HOW-IT-WORKS.md`
- `docs/handoff/MAKE-IT-EZY-HANDOFF.md`
- `README.md`
- `skills/ezy/SKILL.md`

Do not create a competing product-definition document.

This instruction itself is a planning/implementation handoff; the canonical product definition remains the existing handoff + roadmap + MVP spec.

---

## 14. Deliverable

Produce a focused implementation that makes the current `main` architecture capable of representing:

```text
raw intent
  → clarification when needed
  → capability discovery
  → skill evaluation
  → capability specification/composition
  → contractor/workflow
  → execution
  → outcome evaluation boundary
```

Then report:

- files changed
- behavior added
- tests added/run
- anything intentionally deferred to Phase 9+
- any architecture conflict discovered

**Do not merge this work automatically.**

## Bottom line

The goal is **not** to put every good skill into Ezy.

The goal is to make Ezy smart enough to answer:

> **"What does this user actually want, what capabilities are needed, which candidates are worth using, how should they be composed, who should execute them, and did the result actually satisfy the user's intent?"**

while keeping the actual execution in the downstream host ecosystem.
