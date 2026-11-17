# Builder skills (Layer A — not product runtime)

Vendored agent skills for **building Make It Ezy** are **not** committed to git. The lockfile is the single source of truth, similar to `pnpm-lock.yaml`.

## Source of truth

| Artifact | Role |
|----------|------|
| [`skills-lock.json`](../skills-lock.json) | Pin every vendored skill (source repo, path, hash) |
| [`skills/ezy/`](../skills/ezy/) | Repo-owned product adapter (shipped to users) |
| [`skills/ci-before-push/`](../skills/ci-before-push/) | Repo-owned CI gate skill |

## Global home (install once per machine)

Vendored payloads live under a **user-level directory**, not inside each repo clone:

| Path | Role |
|------|------|
| `~/.local/share/make-it-ezy-builder-skills/.agents/skills/` | Default global store (from `skills-lock.json`) |
| `BUILDER_SKILLS_HOME` | Optional override for the directory above (parent of `.agents/skills`) |

Each repo only **links** into that store:

- `.agents/skills/` — symlinks to global skills + repo-owned `skills/ezy` and `skills/ci-before-push` (gitignored; created by `pnpm skills:install`)
- `.cursor/skills`, `.claude/skills` → `.agents/skills` (gitignored; same command)

## After clone (any Make It Ezy repo)

```bash
pnpm install
pnpm skills:install    # bootstrap global home if needed, then link
```

First run (or after lockfile changes) downloads into the **global home** only. New repos only run the link step; they do not re-download unless the global copy is missing or stale.

| Task | Command |
|------|---------|
| Force refresh global vendored tree | `pnpm skills:global` |
| Link this repo after global is ready | `node scripts/link-builder-skills.mjs` |
| Drop local symlinks only (keep global home) | `pnpm skills:clean` then `pnpm skills:install` |
| Add or upgrade a vendored skill | `npx skills add <owner/repo>` (updates lock), then `pnpm skills:global` and `pnpm skills:install` |

Do not edit files under the global home or under `.agents/skills/` by hand (symlinks). Change the lock via the Skills CLI, then re-run `pnpm skills:global` and `pnpm skills:install`.

## Why

- Keeps GitHub language stats and repo size honest (product is TypeScript; vendored tooling is not in git).
- One download per machine per lockfile revision, not one per repo clone.

See [`AGENTS.md`](../AGENTS.md) → *Building Make It Ezy* for when each builder skill applies.