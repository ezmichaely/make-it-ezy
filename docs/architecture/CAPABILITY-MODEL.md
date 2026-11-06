# Capability Model

Do not collapse everything into “agent.”

| Concept | Meaning | Product status |
|---|---|---|
| Specialist | Logical domain role | Schema later; Agency Agents = STUDY |
| Capability | Task that must be done | `ezy plan` / `ezy next` — requirements from the agent brief (Phase 6), heuristic fallback otherwise |
| Skill | Reusable `SKILL.md` knowledge/scripts | Discovery + gated install; Agent Skills format |
| Tool | Software that acts (CLI, MCP, FFmpeg) | Optional INTEGRATE |
| Workflow | Ordered process | Superpowers/BMAD/gstack = STUDY/OPTIONAL |
| Runtime | Claude Code / Codex / Cursor / … | Adapter #0 files; adapter #1 `skills/ezy` |
| Model provider | Anthropic / OpenAI / Ollama / … | User-owned; never Make It Ezy-mandated |

## Domains

The model is domain-neutral; the product today covers **coding tasks** only. Domains are added one at a time — see [`../ROADMAP.md` → Scope](../ROADMAP.md).

## Minimum useful composition

Choose the smallest set of specialist + skills + tools + workflow + runtime that can achieve the outcome. Explain inclusions and exclusions. Same-name skills from different sources collapse to one pick (best score / installs / local).

## Format stance

Understand **Agent Skills**. Treat Superpowers as one workflow methodology that uses skills — not a competing standard and not a required dependency.

Product adapter skill: `skills/ezy` — run CLI → gated install → continue building in the host runtime.
