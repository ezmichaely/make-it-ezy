# CI & free review gates

No paid CodeRabbit required. Public GitHub Actions + CodeQL are free for this repo.

## On every PR / push to `main`

| Gate | Tool | What it catches |
|---|---|---|
| Lint | ESLint + `typescript-eslint` strictTypeChecked | Style, unsafe types, common bugs |
| Types | `tsc --noEmit` (strict already on) | Type errors |
| Tests | Vitest | Regressions |
| Build | `pnpm build` | Broken compile |
| Deps | `pnpm audit --prod --audit-level=high` | Known vulnerable packages |
| Security/quality | **CodeQL** (`security-and-quality`) | Injection, XSS-class issues, quality smells |

## Local

```bash
pnpm install
pnpm check:ci       # build → lint → typecheck → test → audit (same as Actions CI)
pnpm check          # build → lint → typecheck → test
```

Before push/PR, follow root [`AGENTS.md`](../AGENTS.md) and `.agents/skills/ci-before-push/SKILL.md` (also under `.claude/skills` and `.cursor/skills`, which link to `.agents/skills`).

## PR workflow

1. Branch off `main`
2. Open PR (GitHub fills `.github/PULL_REQUEST_TEMPLATE.md`) — CI + CodeQL must pass
3. Merge
4. Enable **Settings → General → Automatically delete head branches** so merged branches disappear (ask a maintainer if you can’t toggle it)

## Releases & changelog

On every push to `main`, [release-please](https://github.com/googleapis/release-please) opens/updates a release PR for the single public CLI package:

- package: `make-it-ezy`
- install: `npm install --global make-it-ezy`
- executable: `ezy`
- version/tag model: `make-it-ezy@X.Y.Z` / `vX.Y.Z`
- changelog: `apps/cli/CHANGELOG.md`

Release Please is responsible for the version bump, changelog, tag, and GitHub Release. It does **not** publish to npm by itself.

The root workspace remains private. `packages/core` is an internal private workspace package and is bundled into the published CLI, so users do not install it separately.

Publishing to npm is an explicit maintainer action and is not run automatically by the current release workflow.

## Not included (paid / optional)

- CodeRabbit / Copilot PR narrative review (trial or paid on some plans)
- Cursor Bugbot (Cursor subscription)
