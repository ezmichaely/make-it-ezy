# Contributing

## Develop

```bash
pnpm install
pnpm build
pnpm test
pnpm test:watch
pnpm dev:ezy analyze
```

## Scope

Phase 1 is intentionally small. Prefer fixing detection accuracy and docs over adding Phase 2+ features unless agreed.

## Principles

1. Simplify before adding complexity.
2. Evidence over speculation in detectors.
3. External skills/tools are untrusted until inspected.
4. Do not invent repository URLs in research docs — mark `UNRESOLVED`.

## Tests

Add or update Vitest coverage when changing detection or CLI behavior.
