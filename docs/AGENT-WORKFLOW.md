# Agent Workflow

This document expands the mandatory workflow in root `AGENTS.md`.

## 1. First session sequence

`AGENTS.md` → `docs/AGENT-WORKFLOW.md` → `README.md` → `docs/HOW-IT-WORKS.md` + `docs/ROADMAP.md` + `docs/MVP-SPECIFICATION.md` → accepted decisions → relevant architecture → implementation + callers + tests.

Do not start coding before this sequence is complete enough to establish current state.

## 2. State declaration

Before implementation, establish:

```text
Goal:
Current phase:
Current behavior:
Desired behavior:
Authoritative decision:
Implementation entrypoint:
Relevant tests:
Docs to synchronize:
Known unknowns:
```

If a critical field is unknown, investigate it.

## 3. Implementation loop

```text
READ → VERIFY → CLASSIFY → PLAN → CHANGE → TEST → SYNC DOCS → VERIFY AGAIN
```

Never replace this with: `GUESS → CODE → write a document explaining the guess`.

## 4. Documentation reconciliation

When repairing documentation:

1. inventory the relevant documents;
2. classify each as authority, dependent, proposal, historical, or redundant;
3. identify the authority;
4. identify contradictions;
5. update the authority;
6. update dependent docs;
7. archive/remove redundant material;
8. verify links;
9. perform a final consistency pass.

Do not create a new master document just because existing documents disagree. First decide which existing document should own the truth.

## 5. Work-plan rule

A work plan is not automatically an approved task list.

Before implementing an item, verify:

1. Is it still open?
2. Is it still desired?
3. Is it already implemented?
4. Did an accepted decision supersede it?
5. Does the current roadmap still contain it?

If unclear, reconcile before coding.

## 6. Audit rule

Audits are diagnostic evidence.

An audit may identify a problem, but it does not by itself authorize implementation.

Current work must come from an explicit user instruction, an accepted decision, an approved roadmap item, or an explicitly approved work plan.

## 7. Completion record

Every substantive task should end with:

```text
WHAT CHANGED:
WHY:
FILES:
TESTS RUN:
DOCS UPDATED:
KNOWN LIMITATIONS:
NEXT ACTION:
```

If there is no assigned next action, say so. Do not invent one.

## 8. Anti-hallucination rules

Never infer current work from a latest conversation, branch name, old TODO, unchecked checkbox, audit finding, historical plan, generated output, or stale handoff.

Never infer implementation from a spec or plan alone.

Never infer approval from an audit, research note, or old conversation.

Never infer failure from an old agent report. Re-run the relevant verification.

## 9. Emergency conflict rule

If current decisions, roadmap, implementation, tests, and documentation cannot establish one consistent direction, **stop and report the conflict instead of choosing silently**.

Report the conflicting statements, file locations, current implementation behavior, and the smallest decision required to proceed.

This rule exists to prevent agents from hallucinating what previous agents intended.