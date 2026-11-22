# Decision: Git as Shared Memory Across 3C Agents

**Date:** 2026-11-23
**Status:** Accepted direction; implementation not yet specified

## Decision

Make It Ezy should treat the Git repository as the durable shared-memory boundary between our conversations and the 3C coding agents: Claude, Cursor, and Codex.

Important knowledge from conversations should be distilled into durable repository artifacts so different agents can continue the work without requiring access to every private conversation transcript.

## Why

Raw conversation history is useful for thinking and discovery, but it is noisy, contains superseded ideas, and is not a reliable implementation interface for coding agents. The repo can provide a stable, reviewable, versioned source of truth.

The goal is continuity across agents and sessions without requiring Ez to repeatedly copy/paste conversation context.

## Intended model

```
Conversations
    ↓
Extract / synthesize important knowledge
    ↓
Git repository
    ├── architecture/  → what Ezy is
    ├── decisions/    → why it is this way
    └── handoff/      → what the next agent should do
    ↓
Claude / Cursor / Codex
```

## Important boundary

This decision does **not** mean that Ezy should immediately ingest, index, or expose every conversation transcript. The preferred direction is structured, durable knowledge rather than a giant raw-chat archive.

Any future conversation-memory implementation must first establish a concrete need, trust/privacy boundary, retention model, and retrieval contract.

## Non-goals

- Do not make raw ChatGPT conversation access a mandatory dependency for coding agents.
- Do not build a vector database merely to store conversation history.
- Do not automatically treat every conversational idea as an approved product decision.
- Do not silently promote obsolete or speculative discussion into architecture.
- Do not turn Ezy into a generic chat-history platform without a demonstrated need.

## Relationship to existing documentation

The current shared-memory contract is documentation-first:

1. **Architecture** — current system boundaries.
2. **Decisions** — durable choices and their rationale.
3. **Handoff** — actionable implementation context.
4. **Historical conversations/research** — useful evidence, but lowest precedence.

Future implementation work should preserve this precedence model.
