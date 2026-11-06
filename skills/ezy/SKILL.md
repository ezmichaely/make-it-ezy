---
name: ezy
description: >
  Make It Ezy — discover, gated-install, and apply the minimum useful skills for
  an outcome, then KEEP BUILDING in the current project. Use when the user says
  /ezy, "make it ezy", "use ezy", or describes an outcome like "build me…",
  "improve…", "add…" and wants skill discovery before coding. Writes a researched
  brief first, then plans from it. Do not stop after the CLI prints a handoff prompt.
---

# Make It Ezy (agent adapter)

You are running **Make It Ezy** inside this session. The CLI finds skills; **you** implement the outcome. Ending the turn after only showing CLI output is a failure.

**Scope:** Ezy is built for **coding tasks in a repo** today. For non-code outcomes, still run the flow, but expect *Uncovered* requirements and handle them directly.

## Resolve the CLI

Prefer, in order:

1. `ezy` on `PATH`
2. `node "$MAKE_IT_EZY_ROOT/apps/cli/dist/index.js"` when `MAKE_IT_EZY_ROOT` is set
3. Ask the user for their Make It Ezy checkout path; then use  
   `node <that-path>/apps/cli/dist/index.js`

If the binary/dist is missing, run `pnpm build` inside the Make It Ezy repo and retry. Do not skip the CLI.

Always run commands with **cwd = the project the user wants changed** (not the Make It Ezy repo, unless that *is* the project).

## Procedure

1. **Clarify the outcome** in one short phrase if the user was vague.
2. **Brief:** run `ezy brief "<outcome>"` (or the `node …/dist/index.js brief "…"` form). It prints the project summary, research instructions, the brief schema, and the next command. Research the outcome as instructed (classify the research type; research only what the decision needs; prefer primary sources and record each `source`; list exclusions with reasons), then write `.ezy/brief.json`. Trivial outcomes may skip this step; planning then falls back to heuristics and says so.
3. **Handoff:**  
   `ezy next "<outcome>" --brief .ezy/brief.json`  
   (omit `--brief` if you skipped the brief). Use network unless the user asked for `--local-only`. If it exits 2, fix the brief at the reported paths and re-run.  
   Planning is **project-aware** (uses the current project + outcome + brief; prefers a minimum skill set).
4. **Show** Project / Requirements / Skills / Checklist briefly to the user.
5. **Install (gated):** If the checklist lists `ezy install …`, ask for approval, then run those install commands (include `--source` when the checklist provides it; add `--brief .ezy/brief.json` only to `ezy install --plan …` commands, if you used a brief). Do **not** pass `--yes` unless the user already approved non-interactive install.
6. **Re-run** `ezy next "<outcome>" [--brief .ezy/brief.json]` (brief only if used) after installs if skills were missing before.
7. **Execute the Prompt block:**  
   - Read each listed skill’s `SKILL.md` under `.agents/skills/<name>/`  
   - Follow those skills  
   - Implement the outcome in this project  
   - Prefer verified/low-risk behavior; do not invent skill names
8. **Anti-stop:** After steps 2–6, continue into step 7 in the same effort. Never report “CLI only printed a handoff” as done.

## Empty / new folders

Proceed even if there is no `package.json`. Skills install into cwd `.agents/skills/`. Optionally note that adding a minimal `package.json` helps project detection — do not block on it.

## Trust

Popularity ≠ safety. External skills are untrusted until inspected. Offer `ezy inspect <name>` when risk is unclear. The brief is your output; Ezy validates its shape but does not verify your findings — cite sources. This skill does **not** claim deep verification.

## Examples

```text
User: /ezy build me a profile page
→ brief "build me a profile page" → research, write .ezy/brief.json → next … --brief .ezy/brief.json → approve installs → read SKILL.md paths → build the page here
```

```text
User: use make it ezy to improve onboarding in this repo
→ same procedure with outcome "improve onboarding"
```
