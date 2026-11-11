# MAKE IT EZY — CODEx / Cursor HANDOFF

> **SUPERSEDED.** Use [`MAKE-IT-EZY-CANONICAL-HANDOFF.md`](./MAKE-IT-EZY-CANONICAL-HANDOFF.md). Historical snapshot only.

## 0. Executive direction

Make It Ezy is an open-source developer tool intended to make the AI ecosystem easier to use.

**Core idea:**

> The user describes the outcome. Make It Ezy figures out the minimum useful process.

Make It Ezy is **not** another LLM, chatbot, giant agent swarm, prompt library, or mandatory AI framework.

It should become an **AI capability discovery, decision, package/skill management, and orchestration layer** that can work with existing ecosystems such as Agent Skills, MCP, Claude Code, Codex, Cursor, GitHub, npm, and local tools.

### Critical product principle

**Simplify before adding complexity.**

Do not introduce agents, skills, databases, frameworks, abstractions, or services unless the current problem actually requires them.

---

# 1. Technology decision

Use:

- **TypeScript**
- **Node.js**
- **pnpm**
- CLI-first
- Framework-light architecture

Do NOT start with Python, Next.js, Electron, Rust, LangChain, LangGraph, CrewAI, AutoGen, Ruflo, or another large orchestration framework.

This does not mean Python is bad. Python may be used later for specialized capabilities where it is clearly advantageous. But the Make It Ezy core should initially be TypeScript/Node because the ecosystem it manages is heavily connected to:

- npm
- npx
- Node CLIs
- MCP servers
- GitHub
- JavaScript/TypeScript projects
- Claude Code
- Codex
- Cursor
- developer tooling

The user already works primarily with TypeScript, Next.js, pnpm, GitHub, Cursor, Codex, and Claude, so TypeScript also reduces project-owner friction.

---

# 2. What Make It Ezy is — and is not

## It is

An ecosystem interpreter/manager that can:

1. Understand a user's desired outcome.
2. Inspect the current project/environment.
3. Identify required capabilities.
4. Discover relevant skills, tools, workflows, specialists, and runtimes.
5. Rank them.
6. Explain why they are useful.
7. Recommend the smallest useful combination.
8. Ask for permission.
9. Install/configure them when approved.
10. Execute through existing runtimes/tools.
11. Verify the result.

## It is not

- A replacement for Claude/Codex/Cursor.
- An LLM provider.
- A mandatory hosted service.
- A requirement to pay for another model API.
- A giant collection of copied skills.
- A multi-agent swarm by default.
- A package manager replacement for npm/pnpm.
- A web application in the first phase.

Make It Ezy can eventually have package-management functionality, but its higher-level purpose is:

> What should the user use at all?

A traditional package manager answers:
> Where is package X and how do I install version Y?

Make It Ezy answers:
> Given the outcome I want, what capabilities should I use, and what is the minimum useful setup?

---

# 3. Conceptual model

Keep these concepts separate.

### Specialist
A logical domain role.

Examples:
- Video editor
- Software developer
- Researcher
- Structural engineering specialist

A specialist is NOT automatically a separate AI agent.

### Capability
A task that needs to be accomplished.

Examples:
- Captioning
- Structural load calculation
- Code review
- UI design
- Research

### Skill
Reusable instructions, domain knowledge, methodology, scripts, and resources.

Examples:
- Agent Skill with `SKILL.md`
- Taste
- UI UX Pro Max
- Superpowers-style skills

### Tool
Software that performs an action.

Examples:
- FFmpeg
- Git
- browser automation
- GitHub CLI
- CAD software
- MCP server

### Workflow
An ordered or conditional process.

Example:

Research → draft → fact-check → produce → review

### Runtime
The environment that executes instructions/tool calls.

Examples:
- Claude Code
- Codex
- Cursor
- local runtime

### Model provider
The source of inference.

Examples:
- Anthropic
- OpenAI
- Google
- Ollama/local models

Do not collapse these concepts into a single “agent” abstraction.

---

# 4. Architecture direction

Conceptually:

USER REQUEST
→ PROJECT / ENVIRONMENT ANALYZER
→ TASK CLASSIFIER
→ CAPABILITY PLANNER
→ DISCOVERY / REGISTRIES
→ DECISION ENGINE
→ RISK / PERMISSION CHECK
→ EXECUTION ADAPTER
→ EXISTING RUNTIME
→ VERIFICATION
→ RESULT

However, this is a conceptual architecture, NOT a command to create every component as a separate package immediately.

Only create boundaries when the implementation actually needs them.

---

# 5. New phased roadmap

The roadmap has been deliberately simplified.

## PHASE 0 — Foundation & Research

Goal:

> Avoid building the wrong thing.

Establish:

- TypeScript
- Node.js
- pnpm
- CLI-first
- no database
- no web UI
- no mandatory AI SDK
- no large agent framework

Research and document:

- Agent Skills
- skills.sh
- Vercel Skills
- Anthropic Skills
- Agency Agents
- Superpowers
- GSD
- BMAD
- Taste
- UI UX Pro Max
- Impeccable
- MCP
- Claude Code
- Codex
- Cursor
- relevant orchestration projects
- relevant browser/research tools
- relevant memory/code-understanding projects

### Phase 0 deliverables

Create:

```text
docs/
├── research/
│   ├── REFERENCE-DIRECTORY.md
│   ├── RESEARCH-INVENTORY.md
│   └── PROJECT-COMPARISON.md
│
├── architecture/
│   ├── ARCHITECTURE.md
│   ├── CAPABILITY-MODEL.md
│   ├── INTEGRATION-STRATEGY.md
│   └── SECURITY-MODEL.md
│
├── ROADMAP.md
└── MVP-SPECIFICATION.md
```

For every external project, document:

- official URL
- actual purpose
- category
- license
- activity/maintenance
- dependencies
- installation method
- supported runtimes
- API/service costs
- security concerns
- overlap with other projects
- potential role in Make It Ezy
- BUILD / REUSE / INTEGRATE / STUDY / OPTIONAL / IGNORE
- evidence/confidence

Do not guess repository identities. Mark uncertain references as unresolved.

---

# 6. PHASE 1 — Minimal CLI

This is the first coding phase.

Create the smallest useful TypeScript/Node/pnpm CLI.

Initial repository shape:

```text
make-it-ezy/
├── apps/
│   └── cli/
│
├── packages/
│   └── core/
│
├── catalog/
│
├── tests/
│
├── docs/
│
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.json
├── README.md
├── LICENSE
└── CONTRIBUTING.md
```

Do NOT create dozens of empty packages.

The CLI should initially support:

```bash
ezy --help
ezy doctor
ezy analyze
```

## `ezy doctor`

Check basic environment:

- Node version
- pnpm availability/version
- Git availability
- operating system
- project root
- basic configuration

## `ezy analyze`

Inspect the current project without modifying it.

Example:

```text
Make It Ezy

Project
────────────────────────
Framework: Next.js
Language: TypeScript
Package manager: pnpm
React: 19
Node: 22

Detected:
✓ Git repository
✓ package.json
✓ TypeScript
✓ Next.js
✓ Tailwind
```

This phase does not need an AI model.

The first objective is proving that Make It Ezy can reliably understand its environment.

---

# 7. PHASE 2 — Discovery

After the CLI works, add ecosystem discovery.

Potential sources:

- GitHub
- skills.sh
- Vercel Skills
- known skill catalogs
- local catalog

Example:

```bash
ezy search "frontend design"
```

Expected output:

```text
Results

1. Taste
   UI / frontend design

2. UI UX Pro Max
   UI/UX design system

3. Impeccable
   frontend quality/design
```

Important:

**Discovery must not automatically install anything.**

Lifecycle:

DISCOVER
→ INSPECT
→ COMPARE
→ RECOMMEND

External sources are untrusted until inspected.

---

# 8. PHASE 3 — Decision Engine

This is the heart of Make It Ezy.

Example:

```bash
ezy "Build me a beautiful SaaS dashboard"
```

The system should identify:

```text
Goal:
Build SaaS dashboard

Capabilities:
✓ Frontend development
✓ UI/UX
✓ Data visualization
✓ Project understanding
✓ Testing
```

Then discover candidate resources and rank them.

Example:

```text
Recommended setup

1. Taste
   UI/UX and visual direction

2. Project understanding
   Existing codebase analysis

3. Testing workflow
   Verify implementation

Not recommended:
- Agency Agents
- BMAD
- GSD
- CrewAI
- LangGraph

Reason:
They add complexity that is not necessary
for this task.
```

The key objective is **minimum useful capability selection**, not maximum capability accumulation.

---

# 9. PHASE 4 — Installation + Runtime Adapters

Only after discovery/recommendation works should Make It Ezy install/configure external capabilities.

Example:

```bash
ezy install taste
```

Before installation:

- inspect source
- inspect license
- inspect dependencies
- inspect installation scripts
- inspect compatibility
- inspect permissions
- inspect risk
- show changes
- request explicit approval

Never execute arbitrary external installation scripts just because a resource appears in a catalog.

Potential runtime adapters:

```text
integrations/
├── claude-code/
├── codex/
├── cursor/
└── ...
```

Start with ONE runtime adapter and validate it thoroughly before adding others.

Do not claim compatibility merely because a runtime is popular. Test it.

---

# 10. PHASE 5 — Verification + Memory

## Verification

After execution, Make It Ezy should be able to ask:

- Did the requested task happen?
- Did the build pass?
- Did tests pass?
- Were unexpected files changed?
- Were unexpected dependencies added?
- Did the selected skill actually help?
- Is human review required?

High-risk domains require stronger safeguards.

Examples:

- legal
- medical
- financial
- structural engineering
- electrical engineering
- cybersecurity

For engineering calculations, Make It Ezy must not claim licensed-professional certification. Deterministic calculations, independent checks, jurisdiction/code selection, and qualified professional review may be required.

## Memory

Only introduce persistent memory when a demonstrated use case requires it.

Potential memory:

- user preferences
- project preferences
- installed skills
- compatibility results
- previous decisions

Do not add vector databases or large memory frameworks merely because “agents need memory.”

---

# 11. PHASE 6 — Web UI / Ecosystem

Only after the CLI/core proves useful.

Future architecture:

```text
                 Make It Ezy Core
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
             CLI                Web UI
```

The web UI must consume the same core capabilities.

Do not make the web application the source of truth.

Potential future features:

- visual capability explorer
- skill marketplace/discovery
- installation approval UI
- workflow visualization
- project dashboard
- runtime configuration
- skill update review
- security/risk review

---

# 12. Skill ecosystem strategy

Do NOT copy every skill into Make It Ezy.

Use external catalogs as discovery sources.

Important references:

- Vercel Skills:
  https://github.com/vercel-labs/skills
- Find Skills:
  https://github.com/vercel-labs/skills/tree/main/skills/find-skills
- skills.sh:
  https://skills.sh/
- skills.sh API:
  https://skills.sh/docs/api
- Anthropic Skills:
  https://github.com/anthropics/skills
- Agent Skills specification:
  https://agentskills.io/
- Awesome Agent Skills:
  https://github.com/VoltAgent/awesome-agent-skills

Make It Ezy should store metadata such as:

- source repository
- source path
- version/release/commit
- content hash
- license
- capabilities/tags
- dependencies
- compatible runtimes
- required permissions
- risk level
- provenance
- last inspected date

External skill updates should follow:

1. Detect upstream change.
2. Compare commit/release/hash.
3. Inspect changed content.
4. Recheck license/dependencies/security.
5. Check runtime compatibility.
6. Explain impact.
7. Ask for approval.
8. Apply update.

Never silently update a user's installed capability.

---

# 13. Important ecosystem references

## Skill / discovery

Vercel Skills
https://github.com/vercel-labs/skills

skills.sh
https://skills.sh/

Anthropic Skills
https://github.com/anthropics/skills

Agent Skills
https://agentskills.io/

Awesome Agent Skills
https://github.com/VoltAgent/awesome-agent-skills

## Specialist catalog

Agency Agents
https://github.com/msitarzewski/agency-agents

500 AI Agents Projects
https://github.com/ashishpatel26/500-AI-Agents-Projects

## Orchestration / workflow projects to study, not automatically depend on

Ruflo
https://github.com/ruvnet/ruflo

Superpowers
https://github.com/obra/superpowers

LangGraph
https://github.com/langchain-ai/langgraph

CrewAI
https://github.com/crewAIInc/crewAI

AutoGen
https://github.com/microsoft/autogen

Agno
https://github.com/agno-agi/agno

LlamaIndex
https://github.com/run-llama/llama_index

GSD
https://github.com/gsd-build/get-shit-done

BMAD Method
https://github.com/bmad-code-org/BMAD-METHOD

gstack
https://github.com/garrytan/gstack

## Code understanding / memory

Graphify
https://github.com/Graphify-Labs/graphify

Understand Anything
https://github.com/Egonex-AI/Understand-Anything

Claude-Mem
https://github.com/thedotmack/claude-mem

OpenViking
https://github.com/volcengine/OpenViking

Agent Memory
https://github.com/rohitg00/agentmemory

## Browser / research

Browser Use
https://github.com/browser-use/browser-use

Agent Browser
https://github.com/vercel-labs/agent-browser

Agent Reach
https://github.com/Panniantong/Agent-Reach

## UI / design

Taste
https://github.com/Leonxlnx/taste-skill

Taste site
https://tasteskill.dev/

UI UX Pro Max
https://github.com/nextlevelbuilder/ui-ux-pro-max-skill

Impeccable
https://github.com/pbakaus/impeccable

21st.dev
https://21st.dev/

HyperFrames
https://github.com/heygen-com/hyperframes

Cap
https://github.com/CapSoftware/Cap

## SEO / reverse engineering

OpenSEO
https://github.com/every-app/open-seo

REA
https://github.com/morluto/rea

OpenSEO site
https://openseo.so/

REA site
https://rea.tools/

DataForSEO
https://dataforseo.com/

## Local model/runtime references

Ollama
https://github.com/ollama/ollama

llama.cpp
https://github.com/ggml-org/llama.cpp

LM Studio
https://lmstudio.ai/

## Target runtimes

Claude Code
https://github.com/anthropics/claude-code

Codex
https://github.com/openai/codex

Cursor
https://cursor.com/

---

# 14. Four repositories explicitly supplied and inspected earlier

These four were specifically supplied by the project owner and inspected.

## OpenSEO

https://github.com/every-app/open-seo

Purpose:
SEO platform/MCP/reusable skills.

Potential role:
INTEGRATE / OPTIONAL

Important:
Self-hosting does not make all SEO data free. DataForSEO can be required for external SEO data.

License observed during earlier inspection:
MIT.

Recheck license and dependencies before redistribution or integration.

## REA — Reverse Engineer Anything

https://github.com/morluto/rea

Purpose:
Reverse engineering workflows for native binaries, JavaScript/Electron applications, .NET assemblies, websites, and runtime behavior.

Potential role:
INTEGRATE / OPTIONAL.

Possible future specialist:
Reverse Engineering Specialist.

License observed earlier:
MIT.

Recheck current status before integration.

## Taste Skill

https://github.com/Leonxlnx/taste-skill

Purpose:
UI/frontend design, art direction, visual research, browser inspection, responsive review, screenshot critique and refinement.

Potential role:
INTEGRATE / OPTIONAL, high priority for UI/UX use cases.

License observed earlier:
MIT.

Important:
Even if the skill itself is free, model usage can be substantial.

Recheck current dependencies/status before integration.

## Agency Agents

https://github.com/msitarzewski/agency-agents

Purpose:
Large catalog of role-based agent definitions across engineering, design, marketing, product, etc.

Potential role:
STUDY / INTEGRATE.

Important:
An agent persona does not prove professional competence. Treat these as role definitions/instructions, not guaranteed expertise.

License observed earlier:
MIT.

Recheck before integration.

---

# 15. Important design principle: skills are not necessarily frameworks

The ecosystem contains several different implementation styles.

Some are simple Agent Skills:

- Markdown instructions
- `SKILL.md`
- optional scripts
- optional resources

Some are actual software:

- MCP servers
- CLIs
- browser automation
- memory systems
- developer tools

Some are workflow methodologies:

- GSD
- Superpowers
- BMAD

Some are orchestration frameworks:

- LangGraph
- CrewAI
- AutoGen
- Ruflo

Make It Ezy must understand the difference.

Do not create a universal “agent” abstraction that hides these differences.

---

# 16. Package manager relationship

Make It Ezy should NOT replace npm/pnpm.

It should operate above existing package managers.

Example:

```text
Make It Ezy
    │
    ├── decides what is needed
    │
    ├── discovers capability
    │
    └── uses existing mechanisms
          ├── npm / pnpm
          ├── Git
          ├── GitHub
          ├── MCP
          ├── runtime-specific installers
          └── OS tools
```

Make It Ezy can eventually feel like an AI package manager, but its differentiator is **capability selection and orchestration**, not package installation alone.

---

# 17. Cost model

Make It Ezy should be free/open-source at its core.

It should NOT require:

- mandatory Make It Ezy hosted backend
- mandatory paid AI API
- mandatory cloud database
- mandatory telemetry
- mandatory hosted subscription

However, Make It Ezy cannot make third-party inference or data services free.

Potential costs can come from:

- Claude/API usage
- OpenAI/API usage
- other model providers
- SEO data APIs
- cloud services
- third-party tools
- local hardware/electricity

The project should make these costs explicit rather than hiding them.

---

# 18. Security model

Treat external repositories, skills, scripts, MCP servers, and installation commands as untrusted.

Never automatically execute arbitrary code because it was discovered.

Before installation/execution:

- identify source
- verify provenance
- inspect requested permissions
- inspect install scripts
- inspect dependencies
- inspect network access
- inspect filesystem access
- inspect environment-variable requirements
- inspect license
- classify risk
- obtain user approval where appropriate

Risk categories:

### Low
- formatting
- summarization
- writing
- read-only analysis

### Medium
- code edits
- browser automation
- file modifications
- dependency installation

### High
- security testing
- financial actions
- legal work
- medical work
- structural/electrical engineering
- destructive system actions

High-risk workflows should require stronger permission and verification.

---

# 19. What NOT to build in Phase 1

Absolutely do not add:

- multi-agent swarm
- automatic agent spawning
- LangGraph
- CrewAI
- AutoGen
- Ruflo
- database
- vector database
- web app
- desktop app
- model hosting
- model training
- automatic skill installation
- automatic code modification
- automatic external script execution
- dozens of adapters
- huge plugin architecture
- telemetry
- unnecessary abstraction layers

If the simplest implementation solves the problem, use it.

---

# 20. First vertical slice

The first useful end-to-end path should eventually become:

```text
User request
    ↓
Project analysis
    ↓
Capability identification
    ↓
Skill/tool discovery
    ↓
Candidate ranking
    ↓
Minimal useful plan
    ↓
Explain recommendation
    ↓
User approval
    ↓
Installation/configuration
    ↓
Runtime execution
    ↓
Verification
```

But Phase 1 only needs to reach:

```text
User/project
    ↓
Analyze
    ↓
Show reliable project information
```

Phase 2 adds discovery.

Phase 3 adds intelligent recommendation.

Do not skip directly to the full pipeline.

---

# 21. Immediate assignment to Codex/Cursor

You are the implementation agent.

## Task

Implement **Phase 0 + Phase 1 only**.

### Step 1 — Inspect

Before changing code:

- inspect the existing repository
- identify whether anything already exists
- do not overwrite useful existing work
- determine whether the repo is empty or partially initialized

### Step 2 — Research documentation

Create/update:

```text
docs/research/REFERENCE-DIRECTORY.md
docs/research/RESEARCH-INVENTORY.md
docs/research/PROJECT-COMPARISON.md
docs/architecture/ARCHITECTURE.md
docs/architecture/CAPABILITY-MODEL.md
docs/architecture/INTEGRATION-STRATEGY.md
docs/architecture/SECURITY-MODEL.md
docs/ROADMAP.md
docs/MVP-SPECIFICATION.md
```

Use the reference list in this handoff.

Do not invent repository URLs.

If a reference from the original video cannot be confidently identified, mark it:

`UNRESOLVED — requires verification`

### Step 3 — Initialize the project

Use:

- TypeScript
- Node.js
- pnpm
- CLI
- Vitest or another lightweight TypeScript test runner

Keep dependencies minimal.

### Step 4 — Implement

Implement:

```bash
ezy --help
ezy doctor
ezy analyze
```

`ezy analyze` must be read-only.

It should detect at minimum where applicable:

- project root
- Git repository
- package manager
- Node version
- package.json
- TypeScript
- framework
- common frontend/backend frameworks
- useful project metadata

Do not make the detector pretend to know things it cannot reliably determine.

### Step 5 — Test

Add tests for:

- CLI startup
- doctor
- project root detection
- package manager detection
- framework detection
- non-project directory behavior
- malformed package.json handling
- unsupported environments

### Step 6 — Documentation

Document:

- how to install
- how to develop
- how to run tests
- how to run the CLI locally
- architecture decisions
- what is deliberately NOT implemented

### Step 7 — Stop

Do not proceed to Phase 2.

Do not implement discovery yet.

Do not install skills automatically.

Do not build a web UI.

Do not add an AI provider.

Return:

1. files created/changed
2. architecture summary
3. commands to run
4. tests run/results
5. dependencies added
6. assumptions made
7. unresolved questions
8. recommendation for Phase 2

---

# 22. Definition of success for Phase 1

A developer can clone the repository and run:

```bash
pnpm install
pnpm build
pnpm test
pnpm ezy --help
pnpm ezy doctor
pnpm ezy analyze
```

and get reliable output.

The project should be understandable by a developer without reading thousands of lines of code.

The implementation should be small enough that the project owner can still understand the architecture.

---

# 23. Final principle

The goal is not:

> Build the biggest AI orchestration platform.

The goal is:

> Make the AI ecosystem easier to use.

The intelligence should be in **choosing the right capabilities**, not in accumulating the most capabilities.

Build small.

Verify.

Then expand.

Do not solve problems we do not have yet.
