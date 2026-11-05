---
name: ezy
description: >
  Make It Ezy — discover, gated-install, and apply the minimum useful skills for
  an outcome, then KEEP BUILDING in the current project. Use when the user says
  /ezy, "make it ezy", "use ezy", or describes an outcome like "build me…",
  "improve…", "add…" and wants skill discovery before coding. Do not stop after
  the CLI prints a handoff prompt.
---

# Make It Ezy (agent adapter)

You are running **Make It Ezy** inside this session. The CLI finds skills; **you** implement the outcome. Ending the turn after only showing CLI output is a failure.

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
2. **Handoff:**  
   `ezy next "<outcome>"`  
   (or the `node …/dist/index.js next "…"` form). Use network unless the user asked for `--local-only`.  
   Planning is **project-aware** (uses the current project + outcome; prefers a minimum skill set).
3. **Show** Project / Requirements / Skills / Checklist briefly to the user.
4. **Install (gated):** If the checklist lists `ezy install …`, ask for approval, then run those install commands (include `--source` when the checklist provides it). Do **not** pass `--yes` unless the user already approved non-interactive install.
5. **Re-run** `ezy next "<outcome>"` after installs if skills were missing before.
6. **Execute the Prompt block:**  
   - Read each listed skill’s `SKILL.md` under `.agents/skills/<name>/`  
   - Follow those skills  
   - Implement the outcome in this project  
   - Prefer verified/low-risk behavior; do not invent skill names
7. **Anti-stop:** After step 2–5, continue into step 6 in the same effort. Never report “CLI only printed a handoff” as done.

## Empty / new folders

Proceed even if there is no `package.json`. Skills install into cwd `.agents/skills/`. Optionally note that adding a minimal `package.json` helps project detection — do not block on it.

## Trust

Popularity ≠ safety. External skills are untrusted until inspected. Offer `ezy inspect <name>` when risk is unclear. This skill does **not** claim deep verification.

## Examples

```text
User: /ezy build me a profile page
→ next "build me a profile page" → approve installs → read SKILL.md paths → build the page here
```

```text
User: use make it ezy to improve onboarding in this repo
→ same procedure with outcome "improve onboarding"
```
