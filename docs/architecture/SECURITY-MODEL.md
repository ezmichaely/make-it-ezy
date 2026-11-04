# Security Model

## Trust posture

External skills, MCP servers, install scripts, and catalogs are **untrusted** until inspected. Popularity is not safety.

## Phase 1 guarantees (current)

- Analyze: filesystem reads only
- Doctor: version checks for Node / pnpm / git
- No network discovery, no auto-install, no third-party script execution

## Install gate (Phase 4+)

1. Identify source + provenance  
2. Inspect license, deps, scripts, permissions  
3. Classify risk  
4. Show planned changes  
5. Require explicit approval  

## Risk levels

| Level | Examples | Default |
|---|---|---|
| Low | formatting, summarization, read-only analysis | low friction |
| Medium | code edits, browser automation, dependency install | scoped + verify |
| High | security testing, legal/medical/financial, structural/electrical, RE, destructive actions | strong approval + human review |

## License caution (live 2026-11-05)

- `anthropics/skills` and `anthropics/claude-code` report **NO_LICENSE** via GitHub API — do not advise redistribution until clarified.
- Prefer MIT/Apache-2.0 candidates when recommending installs.
