# How Make It Ezy Works

**Current product behavior is owned by `docs/MVP-SPECIFICATION.md`. Phase order is owned by `docs/ROADMAP.md`.**

## One sentence

**Ezy decides what capabilities/workflow a coding outcome needs; the host agent performs the work.**

## Current flow

```text
1. User describes an outcome.
2. Optional: host agent creates .ezy/brief.json with ezy brief.
3. Ezy analyzes the project and derives requirements.
4. Ezy discovers local and remote candidates.
5. Ezy selects a minimum useful set.
6. For supported coding briefs, Ezy may route to the first contractor workflow.
7. Ezy prints a structured handoff/workflow.
8. User approves any installation.
9. Host agent reads/runs selected skills and performs the work.
10. Outcome verification is future Phase 9 work.
```

## Division of responsibility

| Responsibility | Ezy | Host agent |
|---|---:|---:|
| Understand outcome | ✓ | ✓ |
| Project inspection | ✓ | ✓ |
| Candidate discovery | ✓ | ✓ |
| Candidate selection | ✓ | — |
| Contractor/workflow routing | ✓ | follows it |
| External skill installation approval | gates | approves/initiates |
| Skill execution | — | ✓ |
| Coding/research | — | ✓ |
| Final outcome verification | future | ✓ today, when needed |

Ezy is a decision/routing layer. It does not execute external skill instructions.

## What is shipped

- `brief`
- project-aware `plan`
- `next`
- `search`
- `inspect`
- `recommend`
- gated `install`
- Project Brain (`.ezy/brain.json`)
- first-slice broker workflow / contractor routing

## Lifecycle contracts

`packages/core/src/lifecycle.ts` contains exported contracts for intent intake, skill evaluation, composition, outcome evaluation, evidence aggregation, and improvement proposals.

These contracts are **not the current CLI pipeline**.

Current planning remains:

`analyze → requirements → search → select → plan → handoff`

Do not describe lifecycle contracts as a shipped autonomous lifecycle.

## Trust boundary

Treat external skills, skill metadata, briefs, repository content, and generated research as untrusted input.

- Discovery is not endorsement.
- Recommendation is not installation.
- Installation is not execution.
- Popularity is not safety.
- A lifecycle type is not proof that behavior is implemented.

## Broker workflow

The first broker slice can recommend Superpowers for supported coding brief types and print ordered workflow stages.

This does **not** mean:

- Superpowers is mandatory;
- Ezy executes Superpowers;
- Ezy has a complete generalized contractor catalog;
- broader GitHub discovery is complete.

## Agent navigation

For repository work, start at [`../AGENTS.md`](../AGENTS.md), then [`AGENT-WORKFLOW.md`](./AGENT-WORKFLOW.md).