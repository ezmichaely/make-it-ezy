# Archived conversations — summary

> **Status:** historical context only. Not authority, not a work order.
>
> The raw chat exports that used to live in this folder were removed on 2026-11-27.
> This file preserves their durable content in one place, following the pattern set by
> [`docs/convo/README.md`](../../convo/README.md).
>
> Raw transcripts remain recoverable from git history if ever needed.

## Why the raw exports were removed

- `docs/convo/README.md` states the policy directly: *"Do not add raw conversation exports or full agent-session histories"* and conversation transcripts *"belong in the appropriate current documentation or nowhere at all."*
- The durable decisions from these conversations are already captured in
  [`docs/archive/handoff/README.md`](../handoff/README.md),
  which covers contractor direction, Superpowers vs ECC, Graphify, OmniRoute, Paperclip, Local/Home AI, and the Ezy boundary.
- The canonical audit already flagged tracked conversation exports as a repository-hygiene item.

## What each conversation contained

| Conversation | Topic | Durable value |
|---|---|---|
| `1 - Video_Summary_and_Skills` | A Facebook Reel presenting ~25 Claude Code plugins/skills, with a summary and skill-by-skill breakdown. | Background on the plugin/skill landscape. Superseded by `docs/architecture/CAPABILITY-MODEL.md`. |
| `2 - Compare_Agents_Skills_Tools` | The distinction between an agent, a skill, and a tool. | Conceptual background for Ezy's capability/skill/contractor vocabulary. |
| `3 - Multi_Agent_Group_Chat_Setup` | How to run a shared chat across Claude, Cursor, Codex and Qwen. Records the `3C` → `3C1Q` shorthand and points to local model routing. | Workflow/host shorthand only. Not a product boundary. |
| `4 - Await_GitHub_Repo` | Review of `ashishpatel26/500-AI-Agents-Projects`. | Reference material for agent-project patterns. |
| `5 - Review_Repo_Resources` | Screenshots and short videos of repo resources. | Low durable value; visual reference only. |
| `6 - Claude_context_issues` | Why Claude sometimes gives generic answers; the "flick" skill confusion. | Prompt/context hygiene notes. |
| `7 - GenAI_Layers_Explained` | A 10-layer map of the GenAI ecosystem; conclusion that Ezy does not need all layers. | Reinforces scope discipline. |
| `8 - Graphify_Plugin_Strategy` | Graphify is not free unless coding locally, so it is a poor dependency for a plugin-shaped Ezy. | Directly informed the Graphify decision in the synthesis (§3). |
| `9 - Paper_Clip_Concept` | The paperclip as a naming/branding concept: small, simple, helpful. | Branding discussion only. |
| `10 - Recommend_Kindox_Or_Finance_Tracker` | How Ezy would advise a user choosing between continuing Kindox and a finance tracker. | Example of Ezy's intended advisory behavior; about a different project. |

## Where the durable decisions live now

| Decision area | Current location |
|---|---|
| Contractor / orchestrator direction | `docs/architecture/FUTURE-ECOSYSTEM.md`, `docs/PRODUCT-DIRECTION.md` |
| Superpowers vs ECC | `docs/architecture/CAPABILITY-MODEL.md`, synthesis §2 |
| Graphify | synthesis §3 |
| OmniRoute | synthesis §4 |
| Paperclip and agent runtimes | synthesis §5 |
| Local / Home AI | synthesis §6, `docs/architecture/FUTURE-ECOSYSTEM.md` |
| Ezy boundary (decide vs execute) | `AGENTS.md`, `docs/HOW-IT-WORKS.md` |
| Conversation-level synthesis | `docs/archive/handoff/README.md` |

## Rule

Do not re-add raw conversation exports here. If a durable point needs preserving, add it to
[`docs/convo/README.md`](../../convo/README.md) or the relevant authority, not as a transcript.
