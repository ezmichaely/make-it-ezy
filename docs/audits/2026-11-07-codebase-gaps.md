# Codebase gaps — 2026-11-07

Three probes against the real CLI on `main` (v0.1.4, 171 tests green):

1. Promises vs code
2. Quality audit (`/ponytail-audit` of `packages/core/src` and `apps/cli/src`)
3. Convo themes (from `docs/convo/`) vs code

Nothing has been fixed yet.

**Status as of 2026-11-17:** the product-code tree is unchanged from the audit baseline, so findings 1–4 remain the proposed immediate maintenance tranche. The reproductions and 171-test result below are from the original audit, not fresh checks. Revalidate against the current checkout, present a short design, and get user approval before writing product code. The shared sequence is in [`../../AGENTS.md`](../../AGENTS.md) and [`../ROADMAP.md`](../ROADMAP.md).

**Resume here:** revalidate findings 1–4, then present the bounded design for approval. After that tranche, Phase 7 — Project Brain — is the next roadmap phase. Keep implementation limited to findings 1–4 unless the user approves broader scope.

---

## 1. Promises vs code

- Every command the ROADMAP marks done exists and runs. Build and tests are green.
- **The golden tests only run offline.** They use a hand-written brief with `localOnly: true` (`packages/core/src/golden.test.ts:60-64`). Real users run with the network on, and there the Stripe case breaks (finding 3).
- **The heuristic path (no brief) is weak.** It only has a negative test in the goldens, and it gives junk for vague prompts (finding 7).

## 2. Audit

**What this repo does:** a local CLI. It reads a project, turns an outcome into requirements, searches local and skills.sh skills, and picks a small set to recommend, install, or hand to the agent.

**Assumed load:** one developer running it on their own machine. Scale isn't a concern; correctness and safety on untrusted skill text are.

### Must fix

1. **Skill text can take over the terminal** (`packages/core/src/load-local-skills.ts:56-57`, `packages/core/src/search-remote.ts:56-57`)
   - **Problem:** escape codes in a skill's name, description or source are printed raw. Reproduced: a test skill changed the window title and the text colour. This breaks the shared agent rule in root [`AGENTS.md`](../../AGENTS.md) (sanitize untrusted skill text on output).
   - **Fix:** apply the existing `sanitizeText` (`packages/core/src/brief.ts:51`) to name, description and source in both loaders.
   - **If skipped:** a malicious skill controls what you see while you decide whether to trust it.

2. **Running from a monorepo subfolder finds no local skills** (`packages/core/src/find-project-root.ts:10-24`)
   - **Problem:** the root search stops at the first `package.json`. Reproduced: running `ezy plan` from `packages/core` gives root = `packages/core` and 0 local skills. `install` would also put skills in the wrong folder.
   - **Fix:** while walking up, prefer the nearest folder that has `.agents/skills` or `pnpm-workspace.yaml`. Fall back to today's logic otherwise.
   - **If skipped:** in any monorepo, Ezy ignores installed skills and recommends fresh downloads.

3. **A remote skill beats installed local skills** (`packages/core/src/select.ts:85-95`)
   - **Problem:** the greedy picker counts coverage first; "prefer local" only breaks ties. Reproduced: with the network on, the Stripe golden drops the required local `stripe-integration` and `webhook-handler` for one remote `stripe-webhooks` (599 installs, unreviewed).
   - **Fix:** run the picker over local skills first, then remote skills for what's still uncovered. Add a golden run with a fake skills.sh `fetchImpl`.
   - **If skipped:** Ezy pushes unvetted installs when vetted local skills already cover the need.

4. **YAML `|-` / `>-` descriptions are read as the literal text "|-"** (`packages/core/src/parse-skill-frontmatter.ts:36`)
   - **Problem:** only `>` and `|` are handled. Reproduced: the `claude-api` skill shows the description "|-".
   - **Fix:** `/^[>|][-+]?$/.test(rest)`. One line.
   - **If skipped:** skills written in this style are partly invisible to search.

### Should fix

5. **A slow or down skills.sh makes `plan` hang for up to 80 s** (`packages/core/src/plan.ts:119-125`)
   - **Problem:** up to 10 searches run one after another, each with an 8 s timeout.
   - **Fix:** run them with `Promise.all`, or stop asking skills.sh after the first failure.

6. **Install arguments aren't checked** (`packages/core/src/install.ts:30-36`)
   - **Problem:** `spawn` uses no shell, so shell injection is impossible. But a source or name starting with `-` becomes a flag, a name like `../x` escapes `.agents/skills`, and `npx skills` isn't pinned to a version.
   - **Fix:** check `source` against `^[\w.-]+/[\w.-]+$` and the name against `^[a-z0-9][\w.-]*$`. Pin `skills@<version>`.

7. **Vague outcomes produce junk requirements** (heuristic path, `packages/core/src/requirements.ts` / `packages/core/src/capabilities.ts`)
   - **Problem:** "make it better" gives the requirements `make` and `better`; "add a REST endpoint" gives `add`.
   - **Fix:** when no lexicon entry matches, return no requirements plus the note "run `ezy brief`".

8. **Non-JS projects are called "greenfield"** (`packages/core/src/find-project-root.ts:4`)
   - **Problem:** a FastAPI project with `pyproject.toml` is labelled "Greenfield / no project markers".
   - **Fix:** add `pyproject.toml`, `requirements.txt`, `go.mod` and `Cargo.toml` as markers, with `.git` as a fallback. Full Python support stays "next".

9. **Typo'd flags are ignored silently** (`apps/cli/src/index.ts:161`, and the plan/next/recommend flag sets)
   - **Problem:** `--local-ony` quietly goes to the network; `--yse` quietly does nothing.
   - **Fix:** exit 1 with "unknown flag".

10. **Risky code with no tests:**
    - `search-remote.ts` (parses untrusted JSON)
    - `load-local-skills.ts`
    - `doctor.ts`
    - `is-git-repo.ts`
    - the monorepo case in `find-project-root.ts`

    One test per fix for findings 1–4 covers the risky parts.

### Nice to have

11. **Lean:** two things can be deleted, about -15 lines in total.
    - `skipHints` duplicates `exclusions`, and only tests read it (`packages/core/src/requirements.ts:50, 114-143`).
    - The `remoteOnly` option is never set by the CLI (`packages/core/src/search.ts:11`).

**Verdict:** fix 1–4 first, each roughly 1 to 15 lines. Findings 1 and 3 break the project's own promises: sanitize untrusted text, and prefer vetted local skills.

**Not checked:** `format.ts` and `inspect-skill.ts` (read only in part), the TTY arrow picker, and a real `npx skills add` install.

## 3. Convo themes vs code

| Theme | In the code? |
|---|---|
| **A. Token and cost awareness:** context and setup cost in scoring, a cost hint per skill, a rule for when to recommend Graphify | Nothing |
| **B. Project Brain:** incremental updates, task-scoped slices, a ~1–3 KB budget, inspectable, no secrets | Nothing (Phase 7) |
| **C. Intake:** "don't ask what you can discover", assumptions and unknowns in the brief | Briefs work; the heuristic fallback is poor (finding 7); no assumptions field |
| **D. Trust:** content-hash pinning, no competing frameworks, security only when it matters | Risk notes in `inspect`; no hashing or competing-framework rule; security is added only via a brief (the heuristic Stripe plan has none) |
| **E. Verification:** SUCCESS / PARTIAL / FAILED / NEEDS HUMAN REVIEW, plus a final report | Nothing (Phase 8) |
| **F. Detecting existing agent config:** `.claude/`, `CLAUDE.md`, `.mcp.json` | Nothing |

## Related decisions from this session

- **`docs/convo/` is archived research only** (personal chat exports). It is tracked for history but must not drive product decisions—use [`AGENTS.md`](../../AGENTS.md), [`../ROADMAP.md`](../ROADMAP.md), and [`../handoff/MAKE-IT-EZY-CANONICAL-HANDOFF.md`](../handoff/MAKE-IT-EZY-CANONICAL-HANDOFF.md).
- **Don't import numbers from the convos.** Skill counts, model prices, "OmniRoute 7B free tokens", install counts and Graphify Pro pricing are all wrong or unsourced.
- **Closest competitor:** Anthropic's official `claude-code-setup` plugin (`anthropics/claude-plugins-official/plugins/claude-code-setup`). It is prompt-only, Claude Code only, set up once per project, and recommends hooks, MCP servers, subagents and skills. Ezy differs by working per task, researching first, explaining exclusions, working across hosts, and gating installs. `docs/research/REFERENCE-DIRECTORY.md:78` still marks it UNRESOLVED.
- **Suggested order:** fix 1–4, then design Phase 7 — Project Brain. Themes A and B (token/context cost and persistent project knowledge) can inform that design; “token economy” is a design lens, not a phase rename or a change to the roadmap.
