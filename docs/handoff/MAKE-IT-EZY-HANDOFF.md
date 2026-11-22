# Make It Ezy — Product Handoff

**Purpose:** This document consolidates the Make It Ezy project decisions, direction, architecture, research conclusions, constraints, roadmap, and unresolved questions that have emerged across the project conversations.

**Status:** Current product handoff (not a phase/status tracker—use [`docs/ROADMAP.md`](../ROADMAP.md) for that)  
**Date:** 2026-11-08

> **Important:** This is the **only current** product handoff file (`MAKE-IT-EZY-HANDOFF.md`). It is more authoritative than raw historical conversations and older `MAKE-IT-EZY-HANDOFF-v*.md` snapshots. When they conflict, the latest explicit project decisions in this file, [`AGENTS.md`](../../AGENTS.md), and [`docs/ROADMAP.md`](../ROADMAP.md) win.
>
> **Precedence with other repo docs:** shared agent workflow/current work → root `AGENTS.md`. Product definition / trust rules / what Ezy is-not → **this file**. Locked phase sequence and shipped status → `docs/ROADMAP.md` (its phase numbers win over older numbering). Current CLI behavior → `docs/MVP-SPECIFICATION.md`. Audit **1–4** (fixed 2026-11-17) and open **5–10** → `docs/audits/2026-11-07-codebase-gaps.md` (does not change phase numbering).
>
>
> **Recent decision synthesis (2026-11-22):** [`CONVERSATION-SYNTHESIS-2026-11-22.md`](./CONVERSATION-SYNTHESIS-2026-11-22.md) captures the latest broker/contractor, ECC vs Superpowers, Graphify, OmniRoute, Paperclip, local AI, and shared-evidence conclusions without treating raw conversation transcripts as product authority.

> **Start here if this file feels too big:** [`docs/HOW-IT-WORKS.md`](../HOW-IT-WORKS.md) — one page on who does what (Ezy = decide and hand off; host agent = run ecosystem skills and code). Diagrams below are product intent; intake, deep research, and heavy security are normally **skills the agent runs**, not code inside the CLI.

### Shipped → next → future (read this before §1)

Early sections describe **product intent and target lifecycle**. They are easy to read as if everything below is already in the binary. Use this table for **what exists today**; details live in [`MVP-SPECIFICATION.md`](../MVP-SPECIFICATION.md) and [`ROADMAP.md`](../ROADMAP.md).

| Layer | Meaning | Examples |
|--------|---------|----------|
| **Shipped** | In the CLI / `skills/ezy` today (Phases **0–7**; audit **1–4**) | `doctor`, `analyze`, `search`, `inspect`, `recommend`, `brief`, `brain`, `plan`, `next`, gated `install`; project-aware requirements; brief JSON or heuristic fallback; `.ezy/brain.json` (machine on plan/next + optional agent slice); local + skills.sh discovery; handoff prompt; **no LLM inside Ezy** |
| **Next** | Agreed roadmap work, not shipped yet | **Phase 8** launch and distribution; after launch: **Phase 9** outcome verification and Phase **10** Web UI; optional audit findings **5–10** if approved |
| **Future** | Vision / research; not the current implementation queue | Soft-C (spawn agents), deep skill verify, trusted-auto installs, Codex marketplace plugin, full in-product trust scoring, token-economy scoring in Ezy, multi-domain expansion beyond the coding launch slice |

**How to read §1–3:** vision and problem framing (conceptually correct). **How to read diagrams** (e.g. evaluate security/trust as Ezy steps): target responsibility split — much of that work is **host agent + installed skills** today, not reimplemented in TypeScript.

---

# 1. Executive Definition

## What is Make It Ezy?

**Make It Ezy is a trusted capability-intelligence and routing layer between a user and AI execution agents.**

The user describes the outcome they want.

Ezy determines:

- what the task actually requires
- what capabilities are needed
- which skills/tools/agents/workflows are relevant
- which candidates are trustworthy enough to use
- which candidates are high quality
- which candidates are compatible
- which candidates overlap or conflict
- what minimum useful skill set should be used
- how those selected capabilities should be handed to the downstream execution agent

The downstream execution agent may be:

- Cursor
- Claude Code
- Codex
- another compatible coding/agent runtime

The downstream agent actually performs the work.

### Core mental model

```text
USER
  │
  │ "Build X"
  ▼
MAKE IT EZY
  │
  ├── Understand the task
  ├── Analyze project/environment
  ├── Extract capabilities
  ├── Discover candidate capabilities
  ├── Evaluate quality
  ├── Evaluate security
  ├── Evaluate provenance/trust
  ├── Check compatibility
  ├── Check overlap/conflicts
  ├── Select the minimum useful trusted set
  └── Prepare handoff
          │
          ▼
   CURSOR / CLAUDE / CODEX
          │
          ▼
      ACTUAL WORK
```

The key product value is **not merely discovering skills**.

The key product value is making a trustworthy decision about **which capabilities should be used for this specific job**.

*This diagram is the **target** routing story. For what each box does **today**, see **Shipped → next → future** above and [`HOW-IT-WORKS.md`](../HOW-IT-WORKS.md).*

---

# 2. The Problem Ezy Solves

The core problem repeatedly identified in the conversations is:

> A developer may know what they want to build, but not know which AI skills, agents, tools, workflows, or capabilities are actually needed to build it correctly.

Modern AI coding environments expose huge numbers of:

- skills
- agent definitions
- workflows
- MCP/tool integrations
- frameworks
- repositories
- coding methodologies
- research tools
- specialized domain capabilities

The problem is therefore not simply lack of access.

It is **capability selection**.

The user should not need to become an expert in:

- agent skill ecosystems
- skill repositories
- agent frameworks
- security characteristics of individual skills
- compatibility between skills
- overlapping workflows
- context requirements
- installation requirements
- downstream agent formats

Ezy is intended to make that decision layer easier.

---

# 3. The Core Product Statement

The accepted core framing is:

> **Make It Ezy = the middleman between you and the capabilities that can get the job done.**

An earlier narrower framing focused heavily on coding skills.

The broader long-term direction is:

> Ezy evolves from a skill middleman into a capability middleman.

Capabilities can include:

- skills
- tools
- agents
- services
- workflows
- runtimes
- research capabilities
- potentially human steps where appropriate

However, the initial implementation should remain focused enough to avoid becoming an over-engineered general agent platform.

---

# 4. What Ezy Is NOT

These boundaries are important because they prevent the project from turning into something else.

Ezy is **not primarily**:

- a coding agent
- Claude Code
- Codex
- Cursor
- an autonomous software engineer
- a generic multi-agent framework
- a Ruflo replacement
- a skill marketplace
- a package manager
- an MCP manager
- a prompt library
- a giant skill dump
- merely a token/context manager

Ezy may interact with these systems, but it should remain the **decision/composition/routing layer**.

The downstream execution system is responsible for doing the actual work.

---

# 5. The Most Important Trust Principle

A major correction made during the project is:

> **Ezy must not blindly hand discovered skills to an execution agent.**

If Ezy simply does:

```text
discover skill
    ↓
send skill to Claude/Codex/Cursor
```

then Ezy has failed at its most important responsibility.

It may save some discovery/token-management work, but the resulting implementation could still be poor or unsafe.

Therefore:

> **Trust and verification are core product functionality, not optional metadata.**

A large skill registry is useful and necessary, but the registry is an evidence base — not a trusted recommendation list.

---

# 6. Registry vs Trusted Pool vs Recommendation

These concepts must remain separate.

## Skill Registry

Contains discovered/evaluated knowledge about skills and related capabilities.

The registry can contain:

- unknown skills
- candidates
- inspected skills
- rejected skills
- verified skills
- trusted skills
- study-only resources
- catalogs
- frameworks
- tools
- runtimes

The registry is allowed to be large.

## Trusted Skill Pool

The subset that has passed Ezy's trust/security/quality requirements sufficiently to be eligible for recommendation.

## Recommendation Engine

Selects the best subset for the user's specific task.

It should consider:

- task fit
- trust
- security
- quality
- compatibility
- dependencies
- conflicts
- redundancy
- context cost
- project compatibility

### Launch policy for external skills

External catalogs are indexed in batches; individual skill execution tests are not required before launch. Ezy may surface a task-relevant skill with strong public reputation and maintenance signals, while showing its source, available evidence, and Ezy review state. Reputation is evidence for ranking, not a claim that the skill is safe or verified. External content stays untrusted and installs remain user-approved. Deeper tests support stronger, narrowly scoped verification labels when available.

## Agent Handoff

Only the selected/recommended skill set and relevant instructions should be passed downstream.

Do **not** dump the entire registry into the agent's context.

---

# 7. Discovery Does NOT Equal Recommendation

This became one of the strongest project principles.

A repository can be useful for discovering another skill without making that skill trusted.

For example:

```text
README
   │
   └── links to Skill X
             │
             ▼
       Candidate discovery
             │
             ▼
       Resolve repository
             │
             ▼
       Inspect actual skill
             │
       ┌─────┴─────┐
       ▼           ▼
    security     quality
       │           │
       └─────┬─────┘
             ▼
       compatibility
             │
             ▼
       task-specific fit
             │
             ▼
       recommendation
```

README links are **discovery edges**, not trust endorsements.

---

# 8. Trust Levels

A useful working trust model discussed in the project is:

### T0 — Unknown

Discovered but not meaningfully evaluated.

- May exist in registry.
- Must not be recommended.

### T1 — Inspected

Repository/skill structure has been inspected.

- Basic provenance and structure known.
- Still insufficient for recommendation.

### T2 — Verified

Quality, security, compatibility, and provenance checks have passed to an acceptable level.

- Eligible for recommendation.

### T3 — Trusted

Stronger evidence exists:

- strong provenance
- good maintenance history
- repeated evaluation
- consistent behavior
- good documentation
- strong security characteristics
- good compatibility evidence

Preferred for recommendations.

### T4 — Ezy Core

Capabilities maintained or directly controlled by the Ezy project.

Highest confidence category.

---

# 9. Hard Security Gate

Trust should not be reduced to a single popularity score.

A skill can have:

- huge GitHub popularity
- many stars
- active development
- excellent documentation

and still contain unsafe instructions or behavior.

Likewise, a small project may contain an excellent skill.

Therefore Ezy should use multiple dimensions.

Potential evaluation areas:

## Provenance

- repository identity
- author/organization
- ownership
- repository history
- source location
- release/version history
- license

## Security

Inspect for:

- shell scripts
- install scripts
- hooks
- executable files
- network access
- filesystem access
- credential access
- destructive commands
- unexpected downloads
- environment manipulation
- suspicious dependencies
- prompt injection
- instructions attempting to override Ezy's policy
- excessive permissions
- hidden or obfuscated behavior

## Quality

Inspect:

- documentation
- clarity
- scope
- tests
- examples
- maintenance
- correctness evidence
- consistency
- issue history
- compatibility
- whether the skill is focused or bloated

## Compatibility

Determine:

- supported agent formats
- expected directory structure
- SKILL.md compatibility
- required tools
- dependencies
- project requirements
- runtime requirements

## Task Fit

Determine whether the skill actually helps with the requested task.

---

# 10. Security Must Be More Than a Score

A critical design principle:

> **Some security findings should be hard blockers.**

Do not simply calculate:

```text
quality = 98
security = 55
task fit = 100
```

and average them into a recommendation.

Instead:

```text
critical security issue
        ↓
       FAIL
        ↓
cannot recommend
```

Even an extremely capable skill should not be recommended when it crosses a critical security boundary.

Ezy must be able to abstain.

---

# 11. Ezy Must Be Able to Say "No"

A mature Ezy should be able to report:

> "I found candidates that fit the task, but I do not have enough evidence to trust them."

This is preferable to making a confident but unsafe recommendation.

Potential recommendation states:

- recommended
- recommended with caveat
- insufficient evidence
- study only
- rejected
- incompatible
- security blocked

---

# 12. Research Before Skill Selection

Another explicit project constraint:

> **Research should precede skill selection/use.**

Ezy should not automatically adopt a skill because it appears in a catalog.

Research should identify:

- candidate sources
- relevant repositories
- available skills
- methodology
- security characteristics
- quality evidence
- compatibility
- alternatives

The research process should produce evidence that feeds the recommendation engine.

---

# 13. Research Sources Already Identified

The project conversations investigated or identified many sources.

Important examples include:

## Official / high-confidence sources

### Vercel Labs Skills

Relevant for:

- skill discovery
- skill installation ecosystem
- skill metadata

Conclusion:

**Useful discovery source, not automatic trust.**

### Anthropic Skills

Official Anthropic skills ecosystem.

Conclusion:

High-value source and important reference for compatibility and skill conventions.

Still, individual skills should be evaluated for Ezy's use case.

### Claude Code documentation/setup/security material

Important because Claude Code provides a reference point for:

- project inspection
- capability recommendations
- security practices
- skill usage

Conclusion:

Study/reference source with high relevance.

---

# 14. Superpowers

`obra/superpowers` was identified as an important methodology project.

Important distinction:

**Agent Skills** and **Superpowers** are not the same thing.

Agent Skills:

- portable skill format/concept
- `SKILL.md`
- capability instructions

Superpowers:

- opinionated development methodology
- workflow
- engineering process

The project direction was:

> Use Superpowers/agent skills as resources for building Ezy itself.

But Superpowers should not become an architectural dependency merely because it is useful.

---

# 15. ECC

`affaan-m/ECC` was studied as a large engineering skill/agent collection.

The repository was reported as containing a large number of workflows/agents/skills.

A key lesson from it:

> Large collections should not be blindly loaded wholesale.

Use the relevant subset.

ECC is therefore:

- valuable research
- candidate skill source
- useful reference for engineering workflows

but not automatically "everything Ezy should recommend."

---

# 16. Other Skill/Agent Sources Studied

The following were discussed as legitimate or useful discovery/reference sources, with different trust/recommendation implications:

- `mattpocock/skills`
- `DietrichGebert/ponytail`
- `pbakaus/impeccable`
- `Leonxlnx/taste-skill`
- `nextlevelbuilder/ui-ux-pro-max-skill`
- `vercel-labs/agent-browser`
- `msitarzewski/agency-agents`
- `K-Dense-AI/scientific-agent-skills`
- `KalarisLabs/research-agent-skills`
- `Integralist/agent-skills`
- `PracticalSwan/agent-skills`
- `VoltAgent/awesome-agent-skills`

General conclusion:

> These are discovery/research inputs and possible skill sources. Their existence or popularity does not automatically make their individual skills trusted Ezy recommendations.

---

# 17. Research-Specific Sources

Other research/catalog resources identified include:

- Auto-Empirical-Research-Skills
- Agent Master Skills
- 500 AI Agents Projects
- GitHub `ai-skills`
- Agency Agents
- Kalaris research-agent-skills

Some findings discussed:

- research-oriented skill collections can provide useful evidence workflows
- primary sources and citations matter
- security/validation practices are valuable
- large catalogs are useful discovery indexes

But again:

> Catalog membership is not trust certification.

---

# 18. Frameworks and Platforms Considered

The project also encountered:

- LangGraph
- CrewAI
- AutoGen
- Agno
- LlamaIndex
- Ruflo
- Paperclip
- OpenProject
- Chatwoot
- Cal.com

These should generally be treated as:

- study/reference material
- potential integrations
- ecosystem research

rather than things to automatically include as core dependencies.

A key principle:

> **Do not turn Make It Ezy into a giant framework composed of every interesting agent framework.**

---

# 19. Ruflo

Ruflo was repeatedly used as a comparison/reference point.

Ezy should not become "Ruflo #2."

The distinction:

### Ruflo / orchestration systems

Primarily concerned with coordinating agents/workflows/execution.

### Make It Ezy

Primarily concerned with:

- understanding the desired outcome
- deciding what capabilities are required
- selecting trusted capabilities
- composing a useful skill set
- preparing context
- routing to the appropriate execution environment
- eventually verifying the result

Ruflo can be a downstream capability/reference, but Ezy should not copy its architecture simply because it is sophisticated.

---

# 20. Current Architecture

The current conceptual architecture is:

```text
                USER
                  │
                  ▼
        REQUEST / OUTCOME
                  │
                  ▼
        TASK UNDERSTANDING
                  │
                  ▼
       PROJECT / ENVIRONMENT
            ANALYSIS
                  │
                  ▼
       CAPABILITY EXTRACTION
                  │
                  ▼
        SKILL DISCOVERY
                  │
                  ▼
       SECURITY / QUALITY
          EVALUATION
                  │
                  ▼
       TRUST / COMPATIBILITY
              GATE
                  │
                  ▼
       RECOMMENDATION ENGINE
                  │
                  ▼
        SKILL SET / PLAN
                  │
                  ▼
         RUNTIME ADAPTER
                  │
          ┌───────┼────────┐
          ▼       ▼        ▼
       Cursor  Claude    Codex
                  │
                  ▼
             EXECUTION
                  │
                  ▼
             VERIFICATION
```

The broader lifecycle is:

> **discover → evaluate → compose → execute → verify**

---

# 21. Existing Repository Direction

The project repository is:

`ezmichaely/make-it-ezy`

The accepted source of truth for repository state has been the GitHub `main` branch.

The project was described as a TypeScript + pnpm workspace/monorepo.

Observed/previously discussed structure included:

```text
apps/
  cli/

packages/
  core/

catalog/

skills/
  ezy/
    SKILL.md

docs/

skills-lock.json
```

The repo had been reported at approximately 36 commits during an earlier review.

The project had reached a working early release around **0.1.2** at that point.

---

# 22. Technology Direction

The implementation direction was deliberately changed toward:

- TypeScript
- Node.js
- pnpm workspace/monorepo
- CLI-first
- core package separated from CLI
- schema validation
- tests

Initial supporting technologies discussed:

- Commander or Citty
- Zod
- Vitest
- tsup/unbuild

The important architectural principle is more important than any individual library:

> Keep the core small, modular, testable, and independent of a particular AI provider.

---

# 23. Why TypeScript/Node First

The project considered Python, but the direction was shifted toward TypeScript/Node because of the ecosystem around:

- GitHub tooling
- agent skills
- CLI development
- developer environments
- Node-based AI tooling
- downstream integration with coding agents

This was also consistent with the desire to make Ezy a developer tool rather than initially a web application.

---

# 24. Initial Product Shape

The original MVP was intentionally CLI-first.

The first useful vertical slice was approximately:

```text
ezy analyze
    ↓
inspect project/request
    ↓
identify capabilities
    ↓
show recommendations
    ↓
ask for approval
```

The early product should not require:

- a web application
- a database
- an AI framework
- an agent framework
- a multi-agent runtime
- automatic external skill installation
- a cloud service

---

# 25. Current / Previously Implemented Pipeline

The repo had already moved beyond the initial conceptual MVP.

The implementation was described as supporting a pipeline similar to:

```text
user outcome
    ↓
capability extraction
    ↓
skill/tool discovery
    ↓
recommendation
    ↓
plan
    ↓
install
    ↓
handoff
    ↓
existing coding agent
```

The CLI had concepts around:

- discovery
- search
- inspection
- recommendation
- decision engine
- plan
- install
- runtime adapters
- `next`

There was also an Ezy skill adapter:

```text
skills/ezy/SKILL.md
```

The conceptual message was:

> The CLI finds skills; you implement the outcome.

---

# 26. Existing vs Not Yet Implemented

Earlier repo reviews described the following as present or substantially established:

- CLI
- core package
- catalog
- discovery/search
- skill inspection
- recommendation
- decision engine
- plan
- install flow
- runtime adapters
- Claude/Codex-related handoff
- Ezy `SKILL.md`
- project-aware planning
- exclusion reasons
- `ezy next`

The following were explicitly described as not yet implemented or not mature at that point:

- runtime spawning
- full multi-agent framework
- autonomous LLM planner
- persistent memory
- complete trust/security system
- Project Brain
- full verification system
- Web UI

These should be treated as roadmap items unless the repository has since changed.

---

# 27. Project-Aware Planning

The planner should not only look at the user's sentence.

It should understand the project/environment.

For example:

```text
User request
     +
Project structure
     +
Existing dependencies
     +
Existing architecture
     +
Existing skills
     +
Constraints
     ↓
Capability requirements
```

This prevents recommendations that conflict with the existing project.

Example:

If a project already uses:

- Next.js
- pnpm
- MUI
- Storybook

Ezy should not casually recommend a skill bundle that assumes a completely different stack unless there is a reason.

---

# 28. Exclusion Reasons Matter

The project already discussed showing not only what Ezy recommends, but why other candidates were excluded.

For example:

```text
Recommended:
  Skill A
  Skill B

Excluded:
  Skill C
    reason: incompatible with project

  Skill D
    reason: insufficient security evidence

  Skill E
    reason: redundant with Skill A

  Skill F
    reason: poor maintenance evidence
```

This is important for trust and debuggability.

The user should be able to understand Ezy's decision.

---

# 29. Recommendation Is a Set, Not Necessarily One Skill

A central clarification from the latest discussions:

> Ezy needs to recommend the **right skill set**, not merely one skill.

A task may require complementary capabilities.

Example:

```text
Offline-first Next.js PWA
        │
        ├── Next.js architecture skill
        ├── PWA/offline architecture skill
        ├── IndexedDB/Dexie skill
        ├── synchronization skill
        ├── testing skill
        └── security skill
```

But Ezy should avoid unnecessary overlap.

The goal is:

> **minimum useful trusted set**

not:

> maximum number of skills.

---

# 30. Skill Bundle Selection

A recommendation bundle should consider:

### Task fit

Does the skill directly contribute?

### Trust

Is there enough evidence?

### Security

Does it pass hard security gates?

### Quality

Is the skill actually good?

### Compatibility

Does it work with the user's agent/project?

### Dependency requirements

Does it require something unavailable?

### Redundancy

Does another skill already provide the same capability?

### Conflict

Could two skills prescribe incompatible approaches?

### Context cost

Is the skill worth the context/token cost?

---

# 31. Token Efficiency Is Secondary to Outcome Quality

This is an important philosophical point.

It is tempting to optimize Ezy around:

> "Use fewer tokens."

But the user explicitly identified the problem with that framing:

If Ezy saves tokens but produces a bad implementation, **the product is still useless**.

Therefore:

```text
Outcome quality
      >
Trust/security
      >
Task fit
      >
Efficiency
```

Exact scoring should be designed later.

Do not optimize context size at the expense of reliable results.

---

# 32. Security Threat Model

Ezy is effectively creating a supply chain for AI instructions.

That creates risks beyond normal package management.

Potential threats include:

### Malicious skill

A skill intentionally instructs the agent to perform harmful actions.

### Prompt injection

A repository's README/SKILL.md contains instructions that attempt to override Ezy's rules.

### Hidden executable behavior

Scripts/hooks execute commands that were not obvious from the skill description.

### Dependency compromise

A skill pulls a malicious dependency.

### Trust laundering

A trusted catalog links to an untrusted downstream repository, and Ezy assumes the downstream item is trusted.

### Popularity laundering

A popular repository contains a third-party skill that has never been independently evaluated.

### Stale verification

A skill was safe when evaluated but changed later.

Therefore verification must be version-aware.

---

# 33. Version Awareness

A skill should not simply have:

```text
trusted = true
```

It should have evidence tied to a version/commit/revision where possible.

Conceptually:

```text
Skill
 ├── repository
 ├── version
 ├── commit
 ├── evaluated_at
 ├── evaluator_version
 └── evidence
```

If the upstream skill changes significantly, its trust state may need re-evaluation.

---

# 34. Registry Schema — Conceptual

A registry entry should eventually contain something close to:

```text
Skill
├── identity
│   ├── id
│   ├── name
│   └── version
│
├── source
│   ├── repository
│   ├── owner
│   ├── commit
│   └── license
│
├── capabilities
│
├── supported_agents
│
├── dependencies
│
├── permissions
│
├── security
│   ├── status
│   ├── findings
│   └── evidence
│
├── quality
│   ├── status
│   ├── evidence
│   └── maintenance
│
├── compatibility
│
├── trust_level
│
├── recommendation_status
│
├── use_cases
│
├── conflicts
│
├── overlaps
│
├── last_verified
│
└── evidence
```

This is a conceptual model, not yet a final database schema.

---

# 35. No Database First

The early project direction was intentionally:

> **No database initially.**

The registry can start as files/static artifacts/catalog data.

A database should only be introduced when actual requirements justify it.

This avoids premature infrastructure.

---

# 36. Local-First / Free Constraint

The user explicitly wants Make It Ezy itself to be **absolutely free/open-source**.

Core constraints:

- no required paid cloud backend
- no mandatory account
- no mandatory subscription
- no required telemetry
- no vendor lock-in
- local-first
- GitHub-native where appropriate
- users can bring their own local models/APIs

External dependencies may naturally have their own:

- licenses
- API costs
- hosting costs

But Ezy itself should not require a paid service for its core operation.

---

# 37. AI Provider Independence

Ezy should not become locked to one model provider.

Possible downstream execution agents include:

- Cursor
- Claude Code
- Codex

Potential future agents should be supported through adapters.

Conceptually:

```text
AgentRuntime
├── prepare()
├── handoff()
├── capabilities()
└── verify()
```

The exact API can evolve.

---

# 38. Runtime Adapter Principle

The core should not contain provider-specific logic everywhere.

Instead:

```text
packages/core
      │
      ▼
Runtime Adapter Interface
      │
 ┌────┼─────┐
 ▼    ▼     ▼
Cursor Claude Codex
```

This keeps the core provider-agnostic.

---

# 39. Research / Discovery Architecture

A future discovery subsystem can use multiple sources:

```text
GitHub repositories
      │
README references
      │
Skill catalogs
      │
Curated lists
      │
Official sources
      │
Direct skill repositories
      │
      ▼
Discovery ingestion
      │
      ▼
Normalization
      │
      ▼
Evaluation
      │
      ▼
Registry
```

Important:

**Discovery sources are not trust sources by default.**

---

# 40. README Discovery Graph

One especially useful idea developed in the project:

> README files can be treated as a discovery graph.

For example:

```text
Repository A
   │
   └── README links Repository B
                         │
                         └── README links Skill C
                                      │
                                      ▼
                               candidate discovery
```

Ezy can recursively discover useful resources.

But every edge increases the trust boundary.

Therefore:

```text
discover
  ≠
trust
```

Every discovered node must pass through evaluation before becoming recommendable.

---

# 41. Ezy's Evaluation Pipeline

A future robust pipeline should resemble:

```text
SOURCE
  ↓
DISCOVERY
  ↓
NORMALIZATION
  ↓
PROVENANCE CHECK
  ↓
SECURITY SCAN
  ↓
QUALITY EVALUATION
  ↓
COMPATIBILITY EVALUATION
  ↓
TRUST CLASSIFICATION
  ↓
REGISTRY
  ↓
TASK ANALYSIS
  ↓
CANDIDATE RETRIEVAL
  ↓
TASK-SPECIFIC RANKING
  ↓
CONFLICT/OVERLAP ANALYSIS
  ↓
SKILL BUNDLE
  ↓
AGENT HANDOFF
  ↓
EXECUTION
  ↓
VERIFICATION
```

---

# 42. Verification

Verification is a future major component.

Ezy should eventually distinguish:

### Pre-execution verification

"Is this capability safe/trustworthy enough to use?"

### Execution verification

"Did the downstream agent actually use the intended capabilities?"

### Outcome verification

"Did the requested result actually happen correctly?"

The last one is especially important.

Ezy's future vision is not simply:

```text
recommend → handoff
```

but:

```text
recommend → execute → verify
```

---

# 43. Project Brain

Project Brain was identified as a later architectural capability.

The purpose is to maintain project-aware understanding, potentially including:

- project architecture
- technology stack
- conventions
- existing tools
- known constraints
- previous decisions
- current state
- relevant capabilities
- rejected approaches

This should reduce repeated analysis.

Project Brain is not the same thing as arbitrary long-term memory.

It should contain useful project knowledge.

---

# 44. Why the User's Current Conversation Problem Exists

The user recently loaded all project conversations into Cursor and Claude, but the agents did not understand the project.

That is expected when raw conversation history is used as the specification.

Historical conversations contain:

- experiments
- abandoned approaches
- corrections
- contradictions
- jokes
- temporary ideas
- research notes
- final decisions
- old decisions

An agent cannot safely infer which statements are authoritative.

Therefore Ezy itself needs a canonical project specification.

---

# 45. Canonical Documentation Structure

Recommended repository documentation structure:

```text
docs/
  00-CONSTITUTION.md
  01-PRODUCT.md
  02-ARCHITECTURE.md
  03-SKILL-INTELLIGENCE.md
  04-RECOMMENDATION.md
  05-SECURITY.md
  06-HANDOFF.md
  07-REGISTRY.md
  08-ROADMAP.md
  09-DECISIONS.md
  10-RESEARCH.md
```

The most important file is:

```text
00-CONSTITUTION.md
```

This should tell every coding agent:

> This is the source of truth for what Make It Ezy is.

**As implemented (agents, 2026-11-17):** start at root [`AGENTS.md`](../../AGENTS.md) (Claude via [`CLAUDE.md`](../../CLAUDE.md)); product intent in this file; phase order in [`docs/ROADMAP.md`](../ROADMAP.md); CLI behavior in [`docs/MVP-SPECIFICATION.md`](../MVP-SPECIFICATION.md). The numbered `00-*` tree above is aspirational, not the current layout.

Historical conversation exports live under `docs/convo/` as archive material—do not treat them as the current specification.

---

# 46. Proposed Constitution Rules

The following should be treated as architectural invariants.

## Rule 1

Ezy is a decision/intelligence/routing layer, not the downstream coding agent.

## Rule 2

Ezy must understand the requested outcome before selecting capabilities.

## Rule 3

Discovery does not imply trust.

## Rule 4

No unverified skill should be casually handed to the execution agent.

## Rule 5

Security failures can hard-block recommendation.

## Rule 6

Task fit alone is insufficient.

## Rule 7

Popularity alone is insufficient.

## Rule 8

The recommendation should be a minimum useful skill set.

## Rule 9

Redundant/conflicting capabilities should be filtered.

## Rule 10

Ezy must be able to abstain.

## Rule 11

The registry may be large; the execution context should be selective.

## Rule 12

Ezy should remain provider-agnostic through adapters.

## Rule 13

Core Ezy should remain free/open-source and local-first.

## Rule 14

Avoid unnecessary framework dependencies and over-engineering.

## Rule 15

Research is evidence; it is not automatically architecture.

---

# 47. Roadmap — Historical Direction

The project roadmap evolved, but the major progression was approximately:

## Phase 0 — Research

Study:

- agent skills
- skill formats
- agent frameworks
- discovery systems
- coding agents
- research systems
- security approaches
- existing ecosystems

Goal:

Understand the landscape before implementing.

---

## Phase 1 — CLI Foundation

Build:

- TypeScript/Node CLI
- pnpm workspace
- core package
- basic commands
- schemas
- tests

Goal:

Create a stable local developer-tool foundation.

---

## Phase 2 — Discovery

Build:

- skill discovery
- search
- inspection
- catalog representation
- source metadata

Goal:

Allow Ezy to find relevant capabilities.

---

## Phase 3 — Recommendation / Decision Engine

Build:

- capability extraction
- task matching
- recommendations
- decision reasoning
- plan generation
- exclusion reasons

Goal:

Move from "find skills" to "choose skills."

---

## Phase 4 — Installation / Runtime Adapters

Build:

- approval/safety
- install handling
- dependency/version handling
- installation verification
- runtime adapters
- Claude/Codex/Cursor handoff

Goal:

Connect Ezy's decision layer to execution environments.

---

## Phase 5 — Ezy Skill / Project-Aware Planning

Build:

- Ezy `SKILL.md`
- project-aware analysis
- `ezy next`
- better contextual recommendations
- exclusion explanations

Goal:

Make Ezy useful inside real agent workflows.

---

## Phase 6 — Project Brain

Future:

- persistent project understanding
- architecture awareness
- project decisions
- project constraints
- relevant capability memory

Goal:

Reduce repeated project analysis.

---

## Phase 7 — Verification

Future:

- skill verification
- security evaluation
- version-aware trust
- execution verification
- outcome verification
- evidence reporting

This phase is now especially important because the project has clarified that trust is core product value.

---

## Later — Web UI

A web UI may eventually expose:

- recommendations
- trust evidence
- skill registry
- project state
- plans
- verification
- history

But Web UI should not be allowed to distract from the core intelligence layer.

---

# 48. Revised Priority

Based on the latest clarification, the roadmap should prioritize:

```text
1. Canonical architecture
2. Skill registry
3. Discovery
4. Security/quality evaluation
5. Trust model
6. Recommendation engine
7. Skill-set composition
8. Agent handoff
9. Verification
10. Project Brain
11. UI
```

The exact implementation order may differ depending on what the current repository already contains.

The critical point is:

> **Trust/evaluation must be elevated from a "later nice-to-have" into a core path before Ezy can claim to be a trustworthy skill recommender.**

---

# 49. What Should NOT Be Built Too Early

Avoid premature implementation of:

- giant databases
- complex multi-agent orchestration
- autonomous swarm systems
- custom LLM training
- cloud infrastructure
- mandatory hosted services
- elaborate Web UI
- every possible agent adapter
- every possible framework integration
- massive abstract plugin systems
- complex distributed architecture

The project should remain small until the actual need is demonstrated.

---

# 50. Anti-Overengineering Principle

The user has specifically been interested in Ponytail / simplification methodology.

The project should actively resist:

- abstractions without current use
- dependencies without clear value
- generalized interfaces before requirements exist
- duplicate functionality
- premature infrastructure
- "future proofing" everything

The goal is not a huge architecture diagram.

The goal is a system that produces better capability decisions.

---

# 51. How Ezy Should Think About a Task

A task should be transformed roughly like:

```text
User goal
   ↓
Intent
   ↓
Constraints
   ↓
Project context
   ↓
Required capabilities
   ↓
Candidate capabilities
   ↓
Trusted candidates
   ↓
Compatible candidates
   ↓
Complementary set
   ↓
Execution plan
```

Example:

```text
"Build offline-first PWA"
```

should become something like:

```text
Requirements:
- Next.js
- PWA
- offline persistence
- local database
- synchronization
- conflict handling
- testing
- security

Candidate capabilities:
- Next.js architecture
- PWA
- Dexie/IndexedDB
- sync architecture
- testing
- security

Evaluation:
- trust
- quality
- compatibility
- overlap

Final bundle:
- only the useful trusted set
```

---

# 52. Recommendation Explainability

Ezy should eventually be able to explain:

### Why selected?

```text
Selected because:
- directly matches task capability
- verified source
- compatible with project
- no conflicting dependencies
```

### Why rejected?

```text
Rejected because:
- insufficient evidence
- outdated
- incompatible
- redundant
- security concern
```

This is critical for user trust.

---

# 53. The Skill Registry Is Not the Product by Itself

A large catalog is not enough.

If Ezy becomes:

```text
search skills
list skills
install skills
```

it risks becoming a package manager or marketplace.

The registry exists to support:

> **intelligent selection.**

The product's value comes from the decision made from the registry.

---

# 54. But the Registry IS Necessary

The opposite mistake is also important.

Ezy should not avoid maintaining a substantial skill knowledge base just because the catalog isn't itself the product.

A recommendation system needs evidence.

Therefore:

```text
Large Registry
      ↓
Evaluation
      ↓
Trusted Pool
      ↓
Task-specific Recommendation
```

This is the correct balance.

---

# 55. Relationship to Coding Agents

The intended division of labor is:

## Make It Ezy

Decides:

- what is needed
- what should be trusted
- which skills should be used
- what context should be supplied
- which agent/runtime should receive the work
- how the selected capabilities fit together

## Cursor / Claude Code / Codex

Executes:

- reading code
- writing code
- editing files
- running tests
- implementing the plan
- using the selected skills

Ezy should not duplicate the entire coding-agent function.

---

# 56. Relationship to Claude Code

A key security/design question discussed:

> Is Claude Code inherently safer because it creates/controls its own skills while Ezy may discover skills from the internet?

The correct design response is not to assume Ezy can automatically be as safe.

Ezy needs an explicit trust pipeline.

That is actually one of the reasons the verification architecture matters.

Ezy can eventually provide a stronger supply-chain model:

```text
Internet
  ↓
Discovery
  ↓
Inspection
  ↓
Security analysis
  ↓
Trust classification
  ↓
Task-specific selection
  ↓
Agent
```

rather than:

```text
Internet
  ↓
Agent
```

---

# 57. Skills Used to Build Ezy

The user wants to use existing agent skills to build Ezy itself.

This is allowed and useful.

But the project should distinguish:

### Skills used by developers/agents to build Ezy

from:

### Skills Ezy recommends to its end users

They are related but not identical.

For example, Ponytail may be useful when implementing/refactoring Ezy.

That does not automatically mean Ponytail is part of every downstream Ezy recommendation.

---

# 58. Agent Skills as a Compatibility Target

The `SKILL.md` pattern is important.

The project has treated Agent Skills as a compatibility target rather than necessarily a dependency.

That means Ezy should understand and eventually produce/consume portable skill definitions where useful.

---

# 59. Important Research Lesson

The research repeatedly showed that the ecosystem contains different kinds of resources:

```text
Skill
Skill pack
Catalog
Tool
Runtime
Framework
Application
Methodology
Agent
Workflow
```

These must not all be treated as the same thing.

The registry should classify them.

For example:

- a methodology is not a skill
- a framework is not a skill
- an application is not an agent
- a catalog is not a trusted skill
- a tool is not necessarily an execution agent

This classification is important for recommendation quality.

---

# 60. Staging List

The project had a staging list of resources with categories/statuses such as:

- skill
- skill-pack
- catalog
- tool
- runtime
- framework
- app
- methodology

and statuses such as:

- unverified
- verify_url
- good
- reject
- study_only

The list should **not** be interpreted as:

> "These are all approved Ezy skills."

It is better understood as:

> **a discovery/evaluation staging index feeding the eventual registry.**

The list should be retained as research input rather than discarded.

---

# 61. Example Study-Only Resources

Resources such as:

- OpenProject
- Chatwoot
- Cal.com

were previously classified as study/reference rather than things Ezy should blindly install.

This illustrates the broader registry rule:

> A resource can be valuable to understand without being a dependency or recommendation.

---

# 62. Ezy's Future Evaluation Engine

A future evaluator could produce something conceptually like:

```text
Skill: example-skill

Provenance
  repository: verified
  owner: verified
  license: MIT
  revision: abc123

Security
  scripts: none
  network access: none
  filesystem access: instructions only
  prompt injection findings: none
  status: PASS

Quality
  documentation: strong
  tests: present
  maintenance: active
  scope: focused
  status: PASS

Compatibility
  Claude Code: yes
  Codex: yes
  Cursor: yes

Task fit
  92%

Trust
  T3 — Trusted

Recommendation
  ELIGIBLE
```

This is illustrative, not a finalized scoring formula.

---

# 63. Evidence Should Be First-Class

Ezy should not merely store:

```text
trust = high
```

It should store why.

For example:

```text
trust:
  level: T3
  evidence:
    - repository ownership
    - commit history
    - license
    - security scan
    - skill inspection
    - tests
    - compatibility checks
  verified_at: ...
  verified_revision: ...
```

This makes trust auditable.

---

# 64. Security and Trust Are Different

Do not collapse them.

A skill can be:

- secure but poor quality
- high quality but risky
- popular but unverified
- trustworthy but not useful for the current task
- excellent and secure but incompatible with the user's runtime

Therefore Ezy needs separate dimensions.

---

# 65. Quality and Task Fit Are Different

A fantastic React skill is not necessarily the correct skill for a PostgreSQL migration.

A highly trusted skill can still be a bad recommendation.

The recommendation engine therefore needs:

```text
Trust
+
Security
+
Quality
+
Task Fit
+
Compatibility
```

---

# 66. Minimum Useful Set

A central optimization target:

> **Select the smallest trusted set that adequately covers the task.**

Not:

> select every relevant skill.

This reduces:

- conflicting instructions
- redundant context
- token usage
- cognitive complexity
- unpredictable downstream behavior

But again:

**efficiency is subordinate to outcome quality and trust.**

---

# 67. Potential Recommendation Model

A conceptual model could be:

```text
candidate score =
    task_fit
  + quality
  + compatibility
  + trust
  - redundancy
  - conflict
  - context_cost
```

But this should only be implemented after defining the actual evidence and hard gates.

Do not prematurely lock the project into arbitrary numerical weights.

---

# 68. Handoff Requirements

The downstream handoff should contain enough information for the execution agent to understand:

- user's requested outcome
- relevant project context
- selected skills
- why those skills were selected
- relevant constraints
- important security/trust information
- execution plan
- what not to use
- verification expectations

The downstream agent should **not** receive the entire discovery registry.

---

# 69. Handoff Example

Conceptually:

```text
TASK
Build an offline-first Next.js PWA.

PROJECT
Next.js / TypeScript / pnpm.

RECOMMENDED CAPABILITIES

1. Next.js architecture
   Trust: T3
   Reason: project-compatible

2. Offline-first/PWA
   Trust: T3
   Reason: direct requirement

3. IndexedDB/Dexie
   Trust: T2
   Reason: local persistence requirement

4. Testing
   Trust: T3
   Reason: required for implementation verification

EXCLUDED

Skill X
  reason: insufficient security evidence

Skill Y
  reason: redundant

EXECUTION REQUIREMENTS
- Follow selected skills.
- Do not introduce unapproved skill sources.
- Run tests.
- Verify requested behavior.
```

The exact format is still to be designed.

---

# 70. Verification Loop

Long-term:

```text
PLAN
 ↓
SELECT
 ↓
HANDOFF
 ↓
EXECUTE
 ↓
TEST
 ↓
VERIFY
 ↓
REPORT
```

If the result fails verification, Ezy should eventually be able to:

- identify which capability failed
- adjust the plan
- recommend a different skill
- ask the execution agent to revise
- update evidence where appropriate

This is future scope, not necessarily MVP.

---

# 71. Historical Project Status (2026-11-08 snapshot)

This section records the project state when this handoff was drafted; it is not a current status report. For shipped work and phase order, use [`docs/ROADMAP.md`](../ROADMAP.md). For the current immediate work proposal, use [`docs/audits/2026-11-07-codebase-gaps.md`](../audits/2026-11-07-codebase-gaps.md) and the shared sequence in [`AGENTS.md`](../../AGENTS.md).

At the point of those repository discussions, Ezy was no longer merely an idea.

The repo had:

- a TypeScript foundation
- pnpm monorepo structure
- CLI
- core package
- catalog
- skill adapter
- discovery
- recommendation
- planning
- installation/handoff concepts
- runtime adapters
- project-aware planning

But the project had **not yet fully solved its hardest problem**:

> trustworthy skill intelligence.

Trustworthy skill intelligence was a major architectural focus at that time. Current priorities are tracked in the roadmap and audit linked above.

---

# 72. Historical Build Priorities (superseded)

An earlier proposal listed registry design, trust evaluation, skill bundles, handoff improvements, verification, and Project Brain as future priorities. That list is retained as historical context only and is not an implementation queue. Use the current sequence in root `AGENTS.md` and `docs/ROADMAP.md`, plus open audit items in `docs/audits/2026-11-07-codebase-gaps.md` (findings 1–4 resolved).

---

# 73. What Should Be Considered "Done" for the Core Product?

A meaningful core Ezy milestone would be:

```text
User:
"Build X."

Ezy:
1. understands X
2. understands the project
3. identifies required capabilities
4. finds candidate skills
5. verifies/evaluates candidates
6. rejects unsafe/weak candidates
7. selects a trusted skill set
8. explains why
9. prepares a downstream handoff
10. sends it to Cursor/Claude/Codex
11. receives/assists with verification
```

At that point Ezy is doing something materially different from:

- a skill catalog
- a package manager
- a prompt library
- a token manager

---

# 74. What Success Looks Like

The user's experience should eventually be:

```text
"I know what I want."

             ↓

"Tell Ezy."

             ↓

"Ezy figures out what capabilities I need."

             ↓

"Ezy checks which ones are trustworthy."

             ↓

"Ezy chooses the best combination."

             ↓

"Ezy gives the right context to my coding agent."

             ↓

"Claude/Codex/Cursor builds it."

             ↓

"Ezy helps verify the result."
```

The user should not have to become a skill ecosystem expert.

---

# 75. What Would Make Ezy Useless?

This is worth preserving explicitly.

Ezy becomes weak if it becomes any of these:

### A glorified search engine

```text
"What skill should I use?"
"Here are 20 GitHub links."
```

### A blind installer

```text
"Found it → installed it."
```

### A token optimizer

```text
"We reduced context by 40%."
```

while the implementation quality collapses.

### A giant catalog

```text
"We indexed 100,000 skills."
```

without trustworthy recommendation.

### A generic agent framework

```text
"We built another swarm."
```

without solving capability selection.

### A popularity ranking

```text
"Most stars = best."
```

### A security theater layer

```text
"Trust score: 87"
```

without real evidence.

The product must avoid all of these.

---

# 76. The Core Differentiator

The strongest current product hypothesis is:

> **Ezy's moat is not owning skills. It is knowing which capabilities to trust, when to use them, how they fit together, and how to route them to the right execution agent.**

The registry provides data.

The evaluator provides trust.

The recommendation engine provides intelligence.

The adapters provide execution connectivity.

The verification layer provides feedback.

---

# 77. Final Architecture

The most complete current conceptual architecture is:

```text
                         USER
                           │
                           ▼
                   OUTCOME / REQUEST
                           │
                           ▼
                 ┌──────────────────┐
                 │ TASK UNDERSTANDING│
                 └──────────────────┘
                           │
                           ▼
                 ┌──────────────────┐
                 │ PROJECT ANALYSIS │
                 └──────────────────┘
                           │
                           ▼
                 ┌──────────────────┐
                 │ CAPABILITY MODEL │
                 └──────────────────┘
                           │
                           ▼
             ┌──────────────────────────┐
             │   DISCOVERY ECOSYSTEM    │
             │                          │
             │ GitHub / catalogs /      │
             │ README references /      │
             │ official sources / repos │
             └──────────────────────────┘
                           │
                           ▼
                 ┌──────────────────┐
                 │  SKILL REGISTRY  │
                 └──────────────────┘
                           │
                           ▼
             ┌──────────────────────────┐
             │ SECURITY / QUALITY /     │
             │ PROVENANCE EVALUATION    │
             └──────────────────────────┘
                           │
                           ▼
                 ┌──────────────────┐
                 │  TRUST BOUNDARY  │
                 └──────────────────┘
                           │
                           ▼
             ┌──────────────────────────┐
             │ RECOMMENDATION ENGINE    │
             │                          │
             │ task fit                 │
             │ trust                    │
             │ security                 │
             │ quality                  │
             │ compatibility            │
             │ overlap                  │
             │ conflicts                │
             │ context cost             │
             └──────────────────────────┘
                           │
                           ▼
                 ┌──────────────────┐
                 │  TRUSTED SKILL   │
                 │      SET         │
                 └──────────────────┘
                           │
                           ▼
                 ┌──────────────────┐
                 │ EXECUTION PLAN   │
                 └──────────────────┘
                           │
                           ▼
                 ┌──────────────────┐
                 │ RUNTIME ADAPTER  │
                 └──────────────────┘
                    │      │      │
                    ▼      ▼      ▼
                 Cursor Claude  Codex
                    │      │      │
                    └──────┼──────┘
                           ▼
                       EXECUTE
                           │
                           ▼
                      VERIFY
                           │
                           ▼
                    RESULT / FEEDBACK
```

---

# 78. Canonical One-Sentence Definition

> **Make It Ezy is a free, local-first, open-source capability-intelligence layer that understands a user's goal, discovers and evaluates available skills and capabilities, selects the smallest trustworthy set needed for the task, and routes that set with the right context to an execution agent such as Cursor, Claude Code, or Codex.**

---

# 79. Canonical Short Definition

> **Ezy figures out what capabilities an AI coding agent needs, verifies which ones are trustworthy, composes the right set, and hands them off to the agent that does the work.**

---

# 80. Non-Negotiable Product Truth

If a future implementation decision makes Ezy easier to build but causes Ezy to blindly recommend untrusted capabilities, that decision should be treated as a regression in the product's core purpose.

The central question for every major architectural decision should be:

> **Does this help Ezy make a better, safer, more trustworthy capability decision for the user's actual task?**

If not, it should not become core architecture merely because it is technically interesting.

---

# 81. Open / Unresolved Decisions

The conversations do not establish final answers for all of these. Do not silently invent them.

Still to decide:

1. Exact trust scoring model.
2. Exact security scanner implementation.
3. Whether evaluation uses deterministic scanners, LLM analysis, or both.
4. Exact registry storage format.
5. Exact recommendation algorithm.
6. Exact handoff protocol for each runtime.
7. How version changes invalidate trust.
8. Exact verification loop.
9. Project Brain storage model.
10. Whether/when to add a database.
11. Whether/when to add Web UI.
12. Full adapter API.
13. How much autonomous execution Ezy should eventually perform.
14. Whether Ezy should ever execute skills itself or always route them to downstream agents.
15. Exact policy for newly discovered skills with incomplete evidence.
16. Exact licensing/attribution policy for imported skill metadata/content.

These should be resolved through implementation/research, not guessed.

---

# 82. Instructions for Future Coding Agents

When working on Make It Ezy:

1. Read this document first.
2. Treat it as the current canonical product context.
3. Do not reconstruct the product from historical conversation dumps.
4. Do not assume every discussed repository is a trusted dependency.
5. Do not turn discovery resources into recommendations without evaluation.
6. Do not remove the registry simply because the registry is not the product.
7. Do not turn Ezy into a generic multi-agent framework.
8. Do not turn Ezy into a simple package manager.
9. Do not optimize token usage at the expense of outcome quality.
10. Do not bypass security/trust gates for convenience.
11. Prefer small, composable, testable changes.
12. Preserve provider independence.
13. Update the canonical documentation when a major architectural decision changes.
14. Record significant decisions rather than allowing them to disappear into chat history.
15. When uncertain, identify the uncertainty rather than inventing a requirement.

---

# 83. Final Mental Model

If an agent remembers only one thing, it should remember this:

```text
             MAKE IT EZY

       "What are you trying to accomplish?"
                    │
                    ▼
       "What capabilities are required?"
                    │
                    ▼
       "Which available capabilities
        can I actually trust?"
                    │
                    ▼
       "Which trusted capabilities
        work best together?"
                    │
                    ▼
       "Which execution agent should
        receive them?"
                    │
                    ▼
       "Did the result actually work?"
```

That is the product.

Everything else — catalogs, repositories, skills, security scanners, adapters, planners, Project Brain, UI, and research — exists to make those decisions better.
