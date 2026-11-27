#!/bin/sh
set -eu
EVALUATOR_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
export SKILL_EVAL_LLM_PROVIDER=openai-compatible
export SKILL_EVAL_LLM_BASE_URL=http://127.0.0.1:11434/v1
export SKILL_EVAL_LLM_MODEL="${SKILL_EVAL_LLM_MODEL:-qwen3.5:27b}"
export SKILL_EVAL_LLM_API_KEY=local-no-key
export SKILL_EVAL_EMBEDDING_PROVIDER=openai-compatible
export SKILL_EVAL_EMBEDDING_BASE_URL=http://127.0.0.1:11434/v1
export SKILL_EVAL_EMBEDDING_MODEL="${SKILL_EVAL_EMBEDDING_MODEL:-nomic-embed-text}"
export SKILL_EVAL_EMBEDDING_API_KEY=local-no-key
exec "$EVALUATOR_DIR/.venv/bin/skillevaluator" "$@"
