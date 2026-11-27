# Archived audits — consolidated record

> **Status:** historical diagnostic evidence only. Not authority, not a work order.
>
> **Canonical current audit:** [`docs/audits/FULL-REPOSITORY-AUDIT-DEEPSEEK-V4-1-FLASH-FREE-2026-11-27.md`](../../audits/FULL-REPOSITORY-AUDIT-DEEPSEEK-V4-1-FLASH-FREE-2026-11-27.md)
>
> This single file replaces the individual archived audit files that previously lived in this
> folder. Their full original text is preserved in git history.

## How to recover full text

```bash
# List historical audit files at the last commit that contained them
git log --name-only -- docs/archive/audits

# Show a removed file's full content from git history
git show <commit>:docs/archive/audits/FULL-REPOSITORY-AUDIT-OPUS5.5-2026-11-26.md
```

Do not restore archived audits as active authority. If you need to re-verify a finding, read
the relevant section below first, then recover the original from git history.

---

## 1. Audit baseline — OPUS 5.5 (2026-11-26)

**File:** `FULL-REPOSITORY-AUDIT-OPUS5.5-2026-11-26.md` (removed; git history)  
**Branch audited:** `analysis/full-scan-reconciliation` @ `c0ace2a`  
**Mode:** read-only; build/test/pack/install verified in isolated clone.

**Why it matters:** This is the audit baseline that produced **Tasks 001–015** in
[`docs/EXECUTION-PLAN.md`](../../EXECUTION-PLAN.md). Task 016 reconciliation must read it
(from git history) when comparing the batch outcome against the baseline.

### Verdict (OPUS)

> The shipped product is a coherent, local, deterministic discovery-and-handoff CLI. The code is
> small, modular, and mostly honest. The main problems are not missing features; they are
> release-gate gaps, a stale Phase 8 distribution story, and several small correctness/UX holes.

### Key findings carried into execution

| ID | Sev | Finding | Task |
|---|---|---|---|
| F1 | P1 | Cold-start CLI test timeout; fresh suite can be red. | 001 |
| F3 | P1 | Phase 8 spec/plan contradict shipped single-package distribution; no accepted decision record. | 002 |
| D-reading | P2 | Agent reading order / execution-plan routing needs reconciliation. | 003 |
| F2 | P1 | Broker routes to contractor without checking it exists / no install guidance. | 004 |
| F4 | P2 | `install` silently ignores unknown flags including `--local-only`. | 005 |
| F7 | P3 | `install --plan` plans twice. | 006 |
| F5 | P2 | Two stopword lists disagree; "add/settings/page" leak into requirements. | 007 |
| F6/F9/F10 | P2/P3/P4 | Brain staleness not surfaced; plan test writes repo `.ezy/brain.json`; "discovery only" note incomplete. | 008 |
| F8 | P3 | `inspect`/install attribute `hits[0]` when name doesn't match exactly. | 009 |
| S5 | P1 | Packaged artifact never tested by CI. | 010 |
| S4 | P2 | No prepack/prepublishOnly build; no clean dist/core. | 011 |
| S1/S2 | P2 | Unpinned `npx skills add`; no shape validation for name/source. | 012 |
| S3 | P2 | `spawn("npx")` Windows cmd issue; CI ubuntu-only. | 013 |
| S8 | P3 | engines `>=20` but CI tests only Node 22. | 014 |
| S6/S7 | P3/P4 | Tarball omits LICENSE; packed devDependencies retain `workspace:*`. | 015 |

### OPUS master TODO (historical)

The OPUS audit proposed a larger Phase 0–8 plan. The repo did **not** adopt it as-is. The
canonical audit and `docs/EXECUTION-PLAN.md` reduced it to the current 001–016 batch. Do not
re-open the larger OPUS plan without a new decision.

---

## 2. Direction audit

**File:** `FULL-REPOSITORY-DIRECTION-AUDIT.md` (removed; git history)

### Verdict

> The repo needs one authoritative product/runtime truth, a smaller trust boundary, and a clear
> separation between current implementation, approved direction, and historical evidence.

### Highest-priority findings (historical)

| Sev | Finding | Disposition |
|---|---|---|
| P0 | Lifecycle/runtime ownership conflicting instructions. | Recorded; needs ADR/decision. |
| P0 | `docs/skill-scan/` and generated artifacts dominate repo size. | Partially addressed; skill-scan still large. |
| P0 | Conversation/session exports tracked. | **Addressed 2026-11-27** by archive consolidation. |
| P1 | Trust/evaluation language stronger than runtime enforcement. | Still true; defer to design. |
| P1 | `ezy install` is the most sensitive runtime boundary. | Partly addressed by Task 012 scope. |
| P1 | `ezy inspect` exposes untrusted skill-derived terminal content. | Folded into Task 009. |
| P1 | Project Brain mostly persistent context, not active planning input. | Still true by design. |
| P1 | Contractor routing centered on Superpowers. | Intentional first slice. |

---

## 3. Full repository audit — 2026-11-25

**File:** `FULL-REPOSITORY-AUDIT-2026-11-25.md` (removed; git history)  
**HEAD:** `c06b9f7`

### Verdict

> The shipped product is a discovery-and-planning CLI. The documentation and handoffs describe
> an intent-to-outcome orchestration layer with a trust gate and a lifecycle. The gap between
> those two things is deliberate in places, accidental elsewhere, and in at least three places
> the repository contradicts itself about which is true.

### Durable value

- Baseline inventory at 149 commits / 2,133 tracked files / ~242 MB working tree.
- Identified the lifecycle contradiction (architecture says boundary; handoffs said wire it).
- Identified repo-hygiene pressure from `docs/skill-scan/`, `docs/convo/`, and generated artifacts.

---

## 4. Docs sync audit — 2026-11-25

**File:** `DOCS-SYNC-AUDIT-2026-11-25.md` (removed; git history)  
**Scope:** 111 tracked markdown files checked for status drift, contradictions, broken links.

### Durable value

- Proved the doc-reconciliation pass caught Phase 8 contradictions, stale handoff refs, and broken links.
- Recorded the deliberate "left alone" items (historical handoffs, generated scan outputs).
- Referenced by `docs/skill-scan/REANALYSIS-2026-11-24.md` for a badge-alt-text correction.

---

## 5. Iceman full audit — 2026-11-27

**File:** `FULL-REPOSITORY-AUDIT-OPENCODE-ICEMAN-FREE-2026-11-27.md` (removed; git history)

### Verdict

Adversarial, evidence-driven audit. Confirmed the OPUS findings still held, added packaging/doc
drift detail, and fed into the canonical DeepSeek consolidation.

Key confirmations: local-only semantics gap, install `--local-only` ignored, Phase 8 spec drift,
MVP spec omissions, SECURITY-MODEL staleness, brain staleness not surfaced, exact-match attribution.

---

## 6. Iceman repo-audit handoff — 2026-11-27

**File:** `REPO-AUDIT-HANDOFF-ICEMAN-FREE-2026-11-27.md` (removed; git history)

Compact model-handoff snapshot: repo identity, phase, layout, CLI surface, core runtime map,
verification run, risks, suggested next checks. Useful as orientation only.

---

## 7. Codebase gaps — 2026-11-07

**File:** `2026-11-07-codebase-gaps.md` (removed; git history)

Early probe at v0.1.4 (171 tests). Identified promises-vs-code gaps, quality issues, and
conversation-theme gaps. Its must-fix items 1–4 were shipped on 2026-11-17. Referenced by the
current handoff as historical audit evidence.

---

## Consolidation notes

- **Removed on 2026-11-27:** the 7 individual audit files above. Full text remains in git history.
- **Also removed earlier:** `convo-qwen3-span-notes.md` (generated artifact; broken source refs).
- **Kept active:** [`docs/audits/FULL-REPOSITORY-AUDIT-DEEPSEEK-V4-1-FLASH-FREE-2026-11-27.md`](../../audits/FULL-REPOSITORY-AUDIT-DEEPSEEK-V4-1-FLASH-FREE-2026-11-27.md) — the only current audit.
- **Execution authority:** [`docs/EXECUTION-PLAN.md`](../../EXECUTION-PLAN.md). Audits are evidence, not work orders.

## Reading rule

Read the canonical audit first. Use this file for historical context. Recover an original audit
from git history only when you need to re-verify a specific claim or evidence trail.