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
pnpm check          # lint + typecheck + test + build
pnpm lint
pnpm typecheck
```

## PR workflow

1. Branch off `main`
2. Open PR (GitHub fills `.github/PULL_REQUEST_TEMPLATE.md`) — CI + CodeQL must pass
3. Merge
4. Enable **Settings → General → Automatically delete head branches** so merged branches disappear (ask a maintainer if you can’t toggle it)

## Not included (paid / optional)

- CodeRabbit / Copilot PR narrative review (trial or paid on some plans)
- Cursor Bugbot (Cursor subscription)
