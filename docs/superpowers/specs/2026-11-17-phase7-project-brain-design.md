# Phase 7 — Project Brain design

**Status:** shipped (2026-11-17; hybrid B on `feat/phase7-project-brain` / merge to `main`)  
**Supersedes:** [`2026-11-06-phase6-project-brain-design.md`](./2026-11-06-phase6-project-brain-design.md)  
**Approach:** **B — hybrid** (CLI machine slice + agent skill slice; mirrors `brief` pattern)

## Intent

Persist **small, local project knowledge** across sessions: **Ezy writes trusted facts from analyze/plan**; the **host agent** (via the **`ezy` skill** and optional **Graphify**) maintains labeled, sourced project notes — without a repo dump, database, or LLM inside the CLI.

## Why (smallest success case)

**Today:** Every `plan` / `next` re-runs `analyzeProject` and discards the summary between sessions.

**v1 success:**

1. After `ezy plan`, `.ezy/brain.json` has a **machine** `project` + `lastPlan` block.
2. `ezy brain` shows that cache; `ezy brain enrich` prints instructions (like `ezy brief`) for the agent to add/update an optional **`agent`** block.
3. Next plan **merges**: CLI refreshes machine fields; **preserves** a valid existing `agent` block.

## Product fit (why hybrid)

| Layer | Owner | Same pattern as |
|--------|--------|-----------------|
| Machine slice | Ezy CLI (deterministic) | `analyze` + plan output |
| Agent slice | Host agent + [`skills/ezy/SKILL.md`](../../../skills/ezy/SKILL.md) | `ezy brief` → `.ezy/brief.json` |
| Deep navigation | Optional **Graphify** skill (installed locally) | Ezy recommends; agent runs `/graphify` — not embedded in CLI |

Ezy does **not** reimplement Graphify or a memory marketplace; it **composes** skills and holds a **thin JSON contract**.

## Goals

- Store brain at `<projectRoot>/.ezy/brain.json`.
- Refresh **machine** fields from `plan` / `next` / `ezy brain refresh`.
- `ezy brain` (show), `ezy brain refresh` (machine only), `ezy brain enrich` (print agent schema + trust rules).
- Validate optional `agent` block on load (shape only; no truth verification — same as brief).
- CLI writes **merge** with existing file: keep valid `agent` and `lastPlan` when rules say so.
- Extend **`skills/ezy`**: when to read brain, when to enrich, when Graphify is worth it.
- No LLM in CLI; no new runtime dependencies.
- Size: machine slice typically **≤ 1.5 KB**; whole file soft cap **≤ 8 KB** (refuse CLI write if over).

## Non-goals

- Phase 8 verification.
- Replacing `.ezy/brief.json`.
- Graphify as mandatory product dependency or storing graph JSON inside brain.
- Sync services, team-default shared brain, Soft-C, Web UI.

## Anti-goals

- Secrets, env values, brief `research` bodies, or repo dumps in brain.
- Brain overrides `analyzeProject` when fingerprint disagrees.
- Ezy executing vendored skill instructions during `plan`.
- Silent memory (always inspectable via `ezy brain`).

## Brief vs brain

| | `.ezy/brief.json` | `.ezy/brain.json` |
|--|-------------------|-------------------|
| Scope | One **outcome** | **Project** across sessions |
| Machine author | — | Ezy CLI |
| Agent author | Host agent (`ezy brief`) | Host agent (`ezy brain enrich` flow) |
| Drives `plan`? | Yes (`--brief`) | **No** in v1 (context for agent only) |
| Graphify | Per brief exclusion | Optional `agent.graphify` hint + skill workflow |

## Approaches

| Approach | Tradeoff | Decision |
|----------|----------|----------|
| A. CLI-only cache | Simple; ignores skill ecosystem | Superseded |
| **B. Hybrid (machine + agent skill)** | Brief-shaped; reuses Graphify optionally | **Ship v1** |
| C. Graphify-only brain | Heavy; poor 3 KB inspectability | Rejected |
| D. Rich memory in core | Trust + scope creep | Rejected |

## Behavior — machine slice (CLI)

1. No `projectRoot` → no brain I/O (unchanged).
2. **Fingerprint:** SHA-256 of `package.json` bytes (or empty) + sorted `.agents/skills` directory names.
3. On `planOutcome` end: load existing brain if any → build new `project`, `lastPlan`, `fingerprint`, `updatedAt` → **preserve** existing valid `agent` → save.
4. **`ezy brain refresh`:** update machine `project` + fingerprint; **preserve** `agent` and `lastPlan`.
5. Note on plan when written: e.g. `Cached project summary at .ezy/brain.json`.
6. Invalid file: machine path may rewrite on next plan; invalid `agent` omitted from merge with warning.

## Behavior — agent slice (host agent)

1. After first plan (or when user asks), agent runs `ezy brain enrich` and follows printed schema.
2. Agent may set `agent.graphify.recommended` and run Graphify per **installed** `graphify` skill — Ezy does not run it.
3. Updates: read `.ezy/brain.json`, edit only `agent`, run validation by re-loading (future: `ezy brain validate` optional; v1: enrich instructions + tests for `parseAgentSlice`).
4. Trust: every `decisions` / `conventions` / `rejectedSkills` entry must have `why`; `source` nullable string (URL or path), max lengths like brief.

## JSON shape (version 1)

```json
{
  "version": 1,
  "updatedAt": "2026-11-17T12:00:00.000Z",
  "fingerprint": "hex",
  "project": {
    "projectRoot": "/abs/path",
    "packageName": "…",
    "language": "…",
    "frameworks": ["…"],
    "packageManager": "pnpm",
    "localSkills": ["…"]
  },
  "lastPlan": {
    "outcome": "…",
    "requirements": ["label1"],
    "recommended": ["skill-a"],
    "at": "2026-11-17T12:00:00.000Z"
  },
  "agent": {
    "updatedAt": "2026-11-17T13:00:00.000Z",
    "decisions": [{ "what": "…", "why": "…", "source": "docs/ROADMAP.md" }],
    "conventions": [{ "label": "…", "detail": "…", "source": null }],
    "rejectedSkills": [{ "name": "…", "why": "…", "source": null }],
    "graphify": {
      "recommended": true,
      "note": "Cross-package planner change",
      "outDir": "graphify-out"
    }
  }
}
```

`agent` is optional. Lists: 0–10 items each; strings ≤ 200 chars after sanitize (reuse brief sanitizer patterns).

## Touchpoints

- New: `packages/core/src/brain-types.ts`, `brain.ts`, `brain.test.ts` (fingerprint, merge-save, `parseAgentSlice`, `formatBrainEnrichInstructions`)
- Modify: `plan.ts`, `apps/cli/src/index.ts` (`brain`, `brain refresh`, `brain enrich`)
- Modify: [`skills/ezy/SKILL.md`](../../../skills/ezy/SKILL.md) — brain + Graphify subsection (Task 6)
- Docs: `MVP-SPECIFICATION.md`, `ARCHITECTURE.md`, `HOW-IT-WORKS.md` (two-slice model)
- No new vendored skill in v1; optional later: promote a verified memory skill via `find-skills`

## Success criteria

- Plan creates/updates machine slice; valid `agent` survives refresh.
- `ezy brain enrich` output matches schema agents can follow.
- `skills/ezy` documents brain step in procedure (after plan or session start on returning project).
- `pnpm check:ci` green.

## Spec lock

1. **Hybrid B** for Phase 7 v1.
2. Analyze remains truth for `project`; agent slice never changes plan inputs.
3. Graphify via **skill only**, not CLI runtime.