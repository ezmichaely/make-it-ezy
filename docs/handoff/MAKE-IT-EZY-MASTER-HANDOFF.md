# MAKE IT EZY — Master Project Handoff

> **Purpose:** This document is the source-of-truth handoff for building **Make It Ezy**, an open-source system intended to make the AI ecosystem easier to use.
>
> **Core idea:** The user describes an outcome. Make It Ezy figures out the useful process, capabilities, skills, tools, workflows, and runtime needed to accomplish it.
>
> **Important development principle:** We should use the existing AI skill ecosystem to build Make It Ezy rather than reinventing that ecosystem.

## Phase map update (2026-11-05) — read this first

Shipped CLI through Phase 5 (project-aware `plan` / `next`, `install`, `skills/ezy`). The **live sequence** is now:

| Phase | Name | Status |
|---|---|---|
| 0–4 | Research → CLI → Discovery → Plan → Install/adapters | **done** |
| **5** | **Project Capability Planner** (project-aware `plan`) | **done** |
| 6 | Project Brain (lightweight persistent knowledge; was “Memory”) | later |
| 7 | Outcome verification (was numbered Phase 5 below) | later |
| 8 | Web UI (was numbered Phase 7 below) | later |

Canonical tracker: [`../ROADMAP.md`](../ROADMAP.md).  
Phase 5 design: [`../superpowers/specs/2026-11-05-phase5-project-capability-planner-design.md`](../superpowers/specs/2026-11-05-phase5-project-capability-planner-design.md).

Older section headings in this file that still say “Phase 5 — Verification” / “Phase 6 — Memory” / “Phase 7 — Web UI” are **historical wording**; use the table above.

---

# 1. Vision

## Make It Ezy

Make It Ezy is intended to be a **free/open-source, local-first capability discovery and orchestration layer** for the AI ecosystem.

It should help a user answer:

> “I want to accomplish X. What skills, tools, workflows, and runtime should I use?”

Examples:

- “Build me a beautiful SaaS dashboard.”
- “Research this topic and produce a report.”
- “Make a promotional video.”
- “Review this codebase.”
- “Build a PWA.”
- “Analyze this structural problem.”
- “Improve the SEO of this website.”
- “Reverse engineer this application.”

Make It Ezy should determine the **minimum useful combination of capabilities** rather than throwing dozens of agents at every problem.

## Motto

> **The user describes the outcome. Make It Ezy figures out the process.**

---

# 2. The Most Important Clarification

Make It Ezy is **not** supposed to reinvent every component of the AI ecosystem.

It should sit above existing ecosystems.

It should understand and work with:

- Agent Skills
- skills catalogs
- workflow methodologies
- MCP servers
- CLIs
- external tools
- local tools
- AI runtimes
- model providers
- existing agent frameworks where useful

The project should prefer:

> **DISCOVER → EVALUATE → COMPOSE → EXECUTE → VERIFY**

rather than:

> BUILD EVERYTHING OURSELVES

---

# 3. How We Use Skills to Build Make It Ezy

This is a critical part of the project.

We are going to use existing skills and development methodologies **while building Make It Ezy**.

There are therefore two layers.

## Layer A — Development of Make It Ezy

Our coding agent may use:

- Superpowers
- Agent Skills
- UI/design skills
- research skills
- testing skills
- architecture skills
- code-review skills
- browser/research tools
- other specialized skills

These help us build Make It Ezy correctly.

## Layer B — Make It Ezy itself

The finished product should eventually be able to:

- discover skills
- inspect skills
- understand skill metadata
- evaluate skills
- compare skills
- recommend skills
- compose skills into workflows
- connect skills to tools
- select an appropriate runtime
- execute or hand off work
- verify results

Therefore:

> **The skills we use to build Make It Ezy are also evidence for how Make It Ezy should eventually understand the ecosystem.**

---

# 4. Superpowers vs Agent Skills

These are not competitors.

## Agent Skills

Agent Skills are a general format/ecosystem for packaging reusable agent knowledge, instructions, workflows, scripts, and resources.

Typical structure:

```text
some-skill/
├── SKILL.md
├── scripts/
├── references/
└── assets/
```

Agent Skills are closer to a **portable format/ecosystem standard**.

Make It Ezy should understand this format rather than inventing an incompatible proprietary format.

## Superpowers

Superpowers is a more opinionated **software-development workflow/methodology built around skills**.

It provides workflows such as:

- brainstorming
- planning
- TDD
- implementation
- debugging
- code review
- verification
- delivery

It is useful for the development of Make It Ezy.

### Decision

Do NOT make Superpowers a required runtime dependency of Make It Ezy.

Instead:

```text
Agent Skills
    ↓
portable skill ecosystem

Superpowers
    ↓
one workflow/methodology that uses skills

Make It Ezy
    ↓
discovers/evaluates/composes both
```

---

# 5. Conceptual Model

Make It Ezy should distinguish between these concepts.

## Specialist

A logical role or domain.

Examples:

- software developer
- video editor
- structural engineering specialist
- researcher
- SEO specialist

A specialist does NOT necessarily mean a separate AI agent.

## Capability

A thing that needs to be accomplished.

Examples:

- write code
- review code
- generate captions
- analyze SEO
- research sources
- inspect a website
- calculate a structural load

## Skill

Reusable knowledge/instructions/resources/scripts.

Examples:

- Agent Skill
- Taste
- UI UX Pro Max
- SEO skill
- testing skill

## Workflow

An ordered or conditional process.

Examples:

```text
research
→ analyze
→ draft
→ review
→ revise
→ verify
```

Superpowers, GSD, BMAD and similar systems belong largely in this category.

## Tool

Something that performs an operation.

Examples:

- Git
- FFmpeg
- browser
- MCP server
- CLI
- image processor
- database
- API

## Runtime

The environment that executes AI-assisted work.

Examples:

- Claude Code
- Codex
- Cursor
- OpenCode
- other compatible runtimes

## Model Provider

The model/inference provider.

Examples:

- OpenAI
- Anthropic
- Google
- Ollama/local models
- other providers

---

# 6. Architecture Principle

Do not turn every box into a package.

The following is conceptual architecture:

```text
USER REQUEST
     │
     ▼
PROJECT / ENVIRONMENT ANALYZER
     │
     ▼
TASK CLASSIFIER
     │
     ▼
CAPABILITY PLANNER
     │
     ▼
DISCOVERY / REGISTRIES
     │
     ▼
DECISION ENGINE
     │
     ▼
RISK / PERMISSION CHECK
     │
     ▼
EXECUTION ADAPTER
     │
     ▼
EXISTING RUNTIME
     │
     ▼
VERIFICATION
     │
     ▼
RESULT
```

The initial implementation should remain small.

---

# 7. Core Philosophy

## 7.1 Simplify before adding complexity

Make It Ezy should follow a simple rule:

> If the same outcome can be achieved with fewer components, prefer the simpler composition.

Avoid:

- unnecessary agents
- unnecessary databases
- unnecessary orchestration
- unnecessary model calls
- unnecessary frameworks
- unnecessary abstractions
- unnecessary cloud services

## 7.2 Minimum useful composition

Example:

User:

> “Build a marketing landing page.”

Bad approach:

```text
12 agents
8 MCP servers
4 workflows
3 models
vector database
browser swarm
research pipeline
```

Better:

```text
UI/design skill
+
frontend implementation skill
+
existing coding runtime
+
verification
```

## 7.3 Existing ecosystem first

Before implementing a new capability:

1. Search existing skills.
2. Search existing workflows.
3. Search existing tools.
4. Search existing MCP servers.
5. Search existing runtimes/integrations.
6. Evaluate quality, license, security and maintenance.
7. Reuse or integrate when appropriate.
8. Build only when necessary.

---

# 8. Technology Direction

## Initial foundation

Use:

- TypeScript
- Node.js
- pnpm
- CLI-first
- framework-light architecture

Do NOT begin with:

- Next.js
- Electron
- Rust
- Python core
- database
- vector database
- web UI
- mandatory AI SDK
- LangChain
- LangGraph
- CrewAI
- AutoGen
- large multi-agent framework

Python can be added later for specialized capabilities where it is clearly justified.

---

# 9. Repository Structure

Start small.

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
│   ├── research/
│   └── architecture/
│
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.json
├── README.md
├── LICENSE
└── CONTRIBUTING.md
```

Do not create dozens of empty packages.

---

# 10. Development Workflow

Before implementation, the coding agent should use appropriate development skills.

Preferred development sequence:

```text
UNDERSTAND
    ↓
RESEARCH
    ↓
BRAINSTORM
    ↓
DESIGN
    ↓
PLAN
    ↓
TEST
    ↓
IMPLEMENT
    ↓
VERIFY
    ↓
REVIEW
```

Superpowers can be used for this development workflow.

Agent Skills can provide specialized knowledge and implementation guidance.

---

# 11. Phase 0 — Ecosystem Research and Foundation

## Goal

Avoid building the wrong product.

Before significant implementation, research what already exists.

## Research categories

### Skills

Investigate:

- Agent Skills
- skills.sh
- Vercel Skills
- Anthropic Skills
- Awesome Agent Skills
- other significant skill catalogs

### Workflow systems

Investigate:

- Superpowers
- GSD
- BMAD
- gstack
- other relevant workflow methodologies

### Agent/specialist catalogs

Investigate:

- Agency Agents
- other large specialist catalogs

### Tools and orchestration

Investigate:

- MCP
- browser automation
- research systems
- orchestration frameworks
- code understanding tools
- memory systems

### UI/design

Investigate:

- Taste
- UI UX Pro Max
- Impeccable
- 21st.dev
- other relevant UI systems

### SEO/research/reverse engineering

Investigate:

- OpenSEO
- REA
- browser tools
- research tools

### Runtimes

Investigate:

- Claude Code
- Codex
- Cursor
- OpenCode
- other important runtimes

---

# 12. Research Deliverables

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

## Research quality requirements

For important findings:

- prefer official sources
- verify current status
- check repositories
- check licenses
- check maintenance/activity
- inspect dependencies
- inspect installation instructions
- inspect supported runtimes
- inspect security implications
- identify overlap with Make It Ezy
- identify whether the project should be:
  - BUILD
  - REUSE
  - INTEGRATE
  - STUDY
  - OPTIONAL
  - IGNORE

Do not assume a repository is trustworthy merely because it is popular.

Do not confuse:

> many websites mentioning a project

with:

> independent confirmation of project quality.

---

# 13. Research Table Format

Use a table similar to:

| Project | Category | Purpose | Official Source | License | Maintenance | Runtime | Cost | Security | Overlap | Decision | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Agent Skills | Standard | Skill format | official source | verify | active | multiple | varies | review | high | STUDY/INTEGRATE | high |
| Superpowers | Workflow | Development workflow | official repo | verify | active | multiple | model cost | review | medium | STUDY/OPTIONAL | high |
| Taste | Skill | UI/design | official repo | verify | verify | agent runtimes | model cost | review | medium | INTEGRATE/OPTIONAL | medium |
| OpenSEO | Tool/Skill | SEO | official repo | verify | verify | MCP/skills | external data may cost | review | medium | OPTIONAL | medium |
| REA | Workflow/Skill | Reverse engineering | official repo | verify | verify | agent runtimes | varies | high | medium | OPTIONAL | medium |

Never fill uncertain values by guessing.

Use:

> UNKNOWN — NEEDS VERIFICATION

when necessary.

---

# 14. Phase 1 — Minimal CLI

After Phase 0 research, implement the smallest useful CLI.

Commands:

```bash
ezy --help
ezy doctor
ezy analyze
```

## `ezy doctor`

Read-only environment diagnostics.

Check:

- Node.js
- pnpm
- Git
- operating system
- project root
- configuration
- basic runtime compatibility

Do not install or modify anything.

## `ezy analyze`

Read-only project analysis.

Detect:

- project root
- Git repository
- package manager
- Node version
- package.json
- TypeScript
- framework
- common project metadata

Potential future detections:

- existing skills
- MCP configuration
- Claude Code configuration
- Codex configuration
- Cursor configuration
- package scripts
- testing framework
- linting
- build system

Do not overbuild Phase 1.

---

# 15. Phase 1 Tests

Include tests for:

- CLI startup
- `--help`
- doctor
- project root detection
- package manager detection
- framework detection
- non-project directory
- malformed package.json
- unsupported environment
- missing tools
- graceful error handling

Expected commands:

```bash
pnpm install
pnpm build
pnpm test
pnpm ezy --help
pnpm ezy doctor
pnpm ezy analyze
```

---

# 16. Phase 2 — Skill and Capability Discovery

Only after Phase 1 works.

Example:

```bash
ezy search "frontend design"
```

Potential discovery sources:

- GitHub
- skills.sh
- Vercel Skills
- known catalogs
- local catalog
- installed skill directories

Flow:

```text
DISCOVER
   ↓
INSPECT
   ↓
COMPARE
   ↓
RECOMMEND
```

No automatic installation initially.

---

# 17. Skill Discovery Model

A skill should be represented conceptually as:

```text
Skill
├── identity
├── name
├── description
├── source
├── version
├── license
├── compatibility
├── runtime
├── dependencies
├── permissions
├── capabilities
├── inputs
├── outputs
├── risks
├── trust level
└── evidence
```

The actual schema should be validated before implementation.

Do not assume every skill has identical metadata.

Agent Skills should be treated as an ecosystem format, not necessarily as the only artifact type Make It Ezy will ever understand.

---

# 18. Phase 3 — Decision Engine

Example:

```bash
ezy "Build me a beautiful SaaS dashboard"
```

The system should identify likely capabilities:

```text
frontend
UI/UX
project understanding
data visualization
testing
```

Then:

1. discover candidates
2. evaluate candidates
3. rank them
4. identify dependencies
5. identify risks
6. recommend minimum useful composition
7. explain why

The output should be understandable to humans.

Example conceptual result:

```text
Recommended

1. UI/design skill
2. frontend implementation skill
3. existing coding runtime
4. verification/testing

Optional

- browser inspection

Not needed

- multi-agent swarm
- vector database
- autonomous research pipeline
```

---

# 19. Phase 4 — Installation and Runtime Adapters

Example:

```bash
ezy install taste
```

Before installation, show:

- source
- provenance
- license
- version
- dependencies
- compatibility
- scripts
- permissions
- security concerns
- files that will change
- estimated external/model costs where possible

Require explicit approval for potentially dangerous changes.

Never blindly execute arbitrary installation scripts from untrusted sources.

---

# 20. Runtime Adapters

Make It Ezy should eventually support different runtimes through adapters.

Conceptually:

```text
Make It Ezy Core
      │
      ├── Claude Code adapter
      ├── Codex adapter
      ├── Cursor adapter
      ├── OpenCode adapter
      └── future adapters
```

Do not hard-code the entire architecture around one runtime.

---

# 21. Phase 5 — Project Capability Planner (inserted 2026-11-05)

**Next implementation milestone.** Evolve `ezy plan` / `ezy next` so planning uses the current project, derives requirements, discovers candidates, filters unnecessary capabilities, and emits a minimum useful set — still heuristic, still no Soft-C / LLM / mandatory Graphify.

See `docs/superpowers/specs/2026-11-05-phase5-project-capability-planner-design.md` and `docs/ROADMAP.md`.

---

# 21b. Phase 7 — Verification (was “Phase 5” in early drafts)

After a workflow executes, Make It Ezy should verify the outcome.

Possible checks:

- build passes
- tests pass
- expected files exist
- expected changes occurred
- unexpected dependencies appeared
- required output exists
- workflow completed
- errors occurred
- human review is required

Verification is a core part of the product.

The system should not confuse:

> “The agent said it finished.”

with:

> “The requested outcome was actually achieved.”

---

# 22. Security Model

This project will eventually process external skills and instructions.

That creates a major security boundary.

Treat skills as potentially executable/untrusted instructions.

Before trusting a skill:

- inspect source
- inspect repository
- inspect scripts
- inspect dependencies
- inspect install behavior
- inspect requested permissions
- inspect network access
- inspect file-system access
- inspect credentials requirements
- inspect reputation and maintenance

High-risk operations should require explicit user confirmation.

Examples:

- deleting files
- executing arbitrary shell commands
- modifying credentials
- accessing secrets
- sending external requests
- installing software
- modifying system configuration
- financial/legal/medical/engineering actions

Make It Ezy should never imply professional certification merely because a skill is called “engineer”, “lawyer”, “doctor”, etc.

For high-risk domains:

> AI assistance ≠ professional authorization.

---

# 23. Phase 6 — Project Brain / Memory (was “Phase 6 — Memory”)

Do not add a vector database simply because AI projects commonly have one.

**Project Brain** should preserve only useful project knowledge (architecture, decisions, conventions, constraints, available capabilities) — not a copy of the repository — so the next agent does not rediscover what the last one learned.

Memory / Brain should be added only when there is a demonstrated requirement (after the Phase 5 planner exists).

Potential future memory:

- project preferences
- installed capabilities
- previous successful workflows
- user preferences
- known project architecture
- trusted sources
- rejected recommendations

Start with simple local configuration/files if sufficient. Graphify may be an optional understanding provider — never mandatory infrastructure.

---

# 24. Phase 8 — Web UI (was “Phase 7”)

Do not begin with the web UI.

The CLI/core should prove the concept first.

Eventually:

```text
                 Make It Ezy Core
                       │
              ┌────────┴────────┐
              ▼                 ▼
             CLI              Web UI
```

The core should remain the source of truth.

The web UI should consume the same APIs/core logic rather than duplicating decision logic.

---

# 25. What Make It Ezy Is NOT

Do not accidentally turn this into:

- another chatbot
- another LLM
- another giant prompt library
- another agent marketplace
- another agent swarm
- another LangChain clone
- another package manager
- another skill format
- another MCP replacement
- another autonomous framework
- another subscription SaaS
- a giant database of every AI project on Earth

The product is a **decision/discovery/composition layer**.

---

# 26. Cost Philosophy

Make It Ezy being free/open-source does NOT mean AI inference is free.

Costs may still come from:

- OpenAI
- Anthropic
- Google
- other model providers
- external APIs
- browser infrastructure
- SEO data providers
- cloud services
- local electricity/hardware

The project should make those costs visible when possible.

A useful future concept:

```text
Capability
   ↓
Estimated cost
   ↓
Free/local option
   ↓
Paid/better option
```

Example:

```text
Research task

Local model:
$0 API cost
Potentially slower/lower quality

Cloud model:
API cost
Potentially stronger reasoning

External SEO data:
Additional provider cost
```

Do not promise “free AI” when the underlying service is paid.

---

# 27. Example Ecosystem

Make It Ezy should eventually be able to understand something like:

```text
                 MAKE IT EZY
                       │
              "What do we need?"
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
      SKILLS        WORKFLOWS        TOOLS
        │              │              │
 Agent Skills      Superpowers       MCP
 Taste              GSD              Git
 UI UX Pro Max      BMAD             FFmpeg
 OpenSEO            etc.             Browser
        │              │              │
        └──────────────┼──────────────┘
                       ▼
                    RUNTIME
               Claude / Codex / Cursor
```

This is a conceptual model, not a requirement to create one package per box.

---

# 28. Candidate Projects to Research

## Skills / catalogs

- Vercel Skills
- skills.sh
- Anthropic Skills
- Agent Skills
- Awesome Agent Skills

## Workflow systems

- Superpowers
- GSD
- BMAD Method
- gstack

## Specialist catalogs

- Agency Agents
- other agent catalogs

## UI / design

- Taste
- UI UX Pro Max
- Impeccable
- 21st.dev
- HyperFrames
- Cap

## SEO

- OpenSEO
- REA
- DataForSEO

## Reverse engineering

- REA

## Browser / research

- Browser Use
- Agent Browser
- Agent Reach

## Code understanding / memory

- Graphify
- Understand Anything
- Claude-Mem
- OpenViking
- Agent Memory

## Local runtime

- Ollama
- llama.cpp
- LM Studio

## Target runtimes

- Claude Code
- Codex
- Cursor

## Orchestration frameworks

Study but do not automatically adopt:

- LangGraph
- CrewAI
- AutoGen
- Agno
- LlamaIndex
- Ruflo

---

# 29. Known Reference URLs

Use official repositories/sites and re-check them during implementation.

## Skills

- Vercel Skills: https://github.com/vercel-labs/skills
- Find Skills: https://github.com/vercel-labs/skills/tree/main/skills/find-skills
- skills.sh: https://skills.sh/
- skills.sh API: https://skills.sh/docs/api
- Anthropic Skills: https://github.com/anthropics/skills
- Agent Skills: https://agentskills.io/
- Awesome Agent Skills: https://github.com/VoltAgent/awesome-agent-skills

## Workflows / agents

- Superpowers: https://github.com/obra/superpowers
- Agency Agents: https://github.com/msitarzewski/agency-agents
- GSD: https://github.com/gsd-build/get-shit-done
- BMAD Method: https://github.com/bmad-code-org/BMAD-METHOD
- gstack: https://github.com/garrytan/gstack

## Orchestration

- Ruflo: https://github.com/ruvnet/ruflo
- LangGraph: https://github.com/langchain-ai/langgraph
- CrewAI: https://github.com/crewAIInc/crewAI
- AutoGen: https://github.com/microsoft/autogen
- Agno: https://github.com/agno-agi/agno
- LlamaIndex: https://github.com/run-llama/llama_index

## UI / design

- Taste: https://github.com/Leonxlnx/taste-skill
- Taste site: https://tasteskill.dev/
- UI UX Pro Max: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- Impeccable: https://github.com/pbakaus/impeccable
- 21st.dev: https://21st.dev/
- HyperFrames: https://github.com/heygen-com/hyperframes
- Cap: https://github.com/CapSoftware/Cap

## SEO / reverse engineering

- OpenSEO: https://github.com/every-app/open-seo
- REA: https://github.com/morluto/rea
- OpenSEO: https://openseo.so/
- REA: https://rea.tools/
- DataForSEO: https://dataforseo.com/

## Browser / research

- Browser Use: https://github.com/browser-use/browser-use
- Agent Browser: https://github.com/vercel-labs/agent-browser
- Agent Reach: https://github.com/Panniantong/Agent-Reach

## Code understanding / memory

- Graphify: https://github.com/Graphify-Labs/graphify
- Understand Anything: https://github.com/Egonex-AI/Understand-Anything
- Claude-Mem: https://github.com/thedotmack/claude-mem
- OpenViking: https://github.com/volcengine/OpenViking
- Agent Memory: https://github.com/rohitg00/agentmemory

## Local models

- Ollama: https://github.com/ollama/ollama
- llama.cpp: https://github.com/ggml-org/llama.cpp
- LM Studio: https://lmstudio.ai/

## Runtimes

- Claude Code: https://github.com/anthropics/claude-code
- Codex: https://github.com/openai/codex
- Cursor: https://cursor.com/

---

# 30. Four Previously Inspected References

These were specifically considered as possible Make It Ezy ecosystem components.

## OpenSEO

https://github.com/every-app/open-seo

Potential role:

> INTEGRATE / OPTIONAL

Purpose:

SEO tooling, MCP, reusable skills.

Important:

External SEO data may still incur provider costs.

---

## REA

https://github.com/morluto/rea

Potential role:

> INTEGRATE / OPTIONAL

Purpose:

Reverse engineering workflows for binaries, JS/Electron, .NET and websites/runtime behavior.

Potential future:

> Reverse Engineering capability

---

## Taste

https://github.com/Leonxlnx/taste-skill

Potential role:

> INTEGRATE / OPTIONAL

Purpose:

UI/frontend design, art direction, visual research, browser inspection, responsive review and screenshot critique/refinement.

Potential future:

> UI/Design capability

---

## Agency Agents

https://github.com/msitarzewski/agency-agents

Potential role:

> STUDY / INTEGRATE

Purpose:

Large role-based specialist catalog.

Important:

A role definition does not prove professional competence or certification.

---

# 31. Initial Codex/Cursor Assignment

## Assignment

You are helping build **Make It Ezy**, an open-source capability discovery and orchestration system for the AI ecosystem.

Do not begin by blindly implementing a large architecture.

First understand the ecosystem and use appropriate development skills.

### Development methodology

Use available development skills/workflows where appropriate, especially:

- Superpowers
- Agent Skills
- testing/TDD skills
- architecture/research skills
- code review/verification skills

Do not make these tools runtime dependencies unless explicitly required.

---

# 32. First Task — Research Before Coding

Perform a structured research pass over:

1. Agent Skills
2. Superpowers
3. skills.sh
4. Vercel Skills
5. Anthropic Skills
6. Agency Agents
7. GSD
8. BMAD
9. Taste
10. UI UX Pro Max
11. Impeccable
12. OpenSEO
13. REA
14. Browser Use
15. Agent Browser
16. relevant MCP ecosystem
17. Claude Code
18. Codex
19. Cursor
20. relevant orchestration frameworks

For each:

- identify the official repository/site
- determine actual purpose
- identify category
- inspect current activity
- inspect license
- inspect dependencies
- inspect supported runtimes
- inspect installation process
- inspect security considerations
- determine whether it overlaps with Make It Ezy
- determine whether Make It Ezy should build, reuse, integrate, study, optionally support, or ignore it

Do not guess.

If information is uncertain:

```text
UNKNOWN — NEEDS VERIFICATION
```

---

# 33. Second Research Pass

Important findings must be cross-checked.

Do not consider a single source sufficient for important conclusions.

Prefer:

1. official repository
2. official documentation
3. independent technical evidence
4. current release/activity information

Look specifically for:

- outdated information
- conflicting documentation
- abandoned projects
- license changes
- security concerns
- runtime incompatibilities
- hidden costs
- misleading marketing claims

---

# 34. Then Produce the Architecture

After research, update:

```text
docs/architecture/ARCHITECTURE.md
docs/architecture/CAPABILITY-MODEL.md
docs/architecture/INTEGRATION-STRATEGY.md
docs/architecture/SECURITY-MODEL.md
docs/MVP-SPECIFICATION.md
docs/ROADMAP.md
```

The architecture must answer:

1. What is Make It Ezy?
2. What is it NOT?
3. What is a skill?
4. What is a workflow?
5. What is a capability?
6. What is a tool?
7. What is a runtime?
8. How are these discovered?
9. How are they evaluated?
10. How are they composed?
11. How are they executed?
12. How are they verified?
13. How are permissions handled?
14. How are costs represented?
15. How does Make It Ezy avoid unnecessary complexity?

---

# 35. Only Then Implement Phase 1

Implement:

```bash
ezy --help
ezy doctor
ezy analyze
```

Requirements:

- TypeScript
- Node.js
- pnpm
- CLI-first
- lightweight architecture
- read-only analysis
- tests
- clear errors
- documentation

Do not implement:

- skill marketplace
- automatic installation
- AI model calls
- agent swarm
- multi-agent orchestration
- web UI
- database
- vector database
- memory system
- automatic execution of third-party code

Those belong to later phases.

---

# 36. Definition of Done for Phase 1

The project must successfully run:

```bash
pnpm install
pnpm build
pnpm test
pnpm ezy --help
pnpm ezy doctor
pnpm ezy analyze
```

The code should be:

- understandable
- typed
- tested
- minimal
- documented
- easy to extend

Avoid premature abstractions.

---

# 37. Critical Product Principle

The most important question Make It Ezy must eventually answer is not:

> “Which agent should I run?”

It is:

> **“What is the smallest trustworthy combination of capabilities that can accomplish this outcome?”**

That means Make It Ezy should optimize for:

```text
USEFULNESS
+
SIMPLICITY
+
TRUST
+
VERIFIABILITY
```

not:

```text
NUMBER OF AGENTS
```

---

# 38. Future Example

Eventually a user could run:

```bash
ezy "Build a modern SaaS dashboard for my existing Next.js project"
```

Make It Ezy could determine:

```text
Project:
Next.js
TypeScript
pnpm
existing repository

Goal:
Modern SaaS dashboard

Required capabilities:
✓ UI design
✓ frontend implementation
✓ project analysis
✓ testing
✓ verification

Potential skills:
→ Taste
→ UI UX Pro Max
→ relevant frontend skill

Runtime:
→ Codex / Claude Code / Cursor

Optional:
→ browser inspection

Not required:
✗ agent swarm
✗ vector database
✗ autonomous multi-agent system
✗ unnecessary backend
```

Then it could ask for permission before applying changes.

That is the product.

---

# 39. Long-Term Direction

If successful, Make It Ezy could become a neutral layer connecting:

```text
Users
  ↓
Make It Ezy
  ↓
Skills
Workflows
Tools
MCP
Runtimes
Models
Local resources
Cloud services
```

The project should remain open-source and modular.

The ecosystem should be able to evolve without Make It Ezy needing to recreate every new tool.

---

# 40. Final Instruction to the Coding Agent

Do not optimize for how much code you can produce.

Optimize for discovering whether the architecture is correct.

Use existing skills to help build the project.

Reuse existing standards where they are good.

Do not invent a proprietary skill standard unless research proves that existing standards are insufficient.

Do not make Superpowers mandatory.

Do not make any individual AI provider mandatory.

Do not make cloud services mandatory.

Do not build a multi-agent swarm merely because the project is about AI.

Do not add a database until a real requirement exists.

Do not add a web UI until the core workflow is proven.

Do not install or execute untrusted third-party skills automatically.

When uncertain, research first.

When research conflicts, show the conflict.

When a simpler solution works, choose the simpler solution.

> **Make It Ezy should make the AI ecosystem easier — including making its own architecture easy to understand.**
