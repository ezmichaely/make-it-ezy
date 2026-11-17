---
name: ci-before-push
description: >
  Run Make It Ezy's GitHub CI gates locally before any git push or PR update.
  Use whenever the user asks to push, open/update a PR, merge to main, or
  "check CI" / "run gates" / "before push" on this repo — even if they did not
  name this skill. Do not push until check:ci is green.
---

# CI before push

Never `git push` (or open/update a PR that needs a push) for this repo until the local CI mirror passes.

## Gate (must match `.github/workflows/ci.yml`)

From repo root:

```bash
pnpm check:ci
```

That runs, in order:

1. `pnpm build` — required first so type-aware ESLint can resolve workspace `dist/*.d.ts`
2. `pnpm lint` — ESLint strictTypeChecked
3. `pnpm typecheck`
4. `pnpm test`
5. `pnpm audit --prod --audit-level=high`

CodeQL is GitHub-only; skip locally.

## Procedure

1. Confirm cwd is the make-it-ezy repo root.
2. Run `pnpm check:ci` (full/unsandboxed shell — CLI tests need tsx IPC).
3. If it fails: fix the reported errors, re-run until exit 0. Do not push red.
4. Only then commit (if needed) and push / create PR.
5. Tell the user the gate result in one line (pass/fail + first failing step).

## Do not

- Push “to see if CI passes”
- Reorder or skip steps to save time
- Treat local lint alone as enough when `dist/` already exists from an old build — always use `pnpm check:ci`
- Rely on vendored `.agents/skills` for tests — they change on every skills update; use temp fixtures