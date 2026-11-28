# MVP Specification

**This file describes shipped product behavior. It is not a future roadmap.**

## Scope

Today: coding tasks in a repository, JS/TS first and Python next.

## Current CLI behavior

Current planning path:

`analyze → requirements → search → select → plan → handoff`

Available commands:

- `doctor`
- `analyze`
- `search`
- `inspect`
- `recommend`
- `brief`
- `brain`
- `plan`
- `next`
- `install`

### Network and local-only behavior

| Command | Default network behavior | `--local-only` |
|---|---|---|
| `doctor`, `analyze`, `brief`, `brain` | Local only | n/a |
| `search`, `recommend`, `plan`, `next` | Queries skills.sh for remote discovery; reads local project/skills | Skips skills.sh lookup |
| `inspect` | Reads local skill; fetches remote metadata by default when available | Skips remote metadata lookup |
| `install` | Resolves missing source via skills.sh lookup by default; `npx skills add` performs the approved install | Skips skills.sh source lookup; approved install still runs |

Network is the default for discovery/source resolution. `--local-only` keeps lookups local; it does not silently install or execute skills.

## Distribution

The intended public CLI package is:

```bash
npm install --global make-it-ezy
ezy --help
```

The npm package is self-contained for runtime use. `@make-it-ezy/core` remains an internal workspace package and is bundled into the CLI during the release build.

## Phase 4 — Install + adapters

Shipped:

- gated `install`;
- `install --plan` / `install --query`;
- `next` handoff;
- `skills/ezy` adapter.

Ezy does not silently install or execute external skills.

## Phase 5 — Project Capability Planner

Shipped:

- project-aware planning;
- goal + project requirements;
- minimum useful capability selection;
- no mandatory LLM;
- no mandatory Graphify;
- no Soft-C runtime.

## Phase 6 — Agent Brief

Shipped:

- `ezy brief`;
- `.ezy/brief.json`;
- untrusted brief validation;
- requirement-covering selection;
- heuristic fallback when no brief is supplied.

## Phase 7 — Project Brain

Shipped:

- `.ezy/brain.json` with machine slice and optional host-maintained `agent` slice;
- `ezy plan` / `ezy next` auto-write/update the machine slice (project summary cache) when a project root is available;
- `ezy brain` shows the brain and reports staleness (current/stale) using the existing fingerprint/age check;
- `ezy brain refresh` rewrites the machine slice from analyze;
- `ezy brain enrich` prints instructions for maintaining the agent slice;
- brain does not replace the brief or become an autonomous planner.

## Broker workflow — first slice

Shipped:

- supported coding briefs may recommend Superpowers as a contractor;
- `ezy next` can print ordered Workflow stages;
- individual skills can fill selected stages;
- uncovered work remains explicit as custom host-agent work.

Not shipped:

- generalized contractor catalog;
- automatic contractor installation;
- complete broad GitHub discovery broker;
- Ezy executing third-party skills.

## Phase 8 — Launch and Distribution

Current:

- one public npm package: `make-it-ezy`;
- global executable: `ezy`;
- internal core bundled into the CLI package;
- distribution/release quality;
- current CLI/adapter consistency;
- safe user-controlled installation;
- recommendation evidence/review-state work only where actually implemented.

## Lifecycle contracts

`packages/core/src/lifecycle.ts` contains exported contracts for intent intake, skill evaluation, composition, outcome evaluation, evidence aggregation, and improvement proposals.

These are **boundary contracts, not current CLI behavior**.

No CLI command currently uses them as the controlling lifecycle.

## Post-launch

| Phase | Status |
|---|---|
| 9 — Outcome verification | Later |
| 10 — Web UI | Later |

Soft-C, trusted-auto, mandatory Superpowers/Graphify, and a giant marketplace remain outside the current MVP.
