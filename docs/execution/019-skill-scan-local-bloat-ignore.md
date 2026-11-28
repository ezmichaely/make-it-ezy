# Task 019 — Ignore local docs/skill-scan evaluator bloat

## Goal

Prevent accidental commit/noise from large local `docs/skill-scan` evaluator/clone artifacts while preserving tracked docs.

## Scope

- `.gitignore` and/or `docs/skill-scan/.gitignore`
- `docs/skill-scan/README.md` or `docs/skill-scan/skill-evaluator/README.md` only if policy clarification is needed
- `docs/EXECUTION-PLAN.md` status update

## Out of scope

- No deletion of local untracked files.
- No removal of tracked audit/scan docs unless explicitly verified as obsolete and approved by task scope.
- No full skill-scan data redesign.

## Required checks

- Identify which `docs/skill-scan/skill-evaluator` paths are large/local/untracked and not needed in git.
- Add ignore rules that cover them while keeping currently tracked files (`git ls-files docs/skill-scan` stays intact).
- Confirm `git status` is clean of the accidental bloat after ignore rules (local files may remain on disk).

## Acceptance criteria

- Large local untracked skill-scan evaluator artifacts are ignored.
- Tracked docs/scan files remain tracked.
- Policy is clear enough for future agents not to commit generated/local evaluator clones.

## Validation

```bash
git ls-files docs/skill-scan
git check-ignore -v <candidate-path>
git status --short
```

## Stop condition

If ignore rules would hide tracked files or require destructive cleanup, stop and narrow scope.
