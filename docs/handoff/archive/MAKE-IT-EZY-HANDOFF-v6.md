# Make It Ezy --- Cursor Handoff v6

> **SUPERSEDED (2026-11-08).** Agents: root [`../../AGENTS.md`](../../AGENTS.md). Product intent: [`MAKE-IT-EZY-HANDOFF.md`](./MAKE-IT-EZY-HANDOFF.md). Status: [`../ROADMAP.md`](../ROADMAP.md). Historical snapshot only.
>
> **Version:** v6\
> **Purpose:** Engineering handoff for Cursor/Codex/Claude Code\
> **Updated:** 2026-11-06\
> **Previous handoff:** v5\
> **Status:** Superseded architecture/research baseline --- do not treat this
> document as a command to implement every referenced project.
>
> **Scope note (2026-11-06):** the product currently targets **coding
> tasks in a repo**; the general, any-domain flow below is the vision.
> See `docs/ROADMAP.md` → Scope.

------------------------------------------------------------------------

# 1. Mission

Make It Ezy is an **AI capability orchestration / decision layer**.

Core idea:

> **Tell Ezy what you want. It figures out what you need.**

The user should focus on the outcome instead of manually figuring out
which skills, agents, tools, research methods, context, runtime, and
workflow are required.

Ezy is **not** intended to become:

-   another coding agent
-   another generic skill marketplace
-   another MCP manager
-   another package manager
-   another model router
-   another multi-agent runtime
-   a giant collection of preloaded skills

Its role is the **decision/composition layer between the user's goal and
the existing AI capability ecosystem**.

------------------------------------------------------------------------

# 2. The Problem

The real user problem is:

> **"I want to build something, but I don't know which skills, agents,
> tools, research capabilities, context, and workflow are
> appropriate."**

Example:

``` text
User:
"Build me an offline-first Next.js application."

                    ↓

               Make It Ezy

                    ↓

             Understand goal
                    ↓
                 Research
                    ↓
          Identify requirements
                    ↓
        Discover candidate capabilities
                    ↓
          Evaluate candidates
                    ↓
       Remove overlap / bad matches
                    ↓
      Select minimum useful capability set
                    ↓
          Compose execution plan
                    ↓
       Hand off to execution runtime
                    ↓
                Verify
```

The product value is not "having many agents."

The product value is:

> **Choosing the right capabilities for the job with as little
> unnecessary complexity as possible.**

------------------------------------------------------------------------

# 3. Core Architecture

The default conceptual flow is:

``` text
USER GOAL
   │
   ▼
PROJECT / ENVIRONMENT INSPECTION
   │
   ▼
RESEARCH-TYPE CLASSIFICATION
   │
   ▼
APPROPRIATE RESEARCH
   │
   ▼
REQUIREMENTS + CONSTRAINTS
   │
   ▼
CAPABILITY DISCOVERY
   │
   ▼
CAPABILITY EVALUATION
   │
   ├── relevance
   ├── compatibility
   ├── trust/security
   ├── maintenance
   ├── overlap
   ├── dependencies
   ├── cost/latency
   └── evidence
   │
   ▼
MINIMUM USEFUL CAPABILITY SET
   │
   ▼
CAPABILITY COMPOSITION
   │
   ▼
EXECUTION PLAN
   │
   ▼
RUNTIME / MODEL ROUTING
   │
   ▼
EXECUTION
   │
   ▼
VERIFICATION
   │
   └── if failed → re-evaluate / revise
```

Do not collapse these stages prematurely.

------------------------------------------------------------------------

# 4. Research Comes Before Capability Selection

Do not design the product as:

``` text
Goal → Find skills → Use skills
```

Use:

``` text
Goal
  ↓
Research
  ↓
Understand task / constraints / current ecosystem
  ↓
Discover capabilities
  ↓
Evaluate capabilities
  ↓
Select minimum useful set
  ↓
Compose
  ↓
Execute
  ↓
Verify
```

Research should answer questions such as:

-   What does the task actually require?
-   What are the current viable approaches?
-   What libraries/frameworks/tools are relevant?
-   What does the existing project already use?
-   Which capabilities exist?
-   Which candidates are maintained?
-   Which are trustworthy?
-   Which are compatible?
-   Which overlap?
-   Which should explicitly NOT be used?

The goal is not:

> "Install everything related to the topic."

The goal is:

> **Find the smallest trustworthy capability set that can accomplish the
> goal.**

------------------------------------------------------------------------

# 5. Two Different Meanings of "Research"

Keep these separate.

## A. Research used to BUILD Make It Ezy

This is our current engineering/research activity.

We research:

-   agent architectures
-   Agent Skills
-   capability discovery
-   research workflows
-   agent selection
-   orchestration
-   package/dependency systems
-   security
-   evaluation
-   model/runtime routing
-   existing open-source implementations

External repositories in this document are **research references**.

## B. Research capability Ezy MAY provide LATER

This is a product capability.

Eventually Ezy may research a user's task before deciding which
capabilities are appropriate.

Do not confuse:

``` text
Research we use to build Ezy
```

with:

``` text
Research Ezy performs for its users
```

------------------------------------------------------------------------

# 6. Research Is Not One Generic Capability

A major conclusion from the research review:

> **"Research" is a family of capabilities, not one universal skill.**

At minimum:

``` text
research
├── technical research
├── repository / codebase research
├── web / source-backed research
├── decision research
├── empirical / experimental research
├── scientific / academic research
├── project-specific investigation
└── verification / citation research
```

Examples:

``` text
"Should I use Dexie or another IndexedDB abstraction?"
→ technical + repository + decision research

"Investigate this GitHub repository."
→ repository research

"Find current evidence about this scientific topic."
→ scientific + literature + citation verification

"Compare three frameworks for this project."
→ technical + decision research
```

The planner should eventually determine **what kind of research is
needed before selecting a research implementation**.

------------------------------------------------------------------------

# 7. Capability Taxonomy

Ezy should distinguish these concepts.

## Skill

A reusable body of instructions, procedures, scripts, references, or
domain knowledge.

``` text
"What procedure/expertise should the agent load?"
```

## Agent

A specialized worker/persona/execution unit.

``` text
"Who should perform this kind of work?"
```

## Tool

A concrete operation or external capability.

``` text
"What action can the system perform?"
```

## MCP / integration

A protocol/interface that exposes external tools or context.

``` text
"How does the agent access an external system?"
```

## Runtime

The environment that actually executes agent work.

Examples:

-   Codex
-   Claude Code
-   Cursor
-   OpenCode
-   other agent runtimes

``` text
"Where does the work execute?"
```

## Model/provider router

Infrastructure that chooses a model/provider.

``` text
"Which model/provider should execute this request?"
```

## Package/dependency manager

Infrastructure for installing/versioning/reproducing agent capabilities.

``` text
"How are agent capabilities packaged and deployed?"
```

## Ezy

The decision/composition layer.

``` text
"What combination of capabilities is appropriate for this goal?"
```

This separation is one of the most important architectural boundaries.

------------------------------------------------------------------------

# 8. Ezy's Core Decision Loop

Eventually Ezy should reason approximately like this:

``` text
1. Receive user goal
2. Inspect project/environment
3. Classify task
4. Determine required research type
5. Research the task
6. Extract requirements and constraints
7. Identify capability categories
8. Discover candidate capabilities
9. Evaluate candidates
10. Detect duplicates and conflicts
11. Resolve dependencies
12. Select minimum useful set
13. Explain why each capability was selected
14. Explain important exclusions
15. Compose execution plan
16. Select/delegate to runtime
17. Execute
18. Verify result
19. Re-evaluate if verification fails
```

The **WHY** is important.

Example:

``` text
Recommended:
- Next.js capability
  Why: project uses Next.js and the task changes routing/components.

- Testing capability
  Why: authentication behavior changes.

- Security review
  Why: authorization boundaries are affected.

Excluded:
- Docker
  Why: no container/deployment change is required.

- Generic UI design agent
  Why: the requested change is backend-only.
```

Ezy should eventually explain recommendations instead of returning an
unexplained list.

------------------------------------------------------------------------

# 9. Minimum Useful Set

Avoid:

``` text
User task
   ↓
Load 2,700 skills
   ↓
Ask model to figure it out
```

Prefer:

``` text
User task
   ↓
Research
   ↓
Candidate discovery
   ↓
Small candidate set
   ↓
Evaluation
   ↓
Deduplication
   ↓
Minimum useful capability set
   ↓
Load only what is needed
```

This reduces:

-   context bloat
-   token cost
-   latency
-   conflicting instructions
-   irrelevant expertise
-   security exposure
-   accidental over-engineering

A large catalog should be treated as **search space**, not as active
context.

------------------------------------------------------------------------

# 10. Provenance and Trust

External skills/agents are effectively executable instructions.

Ezy should eventually track:

``` text
Capability
├── source repository
├── source type
├── discovered via
├── version / commit
├── license
├── maintainer/activity
├── compatibility
├── dependencies
├── permissions
├── network requirements
├── security assessment
├── trust level
├── evaluation result
└── evidence / citations
```

Potential future record:

``` text
{
  "name": "example-skill",
  "source": "owner/repository",
  "sourceType": "github",
  "version": "commit-or-release",
  "license": "MIT",
  "compatibleRuntimes": ["codex", "claude-code", "cursor"],
  "dependencies": [],
  "permissions": [],
  "network": false,
  "trust": "reviewed",
  "evaluation": {
    "relevance": 0.91,
    "quality": 0.87,
    "security": 0.95
  },
  "provenance": {
    "discoveredVia": "github-research",
    "reviewedAt": "2026-11-06"
  }
}
```

This makes recommendations explainable rather than a black-box list.

------------------------------------------------------------------------

# 11. Reference Architecture: What Ezy Is NOT

The ecosystem now contains projects covering adjacent layers.

``` text
                    USER
                     │
                     ▼
               MAKE IT EZY
               "What do we need?"
                     │
       ┌─────────────┼─────────────┐
       ▼             ▼             ▼
    Skills         Agents        Tools
       │             │             │
       └─────────────┼─────────────┘
                     │
             Execution Plan
                     │
                     ▼
                  RUNTIME
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
      Codex / Claude         Other runtimes
          │
          ▼
      Model/provider
          │
          ▼
     Optional gateway/router
```

Conceptual distinction:

  -----------------------------------------------------------------------
  Layer                               Question
  ----------------------------------- -----------------------------------
  **Ezy**                             What capabilities are needed?

  **Skill**                           What expertise/procedure should be
                                      loaded?

  **Agent**                           Who specializes in the work?

  **Runtime**                         Where is the work executed?

  **APM / skillpm**                   How are capabilities
                                      packaged/deployed?

  **OmniRoute**                       Which model/provider/runtime route
                                      should serve the request?

  **Ruflo / orchestration runtime**   How should execution be
                                      coordinated?
  -----------------------------------------------------------------------

Do not turn Ezy into a clone of any one of these.

------------------------------------------------------------------------

# 12. Curated Reference Repositories

These are intentionally curated. **Do not add a reference just because
it is popular.**

## Tier A --- Direct architectural references

### 1. ECC --- agent harness / skills / memory / security

Repository:

https://github.com/affaan-m/ECC

Study:

-   skills-first architecture
-   specialized agents
-   hooks
-   memory
-   research-first development
-   security scanning
-   multi-harness support
-   plan/review/verification workflows

Current repository material describes 71 agents, 314 skills, 98 legacy
command shims, hooks, memory, continuous learning, and security
scanning.

**Ezy decision:** study patterns, do not import ECC wholesale.

Why it matters:

ECC is one of the strongest references for the **large engineering
capability ecosystem** problem.

------------------------------------------------------------------------

### 2. Claude Code Setup --- capability recommendation

Repository:

https://github.com/anthropics/claude-plugins-official/tree/main/plugins/claude-code-setup

Study:

-   codebase inspection
-   tailored automation recommendations
-   skills
-   hooks
-   MCP servers
-   subagents
-   slash commands
-   read-only recommendation workflow

Its central idea is highly relevant:

> Analyze the project first, then recommend only the most useful
> automations.

**Ezy decision:** HIGH-VALUE architectural reference.

Do not copy the implementation. Study the recommendation pattern.

------------------------------------------------------------------------

### 3. Integralist Agent Skills --- deep research artifacts

Repository:

https://github.com/Integralist/agent-skills

Research skill:

https://github.com/Integralist/agent-skills/blob/main/.agents/skills/research/SKILL.md

Study:

-   deep topic/repository research
-   cited reference documents
-   project research artifacts
-   research before implementation
-   durable findings

**Ezy decision:** HIGH-VALUE research architecture reference.

Key idea:

> Research should produce a durable artifact that later
> planning/implementation can consume.

------------------------------------------------------------------------

### 4. PracticalSwan Agent Skills --- primary-source technical research

Repository:

https://github.com/PracticalSwan/agent-skills

Research skill:

https://github.com/PracticalSwan/agent-skills/blob/main/research/SKILL.md

Study:

-   primary-source research
-   official documentation/source-code verification
-   citation capture
-   background research delegation
-   cross-client portability

**Ezy decision:** HIGH-VALUE research quality reference.

Key idea:

> Follow claims back to the source that owns them.

------------------------------------------------------------------------

### 5. Kalaris Research Agent Skills --- specialist research catalog

Repository:

https://github.com/KalarisLabs/research-agent-skills

Study:

-   research skill taxonomy
-   skill routing
-   literature research
-   hypothesis workflows
-   citation verification
-   peer review
-   research provenance
-   security checks
-   selective skill loading

The repository currently describes 280+ research-oriented skills and
emphasizes loading only the skill required for the current task.

**Ezy decision:** specialist research reference, not a generic
dependency.

Important:

Its scientific focus should not be mistaken for Ezy's general-purpose
research architecture. Study the **routing, verification, provenance,
and catalog patterns**.

------------------------------------------------------------------------

# 13. Tier B --- Capability Ecosystem / Discovery References

### 6. Agency Agents

https://github.com/msitarzewski/agency-agents

Study:

-   specialized agent roles
-   role descriptions
-   responsibilities
-   workflows
-   deliverables
-   specialization

**Ezy decision:** reference for agent-role modeling and selection.

Do not assume every listed agent should exist in Ezy.

------------------------------------------------------------------------

### 7. Agent Master Skills

https://github.com/LeoYeAI/agent-master-skills

Study:

-   large skill catalogs
-   categorization
-   metadata
-   naming
-   cross-harness compatibility
-   discovery

**Ezy decision:** discovery/catalog reference.

Do not load the catalog wholesale.

------------------------------------------------------------------------

### 8. 500 AI Agents Projects

https://github.com/ashishpatel26/500-AI-Agents-Projects

Study:

-   agent use cases
-   specialized agent patterns
-   framework ecosystem
-   research/coding/planning examples

**Ezy decision:** ecosystem discovery index only.

Do not use it as an authority for architecture or quality.

------------------------------------------------------------------------

### 9. Claude Code Skills Directory / aggregator

https://aiparabellum.com/claude-code-skills-directory/

The supplied video showed a large directory of Claude Code skills
organized by categories with installation commands and source links.

Use this kind of directory as:

``` text
discovery surface
        ↓
original repository
        ↓
primary-source inspection
        ↓
evaluation
```

Never treat a directory ranking/list as proof that a skill is
appropriate.

The directory itself states that community repositories are not
automatically reviewed; source inspection remains necessary.

**Ezy decision:** useful precedent for a discovery UI/catalog, not a
trusted capability source.

------------------------------------------------------------------------

# 14. Tier C --- Packaging / Dependency Infrastructure

### 10. Microsoft APM

Repository:

https://github.com/microsoft/apm

Docs:

https://microsoft.github.io/apm/

Study:

-   agent dependency manifests
-   lockfiles
-   transitive dependencies
-   cross-harness deployment
-   policy
-   integrity/provenance
-   security scanning
-   reproducibility

APM defines a manifest-based approach for skills, prompts, instructions,
agents, hooks, plugins, and MCP servers.

**Ezy decision:** do not build APM again.

Potential relationship:

``` text
Ezy
  ↓
select capabilities
  ↓
APM or another dependency layer
  ↓
install/reproduce capabilities
```

------------------------------------------------------------------------

### 11. skillpm

Repository:

https://github.com/sbroenne/skillpm

Study:

-   npm-native skill packaging
-   semver
-   package dependencies
-   lockfiles
-   workspace-local installation
-   skill wiring

**Ezy decision:** infrastructure reference only.

APM and skillpm overlap. Do not implement both concepts inside Ezy.

------------------------------------------------------------------------

# 15. Tier D --- Execution / Model Routing References

### 12. OmniRoute

Repository:

https://github.com/cheaper-inference/OmniRoute

Study:

-   model discovery
-   provider discovery
-   routing
-   cost-aware routing
-   quota-aware routing
-   fallbacks
-   context-aware routing
-   MCP/A2A
-   runtime integration
-   routing transparency

Current repository material describes many providers/models and multiple
routing strategies, including cost, quota, fallback, and
context-oriented approaches.

**Ezy decision:** optional execution-layer integration reference.

Critical distinction:

``` text
OmniRoute:
"What model/provider should handle this?"

Ezy:
"What capabilities are required to accomplish this goal?"
```

Do not redefine Ezy as an AI gateway.

------------------------------------------------------------------------

### 13. Ruflo

https://github.com/ruvnet/ruflo

Study:

-   multi-agent execution
-   workflow orchestration
-   agent coordination
-   runtime patterns

**Ezy decision:** execution-layer reference.

Potential relationship:

``` text
Ezy
  ↓
execution plan
  ↓
Ruflo / another runtime
```

Do not make Ezy a Ruflo clone.

------------------------------------------------------------------------

# 16. Tier E --- Domain-Specific Skill Example From Video Research

## Stageshow --- frontend/product-visual skill

Repository:

https://github.com/benjitaylor/skills

Skill:

https://github.com/benjitaylor/skills/tree/main/stageshow

Skill instructions:

https://github.com/benjitaylor/skills/blob/main/stageshow/SKILL.md

Project write-up:

https://benji.org/stageshow

The supplied video demonstrates Stageshow as an installable coding-agent
skill for producing better-looking product UI demonstrations.

Installation shown:

``` bash
npx skills add benjitaylor/skills --skill stageshow
```

Current repository documentation describes:

-   React product UI illustrations
-   browser/app windows
-   dashboards
-   phones
-   notifications
-   bento grids
-   cursor walkthroughs
-   composition guidance
-   motion guidance
-   examples
-   visual verification / filming

The skill also demonstrates an important pattern for Ezy:

``` text
skill
  ↓
quality rules
  ↓
examples
  ↓
implementation kit
  ↓
verification tooling
```

This is useful because a capability can be more than instructions: it
can include **references, examples, tools, and verification**.

**Ezy decision:** do not make Stageshow core. Treat it as a concrete
example of a high-quality domain capability that Ezy could discover and
recommend when a frontend/product-demo task requires it.

------------------------------------------------------------------------

# 17. What the Two New Videos Contribute

## Video A --- Stageshow

The video demonstrates:

``` text
AI-generated UI
      vs
skill-guided UI
```

The important takeaway is not "install Stageshow."

The important takeaway is:

> A focused skill can encode a domain expert's quality bar, workflow,
> examples, and verification loop.

That supports Ezy's capability model.

A capability may contain:

``` text
instructions
examples
references
scripts/tools
quality criteria
verification
```

------------------------------------------------------------------------

## Video B --- Claude Code Skills Directory

The supplied video demonstrates a large directory/catalog of Claude Code
skills with:

-   categories
-   search/discovery
-   official/community distinction
-   source repositories
-   install commands

The important takeaway is not:

> "Use this directory as Ezy's database."

The useful architectural takeaway is:

> **Skill discovery itself is a product problem.**

Ezy eventually needs to solve:

``` text
User goal
   ↓
What capability category?
   ↓
Which candidates?
   ↓
Which source?
   ↓
Which version?
   ↓
Which runtime?
   ↓
Which trust/security status?
   ↓
Which one is actually appropriate?
```

A catalog alone does not solve this.

------------------------------------------------------------------------

# 18. Important New Principle: Discovery ≠ Recommendation

A directory may answer:

> "What skills exist?"

Ezy must answer:

> **"Which of these should be used for this exact task, and why?"**

Therefore:

``` text
Catalog
  = search space

Ezy
  = decision system
```

This is one of the clearest product boundaries emerging from the
research.

------------------------------------------------------------------------

# 19. Capability Evaluation Model

When Ezy discovers a candidate capability, evaluate it on:

``` text
1. Relevance
2. Quality
3. Maintenance
4. Compatibility
5. Security
6. Trust
7. Dependencies
8. Cost
9. Context overhead
10. Overlap
11. Evidence
12. User/project fit
```

Potential scoring model:

``` text
candidateScore =
    relevance
  + compatibility
  + quality
  + trust
  + maintenance
  + evidence
  - overlap
  - risk
  - unnecessaryComplexity
  - cost
```

Do not hard-code a final scoring formula yet.

First gather evidence from real repositories and test cases.

------------------------------------------------------------------------

# 20. Capability Composition

The final output should not necessarily be:

``` text
1. Skill A
2. Skill B
3. Agent C
```

It should become something closer to:

``` text
CAPABILITY PLAN

Goal:
Build offline-first Next.js application.

Research:
- technical architecture research
- repository/project inspection
- current Next.js/PWA compatibility research

Selected capabilities:
- Next.js implementation
- offline/PWA
- IndexedDB/local persistence
- sync/conflict handling
- testing
- security review

Excluded:
- Docker
- generic marketing
- unrelated data science
- unnecessary multi-agent orchestration

Execution:
1. inspect project
2. define data model
3. establish local-first persistence
4. implement sync
5. add tests
6. verify offline behavior
7. security review
8. final verification
```

The plan is the bridge between **selection** and **execution**.

------------------------------------------------------------------------

# 21. Security Is First-Class

External skills are instructions and may contain scripts/tools.

Before recommending or activating an external capability, Ezy should
eventually inspect:

-   source repository
-   maintainer/activity
-   license
-   provenance
-   dependencies
-   hidden Unicode
-   prompt injection
-   suspicious instructions
-   network access
-   shell commands
-   file writes
-   credentials
-   MCP servers
-   permissions
-   compatibility
-   pinned version/commit

Important principle:

> **A capability is not trustworthy merely because it is popular.**

Stars are a discovery signal, not a quality guarantee.

APM is especially useful prior art for treating agent context as
security-sensitive and for reproducible dependency/provenance controls.

------------------------------------------------------------------------

# 22. Research Source Priority

When Ezy researches a task/capability, prefer:

1.  Official documentation / primary source
2.  Official repository
3.  Maintainer documentation
4.  Specifications / standards
5.  Strong technical references
6.  Community sources
7.  Aggregators / social posts / lists

A video, TikTok/Facebook post, Reddit post, or skills directory can be a
**discovery lead**.

It should not automatically become evidence.

Preferred pipeline:

``` text
Discovery source
     ↓
Find original project
     ↓
Inspect current repository/docs
     ↓
Evaluate
     ↓
Cross-check
     ↓
Record provenance
     ↓
Use as evidence
```

------------------------------------------------------------------------

# 23. Avoid Redundant Ecosystem Layers

Do not build multiple versions of the same infrastructure.

Examples:

### Package management

Already existing references:

``` text
APM
skillpm
```

Therefore Ezy should not become:

``` text
"yet another package manager"
```

### Model routing

Already existing:

``` text
OmniRoute
other gateways
```

Therefore Ezy should not become:

``` text
"yet another model gateway"
```

### Execution orchestration

Already existing:

``` text
Ruflo
other agent runtimes
```

Therefore Ezy should not become:

``` text
"yet another multi-agent runtime"
```

### Skill catalogs

Already existing:

``` text
Agent Master Skills
Claude skill directories
GitHub topic pages
other registries
```

Therefore Ezy should not compete by simply storing the biggest list.

### Ezy's differentiation

``` text
Understand
→ Research
→ Discover
→ Evaluate
→ Select
→ Compose
→ Explain
→ Hand off
→ Verify
```

------------------------------------------------------------------------

# 24. Research Reference Matrix

  ----------------------------------------------------------------------------
  Layer                   Reference               Ezy should learn
  ----------------------- ----------------------- ----------------------------
  Capability decision     **Claude Code Setup**   inspect project → recommend
                                                  capabilities

  Large engineering       **ECC**                 skills, agents, hooks,
  ecosystem                                       memory, verification

  Deep research           **Integralist**         sourced research artifacts

  Primary-source research **PracticalSwan**       source ownership + citation
                                                  discipline

  Specialist research     **Kalaris**             routing, verification,
                                                  provenance, selective
                                                  loading

  Agent roles             **Agency Agents**       role specialization

  Skill catalogs          **Agent Master Skills** metadata/discovery

  Agent ecosystem         **500 AI Agents**       use-case discovery

  Skill discovery         **Claude Skills         catalog/search UX
                          Directory**             

  Packaging               **APM**                 manifests, lockfiles,
                                                  reproducibility, policy

  Skill packaging         **skillpm**             npm/semver skill
                                                  distribution

  Execution orchestration **Ruflo**               agent/workflow execution

  Model/provider routing  **OmniRoute**           model
                                                  discovery/routing/fallback

  Domain skill example    **Stageshow**           skill + examples +
                                                  verification
  ----------------------------------------------------------------------------

------------------------------------------------------------------------

# 25. What NOT to Copy

Do not blindly copy:

-   ECC's entire agent/skill ecosystem
-   Kalaris's entire scientific catalog
-   Agency Agents' entire agent list
-   Agent Master Skills' entire catalog
-   a 500+ skills directory
-   APM's package manager
-   skillpm's package manager
-   OmniRoute's gateway
-   Ruflo's runtime
-   Stageshow's UI kit

Study the **patterns**, not the product surfaces.

------------------------------------------------------------------------

# 26. Current Product Boundary

The simplest definition remains:

> **Make It Ezy determines what is needed for a user's goal and composes
> the smallest useful set of capabilities to accomplish it.**

Or:

``` text
User:
"I want X."

Ezy:
"To accomplish X, you need A + B + C.
I researched the task, inspected the project,
excluded D and E, and here's why.
Here's the execution plan.
"
```

The user should not need to understand:

-   Agent Skills
-   MCP
-   package managers
-   agent runtimes
-   model routers
-   orchestration frameworks
-   capability catalogs

Ezy absorbs that complexity.

------------------------------------------------------------------------

# 27. Implementation Guardrail

Before implementing any new architectural feature:

## Step 1

Read this handoff completely.

## Step 2

Inspect the current repository:

https://github.com/ezmichaely/make-it-ezy

Do not redesign working components without understanding the existing
implementation.

## Step 3

Research the relevant reference layer.

Do not research the entire ecosystem for every change.

Example:

``` text
Need research architecture?
→ Integralist + PracticalSwan + Kalaris

Need capability recommendation?
→ Claude Code Setup + ECC

Need packaging?
→ APM + skillpm

Need model routing?
→ OmniRoute

Need execution orchestration?
→ Ruflo

Need frontend visual capability?
→ Stageshow
```

## Step 4

Compare external prior art against current Ezy:

``` text
Existing Ezy:
What already works?

External reference:
What is demonstrably better?

Missing:
What capability is actually absent?

Risk:
What complexity would adoption introduce?

Decision:
Adopt / adapt / defer / reject
```

## Step 5

Implement the smallest evidence-supported change.

## Step 6

Verify.

------------------------------------------------------------------------

# 28. Recommended Future Internal Data Model

Do not implement all of this immediately.

The research suggests Ezy will eventually need concepts similar to:

``` text
Goal
ResearchRequest
ResearchResult
Capability
CapabilitySource
CapabilityVersion
CapabilityEvaluation
CapabilityDependency
CapabilityTrust
CapabilityPlan
ExecutionPlan
Runtime
Provider
VerificationResult
```

Potential relationships:

``` text
Goal
  ↓
ResearchRequest
  ↓
ResearchResult
  ↓
Capability candidates
  ↓
CapabilityEvaluation
  ↓
CapabilityPlan
  ↓
ExecutionPlan
  ↓
Runtime
  ↓
VerificationResult
```

Keep the data model flexible until real use cases expose stable
boundaries.

------------------------------------------------------------------------

# 29. Example End-to-End User Experience

``` text
USER

"Add Stripe subscriptions to this app."
```

Ezy:

``` text
1. Inspect project

Detected:
- Next.js
- PostgreSQL
- Prisma
- existing authentication
```

Then:

``` text
2. Research

Task type:
technical decision + repository research

Questions:
- existing billing architecture?
- Stripe SDK compatibility?
- webhook handling?
- subscription state model?
- authentication relationship?
```

Then:

``` text
3. Candidate capabilities

- Stripe integration
- database/payment-state
- webhook handling
- testing
- security review
```

Then:

``` text
4. Evaluation

Selected:
✓ Stripe integration
✓ webhook handling
✓ database/payment-state
✓ testing
✓ security review

Excluded:
✗ generic UI design
✗ Docker
✗ unrelated marketing
✗ broad multi-agent orchestration
```

Then:

``` text
5. Execution plan

1. inspect existing auth
2. define subscription state
3. implement Stripe customer/subscription mapping
4. add webhook verification
5. persist lifecycle events
6. add tests
7. security review
8. verify end-to-end
```

That is the experience Ezy should eventually make possible.

------------------------------------------------------------------------

# 30. Final Guardrail

Do not let Ezy become:

> **"Another framework that makes developers configure 40 things before
> they can use it."**

The complexity belongs **inside Ezy**, not on the user.

The product should feel like:

> **Tell me what you want. I'll figure out what is needed.**

------------------------------------------------------------------------

# 31. Curated Reference Links

These are the references that should remain attached to the handoff.
They are intentionally non-redundant.

## Ezy

-   https://github.com/ezmichaely/make-it-ezy

## Capability decision / engineering ecosystem

-   ECC: https://github.com/affaan-m/ECC
-   Claude Code Setup:
    https://github.com/anthropics/claude-plugins-official/tree/main/plugins/claude-code-setup

## Research

-   Integralist Agent Skills:
    https://github.com/Integralist/agent-skills
-   PracticalSwan Agent Skills:
    https://github.com/PracticalSwan/agent-skills
-   Kalaris Research Agent Skills:
    https://github.com/KalarisLabs/research-agent-skills

## Capability discovery

-   Agency Agents: https://github.com/msitarzewski/agency-agents
-   Agent Master Skills: https://github.com/LeoYeAI/agent-master-skills
-   500 AI Agents Projects:
    https://github.com/ashishpatel26/500-AI-Agents-Projects
-   Claude Code Skills Directory:
    https://aiparabellum.com/claude-code-skills-directory/

## Packaging / dependencies

-   Microsoft APM: https://github.com/microsoft/apm
-   APM documentation: https://microsoft.github.io/apm/
-   skillpm: https://github.com/sbroenne/skillpm

## Execution / routing

-   Ruflo: https://github.com/ruvnet/ruflo
-   OmniRoute: https://github.com/cheaper-inference/OmniRoute

## Domain capability example

-   Benji Taylor Skills: https://github.com/benjitaylor/skills
-   Stageshow: https://github.com/benjitaylor/skills/tree/main/stageshow
-   Stageshow write-up: https://benji.org/stageshow

------------------------------------------------------------------------

# 32. Handoff Instruction to the Next Agent

Start from the current Ezy repository, not from this document alone.

Use this document as:

``` text
context
+
architectural boundary
+
research map
+
reference map
+
decision criteria
```

Do not treat it as:

``` text
a list of packages to install
```

The next agent should:

``` text
READ
  ↓
INSPECT CURRENT Ezy REPO
  ↓
IDENTIFY THE CURRENT IMPLEMENTATION STATE
  ↓
MAP CURRENT COMPONENTS TO THIS ARCHITECTURE
  ↓
RESEARCH ONLY THE RELEVANT REFERENCE LAYER
  ↓
IDENTIFY GAPS
  ↓
PROPOSE THE SMALLEST CHANGE
  ↓
IMPLEMENT
  ↓
VERIFY
```

**Do not expand scope simply because this document contains many
references.**

The goal is still:

> **Make It Ezy.**
