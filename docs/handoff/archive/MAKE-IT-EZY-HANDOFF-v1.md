# Make It Ezy — Product Vision, Research Inventory & Engineering Handoff

> **SUPERSEDED.** Agents: root [`../../AGENTS.md`](../../AGENTS.md). Product intent: [`MAKE-IT-EZY-HANDOFF.md`](./MAKE-IT-EZY-HANDOFF.md). Status: [`../ROADMAP.md`](../ROADMAP.md). Historical snapshot only.

**Repository:** `make-it-ezy`  
**Project type:** Open-source, local-first AI capability discovery and orchestration layer  
**Status:** Historical — superseded by the canonical handoff  
**Primary audience:** Codex, Cursor, Claude Code, and future contributors

---

## 0. Instructions to Codex / Cursor

You are joining this project as a senior software architect and research engineer.

**Do not immediately build the entire vision.** First inspect the existing repository, verify the references in this document, and produce a concrete MVP proposal.

Your first deliverable is a research and architecture package—not a large implementation.

For every external project:

- Verify the official repository and documentation.
- Inspect its current README, license, release/activity history, dependencies, installation process, and security model.
- Identify what it actually provides, not just what its marketing says.
- Check compatibility with Claude Code, Codex, Cursor, and local runtimes where relevant.
- Identify overlaps, conflicts, maintenance burden, and hidden costs.
- Cross-check important claims with independent or primary sources.
- Mark anything that cannot be verified as **unverified**.
- Do not invent URLs, capabilities, versions, or compatibility.
- Do not install, execute, or copy external code without explicit approval.

Classify every candidate as one of:

- **BUILD** — implement ourselves because no suitable reusable option exists.
- **REUSE** — use an existing implementation directly.
- **INTEGRATE** — connect through a documented adapter/interface.
- **STUDY** — borrow ideas or patterns without depending on the project.
- **OPTIONAL** — useful for selected users/tasks, not core.
- **IGNORE** — unsuitable, redundant, unsafe, or out of scope.

Explain each decision and its evidence.

---

# 1. Product vision

Make It Ezy is not another LLM, chatbot, prompt collection, or giant agent framework.

It is an intelligent layer that helps users discover, select, assemble, and coordinate AI capabilities to accomplish a task.

The user describes the outcome:

- “Build a Next.js application.”
- “Research and write a YouTube script.”
- “I need a video-editing workflow.”
- “Help me understand this unfamiliar codebase.”
- “Find a structural-engineering calculation workflow.”
- “Create a presentation.”
- “Automate this browser task.”

Make It Ezy figures out what kind of specialist is needed, which capabilities are required, what skills and tools are available, which workflow is appropriate, and how the result should be checked.

> **The user describes the outcome. Make It Ezy figures out the process.**

## Core principles

1. Free and open source at the core.
2. Local-first and cloud-optional.
3. Model-agnostic and framework-agnostic.
4. Discover before building.
5. Reuse before reinventing.
6. Recommend the minimum useful capabilities.
7. Make recommendations explainable.
8. Require approval for installation and sensitive actions.
9. Verify outputs; do not blindly trust agents.
10. Simplify before adding complexity.
11. Keep external projects replaceable.
12. Do not imply that free software means free model inference or free third-party data.

---

# 2. What Make It Ezy is—and is not

Make It Ezy should own the coordination logic:

- Task understanding and classification.
- Project/environment analysis.
- Specialist and capability taxonomy.
- Skill/tool discovery and metadata registry.
- Candidate evaluation and ranking.
- Workflow planning.
- Risk classification and permission decisions.
- Adapters to supported runtimes and tools.
- Verification strategy and result reporting.

It should generally **reuse** existing systems for:

- Model inference.
- Agent execution.
- Browser automation.
- Codebase indexing.
- Specialized domain tools.
- Video/audio processing.
- External research/data providers.
- Mature workflow engines when genuinely needed.

It should not initially become:

- A new foundation model.
- A paid API proxy.
- A clone of every agent framework.
- A collection of hundreds of bundled agents.
- A full ChatGPT competitor.
- A mandatory cloud service.
- An automatic installer that trusts every GitHub repository.

The key product distinction is that Make It Ezy is a **capability decision and orchestration layer**, not a repository that merely accumulates skills.

---

# 3. Terminology: keep the concepts separate

Do not use “agent,” “skill,” “tool,” and “workflow” interchangeably.

| Concept | Meaning | Example |
|---|---|---|
| **Specialist** | Logical domain role | Video editor, structural engineer, researcher |
| **Capability** | A task the system can perform | Captioning, load calculation, code review |
| **Skill** | Reusable instructions, methods, and domain knowledge | UI design skill, TDD workflow |
| **Tool** | Software/API that performs an action | FFmpeg, browser, GitHub, CAD tool |
| **Workflow** | Ordered or conditional steps | Research → draft → fact-check → edit |
| **Agent runtime** | Environment that executes agent instructions and tool calls | Claude Code, Codex, Cursor, an agent framework |
| **Model provider** | Source of model inference | Anthropic, OpenAI, Google, Ollama |

A specialist is a logical role. It does not necessarily need its own model, process, or autonomous agent. Prefer one capable agent with the right instructions and tools unless multiple agents demonstrably improve the outcome.

---

# 4. Conceptual architecture

```text
                         USER REQUEST
                              |
                              v
                  PROJECT / ENVIRONMENT ANALYZER
                              |
                              v
                       TASK CLASSIFIER
                              |
                              v
                      SPECIALIST SELECTOR
                              |
                              v
                      CAPABILITY PLANNER
                              |
                +-------------+-------------+
                |             |             |
                v             v             v
           SKILL REGISTRY  TOOL REGISTRY  WORKFLOW CATALOG
                |             |             |
                +-------------+-------------+
                              |
                              v
                       DECISION ENGINE
                              |
                              v
                       RISK / PERMISSIONS
                              |
                              v
                       EXECUTION ADAPTER
                              |
              +---------------+---------------+
              |               |               |
          Claude Code        Codex           Cursor
              |               |               |
              +---------------+---------------+
                              |
                              v
                         VERIFICATION
                              |
                              v
                         FINAL RESULT
```

This is a conceptual architecture, not a mandate to create a package for every box. Derive the actual architecture from the MVP and platform constraints.

## Critical design rule

The decision engine should choose the smallest viable combination of:

- Specialist definition.
- Skills.
- Tools.
- Workflow steps.
- Runtime/provider.

It should explain why it selected each item and identify alternatives or missing requirements.

---

# 5. Research inventory and reference directory

The following are references gathered from videos, screenshots, discussions, and direct repository links supplied by the project owner. They are **research candidates, not approved dependencies**.

Repository identities and descriptions below are initial identification notes. Re-verify live details, licenses, maintenance, and compatibility before implementation.

## 5.1 Skill discovery and catalogs

| Project | Official reference | Initial role |
|---|---|---|
| Vercel Skills CLI | https://github.com/vercel-labs/skills | Discover/install compatible agent skills |
| `find-skills` | https://github.com/vercel-labs/skills/tree/main/skills/find-skills | Skill discovery workflow |
| skills.sh | https://skills.sh/ | Agent Skills directory |
| skills.sh API docs | https://skills.sh/docs/api | Investigate catalog/search metadata API |
| Awesome Agent Skills (VoltAgent) | https://github.com/VoltAgent/awesome-agent-skills | Curated skills catalog |
| Anthropic Skills | https://github.com/anthropics/skills | Official skill examples |
| Agent Skills specification | https://agentskills.io/ | Skill format/interoperability reference |

**Questions to answer:**

- Can Make It Ezy query skills.sh without scraping pages?
- What fields and identifiers does its API provide?
- Are hashes, source commits, and update signals available?
- How do catalog entries map to actual Git repositories and skill paths?
- How should the system normalize different skill formats?
- How can the system detect duplicates across catalogs?
- What are the terms, rate limits, and availability guarantees?

Do not assume a catalog's popularity count measures quality or safety.

## 5.2 Agent collections and specialist catalogs

| Project | Official reference | Initial role |
|---|---|---|
| 500 AI Agents Projects | https://github.com/ashishpatel26/500-AI-Agents-Projects | Examples of agents across domains/frameworks |
| Agency Agents | https://github.com/msitarzewski/agency-agents | Role-based specialist definitions and workflows |
| Awesome Harness Engineering | https://github.com/ai-boost/awesome-harness-engineering | Agent harness engineering patterns |
| Scientific Agent Skills | https://github.com/K-Dense-AI/scientific-agent-skills | Scientific research skills |
| Diagram Design | https://github.com/cathrynlavery/diagram-design | Diagram-generation skill |
| Anthropic Cybersecurity Skills | https://github.com/mukul975/Anthropic-Cybersecurity-Skills | Community cybersecurity skill collection |

**Research questions:**

- Which entries are actual executable agents versus prompt/role definitions?
- What schema do specialist definitions use?
- Can they be represented in a neutral Make It Ezy specialist schema?
- How much overlap exists between catalogs?
- Are there engineering, creative, science, legal, and other domain specialists?
- What safeguards are needed for high-risk domains?

Do not equate an agent persona with a verified professional capability.

## 5.3 Orchestration and development workflows

| Project | Official reference | Initial role |
|---|---|---|
| Ruflo | https://github.com/ruvnet/ruflo | Agent orchestration/swarm system; verify current architecture |
| Superpowers | https://github.com/obra/superpowers | Structured software-development skills/workflows |
| LangGraph | https://github.com/langchain-ai/langgraph | Stateful agent workflows |
| CrewAI | https://github.com/crewAIInc/crewAI | Role-based multi-agent framework |
| AutoGen | https://github.com/microsoft/autogen | Multi-agent collaboration framework |
| Agno | https://github.com/agno-agi/agno | Agent framework |
| LlamaIndex | https://github.com/run-llama/llama_index | Data/document retrieval and agent workflows |
| GSD | https://github.com/gsd-build/get-shit-done | Spec-driven AI development workflow |
| BMAD Method | https://github.com/bmad-code-org/BMAD-METHOD | AI-assisted agile development methodology |
| gstack | https://github.com/garrytan/gstack | Coding-agent workflow/tooling |

Do not make all frameworks dependencies. Compare them and select an execution strategy only when the use case requires it.

## 5.4 Codebase understanding and memory

| Project | Official reference | Initial role |
|---|---|---|
| Graphify | https://github.com/Graphify-Labs/graphify | Codebase knowledge graph |
| Understand Anything | https://github.com/Egonex-AI/Understand-Anything | Codebase visualization/understanding |
| Claude-Mem | https://github.com/thedotmack/claude-mem | Persistent Claude Code memory |
| OpenViking | https://github.com/volcengine/OpenViking | Agent context/database infrastructure |
| Agent Memory | https://github.com/rohitg00/agentmemory | Persistent agent memory reference |

Compare these systems rather than combining them all. Evaluate whether plain files, SQLite, search indexes, graph structures, or vector retrieval solve the actual requirements.

## 5.5 Browser automation and research

| Project | Official reference | Initial role |
|---|---|---|
| Browser Use | https://github.com/browser-use/browser-use | Browser automation for agents |
| Agent Browser | https://github.com/vercel-labs/agent-browser | Browser automation for coding agents |
| Agent Reach | https://github.com/Panniantong/Agent-Reach | External research/platform access; verify supported sources |

Browser access is a tool capability, not a skill by itself. Consider authentication, user consent, data handling, and website terms.

## 5.6 Security and simplification

| Project | Official reference | Initial role |
|---|---|---|
| Strix | https://github.com/AiSecurityServices/strix | AI-assisted security testing |
| Ponytail | https://github.com/DietrichGebert/ponytail | Simplification-oriented coding skill; verify exact scope |
| Impeccable | https://github.com/pbakaus/impeccable | UI/design improvement skill |

Strix should only be used for authorized security testing. Ponytail's simplification principle should be considered across the project, not necessarily as a mandatory runtime dependency.

## 5.7 UI/UX and creative tooling

| Project | Official reference | Initial role |
|---|---|---|
| UI UX Pro Max | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill | UI/UX design skill |
| 21st.dev | https://21st.dev/ | UI component ecosystem |
| Taste Skill | https://github.com/Leonxlnx/taste-skill | Frontend design direction and browser-based visual review |
| Taste Skill website | https://tasteskill.dev/ | Project information |
| TasteCode | https://tastecode.dev/ | Related desktop product; evaluate separately |
| HyperFrames | https://github.com/heygen-com/hyperframes | HTML-to-video workflow |
| VoiceStudio | https://github.com/debpalash/voicestudio | Voice/audio workflow candidate; verify project status |
| OpenHiggsfield | https://github.com/thehiggsfieldai/OpenHiggsfield | Open-source video/story studio candidate; verify status |
| Cap | https://github.com/CapSoftware/Cap | Screen recording/editing |

Do not confuse a creative application with an agent skill. A creative app may be an external tool or integration rather than something Make It Ezy should install.

## 5.8 SEO, reverse engineering, and other specialist tools

| Project | Official reference | Initial role |
|---|---|---|
| OpenSEO | https://github.com/every-app/open-seo | SEO platform, MCP server, and agent skills |
| OpenSEO website | https://openseo.so/ | Product/docs |
| REA — Reverse Engineer Anything | https://github.com/morluto/rea | Reverse-engineering MCP and workflows |
| REA website | https://rea.tools/ | Product/docs |
| REA npm package | https://www.npmjs.com/package/rea-agents | Distribution |
| OpenSEO DataForSEO dependency | https://dataforseo.com/ | External SEO data provider |

Important cost notes:

- OpenSEO can be self-hosted, but actual SEO data requires a DataForSEO API key and usage may cost money.
- REA is a specialized reverse-engineering capability; some native analysis paths rely on separate tools such as Hopper, Ghidra, IDA, or Kuna.
- Do not include either in the core dependency set without a user task that needs it.

## 5.9 Other application references from earlier videos

These are examples of standalone applications or possible integrations, not necessarily agent frameworks.

| Project | Official reference | Initial role |
|---|---|---|
| AppFlowy | https://github.com/AppFlowy-IO/AppFlowy | Productivity/workspace application |
| OpenProject | https://github.com/opf/openproject | Project management |
| Chatwoot | https://github.com/chatwoot/chatwoot | Customer communication/support |
| Cal.com | https://github.com/calcom/cal.com | Scheduling |
| OpenWhisper | https://openwhisper.io/ | Transcription reference; verify exact repository/product |
| Motion Sites | https://github.com/search?q=Motion+Sites&type=repositories | Exact source from video still needs confirmation |
| Agency Agents | https://github.com/msitarzewski/agency-agents | Specialist collection (also listed above) |
| Claude Code Setup | https://github.com/search?q=Claude+Code+Setup&type=repositories | Exact project/source from video needs confirmation |

---

# 6. Additional skills named in earlier videos

These names were extracted from video frames and discussion. Some identities still need exact source verification.

| Name | Reference | Initial category / note |
|---|---|---|
| Caveman | https://github.com/search?q=Caveman+AI+skill&type=repositories | Token/context efficiency; verify exact project |
| Headroom | https://github.com/search?q=Headroom+AI+skill&type=repositories | Token/context efficiency; verify exact project |
| Ponytail | https://github.com/DietrichGebert/ponytail | Simplification |
| Impeccable | https://github.com/pbakaus/impeccable | UI/UX |
| Taste | https://github.com/Leonxlnx/taste-skill | Exact project supplied by owner |
| UI UX Pro Max | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill | UI/UX |
| Humanizer | https://github.com/search?q=Humanizer+AI+skill&type=repositories | Writing; verify exact project |
| PPT Master | https://github.com/search?q=PPT+Master+Claude+skill&type=repositories | Presentation; verify exact project |
| HyperFrames | https://github.com/heygen-com/hyperframes | Video |
| Graphify | https://github.com/Graphify-Labs/graphify | Codebase understanding |
| Understand Anything | https://github.com/Egonex-AI/Understand-Anything | Codebase understanding |
| REA | https://github.com/morluto/rea | Reverse engineering; exact project supplied by owner |
| Claude-Mem | https://github.com/thedotmack/claude-mem | Memory |
| Last30Days | https://github.com/search?q=Last30Days+AI+skill&type=repositories | Research; verify exact project |
| Marketing Skills | https://github.com/search?q=Marketing+Skills+AI+agent&type=repositories | Marketing; verify exact project |
| Superpowers | https://github.com/obra/superpowers | Development workflow |
| GSD | https://github.com/gsd-build/get-shit-done | Development workflow |
| BMAD Method | https://github.com/bmad-code-org/BMAD-METHOD | Development workflow |
| gstack | https://github.com/garrytan/gstack | Development workflow |
| Anthropic Skills | https://github.com/anthropics/skills | Agent skills |
| Matt Pocock Skills | https://github.com/mattpocock/skills | Engineering skills; verify current repository |
| Karpathy Skills | https://github.com/search?q=Karpathy+skills&type=repositories | Exact collection needs verification |
| Agency Agents | https://github.com/msitarzewski/agency-agents | Specialist catalog; exact project supplied by owner |

**Do not silently replace a search link with a guessed repository.** Find the exact source or leave it marked unverified.

---

# 7. Exact seven-repository video reference

The video reference was identified through this accompanying article:

https://www.claudecodeclub.ai/free-resources/7-github-repos-ai-agents

The seven repository references listed there are:

1. Browser Use — https://github.com/browser-use/browser-use
2. Agent Memory — https://github.com/rohitg00/agentmemory
3. Scientific Agent Skills — https://github.com/K-Dense-AI/scientific-agent-skills
4. Diagram Design — https://github.com/cathrynlavery/diagram-design
5. Anthropic Cybersecurity Skills — https://github.com/mukul975/Anthropic-Cybersecurity-Skills
6. Awesome Harness Engineering — https://github.com/ai-boost/awesome-harness-engineering
7. OpenViking — https://github.com/volcengine/OpenViking

Treat the article as an identification aid. Verify every item against its original repository.

---

# 8. Four owner-supplied repositories: verified initial notes

The project owner supplied these exact links. Their repository READMEs and LICENSE files were inspected during the conversation. The initial license check found MIT for all four. Recheck the current license and any third-party assets before redistribution.

## 8.1 OpenSEO

- Repository: https://github.com/every-app/open-seo
- Website: https://openseo.so/
- License file: https://github.com/every-app/open-seo/blob/main/LICENSE
- Initial license: MIT
- Category: SEO platform, MCP server, agent skills.

README describes:
- Keyword research.
- Rank tracking.
- Competitor insights.
- Backlinks.
- Site audits.
- AI visibility.
- MCP access for agents.
- Self-hosting with Docker or Cloudflare.

Cost caveat: SEO data requires a DataForSEO API key. Self-hosting does not make the external data free.

Initial classification: **INTEGRATE / OPTIONAL**.

## 8.2 REA — Reverse Engineer Anything

- Repository: https://github.com/morluto/rea
- Website: https://rea.tools/
- Guides: https://rea.tools/guides/
- npm: https://www.npmjs.com/package/rea-agents
- License file: https://github.com/morluto/rea/blob/main/LICENSE
- Initial license: MIT
- Category: reverse engineering, MCP, binary/application/runtime analysis.

README describes:
- Native binary inspection.
- JavaScript and Electron analysis.
- .NET assembly analysis.
- Website investigation.
- Evidence-oriented reports.
- MCP and CLI workflows.

Requirements noted in README: Node.js 22+ (specific supported patch versions are documented). Some native analysis workflows need separate tools such as Hopper, Ghidra, IDA, or Kuna.

Initial classification: **INTEGRATE / OPTIONAL**.

Potential specialist: Reverse Engineering Engineer.

## 8.3 Taste Skill

- Repository: https://github.com/Leonxlnx/taste-skill
- Website: https://tasteskill.dev/
- Related desktop product: https://tastecode.dev/
- License file: https://github.com/Leonxlnx/taste-skill/blob/main/LICENSE
- Initial license: MIT
- Category: frontend/UI design skill and visual QA.

README describes:
- Art direction.
- Design workflows based on curated site research.
- Real visual references and credited images.
- Browser-based inspection.
- Responsive checks.
- Screenshot review and iterative refinement.
- Dashboard and application UI workflows.

Requirements noted in README: Node.js 22+ and Chrome, Edge, or Chromium. The documented skill says it does not require an API key, but network access is used to find images.

Important cost caveat: README describes a build taking roughly 30–45 minutes and a few hundred thousand tokens. The skill is free to obtain, but execution can consume significant paid-model tokens.

Installation references:
- Skills CLI: https://github.com/vercel-labs/skills
- Repository install instructions: https://github.com/Leonxlnx/taste-skill

Initial classification: **INTEGRATE / OPTIONAL**, high-priority candidate for UI/UX tasks.

## 8.4 Agency Agents

- Repository: https://github.com/msitarzewski/agency-agents
- Desktop app: https://agencyagents.app/
- Desktop releases: https://github.com/msitarzewski/agency-agents-app/releases/latest
- License file: https://github.com/msitarzewski/agency-agents/blob/main/LICENSE
- Initial license: MIT
- Category: specialist/agent definition catalog.

README describes:
- Engineering, design, marketing, product and other specialist roles.
- Role-specific instructions, processes, and deliverables.
- Multi-platform conversion and installation scripts.
- Selective installation by tool, division, or agent.
- A separate desktop app for browsing/installing the roster.

Initial classification: **STUDY / INTEGRATE**, high-priority candidate for specialist catalog research.

Important: An agent persona is not proof of domain competence. Evaluate the quality of its instructions, evidence, tools, and safeguards.

---

# 9. Skill registry and update strategy

Do not copy every external skill into Make It Ezy.

Maintain a registry that points to external sources and records provenance.

Illustrative metadata:

```json
{
  "name": "example-skill",
  "source": "github",
  "repository": "owner/repository",
  "path": "skills/example",
  "version": null,
  "commit": "pinned-commit",
  "contentHash": "verified-hash",
  "license": "MIT",
  "compatibleAgents": ["claude-code", "codex", "cursor"],
  "capabilities": ["research", "analysis"]
}
```

This is a proposed schema, not a real skill record.

## Three tiers

1. **Built-in:** maintained by Make It Ezy.
2. **Registered external:** tracked from known repositories/catalogs.
3. **Dynamically discovered:** found from supported catalogs and GitHub sources.

## Update lifecycle

1. Detect that an external source changed.
2. Compare commit, release/version, or content hash.
3. Inspect changed files and metadata.
4. Identify compatibility, dependency, license, or security changes.
5. Explain the impact to the user.
6. Offer an update.
7. Apply only after approval.

Do not assume every project uses semantic versioning. Support commit pinning and hashes.

External changes must never silently modify Make It Ezy core logic.

Keep these actions separate:

- Discover.
- Inspect.
- Recommend.
- Approve.
- Install.
- Update.
- Execute.

## External content is untrusted

- Inspect installation scripts.
- Inspect dependencies and transitive dependencies.
- Check for shell commands, network access, file access, and credential handling.
- Pin versions/commits where practical.
- Require approval before installation or execution.
- Do not grant broad permissions by default.
- Preserve attribution and license notices.
- Never run a skill simply because it appears in a catalog.

---

# 10. Decision engine and example workflows

## Example A: YouTube video about sustainable farming

User request:

> “Create a YouTube video about sustainable farming.”

Potential specialist roles:
- Researcher.
- Scriptwriter.
- Video editor.

Potential capabilities:
- Topic research.
- Source evaluation.
- Scriptwriting.
- Fact-checking.
- Storyboarding.
- Asset sourcing.
- Video/audio editing.
- Caption generation.
- Rendering.

Possible workflow:

```text
Research
  -> Source verification
  -> Script draft
  -> Fact-check
  -> Storyboard
  -> Gather/create assets
  -> Edit
  -> Captions/audio
  -> Render
  -> Review
```

Potential tools include browser research, FFmpeg, and user-selected video software. Do not assume one AI tool performs every stage.

## Example B: Structural engineering calculation

User request:

> “Help me calculate a reinforced concrete beam.”

Potential specialist:
- Structural engineering assistant.

Capabilities:
- Input collection.
- Load analysis.
- Calculation.
- Applicable-code lookup.
- Independent verification.
- Report generation.

Risk: **HIGH**.

Requirements:
- Establish jurisdiction and applicable standards.
- Collect complete dimensions, material properties, support conditions, and loading.
- Clearly state assumptions and missing inputs.
- Use validated deterministic calculation methods/software where possible.
- Independently verify results.
- Require qualified professional review before construction.

Never represent an AI agent or skill as a licensed engineer or approved design.

## Decision principles

- One agent is preferable to a swarm when it can do the job.
- Use deterministic tools for calculations when appropriate.
- Do not use a model where a simple script is more reliable.
- Do not install a skill when an existing tool already provides the capability.
- Explain why each selected capability is needed.
- Identify unavailable capabilities and uncertainty honestly.

---

# 11. Risk and permission model

Every task should receive a risk assessment.

| Level | Example tasks | Default approach |
|---|---|---|
| Low | Formatting, basic writing, ordinary summarization | Minimal friction |
| Medium | Code edits, browser automation, database/file changes | Scoped permissions and verification |
| High | Security testing, financial/legal/medical decisions, structural/electrical engineering | Strong safeguards, explicit approval, independent review |

Risk should determine:
- Which tools are allowed.
- Which actions require approval.
- What verification is mandatory.
- Whether human review is necessary.
- Whether execution must be sandboxed or read-only.

Do not use a specialist label as a substitute for credentials, validated methods, or professional review.

---

# 12. Local-first memory and storage

Separate these concerns:

1. Session memory — current task state.
2. Project memory — project-specific facts and decisions.
3. Workflow memory — reusable procedures.
4. Skill registry cache — external metadata and source state.
5. Agent history — optional task history/artifacts.

Start simply:
- SQLite for structured local data.
- JSON/YAML for human-readable configuration.
- Filesystem for skills and task artifacts.
- Git for version tracking.

Only add vector or graph databases when a demonstrated retrieval requirement justifies them.

Memory should be:
- Project-isolated.
- Inspectable.
- Exportable.
- Removable.
- Protected from storing credentials/secrets.

Do not build an elaborate memory platform before the core workflow works.

---

# 13. Models, providers, and cost philosophy

Make It Ezy must not require its own paid model API.

Potential execution/provider options:
- Claude Code using supported authentication.
- Codex using supported authentication.
- Cursor using supported integration mechanisms.
- Ollama and local models.
- User-provided API keys.
- Other compatible providers.

Important distinctions:
- Make It Ezy being free does not make model inference free.
- Existing subscriptions and usage limits still apply.
- Do not bypass provider authentication or billing.
- External data services can charge independently.
- Some skills may consume large amounts of model tokens.
- Some tools may require paid APIs even when their source code is open source.

Core product goal:
- No mandatory hosted backend.
- No mandatory paid model API.
- No mandatory cloud account.
- No telemetry requirement.
- Local execution where supported.

Optional costs should be transparent and disclosed before use.

---

# 14. Future local workstation

The software should scale from an ordinary laptop to a dedicated local AI workstation without requiring an architectural rewrite.

Possible future target—not an MVP requirement:

| Component | Future target |
|---|---|
| CPU | 12–16+ cores |
| RAM | 64–128 GB |
| GPU | 16–24+ GB VRAM |
| Storage | 2–4 TB NVMe |

Potential local runtimes:
- Ollama: https://github.com/ollama/ollama
- llama.cpp: https://github.com/ggml-org/llama.cpp
- LM Studio: https://lmstudio.ai/

Keep the model runtime replaceable. Support local and remote endpoints where practical.

Do not require this hardware to build or use the initial Make It Ezy core.

---

# 15. Integration targets

Initial target environments:
- Claude Code: https://github.com/anthropics/claude-code
- Codex: https://github.com/openai/codex
- Cursor: https://cursor.com/

Potential future integrations:
- Ollama.
- MCP servers.
- Browser automation.
- Specialized domain tools.
- Other agent runtimes.

Use adapters and documented interfaces. Do not scatter platform-specific assumptions throughout the core.

For each adapter, document:
- Supported capabilities.
- Skill format support.
- Execution mechanism.
- Tool interface.
- Authentication requirements.
- Permission model.
- Known limitations.
- Tested platform/version.

Do not claim full compatibility until it has been tested.

A web interface is a future option, not an MVP requirement. The CLI/core should be useful independently.

---

# 16. Proposed repository structure

This is a proposal only. Do not create empty packages just to match this tree.

```text
make-it-ezy/
├── apps/
│   ├── cli/
│   └── web/                     # Future, not MVP
├── packages/
│   ├── core/
│   ├── decision-engine/
│   ├── project-analyzer/
│   ├── task-classifier/
│   ├── specialist-registry/
│   ├── skill-registry/
│   ├── tool-registry/
│   ├── workflow-engine/
│   ├── memory/
│   ├── provider-adapters/
│   ├── execution-adapters/
│   ├── verification/
│   └── security/
├── integrations/
│   ├── claude-code/
│   ├── codex/
│   ├── cursor/
│   └── ollama/
├── catalog/
│   ├── built-in-skills/
│   ├── specialists/
│   └── workflows/
├── docs/
│   ├── research/
│   ├── architecture/
│   ├── integrations/
│   └── security/
├── tests/
├── README.md
├── LICENSE
└── CONTRIBUTING.md
```

Choose actual package boundaries after defining the first end-to-end use case.

---

# 17. CLI experience

Possible commands:

```bash
ezy init
ezy analyze
ezy doctor
ezy discover
ezy plan
ezy run
ezy skills list
ezy skills search
ezy skills inspect
ezy skills update
ezy providers list
ezy memory inspect
```

Example interaction:

```text
$ ezy

What would you like to accomplish?

> Build a dashboard for my business.

Make It Ezy detects:
- Web application
- Frontend development
- Data visualization

Recommended capabilities:
- Project understanding
- UI/UX
- Implementation
- Testing

Available runtimes:
- Claude Code
- Codex
- Local model

Proposed workflow:
Understand -> Plan -> Build -> Test -> Review

[Review plan] [Approve] [Cancel]
```

The user should not need to understand the entire AI ecosystem to use the system.

---

# 18. Roadmap

## Phase 0 — Research and architecture

Deliver:
- Verified reference directory.
- Research inventory.
- License and dependency comparison.
- Capability taxonomy.
- Specialist schema.
- Skill/tool/workflow schema.
- Architecture diagram.
- Integration feasibility.
- Security model.
- MVP specification.

No substantial implementation until the proposed MVP is reviewed.

## Phase 1 — Minimal local core

Build only:
- CLI.
- Project/environment detection.
- Task classification.
- Small specialist registry.
- Basic capability selection.
- Configuration.
- Explainable plan output.

Do not add swarms, a hosted service, or a complex memory system.

## Phase 2 — Skill discovery

Investigate and integrate:
- skills.sh.
- Vercel Skills CLI.
- Awesome Agent Skills.
- GitHub repositories.

Implement:
- Search.
- Metadata retrieval.
- Source/commit tracking.
- Compatibility checks.
- License metadata.
- Content hashes.
- Duplicate detection.
- Recommendations.
- User-approved installation.

## Phase 3 — Decision engine

Implement:
- Task-to-specialist mapping.
- Capability selection.
- Workflow selection.
- Risk classification.
- Minimal-set selection.
- Explainable recommendations.

## Phase 4 — Execution adapters

Start with one adapter that can be tested end-to-end. Then expand to Claude Code, Codex, Cursor, and local runtimes based on feasibility.

## Phase 5 — Memory and verification

Add only what actual use cases need:
- Project memory.
- Workflow memory.
- Task history.
- Test execution.
- Review procedures.
- Security checks.

## Phase 6 — Optional web interface

Only after the local core is stable. Reuse the same core engine. Do not require Make It Ezy to pay for users' model inference.

---

# 19. Engineering rules

## Avoid AI bureaucracy

- Do not create an agent for every task.
- Do not use a swarm when one agent is enough.
- Do not install every skill.
- Do not introduce a database without a demonstrated need.
- Do not make every integration mandatory.
- Do not create abstractions solely for hypothetical future requirements.

## Ponytail / simplification principle

Before adding complexity, ask:

1. Can the existing implementation do this?
2. Can an existing tool solve it?
3. Can the workflow be simpler?
4. Can a dependency be removed?
5. Can fewer agents produce the same or better result?

Simplify without sacrificing correctness or safety.

## Security and quality

- Treat external repositories as untrusted.
- Inspect licenses, dependencies, scripts, and permissions.
- Pin dependencies where appropriate.
- Require approval for installation and sensitive actions.
- Use least privilege.
- Keep secrets outside ordinary memory.
- Test integrations.
- Document unsupported behavior.
- Measure whether multi-agent execution improves outcomes.
- Measure token cost, latency, and reliability.
- Prefer reliable results over impressive demos.

---

# 20. First assignment: exact deliverables

Before substantial coding, inspect the current repository and produce:

1. `docs/research/REFERENCE-DIRECTORY.md`
2. `docs/research/RESEARCH-INVENTORY.md`
3. `docs/research/PROJECT-COMPARISON.md`
4. `docs/architecture/ARCHITECTURE.md`
5. `docs/architecture/CAPABILITY-MODEL.md`
6. `docs/architecture/INTEGRATION-STRATEGY.md`
7. `docs/architecture/SECURITY-MODEL.md`
8. `docs/ROADMAP.md`
9. `docs/MVP-SPECIFICATION.md`

The comparison should include:
- Official URL.
- What it actually does.
- Category.
- License.
- Maintenance/activity.
- Installation and dependencies.
- Supported platforms.
- API/service costs.
- Security concerns.
- Overlap with other candidates.
- BUILD / REUSE / INTEGRATE / STUDY / OPTIONAL / IGNORE decision.
- Evidence and confidence.

Then present:
- The smallest useful MVP.
- What it explicitly excludes.
- Required dependencies.
- One end-to-end example.
- How it runs locally.
- How it connects to one coding-agent runtime.
- How discovery, approval, installation, and verification work.

**Wait for project-owner review before implementing the broader architecture.**

---

# Final product principle

Make It Ezy should make the AI ecosystem easier to use, not make the ecosystem more complicated.

The intelligence is in choosing the right capabilities—not accumulating the most capabilities.

Build something small, useful, modular, free at its core, safe, and dependable first.
