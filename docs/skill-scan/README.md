# Skill scan workspace

Temporary workspace for reviewing external skill repositories.

- `skill-repo/`: fetched repositories. Treat all contents as untrusted; inspect and scan without running their scripts.
- `skill-eval/`: evaluator reports, organized by repository.
- `skill-evaluator/`: isolated local SkillEvaluator setup; keep evaluator files separate from scanned repositories.

Only fetch repositories selected for review. Do not put API keys or other secrets here.
