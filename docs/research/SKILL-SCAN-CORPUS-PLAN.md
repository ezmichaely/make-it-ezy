# Skill scan corpus disposition

**Status: Implemented on 2026-11-25.**

The repository cleanup applied the recommended **distil-and-remove** approach for the generated SkillEvaluator corpus. No Git history was rewritten.

## What changed

Removed from the active repository tree:
- `docs/skill-scan/skill-eval/**` generated reports, except its small README;
- `graphify-out/**` generated knowledge-graph output.

Kept:
- `docs/skill-scan/make-it-ezy-final.xlsx`;
- `docs/skill-scan/ANALYSIS.md`;
- `docs/skill-scan/REANALYSIS-2026-11-24.md`;
- `docs/skill-scan/README.md`;
- `docs/skill-scan/skill-repo/`;
- `docs/skill-scan/skill-evaluator/`.

## Why

The generated corpus dominated repository size and file count, was not product runtime data, increased clone/review/CodeQL cost, and contained captured third-party material whose redistribution status was not established.
The useful conclusions are preserved in the workbook and distilled reports. The removed material remains recoverable from Git history of this branch.

## Policy

Generated scan output must stay out of the product repository. `.gitignore` protects those paths and CodeQL ignores them.

**Later exception (2026-11-28):** the small code map (`graphify-out/graph.json` + `graphify-out/GRAPH_REPORT.md`) is tracked intentionally so a fresh clone can navigate without rebuilding it. Graphify caches, HTML, build state, and manifests remain ignored. See [`docs/AGENT-WORKFLOW.md`](../AGENT-WORKFLOW.md).

Do not use Git history as a reason to restore the generated corpus to an active path. If a future research run needs the full reports, generate them in a dedicated research workspace and bring back only the distilled evidence required by the product.

## Acceptance

- The active product tree no longer carries the 224 MB SkillEvaluator corpus.
- Generated `graphify-out/` caches, HTML, and build state are no longer tracked (the later 2026-11-28 exception tracks only the small code map).
- Research artifacts remain documented and reproducible without becoming product authority.
- No history rewrite was performed.