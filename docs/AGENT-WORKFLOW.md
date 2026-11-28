# Agent Workflow

This document expands the mandatory workflow in root `AGENTS.md`.

## 1. First session sequence

One unambiguous reading path:

```
AGENTS.md
  → docs/AGENT-WORKFLOW.md
  → README.md (human summary)
  → docs/STATUS.md + docs/PRODUCT-DIRECTION.md
  → docs/HOW-IT-WORKS.md
  → docs/ROADMAP.md (phase/status)
  → docs/MVP-SPECIFICATION.md (shipped behavior)
  → accepted decisions in docs/decisions/
  → relevant architecture
  → docs/EXECUTION-PLAN.md (active queue)
  → current atomic task under docs/execution/
  → implementation + callers + tests
```

In words:

`AGENTS.md` → `docs/AGENT-WORKFLOW.md` → `README.md` → `docs/STATUS.md` + `docs/PRODUCT-DIRECTION.md` → `docs/HOW-IT-WORKS.md` + `docs/ROADMAP.md` + `docs/MVP-SPECIFICATION.md` → accepted decisions → relevant architecture → `docs/EXECUTION-PLAN.md` + current task under `docs/execution/` → implementation + callers + tests.

- `AGENTS.md` is the first operating guide.
- `docs/EXECUTION-PLAN.md` is the active audit-reconciliation queue.
- Individual task files under `docs/execution/` are atomic implementation instructions.
- The execution plan does **not** override `docs/ROADMAP.md` or `docs/MVP-SPECIFICATION.md`.
- `docs/STATUS.md` = current state; `docs/PRODUCT-DIRECTION.md` = product direction; `docs/handoff/` = context, not current authority.

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

### Optional local code graph (Graphify)

A committed `graphify-out/` map can reduce repeated broad code scanning. Only two generated files are tracked: `graphify-out/graph.json` and `graphify-out/GRAPH_REPORT.md`. Caches, HTML, build state, and manifests stay local and ignored. Graphify is **not** a product/runtime dependency.

- **Before a task:** read `graphify-out/GRAPH_REPORT.md` and, when Graphify is installed, use `graphify query "<question>"` (or `graphify path` / `graphify explain`) for cross-package “what calls X / trace this flow” questions instead of re-scanning the repo.
- **Freshness:** the report records `Built from commit`. Treat the graph as fresh when `git log --oneline <build-commit>..HEAD -- apps packages` is empty. If it lists code commits, run `graphify update .` before trusting it; otherwise treat the map as a hint and verify against current code.
- **After a task:** if the task changed code structure, run `graphify update .` and commit the updated `graph.json` + `GRAPH_REPORT.md` with the task. Docs-only changes do not require a refresh.
- Graph output is **evidence, not authority**. Current code and accepted docs still win.

### Task branch and Git delivery lifecycle

For every execution task, unless the task explicitly requires another strategy:

```text
LATEST MAIN
   ↓
CREATE TASK BRANCH
   ↓
IMPLEMENT ONE TASK ONLY
   ↓
TEST / VERIFY
   ↓
REVIEW DIFF
   ↓
COMMIT
   ↓
PUSH TASK BRANCH
   ↓
CREATE PR → MAIN
   ↓
REPORT PR DETAILS
   ↓
STOP / WAIT FOR MERGE
```

**Branch isolation**

1. Update `main` from its remote (e.g. `git fetch origin main`, then start from `origin/main`); do not branch from stale or unrelated work. If latest `main` cannot be verified, say so.
2. Create one task-specific, descriptive branch per task. Existing repo conventions apply; if none conflict, use `task/NNN-short-name`, e.g. `task/001-cli-cold-start`, `task/002-distribution-decision`. A workflow change may use an equivalent task/workflow name.
3. Preserve pre-existing user changes. Never reset/clean/overwrite; include only intended task changes in the commit. Do not mix unrelated tasks.
4. Do not begin Task N+1 on Task N's branch. Finish delivery/review handoff first. Sequential execution-plan rules still apply; creating a PR is not merging it.
5. If Task N+1 depends on unmerged Task N, do not silently mix branches. Document the dependency, target/review order, and required base; prefer waiting for Task N to merge before starting N+1. Any explicitly authorized stacked/alternate strategy must be stated clearly.

**Task branch vs PR concepts**

```text
Task branch = isolation boundary
Commit = recorded change
Push = remote delivery
PR = review/integration boundary
Merge = integration into main
```

Branch-per-task does **not** imply automatic merge. Merging is a separate explicit decision.

**Completed task with repository changes**

A task is not fully delivered merely because code/tests pass locally. Unless an exception below applies, once acceptance criteria are genuinely met:

1. Verify task acceptance criteria.
2. Run required tests/checks; for this repo run `pnpm check:ci` before push/PR (and before merge when CI gate applies), inspect output, and do not push red.
3. Synchronize authoritative docs when required.
4. Inspect final diff (`git diff`, staged diff, `git status`) and confirm no unrelated changes.
5. Commit coherent task work; no empty/unrelated commit. Preserve existing commit conventions (Conventional Commits style such as `docs:`, `feat:`, `fix:`, `test:` where used); verify working tree before committing.
6. Push task branch to remote (`git push -u origin <task-branch>` by default); verify pushed branch contains intended commit(s). Never push normal task work directly to `main`; preserve repository protections.
7. Create PR targeting `main` automatically after genuine completion. Do not require separate user requests for push, PR creation, or PR summary. PR title/body must be generated from actual implementation and verification, not assumptions/task text alone.
8. PR must include: clear task-specific title; concise summary; **Before/Now** (what behavior/result changed); why; important files/areas; tests/verification; known limitations; task completion status. Add **Before/Now** to the established PR structure; do not replace existing sections. Do not claim a bug is fixed without evidence + acceptance.
9. Report PR number + URL; branch; commit SHA(s); PR title; **Before/Now**; summary; tests; known limitations; stop/wait for user review/merge.
10. **Do not merge** unless explicitly authorized. Creating PR is agent responsibility; merging is not. Stop at PR.

**Blocked / unresolved tasks**

If acceptance criteria fail, cannot reproduce alleged bug, root cause unconfirmed, required evidence missing, tests fail, implementation incomplete, verification cannot be performed, or repository changes are otherwise unready:

- do not claim task complete;
- do not create misleading completion PR;
- do not start next task;
- report evidence, blocker, and exact next action.

A documentation-only investigation may produce PR if task explicitly requires documenting investigation, but PR must accurately state underlying issue remains unresolved; it must not be labeled bug-fixed. **Do not fake completion PRs.**

**Exceptions (not broad loopholes)**

- **Investigation-only / no repository changes:** no commit/push/PR; report findings + next action.
- **Blocked/incomplete:** no completion PR; report blocker.
- **User explicitly requests local-only work:** stop locally; no push/PR unless later authorized.
- **User explicitly requests no push/PR:** honor; still verify + show diff + completion record.
- **Documentation/research tasks:** follow execution plan's defined delivery mechanism; default still applies when repo changes are made unless explicitly overridden.
- **Task explicitly requires another strategy:** task instruction wins for that task only; record it.
- No legitimate change means no commit; no publishing, third-party messaging, or merge without explicit authority.

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

### Audit report naming

When an agent produces a repository audit report, save it under `docs/audits/` using:

`FULL-REPOSITORY-AUDIT-{MODEL-NAME}-{YYYY-MM-DD}.md`

Example:

`FULL-REPOSITORY-AUDIT-DEEPSEEK-V4-1-FLASH-FREE-2026-11-27.md`

Use the actual auditing model/provider identifier. Normalize filename-unsafe characters to uppercase letters, numbers, and hyphens. Do not overwrite previous audit reports with a generic filename.

There should be **exactly one active audit** under `docs/audits/`. Move superseded audits to `docs/archive/audits/` rather than keeping multiple current reports.

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

For Git-delivered completion, `NEXT ACTION` should normally be `Stop/wait for review/merge`; include PR number, URL, branch, commit SHA(s), PR title, **Before/Now**, summary, verification, and known limitations in the delivery report. Completion record does not replace PR creation; PR creation does not replace completion verification.

## 8. Anti-hallucination rules

Never infer current work from a latest conversation, branch name, old TODO, unchecked checkbox, audit finding, historical plan, generated output, or stale handoff.

Never infer implementation from a spec or plan alone.

Never infer approval from an audit, research note, or old conversation.

Never infer failure from an old agent report. Re-run the relevant verification.

## 9. Emergency conflict rule

If current decisions, roadmap, implementation, tests, and documentation cannot establish one consistent direction, **stop and report the conflict instead of choosing silently**.

Report the conflicting statements, file locations, current implementation behavior, and the smallest decision required to proceed.

This rule exists to prevent agents from hallucinating what previous agents intended.
