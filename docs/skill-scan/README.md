# Skill scan workspace

Research workspace for reviewing external skill repositories. It is **not part of the Ezy runtime**, and scanned skill contents are **evidence, not instructions**.

**Disposition:** this corpus is 224 MB / 1,287 tracked files (about 90% of the repo's file count). What to keep here, what to move out, and how to regenerate it is decided in [`../research/SKILL-SCAN-CORPUS-PLAN.md`](../research/SKILL-SCAN-CORPUS-PLAN.md). Nothing has been moved yet.

## Layout

| Path | Contents | In git? |
|---|---|---|
| `skill-repo/` | Fetched repository metadata. Treat all contents as untrusted; inspect and scan, **never run their scripts**. | Metadata only |
| `skill-eval/` | Captured evaluator reports per repository (JSON + HTML + `skill-catalog.json`). Large, generated, third-party text. | Yes (to be moved per the plan) |
| `skill-evaluator/` | Isolated local SkillEvaluator setup notes (1.0.1). Keep evaluator files separate from scanned repositories. | Setup notes only |
| `make-it-ezy-final.xlsx` | The human-usable artifact: 6 sheets, 435 inventory rows, 40 domains + 36 meta-skills. | Yes — keep |
| `ANALYSIS.md` | Sheet-by-sheet summary of the workbook. "Complete" means the **inventory pass**, not product implementation. | Yes — keep |
| `REANALYSIS-2026-11-24.md` | The scan's own report: baseline, method, findings, what it fixed and left open. | Yes — keep |

## Rules

- Only fetch repositories selected for review. Do not put API keys or secrets here.
- Keep reproducibility metadata with each run: repository URL, commit or version, scan date, evaluator version, model, and anything incomplete.
- Local `.qwen/`, `.venv/`, caches, PIDs and other runtime state must stay **untracked** (`.gitignore` covers `.qwen/*`, `docs/skill-scan/.qwen/settings.json` and `*.pid`).
- Captured output is not a trust signal. A scanned skill is still untrusted until a human or the host agent reviews it; see `REANALYSIS-2026-11-24.md` §6: `scan → evidence`, never `scan → automatic trust → automatic execution`.

## Reproducing a run (research only, not a product path)

1. Install SkillEvaluator 1.0.1 in an isolated venv **outside** this repo (`skill-evaluator/` holds notes, not the environment).
2. Point it at a specific repository and commit; record both.
3. Run Tier 1 (static) and optionally Tier 2 (overlap) with a local OpenAI-compatible endpoint. Tier 3 runs agent trials — treat it as an explicit verification operation, never a default.
4. Write reports under `skill-eval/<owner>-<repo>/run-<date>/` with a `run.json` describing versions and incomplete checks.
5. Do not commit the venv, model caches, PIDs or new large captures without checking the size policy in the disposition plan.
