# Capability Model

Do not collapse everything into “agent.”

| Concept | Meaning | Product status |
|---|---|---|
| Specialist | Logical domain role | Schema later; Agency Agents = STUDY |
| Capability | Task that must be done | `ezy plan` / `ezy next` — requirements from the agent brief (Phase 6), heuristic fallback otherwise |
| Skill | Reusable `SKILL.md` knowledge/scripts | Discovery + gated install; Agent Skills format |
| Tool | Software that acts (CLI, MCP, FFmpeg) | Optional INTEGRATE |
| Workflow | Ordered process | Superpowers = shipped first-slice contractor (optional, not mandatory); BMAD/gstack = STUDY/OPTIONAL |
| Runtime | Claude Code / Codex / Cursor / … | Adapter #0 files; adapter #1 `skills/ezy` |
| Model provider | Anthropic / OpenAI / Ollama / … | User-owned; never Make It Ezy-mandated |

## Domains

The model is domain-neutral; the product today covers **coding tasks** only. Domains are added one at a time — see [`../ROADMAP.md` → Scope](../ROADMAP.md).

## Lifecycle roles

Ezy's internal lifecycle is role-based rather than provider-based:

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

These are decision roles, not mandatory built-in agents. External providers may fill a role without becoming mandatory Ezy dependencies.

The stable internal lifecycle contracts live in `packages/core/src/lifecycle-types.ts` and `packages/core/src/lifecycle.ts`. They intentionally do not replace `SKILL.md` or host-agent protocols. They are currently boundary contracts: discovery/planning still use the existing planner/selector path, and full outcome verification remains Phase 9.

## Minimum useful composition

Choose the smallest set of specialist + skills + tools + workflow + runtime that can achieve the outcome. Explain inclusions and exclusions. Same-name skills from different sources collapse to one pick (best score / installs / local).

## Format stance

Understand **Agent Skills**. Treat Superpowers as one workflow methodology that uses skills — not a competing standard and not a required dependency.

Product adapter skill: `skills/ezy` — run CLI → gated install → continue building in the host runtime.
