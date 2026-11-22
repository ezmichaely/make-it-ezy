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

On every push to `main`, [release-please](https://github.com/googleapis/release-please) opens/updates a release PR that:

- bumps `package.json` version from Conventional Commits
- updates `CHANGELOG.md`
- tags `vX.Y.Z` and creates a GitHub Release when that PR is merged

The current package version is recorded in `.release-please-manifest.json`. Keep using Conventional Commit subjects (`feat:`, `fix:`, etc.).

### npm CLI packages

The packages prepared for public npm publishing are `@make-it-ezy/core` and `@make-it-ezy/cli`; publish core first, then CLI, after confirming access to the `@make-it-ezy` npm scope. From the repository root:

```bash
pnpm build
pnpm --filter @make-it-ezy/core publish --access public
pnpm --filter @make-it-ezy/cli publish --access public
```

The CLI package declares the core workspace dependency; pnpm rewrites it to the published semver when packing. Publishing is a maintainer release action and is not run by CI in this phase.

## Not included (paid / optional)

- CodeRabbit / Copilot PR narrative review (trial or paid on some plans)
- Cursor Bugbot (Cursor subscription)
