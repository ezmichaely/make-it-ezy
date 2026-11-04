# Integration Strategy

## Above package managers

```text
Make It Ezy decides what is needed
  → npm/pnpm, Git, MCP, runtime installers, OS tools perform install/run
```

Not a replacement for pnpm/npm.

## Phased integrations

| Phase | Integration | Gate |
|---|---|---|
| 1 (done) | Local filesystem + PATH doctor checks | shipped |
| 2 | skills.sh / Vercel Skills / local `.agents/skills` discovery | search only, no auto-install |
| 3 | Ranking + explainable minimum set | after discovery works |
| 4 | One runtime adapter (prefer Claude Code, then Codex/Cursor) | after approval UX |
| Optional | Taste, OpenSEO, REA, Graphify, browser tools | only when task needs them |

## Layer A vs Layer B

Development may install Superpowers/Ponytail/Graphify into `.agents/skills`.  
Product must not require them to run `ezy doctor` / `ezy analyze`.

## Compatibility claims

Only after tested against a real runtime install.
