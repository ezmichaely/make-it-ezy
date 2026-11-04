# Project Comparison

Live verification: **2026-11-05** via GitHub API (`gh api repos/...`).  
Stars/pushed_at are snapshots; they measure attention/activity, not quality or safety.

## Priority comparison table

| Project | Category | Purpose | Official Source | License | Maintenance | Runtime | Cost | Security | Overlap | Decision | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Agent Skills | Standard | Portable skill format | https://agentskills.io/ | UNKNOWN — site | active ecosystem | multi-agent | varies | review install scripts | high | STUDY/INTEGRATE | high |
| Vercel Skills | Tool | Install/manage skills | https://github.com/vercel-labs/skills | MIT | active (push 2026-11-03) | Cursor/Claude/Codex/… | free CLI | untrusted skill content | high | INTEGRATE | high |
| skills.sh | Catalog | Skill directory | https://skills.sh/ | UNKNOWN — site ToS | active | — | free browse | popularity ≠ safety | high | INTEGRATE | medium |
| Anthropic Skills | Examples | Official skill samples | https://github.com/anthropics/skills | **NO_LICENSE** | active | Claude-centric | free | redistribution unclear | high | STUDY | high |
| Awesome Agent Skills | Catalog | Curated list | https://github.com/VoltAgent/awesome-agent-skills | MIT | active | multi | free | unvetted entries | medium | STUDY/OPTIONAL | high |
| Superpowers | Workflow | SD methodology via skills | https://github.com/obra/superpowers | MIT | very active | multi-harness | model tokens | skill trust | medium | STUDY/OPTIONAL | high |
| Ponytail | Workflow | Minimal-change coding skill | https://github.com/DietrichGebert/ponytail | MIT | active | multi | model tokens | low | medium | STUDY/OPTIONAL | high |
| GSD | Workflow | Spec-driven prompts | https://github.com/gsd-build/get-shit-done | MIT | **ARCHIVED** | Claude Code | model tokens | n/a | low | IGNORE | high |
| BMAD | Workflow | Agile AI method | https://github.com/bmad-code-org/BMAD-METHOD | NOASSERTION | active | multi | model tokens | review | medium | STUDY/OPTIONAL | medium |
| gstack | Workflow | Opinionated CC tooling | https://github.com/garrytan/gstack | MIT | active | Claude Code | model tokens | review | medium | STUDY/OPTIONAL | high |
| Agency Agents | Catalog | Role specialists | https://github.com/msitarzewski/agency-agents | MIT | active | multi | model tokens | persona ≠ expertise | high | STUDY/INTEGRATE | high |
| Taste | Skill | UI art direction | https://github.com/Leonxlnx/taste-skill | MIT | active | agent+browser | **high token** | network for refs | medium | INTEGRATE/OPTIONAL | high |
| UI UX Pro Max | Skill | UI/UX design intel | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill | MIT | active | agents | model tokens | review | medium | OPTIONAL | high |
| Impeccable | Skill | Design critique vocab | https://github.com/pbakaus/impeccable | Apache-2.0 | active | agents | model tokens | review | medium | OPTIONAL | high |
| OpenSEO | Tool/MCP | SEO platform | https://github.com/every-app/open-seo | MIT | active | MCP/skills | **DataForSEO $** | API keys | medium | OPTIONAL | high |
| REA | Tool/MCP | Reverse engineering | https://github.com/morluto/rea | MIT | active | MCP/CLI | tool deps | **high risk domain** | medium | OPTIONAL | high |
| Browser Use | Tool | Browser agents | https://github.com/browser-use/browser-use | MIT | active | Python | cloud optional | site ToS/auth | medium | OPTIONAL | high |
| Agent Browser | Tool | Browser CLI | https://github.com/vercel-labs/agent-browser | Apache-2.0 | active | Node agents | free CLI | site ToS | medium | OPTIONAL | high |
| Graphify | Tool/Skill | Code knowledge graph | https://github.com/Graphify-Labs/graphify | Apache-2.0 | active | Cursor/CC/… | local/LLM tokens | local-first | medium | OPTIONAL | high |
| LangGraph | Framework | Agent graphs | https://github.com/langchain-ai/langgraph | MIT | active | Python | infra | complexity | high (wrong layer) | STUDY/IGNORE core | high |
| CrewAI | Framework | Multi-agent roles | https://github.com/crewAIInc/crewAI | MIT | active | Python | infra | complexity | high (wrong layer) | STUDY/IGNORE core | high |
| Claude Code | Runtime | Coding agent | https://github.com/anthropics/claude-code | **NO_LICENSE** | active | terminal | Anthropic usage | trust Anthropic | high | INTEGRATE Phase 4 | high |
| Codex | Runtime | Coding agent | https://github.com/openai/codex | Apache-2.0 | active | terminal | OpenAI usage | trust OpenAI | high | INTEGRATE Phase 4+ | high |
| Cursor | Runtime | IDE agent | https://cursor.com/ | proprietary | active | IDE | subscription | vendor | high | INTEGRATE (now) | high |

## Evidence notes

- **GSD archived:** do not recommend as primary workflow dependency.
- **License gaps:** Anthropic Skills + Claude Code show `NO_LICENSE` via API — treat redistribution guidance as blocked until clarified.
- **Cost honesty:** Taste/OpenSEO can be “free software” with expensive inference or data APIs.
- **Installed locally for development:** Superpowers, Anthropic skills, Vercel agent-skills, find-skills, Graphify, Ponytail (see `skills-lock.json`). These are Layer A tools, not Make It Ezy runtime deps.

## Gaps still open

| Item | Status |
|---|---|
| skills.sh API field list / auth / rate limits | UNKNOWN — NEEDS VERIFICATION |
| Ruflo, AutoGen, Agno, LlamaIndex, memory tools, Strix, Cap, HyperFrames | UNKNOWN — NEEDS VERIFICATION (this pass) |
| Video-name unresolved skills (Caveman, etc.) | UNRESOLVED |
