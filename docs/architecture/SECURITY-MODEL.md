# Security Model

## Trust posture

External skills, MCP servers, install scripts, and catalogs are **untrusted** until inspected. Popularity is not safety.

## What is safe by default

| Surface | Behavior |
|---|---|
| `doctor` / `analyze` | Local filesystem / PATH only |
| `search` / `recommend` / `plan` / `next` | May query skills.sh + read local project; **never installs or executes** skills |
| `inspect` | Local skill read + risk notes; optional remote metadata |
| `install` | Preview + explicit approval (`--yes` or TTY confirm) before `npx skills add` |
| Agent Skill `ezy` | Must ask before install; must not invent `--yes` |

## Install gate (Phase 4 — partial)

Shipped today:

1. Resolve source + destination  
2. Show preview (command, path, thin risk notes)  
3. Require explicit approval  
4. Install via `npx skills add` into `.agents/skills`

**Not shipped yet (deep verify):** full license/deps/scripts static analysis, Verified vs Unverified badges, trusted-auto allowlist.

## Risk levels

| Level | Examples | Default |
|---|---|---|
| Low | formatting, summarization, read-only analysis | low friction |
| Medium | code edits, browser automation, dependency install | scoped + verify |
| High | security testing, legal/medical/financial, structural/electrical, RE, destructive actions | strong approval + human review |

## License caution (live 2026-11-05)

- `anthropics/skills` and `anthropics/claude-code` report **NO_LICENSE** via GitHub API — do not advise redistribution until clarified.
- Prefer MIT/Apache-2.0 candidates when recommending installs.
