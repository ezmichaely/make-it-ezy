# Make It Ezy — Integration Map

**Purpose:** Define where external systems fit in the product without turning future integrations into current implementation requirements.

## Integration principles

1. Ezy's core decision layer should remain host-agnostic.
2. An integration must have a defined responsibility.
3. A future integration is not an approved implementation task until accepted into the roadmap.
4. External skills and integrations are untrusted until evaluated.
5. Integrations should adapt to Ezy's contracts rather than redefine the product boundary.
6. Prefer a small number of useful integrations over broad compatibility for its own sake.

## Host agents

These execute the work selected or planned by Ezy.

| Host | Role | Priority | Status |
|---|---|---:|---|
| Codex | coding/research execution host | High | Target |
| Claude Code | coding/research execution host | High | Target |
| Cursor | coding execution host | Medium | Target |
| OpenCode | coding execution host | Medium | Target |
| Qwen Code | coding execution host | Medium | Target |

These are integration targets, not claims that all adapters already exist.

## Repository and project systems

| System | Role | Priority | Status |
|---|---|---:|---|
| Git | repository state/history | Core | Current dependency/context |
| Filesystem | project inspection | Core | Current |
| GitHub | repository/issues/PR context | High | Target |
| Other Git hosts | repository context | Later | Candidate |

## Capability sources

Potential sources for capability discovery include local skill directories, GitHub-hosted skills, other trusted/compatible registries, and project-local capabilities.

A source should not be treated as trusted merely because Ezy can discover it.

## Verification systems

Future integrations may provide stronger evidence that an outcome was achieved:
- test runners;
- linters/type checkers;
- build systems;
- browser/application checks;
- repository/CI status;
- host-agent result summaries.

Phase 9 should establish the product contract before broadening verification integrations.

## Integration maturity model

~~~text
Candidate
   ↓
Accepted target
   ↓
Contract defined
   ↓
Adapter implemented
   ↓
Verified
   ↓
Maintained
~~~

A system must not be described as supported merely because a design or adapter type exists.

## How integrations should evolve

For each accepted integration:
1. define its purpose;
2. define the boundary/contract;
3. identify trust and security implications;
4. implement the smallest useful adapter;
5. add verification;
6. document actual behavior;
7. update STATUS and ROADMAP when the accepted state changes.

## What we should not do

Do not build adapters for every AI coding host at once.

Likely order:
1. stabilize the core Ezy workflow;
2. prove one or two host integrations end-to-end;
3. extract reusable adapter boundaries;
4. add additional hosts where demand justifies them.

This prevents the integration layer from becoming the project.

## Relationship to other documents

- Product destination: docs/PRODUCT-DIRECTION.md
- Current state: docs/STATUS.md
- Accepted phase order: docs/ROADMAP.md
- Current product behavior: docs/MVP-SPECIFICATION.md
- Technical architecture: docs/architecture/
