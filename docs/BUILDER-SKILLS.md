# Builder skills (Layer A — not product runtime)

Vendored agent skills for **building Make It Ezy** are **not** committed to git. The lockfile is the single source of truth, similar to `pnpm-lock.yaml`.

## Source of truth

| Artifact | Role |
|----------|------|
| [`skills-lock.json`](../skills-lock.json) | Pin every vendored skill (source repo, path, hash) |
| [`skills/ezy/`](../skills/ezy/) | Repo-owned product adapter (shipped to users) |
| [`skills/ci-before-push/`](../skills/ci-before-push/) | Repo-owned CI gate skill |

Installed tree (local only, gitignored): `.agents/skills/` (+ symlinks `.cursor/skills`, `.claude/skills` → `.agents/skills`).

## After clone

```bash
pnpm install
pnpm skills:install    # restore from skills-lock.json + link repo-owned skills
```

Under the hood:

1. `npx skills install` — restores vendored skills from `skills-lock.json` into `.agents/skills/`
2. Copies `skills/ezy` and `skills/ci-before-push` into `.agents/skills/` (not in the lockfile)

## Maintenance

| Task | Command |
|------|---------|
| Add or upgrade a vendored skill | `npx skills add <owner/repo>` (updates lock) |
| Refresh all installed skills | `npx skills update` |
| Browse / discover | [skills.sh](https://skills.sh/) or `npx skills find …` |

Do not edit files under `.agents/skills/` by hand except after a failed install. Change the lock via the Skills CLI, then re-run `pnpm skills:install`.

## Why

- Keeps GitHub language stats and repo size honest (product is TypeScript; Graphify and office-skill scripts are vendored tooling).
- Same pattern as **Untangle**: workflow rules point at skill *names*; payloads are installed locally, not vendored in git.

See [`AGENTS.md`](../AGENTS.md) → *Building Make It Ezy* for when each builder skill applies.