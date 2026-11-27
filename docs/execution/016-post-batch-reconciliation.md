# Task 016 — Post-Batch Reconciliation & Next-Batch Generation

## Purpose

After Tasks 001–015 have been completed and validated, reconcile the execution queue against the **actual repository state** before creating the next batch of atomic fixes.

This is a **reconciliation gate**, not an implementation task.

## Audit Report Naming

When a repository audit is produced for this workflow, save the report under `docs/audits/` with the auditing model/provider name and audit date in the filename.

Format:

`FULL-REPOSITORY-AUDIT-{MODEL-NAME}-{YYYY-MM-DD}.md`

Example:

`FULL-REPOSITORY-AUDIT-DEEPSEEK-V4-1-FLASH-FREE-2026-11-27.md`

Use the actual model/provider identifier used for the audit. Normalize filename-unsafe characters to uppercase letters, numbers, and hyphens. Do not overwrite a prior audit with a generic filename such as `FULL-REPOSITORY-AUDIT.md`. Keep exactly one active audit under `docs/audits/`; archive superseded reports.

This task is the **post-batch** gate. It is not the audit-cleanup/consolidation pass; it runs only after Tasks 001–015 are completed and validated.

## Read First

- `AGENTS.md`
- `docs/EXECUTION-PLAN.md`
- Completed Task 001–015 execution results/diffs
- The canonical audit: `docs/audits/FULL-REPOSITORY-AUDIT-DEEPSEEK-V4-1-FLASH-FREE-2026-11-27.md`

## Scope

Only assess the delta created by Tasks 001–015 and the evidence they produced.

Determine:

1. Which Tasks 001–015 were actually completed and validated.
2. Whether any task exposed a new issue that was not visible in the original audit.
3. Whether any remaining task became unnecessary or changed because an earlier fix resolved or altered its assumptions.
4. Whether the repository state still matches the documented product/architecture assumptions.
5. What the next smallest useful batch of atomic tasks should be.

## Required Output

Update `docs/EXECUTION-PLAN.md` as needed so it accurately reflects the reconciled state.

Create the **next small atomic task batch** under `docs/execution/`, using sequential numbering after Task 016.

Each new task must:

- have one clear objective;
- define a narrow file/scope boundary;
- state explicit out-of-scope items;
- include acceptance criteria;
- include the minimum validation required;
- avoid combining unrelated fixes;
- avoid future architecture unless separately authorized.

## Important Constraints

- **Do NOT perform a full re-audit from scratch.**
- **Do NOT implement the fixes discovered during reconciliation.**
- **Do NOT redesign the current architecture.**
- **Do NOT blindly preserve Tasks 017+ from an earlier plan if repository evidence invalidates them.**
- **Do NOT create a giant backlog.** Generate only the next practical atomic batch.
- The original audit remains the baseline; this task reconciles the **delta since that baseline**.

## Completion Criteria

Task 016 is complete when:

- Tasks 001–015 have been checked against actual repository evidence.
- The execution plan reflects the current state.
- Superseded or invalidated tasks are removed/revised rather than blindly retained.
- Newly required work is represented as small sequential task files.
- No implementation changes are made as part of this reconciliation.
- The next execution batch is ready for sequential local-agent execution.

## Guiding Principle

Use the cycle:

**execute → validate → reconcile → generate next atomic batch → execute**

Do not turn the reconciliation gate into another large implementation phase.
