# Phase 4 `ezy install` Implementation Plan

> **For agentic workers:** Use executing-plans / implement task-by-task.

**Goal:** Gated skill install with optional TTY arrow picker from `--plan` / `--query`.

**Architecture:** Core builds `InstallPreview` + runs injectable `npx skills add`. CLI resolves candidates (name / plan / recommend), arrow-selects on TTY, requires `--yes` or confirm, then installs.

**Spec:** `docs/superpowers/specs/2026-11-05-phase4-install-design.md`

## Task 1 — core install preview + runner

- Create `install-types.ts`, `install.ts`, `install.test.ts`
- `buildInstallPreview({ name, source, cwd })`
- `isSkillInstalledLocally(name, cwd)`
- `runInstall(preview, { spawn, yes })` — only runs when approved by caller
- `formatInstallPreview`

## Task 2 — CLI picker + command

- `apps/cli/src/select.ts` — raw-mode up/down/enter/q
- Wire `ezy install` flags; docs; tests with mocked spawn / non-TTY
