# Reference Directory

Verified against GitHub API on **2026-11-05** unless marked otherwise.  
Source of truth for product intent: `docs/handoff/MAKE-IT-EZY-CANONICAL-HANDOFF.md`.

License / activity fields below are live API snapshots. Re-check before integration.

## Skills / catalogs

| Name | Official URL | License | Last push | Stars | Notes |
|---|---|---|---|---|---|
| Vercel Skills CLI | https://github.com/vercel-labs/skills | MIT | 2026-11-03 | ~38k | `npx skills`; skills.sh directory |
| skills.sh | https://skills.sh/ | — | — | — | Directory; API docs at /docs/api (redirecting — recheck client) |
| Agent Skills spec | https://agentskills.io/ | — | — | — | Format/interop site |
| Anthropic Skills | https://github.com/anthropics/skills | **NO_LICENSE** | 2026-10-28 | ~187k | Official examples; license gap |
| Awesome Agent Skills | https://github.com/VoltAgent/awesome-agent-skills | MIT | 2026-11-02 | ~37k | Curated catalog |

## Workflow methodologies

| Name | Official URL | License | Last push | Stars | Notes |
|---|---|---|---|---|---|
| Superpowers | https://github.com/obra/superpowers | MIT | 2026-11-03 | ~312k | Dev methodology via skills; **not** a product runtime dep |
| GSD | https://github.com/gsd-build/get-shit-done | MIT | 2026-05-31 | ~64k | **ARCHIVED** |
| BMAD Method | https://github.com/bmad-code-org/BMAD-METHOD | NOASSERTION | 2026-11-03 | ~55k | Active; verify license text |
| gstack | https://github.com/garrytan/gstack | MIT | 2026-11-04 | ~139k | Opinionated Claude Code tooling pack |

## Specialist catalogs

| Name | Official URL | License | Last push | Stars | Notes |
|---|---|---|---|---|---|
| Agency Agents | https://github.com/msitarzewski/agency-agents | MIT | 2026-10-25 | ~166k | Role personas ≠ competence |

## UI / design skills

| Name | Official URL | License | Last push | Stars | Notes |
|---|---|---|---|---|---|
| Taste | https://github.com/Leonxlnx/taste-skill | MIT | 2026-11-04 | ~110k | High-priority UI optional |
| UI UX Pro Max | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill | MIT | 2026-11-04 | ~145k | Overlaps Taste |
| Impeccable | https://github.com/pbakaus/impeccable | Apache-2.0 | 2026-11-04 | ~103k | Design vocabulary / critique |

## Domain optional

| Name | Official URL | License | Last push | Stars | Notes |
|---|---|---|---|---|---|
| OpenSEO | https://github.com/every-app/open-seo | MIT | 2026-11-04 | ~26k | DataForSEO costs possible |
| REA | https://github.com/morluto/rea | MIT | 2026-11-04 | ~430k | High-sensitivity domain |

## Browser / code understanding / simplification

| Name | Official URL | License | Last push | Stars | Notes |
|---|---|---|---|---|---|
| Browser Use | https://github.com/browser-use/browser-use | MIT | 2026-11-02 | ~120k | Python browser agents |
| Agent Browser | https://github.com/vercel-labs/agent-browser | Apache-2.0 | 2026-11-04 | ~46k | Browser CLI for agents |
| Graphify | https://github.com/Graphify-Labs/graphify | Apache-2.0 | 2026-11-03 | ~142k | Knowledge graph skill/tool |
| Ponytail | https://github.com/DietrichGebert/ponytail | MIT | 2026-10-29 | ~184k | Simplification skill (dev methodology) |

## Orchestration (study / avoid as core deps)

| Name | Official URL | License | Last push | Stars | Notes |
|---|---|---|---|---|---|
| LangGraph | https://github.com/langchain-ai/langgraph | MIT | 2026-11-04 | ~44k | STUDY / IGNORE for core |
| CrewAI | https://github.com/crewAIInc/crewAI | MIT | 2026-11-04 | ~60k | STUDY / IGNORE for core |

## Target runtimes

| Name | Official URL | License | Last push | Stars | Notes |
|---|---|---|---|---|---|
| Claude Code | https://github.com/anthropics/claude-code | **NO_LICENSE** | 2026-11-04 | ~155k | Primary adapter candidate |
| Codex | https://github.com/openai/codex | Apache-2.0 | 2026-11-04 | ~133k | Adapter candidate |
| Cursor | https://cursor.com/ | proprietary product | — | — | Current build harness |

## Unresolved (do not invent)

| Name | Status |
|---|---|
| Caveman / Headroom / Humanizer / PPT Master / Last30Days / Marketing Skills / Karpathy Skills | UNRESOLVED — requires verification |
| Matt Pocock Skills | https://github.com/mattpocock/skills — recheck current |
| OpenWhisper / Motion Sites / Claude Code Setup | UNRESOLVED — requires verification |
| 500 AI Agents Projects | https://github.com/ashishpatel26/500-AI-Agents-Projects — not re-fetched this pass |
| Ruflo / AutoGen / Agno / LlamaIndex / Understand Anything / Claude-Mem / OpenViking / Agent Memory / Agent Reach / Strix / Cap / HyperFrames | Listed in master handoff; **UNKNOWN — NEEDS VERIFICATION** for live license/activity this pass |

## Local install evidence (this repo, 2026-11-05)

Via `npx skills` into `.agents/skills` (Cursor): **52 skills**, including Superpowers pack, Anthropic skills, Vercel agent-skills, find-skills, Graphify, Ponytail suite. See `skills-lock.json`.
