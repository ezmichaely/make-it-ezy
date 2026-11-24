# Claude Implementation Command — Review Fix Pass

> **Status (2026-11-25): historical instruction, not current direction.** It states "The evaluator must not remain a dead contract or helper", which conflicts with [`docs/architecture/ARCHITECTURE.md`](../architecture/ARCHITECTURE.md) (lifecycle = boundary contract, not runtime). It also targets `docs/shared-evidence-self-improvement` / PR #21, not this branch. Full audit §6 records the conflict; work-plan item 1 proposes the ADR.

You are taking over the Make It Ezy review/fix pass on this branch:

- Repository: `ezmichaely/make-it-ezy`
- Branch: `docs/shared-evidence-self-improvement`
- PR: #21
- Base: `main`

## Mission

Start by reading this command and then independently inspect the entire branch. Treat the existing branch as the current source of truth, not this document alone.

Your job is to **implement the fixes identified by the architecture/review audit**, not merely summarize them.

Do not redesign Make It Ezy. Preserve the existing architecture and decisions unless the repository itself proves they are inconsistent.

## Required review/fix areas

### 1. Audit the whole repository first

Inspect:

- `packages/core`
- CLI/packages
- skill discovery/selection/routing
- planner/handoff code
- all lifecycle-related docs
- `docs/architecture/`
- `docs/handoff/`
- `docs/ROADMAP.md`
- `docs/ezy-routing/`
- `docs/convo/`
- root documentation/config
- tests
- CI/workflows
- current git diff against `main`

Do not assume the existing docs accurately describe the implementation. Verify code and docs against each other.

### 2. Fix lifecycle implementation gaps

The intended lifecycle is:

intent → understand/clarify → requirements → capability planning → discovery → skill evaluation → skill specification/composition → specialist/contractor/workflow → execution → outcome verification → evidence → aggregation → improvement proposal → controlled validation/approval

The branch already contains the first stable lifecycle contract slice. Build on it instead of creating duplicate abstractions.

Pay particular attention to:

- `IntentIntake`
- clarification as an actual planning boundary
- `SkillEvaluation`
- `SkillSpec`
- outcome verification/evaluation
- shared evidence
- improvement proposals

### 3. Wire the Skill Evaluator into real selection

This is a major requirement.

The evaluator must not remain a dead contract or helper.

Trace the real candidate-selection path and integrate evaluation so that candidate skills can become:

- eligible
- review
- rejected

The existing heuristic selector should not simply be deleted. Preserve useful ranking behavior where appropriate, but make trust/security/compatibility/task-fit evaluation an explicit part of the selection flow.

Do not fake evaluation values just to make tests pass.

### 4. Wire SkillSpec/composition into planning/handoff

The internal `SkillSpec` should become useful to the planner/handoff flow.

Do not replace existing `SKILL.md` artifacts. `SKILL.md` remains the external skill definition/source artifact; `SkillSpec` is the internal runtime/planning contract.

Avoid introducing two competing representations of the same lifecycle concept.

### 5. Make clarification a real boundary

If the request contains blocking unknowns or decisions, the planner should not silently proceed as if requirements were complete.

Use the existing clarification/intake contract.

Do not turn every missing detail into a blocking question. Only block when the unknown materially affects the plan, capability choice, safety/trust, execution, or verification.

### 6. Keep execution completion separate from outcome success

Do not equate:

- command completed
- process exited successfully
- artifact exists

with:

- requested outcome was actually achieved

Preserve the `PASS / FAIL / UNCERTAIN` model.

If execution completed but verification evidence is insufficient, the result should be capable of being `UNCERTAIN`, not falsely marked successful.

Full autonomous execution/retry behavior is still Phase 9 unless the existing architecture clearly requires a small boundary integration.

### 7. Review shared evidence for privacy and aggregation correctness

Shared evidence must remain privacy-safe.

Do not introduce:

- user identifiers
- raw prompts
- raw conversation content
- secrets
- private repository contents
- arbitrary personal data

into shared evidence.

Review whether `agent`, `model`, task classes, capabilities, and skill names can leak unnecessary identifying information.

Also inspect aggregation semantics. The current implementation groups combinations of capabilities/skills. Verify that multi-capability or multi-skill events do not accidentally inflate success/failure counts.

### 8. Keep self-improvement controlled

The intended loop is:

Observe → Aggregate → Evaluate → Propose → Validate → Approve → Deploy

Do NOT implement autonomous self-modifying behavior.

Improvement proposals must remain explicit, reversible, evidence-backed, and subject to validation/approval.

Do not expand Phase 8 into an autonomous agent-learning system.

### 9. Review Phase boundaries

Respect the roadmap.

Phase 8 should establish stable contracts and controlled evidence/improvement foundations.

Do not pull in:

- autonomous agent spawning
- unrestricted self-modification
- hosted telemetry infrastructure
- third-party runtime services
- full autonomous retry loops
- unrelated routing systems

unless the repository already requires them for correctness.

### 10. Public repository privacy issue

The repository is public again.

Inspect `docs/convo/` carefully.

Those files contain raw historical conversation exports and are not appropriate as a public source-of-truth architecture surface.

Do not blindly rewrite git history or delete files without understanding the impact.

Instead:

1. identify exactly what should be removed/sanitized;
2. check whether any sensitive material is present;
3. recommend the safest remediation;
4. if the fix is clearly safe and in-scope, implement it;
5. if it requires a destructive/history rewrite decision, stop and clearly report the required decision.

Do not treat `docs/convo/` as current architectural authority.

### 11. Documentation consistency

After code changes, update documentation so it reflects what actually exists.

In particular verify:

- capability model
- shared-evidence learning doc
- roadmap
- handoff
- routing docs
- root README/docs where relevant

Avoid speculative claims such as "implemented" when only a contract exists.

### 12. Tests and validation

Run the repository's actual checks.

At minimum, determine and run the appropriate:

- unit tests
- typecheck
- lint
- build
- package validation
- CI-equivalent checks where practical

Do not claim a check passed unless you actually ran it and observed the result.

If something fails, fix it when the failure is in scope.

## Important implementation constraints

- Preserve public APIs unless there is a strong reason to change them.
- Prefer the smallest coherent implementation.
- Do not duplicate lifecycle types/contracts.
- Do not create parallel abstractions for concepts already represented in `packages/core/src/lifecycle-types.ts` and `lifecycle.ts`.
- Keep external skill definitions separate from internal runtime specs.
- Keep trust/evaluation distinct from performance evidence.
- Keep evidence aggregate-safe.
- Avoid hard-coding specific model/vendor identities into product logic.
- Do not implement research ideas merely because they are mentioned in documentation.
- Do not overengineer.

## Final audit

Before finishing:

1. Review your own diff against `main`.
2. Check for duplicated abstractions.
3. Check that docs match code.
4. Check that lifecycle contracts are actually connected to the relevant runtime/planning path.
5. Check privacy/security implications.
6. Run tests/checks again if you made fixes after the first run.
7. Report:
   - what you changed
   - what remains intentionally unimplemented
   - tests/checks run and exact results
   - any blockers requiring a product/security decision

Start now. Do not stop at analysis or produce only a review report. Implement the safe, in-scope fixes directly on this branch.