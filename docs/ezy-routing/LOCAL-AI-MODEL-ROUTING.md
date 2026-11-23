# Make It Ezy — Local AI Model Routing

**Status:** Reference / design document  
**Scope:** Local development and agent workflows  
**Location:** `docs/ezy-routing/`

## Purpose

Define a client-agnostic routing layer for local AI models so different coding agents and development workflows can use the right local model automatically.

This is **not** a Make It Ezy application feature yet. It is a reference architecture for the local AI setup.

## Supported workflows

The design should not be locked to a single client.

Examples include:

- 3C1Q workflows
- Other equivalent multi-agent/coding workflows
- Qwen Code
- OpenCode
- Hermes
- OpenClaw
- Cursor
- Claude Code
- Codex
- Other clients/agents that can use an OpenAI-compatible endpoint

## Local model roles

### Primary model — Qwen3.8:27B

Use the primary model for work that benefits from stronger reasoning, coding ability, repository understanding, or tool use.

Route here for:

- Code generation
- Code analysis
- Debugging
- Fixing issues
- Implementation
- Creating or changing files
- Refactoring
- Code review
- Architecture/design decisions
- Repository work
- Tool/agent-based development
- Migrations and upgrades
- Any task that can modify the repository
- Ambiguous requests where the router cannot safely classify the task as informational

### Smaller model

Use a smaller local model for straightforward informational work.

Examples:

- Read a file
- Explain something
- Summarize
- Find/list/search
- Straightforward factual questions
- Other read-only tasks that do not require repository changes

The smaller model is configurable; it should not be hard-coded into the architecture.

## Critical routing rule

**Any repository-changing operation must use Qwen3.8:27B.**

For example:

```text
"Read this file."
→ smaller model

"Read this file and update the repository."
→ Qwen3.8:27B
```

When uncertain, prefer Qwen3.8:27B rather than risk sending development work to the smaller model.

## Recommended architecture

```text
                    User
                     │
                     ▼
        ┌──────────────────────────┐
        │ Any compatible AI client │
        │                          │
        │ 3C1Q / Qwen Code        │
        │ OpenCode / Hermes       │
        │ OpenClaw / Cursor       │
        │ Claude Code / Codex     │
        └────────────┬─────────────┘
                     │
                     ▼
        ┌──────────────────────────┐
        │    Ezy Local Router      │
        │  OpenAI-compatible API   │
        └────────────┬─────────────┘
                     │
             ┌───────┴────────┐
             │                │
             ▼                ▼
       Small local       Qwen3.8:27B
          model            primary
             │                │
             └───────┬────────┘
                     ▼
                  Ollama
```

The router should sit between clients and Ollama rather than requiring every client to implement its own routing logic.

## Interface

Recommended local endpoint:

```text
http://127.0.0.1:11435/v1
```

Ollama remains the model runtime:

```text
http://127.0.0.1:11434/v1
```

The router should primarily change the requested `model` while preserving:

- Messages
- System prompts
- Tool definitions
- Tool calls
- Streaming
- Context
- Response shape
- Client compatibility

## Model configuration

Keep model names configurable.

Example:

```text
PRIMARY_MODEL=qwen3.8:27b
SMALL_MODEL=<configured-small-model>
OLLAMA_BASE_URL=http://127.0.0.1:11434
ROUTER_PORT=11435
```

Do not make Qwen3.8:27B or the smaller model a permanent architectural dependency. They are the current local configuration.

## Routing policy

A simple deterministic policy is preferred for the first version.

```text
Request
  │
  ├── Clearly informational/read-only?
  │       └── YES → Small model
  │
  ├── Development/reasoning/repository work?
  │       └── YES → Qwen3.8:27B
  │
  ├── Repository modification involved?
  │       └── ALWAYS → Qwen3.8:27B
  │
  └── Ambiguous?
          └── Qwen3.8:27B
```

Do **not** add another LLM just to classify requests in the first version. A classifier model adds latency, consumes resources, and introduces another failure point. Deterministic routing is easier to inspect and trust.

## Design principles

1. **Client-agnostic** — do not design around one coding agent.
2. **Model-agnostic** — model names are configuration, not architecture.
3. **Ollama-compatible** — use Ollama as the local model runtime.
4. **OpenAI-compatible interface** — maximize client compatibility.
5. **Safe default** — ambiguous work goes to the stronger model.
6. **Repository safety** — repository-changing work always uses the primary model.
7. **Thin router** — routing should not become another agent runtime.
8. **No unnecessary classifier model** — keep V1 deterministic.
9. **Preserve agent capabilities** — tools, streaming, context, and responses should pass through unchanged.
10. **Separate reference from product code** — this document describes the local development setup and should not be treated as an implemented Make It Ezy feature.

## Relationship to 3C1Q

**3C1Q** is the current shorthand for the multi-agent workflow:

```text
3C1Q
├── Claude
├── Cursor
├── Codex
└── Qwen
```

The routing layer is broader than 3C1Q. Any compatible agent or workflow can use the same local router.

