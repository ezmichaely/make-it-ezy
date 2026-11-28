# Archive

Archived material is **historical evidence**, not current product authority and not an automatic work order.

## Current authority

Do not start here. Start with [`AGENTS.md`](../../AGENTS.md), then
[`docs/STATUS.md`](../STATUS.md), [`docs/PRODUCT-DIRECTION.md`](../PRODUCT-DIRECTION.md),
[`docs/ROADMAP.md`](../ROADMAP.md), [`docs/MVP-SPECIFICATION.md`](../MVP-SPECIFICATION.md),
current architecture, and accepted decisions. For active work, follow
[`docs/EXECUTION-PLAN.md`](../EXECUTION-PLAN.md).

The canonical current audit lives at
[`docs/audits/`](../audits/) — **not** in this folder.

## Folder map

| Folder | Contents | Index |
|---|---|---|
| [`audits/`](./audits/) | Superseded diagnostic reports and handoff snapshots. | [`audits/README.md`](./audits/README.md) |
| [`conversations/`](./conversations/) | Summary of removed raw chat exports; durable decisions only. | [`conversations/README.md`](./conversations/README.md) |
| [`specs/`](./specs/) | Completed Phase 2–8 design specifications. | [`specs/README.md`](./specs/README.md) |
| [`work-plans/`](./work-plans/) | Completed Phase 2–8 implementation plans, plus one superseded proposal. | [`work-plans/README.md`](./work-plans/README.md) |
| [`handoff/`](./handoff/) | Consolidated historical handoff summary. | [`handoff/README.md`](./handoff/README.md) |
| `evidence/` | Completed one-time cleanup instruction removed; recover from git history if provenance is needed. | — |

## Cleanup record (2026-11-27)

Removed from this folder because they were derivative or duplicated:

- `conversations/` — 11 raw chat exports (~1.0 MB). Durable content is now in
  [`conversations/README.md`](./conversations/README.md) and
  [`docs/archive/handoff/README.md`](./handoff/README.md).
  This matches the policy in [`docs/convo/README.md`](../convo/README.md).
- `audits/convo-qwen3-span-notes.md` — generated span notes whose source files no longer exist.

Everything removed is recoverable from git history.

Kept deliberately: the raw audits (the evidence base for the execution plan), the Phase 2–7
specs and plans. Completed one-time cleanup instructions are recoverable from git history.

## Reading rule

Historical documents may contain useful evidence. Classify them as HISTORICAL before using
anything in them to make a current implementation decision. When an archived document disagrees
with the current code, the code wins.
