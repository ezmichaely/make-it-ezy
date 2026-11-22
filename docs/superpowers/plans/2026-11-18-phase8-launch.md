# Phase 8 — Launch and Distribution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prepare Ezy’s CLI and core packages for public npm distribution and document global installation.

**Architecture:** Publish the existing workspace packages in dependency order. pnpm pack/publish rewrites the CLI’s `workspace:*` dependency to the core package’s version; npm installs both. No runtime bundler or new dependency.

**Tech Stack:** Node.js 20+, pnpm workspace, npm packages, release-please.

**Spec:** `docs/superpowers/specs/2026-11-18-phase8-launch-design.md`

## Global Constraints

- Keep the CLI/core package boundary.
- Do not publish packages or use registry credentials.
- Preserve explicit user approval for skill installs.
- Do not describe community popularity as Ezy verification.

## Review Focus

- Packed CLI must include its executable and compiled output.
- Packed CLI must reference a semver core dependency, not `workspace:*`.
- Core must publish before CLI.
- Package versions and release-please manifest must agree.
- User docs must not claim npm installation works before publication.

### Task 1: Publishable package metadata

**Files:** `apps/cli/package.json`, `apps/cli/README.md`, `packages/core/package.json`, `packages/core/README.md`, `.release-please-manifest.json`, `release-please-config.json`

- [x] Remove `private` from CLI and core packages; set public access, repository/license/engine metadata, matching current versions, descriptions, and keywords.
- [x] Add package-level READMEs so npm package pages explain installation and scope.
- [x] Configure release-please to track the root repository plus both workspace packages, with component tags for package releases.
- [x] Run `pnpm build` and `pnpm pack` for both packages; inspect manifests in the generated tarballs for bin/files/dependency correctness. Installed both tarballs offline and ran `ezy --help` successfully.

### Task 2: User installation docs

**Files:** `README.md`, `docs/MVP-SPECIFICATION.md`, `docs/CI.md`, `docs/architecture/INTEGRATION-STRATEGY.md`

- [x] Document `npm install --global @make-it-ezy/cli`, `ezy --help`, and first-use commands, marked pending first publication.
- [x] Document the package build/publish order and the scope-ownership check for the maintainer; do not add an auto-publish workflow.
- [x] Align the integration strategy phase table with the current roadmap.
- [x] Run `git diff --check` and verify README matches package metadata.
