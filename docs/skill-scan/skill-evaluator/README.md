# Local SkillEvaluator setup

SkillEvaluator 1.0.1 was used for the captured local run, but `.venv/` is intentionally untracked. A fresh checkout must install SkillEvaluator before using `run-local.sh`. This workspace is separate from the Ezy repository and the third-party repos being scanned.

## Local models

- Chat and analysis: Ollama model configured by `SKILL_EVAL_LLM_MODEL` (the captured run used `qwen3.5:27b`)
- Embeddings for comparison: Ollama model configured by `SKILL_EVAL_EMBEDDING_MODEL` (the captured run used `nomic-embed-text`)
- API endpoint: `http://127.0.0.1:11434/v1`

Run `./run-local.sh --help` from this folder. The wrapper points SkillEvaluator to the local Ollama API and does not use an external model provider. Ollama must be running, with both model names available.

## Run a scan

From this folder, replace `repo-name` with a folder under `../skill-repo/`:

```sh
./run-local.sh tier1 ../skill-repo/repo-name --no-llm -o ../skill-eval/repo-name/tier1
./run-local.sh tier2 ../skill-repo/repo-name -o ../skill-eval/repo-name/tier2
```

Tier 1 checks files without running repository scripts. Tier 2 uses the local embedding model for similarity checks and the configured local LLM for model-backed analysis. Reports go into the matching folder under `../skill-eval/`.

Keep fetched repositories under `../skill-repo/`. Do not execute scripts from a repository before reviewing it. Tier 3 live agent testing is a separate setup and may require an agent runtime and sandbox.
