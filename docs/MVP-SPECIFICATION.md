# MVP Specification

## Phases 1–3 (done)

`doctor` / `analyze` / `search` / `inspect` / `recommend` / `plan` — discover & plan only.

## Phase 4 slice (current)

```bash
pnpm ezy install <skill> --source owner/repo --yes
pnpm ezy install --plan "Build a SaaS dashboard"   # TTY: arrow select + confirm
```

- Preview source, destination, risk notes, exact command
- Require `--yes` or interactive confirm
- Install with `npx skills add …` into `.agents/skills`
- **Does not** execute the skill’s outcome

## Source of truth

- `MAKE-IT-EZY-MASTER-HANDOFF.md`
- `docs/superpowers/specs/2026-11-05-phase4-install-design.md`
