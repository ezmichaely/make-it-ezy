# Repo Audit / Handoff — 2026-11-27

> **Diagnostic snapshot for model handoff. Not authoritative product truth.**
> Verify against current implementation/tests and authoritative docs before acting.

## 1. Snapshot

- **Repo:** `make-it-ezy` (`https://github.com/ezmichaely/make-it-ezy.git`)
- **Branch:** `analysis/full-scan-reconciliation`
- **HEAD:** `6d2bc90 docs: add post-batch reconciliation task 016`
- **Working tree at audit time:** clean except untracked `docs/audits/FULL-REPOSITORY-AUDIT-2026-11-26.md`
- **Audit date:** 2026-11-27
- **Audited by:** opencode/iceman-free (read-only audit + this handoff file)

## 2. What This Repo Is

Make It Ezy is a **local-first capability/context decision layer for coding tasks**. 

- **Ezy decides; the host agent executes.**
- It understands outcome/project, derives requirements, discovers candidates, selects a minimum useful set, and prepares handoff/workflow.
- It is **not** a coding agent, generic autonomous multi-agent runtime, skills marketplace, mandatory Superpowers runtime, or model host.
- External skills/repo content/briefs/research are untrusted input; discovery != trust/recommendation/install/execution.

Authoritative starting points: [`AGENTS.md`](../../AGENTS.md), [`docs/AGENT-WORKFLOW.md`](../AGENT-WORKFLOW.md), [`docs/STATUS.md`](../STATUS.md), [`docs/ROADMAP.md`](../ROADMAP.md), [`docs/MVP-SPECIFICATION.md`](../MVP-SPECIFICATION.md), [`docs/HOW-IT-WORKS.md`](../HOW-IT-WORKS.md).

## 3. Current Phase / Status

- **Phases 0–7:** shipped.
- **Phase 8 — Launch and Distribution:** current.
- **Phase 9 — Outcome Verification:** later.
- **Phase 10 — Web UI:** later.
- First broker-directed workflow slice shipped (contractor routing, ordered workflow output, host-agent adapter support).
- `packages/core/src/lifecycle.ts` exports lifecycle boundary contracts, but they are **not** the controlling CLI/planner pipeline.
- Current planning path: `analyze → requirements → search → select → plan → handoff`.

## 4. Repo Layout

```text
apps/cli/                 # published CLI package (name: make-it-ezy, bin: ezy)
  src/index.ts            # command dispatch
  src/select.ts           # TTY picker
  scripts/prepare-package.mjs  # bundles core dist into dist/core, rewrites imports
packages/core/            # private @make-it-ezy/core, internal runtime
  src/                    # analyze/requirements/search/select/plan/handoff/install/brain/brief/lifecycle etc.
skills/
  ezy/SKILL.md            # end-user host-agent adapter
  ci-before-push/SKILL.md # builder helper
docs/                     # authoritative docs, architecture, decisions, audits, handoff, research
catalog/                  # reserved, .gitkeep only
scripts/                  # builder skill bootstrap/link/clean
```

## 5. CLI Surface (from `apps/cli/src/index.ts`)

Commands: `doctor`, `analyze`, `search`, `inspect`, `recommend`, `brief`, `brain [refresh|enrich]`, `plan`, `next`, `install`.

Key flags: `--local-only`, `--yes/-y`, `--source`, `--brief`, `--plan`, `--query`.

Flow: `ANALYZE → REQUIREMENTS → DISCOVER → FILTER → PLAN → INSTALL → NEXT`.

## 6. Core Runtime Map

- **Project/context:** `analyze.ts`, `detect-*`, `find-project-root.ts`, `brain.ts`
- **Requirements/selection:** `requirements.ts`, `capabilities.ts`, `score-skill.ts`, `select.ts`, `plan.ts`
- **Discovery:** `search.ts`, `search-remote.ts`, `load-local-skills.ts`
- **Handoff/workflow:** `handoff.ts`, `contractors.ts`, `format.ts`
- **Install/inspect:** `install.ts`, `inspect-skill.ts`
- **Brief:** `brief.ts`
- **Lifecycle contracts (not controlling):** `lifecycle.ts`, `lifecycle-types.ts`
- **Exports:** `packages/core/src/index.ts`

## 7. Verification Run (this audit)

| Check | Result | Notes |
|---|---|---|
| `pnpm test` | **PASS** | 21 test files, 189 tests passed (Vitest). CLI tests took ~18.5s. |
| `pnpm build` | NOT RUN | Not executed in this audit pass. |
| `pnpm lint` | NOT RUN | Not executed in this audit pass. |
| `pnpm typecheck` | NOT RUN | Not executed in this audit pass. |
| `pnpm check:ci` | NOT RUN | Includes build/lint/typecheck/test/audit; not executed. |

## 8. Observations / Risks

- **Docs/authority sprawl risk:** Multiple status/direction/handoff docs exist; AGENTS defines precedence. Watch for drift (STATUS last verified 2026-11-25; branch has moved).
- **Lifecycle boundary clarity:** `lifecycle.ts` is exported and tested but intentionally not wired into CLI pipeline; do not describe as shipped behavior.
- **Distribution packaging:** CLI is self-contained via `prepare-package.mjs` bundling `packages/core/dist` into `apps/cli/dist/core`. Verify packaged artifact behavior before publish claims.
- **Untracked audit file present:** `docs/audits/FULL-REPOSITORY-AUDIT-2026-11-26.md` exists in worktree (untracked). Treat as diagnostic evidence, not authority.
- **CI scope:** `.github/workflows/ci.yml` runs build/lint/typecheck/test/audit on Ubuntu Node 22; no publish job in that file. Release-please config exists separately.
- **Test execution mode:** CLI tests spawn `tsx src/index.ts` (source), not packaged dist; packaged-install behavior should be separately verified for release confidence.
- **No runtime deps declared for core/cli packages** beyond workspace/dev tooling; aligns with local-first/no-LLM-runtime boundary.

## 9. If Continuing As Another Model

1. Read `AGENTS.md` first, then `docs/AGENT-WORKFLOW.md`.
2. Confirm current branch/HEAD and dirty state; do not assume this handoff is current after new commits.
3. Read `docs/STATUS.md`, `docs/ROADMAP.md`, `docs/MVP-SPECIFICATION.md`, `docs/HOW-IT-WORKS.md`.
4. For behavior claims, verify against implementation/tests, not just docs.
5. Before changing behavior, inspect callers/tests and follow smallest-complete-slice rule.
6. Run relevant checks (`pnpm build`, `pnpm test`, `pnpm typecheck`, `pnpm lint`, or `pnpm check:ci`) before claiming green.
7. Do not install/execute third-party skills silently; preserve unrelated user changes.

## 10. Suggested Next Checks (if needed)

- Run `pnpm check:ci` for full gate confidence.
- Inspect `release-please-config.json`, `.release-please-manifest.json`, and release workflow for distribution readiness.
- Review untracked `docs/audits/FULL-REPOSITORY-AUDIT-2026-11-26.md` and reconcile any still-valid findings through proper authority.
- Validate packaged CLI (`npm pack` + install smoke) if touching distribution/publish path.