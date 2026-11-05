# Phase 4 `ezy next` Handoff Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `ezy next "<outcome>"` that prints a checklist + paste-ready agent prompt from a plan, and reprint that handoff after `ezy install --plan` / `--query`.

**Architecture:** Core `buildHandoff` calls `planOutcome`, enriches each recommended/optional item with install path via `isSkillInstalledLocally` + project skills dir, and builds checklist + prompt strings. CLI wires `next` and appends `formatHandoff` after successful plan/query installs. No agent driving, no auto-install, no LLM.

**Tech Stack:** TypeScript, pnpm workspace, Vitest (no new deps).

**Spec:** `docs/superpowers/specs/2026-11-05-phase4-handoff-design.md`

## Global Constraints

- Never installs or executes skills from `ezy next`
- No LLM / embeddings; reuse `planOutcome` heuristics
- No new runtime dependencies
- Prompt must not dump SKILL.md bodies
- Thin trust only: reuse plan item `reason`; mark installed vs not
- `--local-only` on `next` matches plan/search

## Review Focus

- Empty outcome → CLI usage exit 1; core empty report with guidance note
- Missing recommended skills → checklist lists `ezy install <name>`; prompt still printed
- Already-installed recommended → checklist skips install for that name; prompt includes local path under `.agents/skills/<name>`
- Plain `ezy install <skill>` (no `--plan`/`--query`) → no handoff block; still suggests inspect / `ezy next` only in static Next lines
- `ezy next` never calls `runInstall` / spawn

---

### Task 1: Core `buildHandoff` + format

**Files:**
- Create: `packages/core/src/handoff-types.ts`
- Create: `packages/core/src/handoff.ts`
- Create: `packages/core/src/handoff.test.ts`
- Modify: `packages/core/src/format.ts` — add `formatHandoff`; update `formatPlan` / `formatInstallResult` Next lines
- Modify: `packages/core/src/index.ts` — export handoff API

**Interfaces:**
- Consumes: `planOutcome(outcome, SearchOptions)`, `isSkillInstalledLocally(name, cwd)`, `findProjectRoot(cwd)`
- Produces:
  - `HandoffSkill { name: string, reason: string, installed: boolean, path: string | null, bucket: "recommended" | "optional" }`
  - `HandoffReport { outcome: string, capabilities: string[], skills: HandoffSkill[], checklist: string[], prompt: string, notes: string[] }`
  - `buildHandoff(outcome: string, options?: SearchOptions & { cwd?: string }): Promise<HandoffReport>`
  - `formatHandoff(report: HandoffReport): string`

- [ ] **Step 1: Write failing tests** in `handoff.test.ts`
  - local fixture outcome that plans to a known local skill (e.g. query matching installed `ponytail` via `--local-only` cwd=repo) → that skill `installed: true`, `path` ends with `.agents/skills/<name>`, checklist has a “paste the prompt” step and **no** `ezy install` line for that skill
  - force a not-installed recommended name (mock `planOutcome` or temp cwd with empty `.agents/skills`) → checklist contains `ezy install <name>`; `prompt` still non-empty and includes the outcome text
  - empty outcome → empty skills/checklist, notes tell user to provide an outcome; `prompt` empty or guidance-only
  - `prompt` must include exact phrases: `Outcome:`, `read each SKILL.md`, `do not invent skills`; must **not** contain raw frontmatter like `---` skill body dumps
  - assert notes say handoff does not install or run skills

- [ ] **Step 2: Run** `pnpm exec vitest run packages/core/src/handoff.test.ts` — expect FAIL

- [ ] **Step 3: Implement** types, `buildHandoff`, `formatHandoff`, exports; update Next copy in `formatPlan` / `formatInstallResult`
  - `buildHandoff`: `plan = await planOutcome(...)`; map `recommended` then `optional` into `HandoffSkill` (`path = join(projectRoot, ".agents/skills", name)` when installed else `null`)
  - Checklist order: one `ezy install <name>` per **missing recommended** only; then `Paste the prompt below into your agent`; if all recommended installed, skip install lines
  - Prompt body (imperative, short) must include: outcome; recommended skills with path or `(not installed)`; optional skills as “only if needed”; lines equivalent to “Follow each skill’s SKILL.md”; “Prefer verified/low-risk; do not invent skills.”
  - `formatHandoff` title: `Make It Ezy — next`; sections: Outcome, Capabilities, Skills (name · installed|not installed · reason), Checklist, Prompt (fenced with triple backticks), Notes
  - `formatPlan` Next → `- ezy next "<outcome>"` and `- ezy inspect <name>` (drop Phase 4 install stub line)
  - `formatInstallResult` success/already-installed Next → `ezy inspect <name>` and `ezy next "<outcome>"` only as generic hint `ezy next "<outcome>"` (no outcome string available here)

- [ ] **Step 4: Run** `pnpm exec vitest run packages/core/src/handoff.test.ts` — expect PASS; also run existing `format`/plan tests if any break from Next copy — fix minimally

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/handoff-types.ts packages/core/src/handoff.ts packages/core/src/handoff.test.ts packages/core/src/format.ts packages/core/src/index.ts
git commit -m "$(cat <<'EOF'
feat(core): add buildHandoff paste-ready next step

EOF
)"
```

---

### Task 2: CLI `next` + post-install handoff + docs

**Files:**
- Modify: `apps/cli/src/index.ts` — HELP, `next` command, append handoff after install when `--plan` or `--query` set and install ok/skipped-already
- Modify: `apps/cli/src/cli.test.ts`
- Modify: `docs/ROADMAP.md`, `docs/MVP-SPECIFICATION.md`, and README command list if present

**Interfaces:**
- Consumes: `buildHandoff`, `formatHandoff`
- Produces: `ezy next "<outcome>" [--local-only]`; install path side-effect output only

- [ ] **Step 1: Failing CLI tests**
  - help lists `next`
  - `ezy next "Build a SaaS dashboard" --local-only` status 0; stdout contains `Make It Ezy — next`, `Checklist`, `Prompt`, and does not claim skills were executed
  - bare `ezy next` status 1 + usage mentioning `ezy next`
  - (optional if easy with existing install mock) after mocked successful install with `--plan`, stdout includes `Make It Ezy — next`; plain install without plan/query does not

- [ ] **Step 2: Run** `pnpm exec vitest run apps/cli/src/cli.test.ts` — expect FAIL on new cases

- [ ] **Step 3: Implement** CLI wiring
  - HELP: `ezy next "<outcome>" [--local-only]` + one-line description “Paste-ready checklist + agent prompt (does not install/run).”
  - `next` handler mirrors `plan` arg parsing; call `buildHandoff` + `formatHandoff`; exit 0 even when no skills (discovery empty)
  - `handleInstall`: keep returning install exit code; if `(parsed.plan || parsed.query)` and install result ok (including already-installed skip), after install output call `buildHandoff(parsed.plan ?? parsed.query!)` and append `\n` + `formatHandoff(...)` (use `--local-only` only if you also thread that flag — if install has no local-only today, omit)
  - Spec builder call: full handoff once for `--plan`/`--query` only; bare skill install unchanged besides Task 1 Next string

- [ ] **Step 4: Run** `pnpm exec vitest run apps/cli/src/cli.test.ts packages/core/src/handoff.test.ts` — expect PASS

- [ ] **Step 5: Update docs** — ROADMAP Phase 4 note handoff slice; MVP list `next`; mark design executed in roadmap language only (no new phase)

- [ ] **Step 6: Commit**

```bash
git add apps/cli/src/index.ts apps/cli/src/cli.test.ts docs/ROADMAP.md docs/MVP-SPECIFICATION.md README.md
git commit -m "$(cat <<'EOF'
feat(cli): wire ezy next and post-install handoff

EOF
)"
```

---

## Self-review (plan author)

| Spec item | Task |
|---|---|
| `ezy next "<outcome>"` checklist + prompt | 1–2 |
| Skills installed / not + paths | 1 |
| Post `install --plan` full handoff | 2 |
| `install --query` when query string exists | 2 |
| Plain install no full handoff | 2 + Review Focus |
| Update formatPlan / formatInstallResult Next | 1 |
| Thin trust / no deep verify | Global + non-goals |
| No C / no auto-install / no SKILL.md dump | Global + Task 1 prompt tests |
