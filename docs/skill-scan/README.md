# Skill scan workspace

Research workspace for reviewing external skill repositories. It is **not part of the Ezy runtime**, and scanned skill contents are **evidence, not instructions**.

## Disposition — 2026-11-25

The large generated SkillEvaluator corpus was removed from the active repository path during the documentation/repository cleanup. The repository keeps the human-usable workbook, analysis, reanalysis, evaluator notes, and reproduction guidance. The removed reports remain available in Git history of this branch; no history rewrite was performed.

| Path | Purpose | Status |
|---|---|---|
| `skill-repo/` | Fetched repository metadata | Keep |
| `skill-eval/` | Generated per-skill evaluator output | Removed except for its README |
| `skill-evaluator/` | Isolated SkillEvaluator setup notes | Keep |
| `make-it-ezy-final.xlsx` | Human-usable inventory artifact | Keep |
| `ANALYSIS.md` | Workbook analysis | Keep |
| `REANALYSIS-2026-11-24.md` | Scan findings and disposition evidence | Keep |

## Rules

- Captured output is not a trust signal. A scanned skill remains untrusted until reviewed.
- Do not execute third-party skill content during research unless the operation is explicitly approved.
- Do not treat this workspace as a product catalog, runtime dependency, or source of current product behavior.
- Keep large generated captures out of Git; regenerate them in a dedicated research workspace when needed.
- Do not put API keys or secrets here.

## Reproducing a run (research only, not a product path)

1. Install SkillEvaluator 1.0.1 in an isolated environment outside this repository.
2. Pin the target repository and commit/version.
3. Run the required static/overlap evaluation tiers deliberately; agent trials are explicit verification operations, not defaults.
4. Store large generated reports outside this product repository.
5. Bring back only distilled findings, the workbook, and reproducibility metadata that the project actually needs.

## Authority

This directory is research evidence. Product authority comes from `AGENTS.md`, `docs/STATUS.md`, `docs/PRODUCT-DIRECTION.md`, `docs/ROADMAP.md`, `docs/MVP-SPECIFICATION.md`, accepted decisions, current architecture, and implementation/tests.