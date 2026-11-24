# `docs/skill-scan/` — what it is and what to do with it

**Date:** 2026-11-25
**Status:** Proposal. **Nothing has been moved, deleted, compressed or rewritten.** No file under `docs/skill-scan/` was changed by this pass; no Git history was rewritten.
**Related:** [`../audits/FULL-REPOSITORY-AUDIT.md`](../audits/FULL-REPOSITORY-AUDIT.md) §3, §12 (S4), §15 (F-11, F-12) · [`../work-plan/FOLLOW-UP-WORK-PLAN.md`](../work-plan/FOLLOW-UP-WORK-PLAN.md) item 13 · same question for `graphify-out/`.

## 1. What is actually in there

Measured on this branch with `du -sh` and `git ls-files`:

| Path | Size | Tracked files | What it is |
|---|---|---|---|
| `docs/skill-scan/` | **224 MB** | 1,287 | Captured SkillEvaluator run + fetched repositories |
| `docs/skill-scan/skill-eval/` | 224 MB | ~1,283 | Generated reports: 429 JSON, 427 HTML, 4.1 MB `skill-catalog.json` |
| `docs/skill-scan/skill-repo/` | 8 KB | few | Fetched repo metadata (payloads were not kept) |
| `docs/skill-scan/skill-evaluator/` | 16 KB | few | Wrapper/setup notes for SkillEvaluator 1.0.1 |
| `docs/skill-scan/make-it-ezy-final.xlsx` | 88 KB | 1 | The human-usable artifact: 6 sheets, 435 inventory rows, 40 domains + 36 meta-skills |
| `docs/skill-scan/ANALYSIS.md` | 8 KB | 1 | Sheet-by-sheet summary of the workbook |
| `docs/skill-scan/REANALYSIS-2026-11-24.md` | 16 KB | 1 | The scan's own report (branch, method, findings, what it fixed) |
| `docs/skill-scan/README.md` | 4 KB | 1 | Workspace rules ("not part of the Ezy runtime") |
| `graphify-out/` | 14 MB | 634 | Generated knowledge-graph output (same class of problem) |

Together these are **1,921 of the 2,133 tracked files (90%)** and roughly **98% of the 242 MB working tree**.

## 2. Why it needs a decision, not just a tidy-up

1. **It contradicts a documented policy.** [`../BUILDER-SKILLS.md`](../BUILDER-SKILLS.md) says vendored material stays out of git "to keep GitHub language stats and repo size honest". The same repo tracks 224 MB of generated research output and 634 graph files.
2. **Review cost is structural.** Any `git log --stat`, clone, CI checkout or CodeQL run pays for it. 90% of tracked files are evidence nobody diffs.
3. **Redistribution status is unknown.** `skill-eval/` contains captured third-party skill text and generated HTML. The audit records this as risk **S4**; "captured for research" is not a licence.
4. **It dilutes the product story.** `ANALYSIS.md` says "100% Complete!" about a workbook. A reader can mistake that for product coverage; the file's own recommendations now say it does not mean that, but the headline remains.
5. **It is still useful.** The workbook + `REANALYSIS` are the best evidence the project has for *what the ecosystem contains* — which is exactly what a future `ezy coverage` (work-plan item 10) needs. Deleting the thinking to save bytes would be the wrong trade.

The question is therefore **not "keep or delete"** but **"which layer belongs in the product repo, and where does the raw evidence live?"**

## 3. Options

| Option | What it means | Cost | Risk | Reversible |
|---|---|---|---|---|
| **A. Keep as-is** | No change | 0 | Size stays; CodeQL and clones stay heavy; licence question unresolved | — |
| **B. Move the corpus to a sibling repo** (`make-it-ezy-skill-scan`), keep a pointer | `git rm -r docs/skill-scan/skill-eval`, push it to its own repo with its README and the reproduction recipe | M | Two repos to keep in sync; the evidence is no longer next to the code that cites it | Yes (history keeps it) |
| **C. Move to a release asset / tarball** | Attach `skill-eval.tar.zst` to a GitHub release; repo keeps hashes + recipe | S | Assets can be deleted; less discoverable | Yes |
| **D. Distil and delete** | Keep workbook + `ANALYSIS.md` + `REANALYSIS` + recipe (<1 MB), remove the 224 MB `skill-eval/` tree | S–M | Loses per-skill reports unless one is archived | Yes (git history) |
| **E. Git LFS / submodule** | LFS pointers or a submodule | M | LFS quota and clone friction; submodules break offline clones | Partly |

## 4. Recommendation: D + C, with a gate

**Keep in the repo (< 1 MB):**

- `docs/skill-scan/make-it-ezy-final.xlsx` — the only artifact a human can actually use.
- `ANALYSIS.md`, `REANALYSIS-2026-11-24.md`, `README.md` — what was scanned, how, what it concluded.
- A **reproduction recipe** (`README.md` section): evaluator version, target repos + commits, model, command shape, and a warning that it needs Python and network and is not a product path.
- **Hashes** of what was removed (a small `MANIFEST.sha256`), so a future run can prove equivalence.

**Move out of the repo (224 MB of `skill-eval/`):**

- Publish the tree as one release asset (option C) **or** to a sibling evidence repo (option B) if it must stay browsable. Prefer the release asset: one artifact, one hash, no second repo to maintain.
- Keep exactly **one** representative report in-repo as a format sample (`skill-eval/<repo>/run-2026-11-18/` summary only) so the docs' claims stay checkable.

**Then make the policy enforced, not aspirational:**

- CI gate: fail if tracked files exceed a size/count threshold, or if new paths match `docs/skill-scan/skill-eval/**`, `graphify-out/**`, `*.pid`.
- `.gitignore`: uncomment/repair the `#graphify-out/` and `# skill-scan/*` lines so the intent is visible (currently commented out).
- CodeQL: exclude `docs/skill-scan/**` and `graphify-out/**` (audit §12 S4 notes it currently scans them).

## 5. Migration steps (in order, when approved)

1. Freeze: no new captures until the move is done (otherwise the corpus regrows mid-migration).
2. Record hashes: `find docs/skill-scan/skill-eval -type f -print0 | sort -z | xargs -0 sha256sum > /tmp/manifest.sha256`.
3. Build the archive: `tar --zstd -cf skill-eval-2026-11-18.tar.zst -C docs/skill-scan skill-eval` (expect a large reduction; JSON/HTML compress well).
4. Attach the archive to a release or the sibling repo, and record its URL + hash in `docs/skill-scan/README.md`.
5. `git rm -r docs/skill-scan/skill-eval` and commit with the manifest, keeping the workbook and the three markdown files.
6. Add the CI gate and CodeQL exclusion in the same PR (otherwise the next capture re-adds the weight).
7. Update `README.md`, `docs/ROADMAP.md` scope note (if it mentions the corpus) and work-plan item 13 to *implemented*.
8. **Do not** run `git filter-repo`/BFG to purge history as part of this. History rewriting breaks every clone and every open PR; if the licence question truly requires removal from history, that is a separate, explicitly approved operation.

## 6. Explicit non-goals

- Do **not** turn the workbook into a product catalog, a skill registry, or an install source. It is research evidence (`docs/skill-scan/README.md` says the workspace is not part of the runtime).
- Do **not** delete the workbook — it is the cheapest thing in the tree and the most useful.
- Do **not** make the corpus a submodule or LFS default: both add clone friction to a repo whose selling point is a small local CLI.
- Do **not** let the evaluator become a runtime dependency because its output lives nearby. Tier 1/2 evaluation stays a research operation (see `REANALYSIS-2026-11-24.md` §6).

## 7. Acceptance criteria

- `git ls-files | wc -l` drops from 2,133 to roughly **250**.
- Working tree drops from 242 MB to **under 20 MB**.
- `du -sh docs/skill-scan` is **under 1 MB** and the directory still explains what was removed, why, and how to regenerate it.
- CI fails on a new 10 MB generated artifact (prove it with a throwaway branch).
- No product doc needs a broken-link fix after the move (verify with a link check; see `docs/audits/DOCS-SYNC-AUDIT-2026-11-25.md`).

## 8. Open questions for the owner

1. Release asset or sibling repo — is the evidence expected to be *browsable*, or only *retrievable*?
2. Is the third-party content in `skill-eval/` redistributable under its captured form? If not, option D becomes option "delete without republishing".
3. Does `graphify-out/` move in the same change, or separately? Same class, different owner (build artifact vs research).
