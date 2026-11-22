# Broker-Orchestrated Skills Design

**Status:** Approved (first slice landed in core + adapter — dogfood with `ezy next`)  
**Date:** 2026-11-18  
**Implementation snapshot:** 2026-11-19 (see [Implementation status vs plan](#implementation-status-vs-plan-2026-11-19))

## Intent

Make It Ezy should act as a broker that turns a user's desired outcome into an ordered workflow and directs the host coding agent to use suitable specialist skills for each part. Ezy coordinates the work; the host agent performs it.

For example, for "design and build a house," Ezy could identify architecture, structural engineering, construction, steelwork, tiling, and roofing capabilities. It should find candidate skills, assess whether they fit and can be trusted, arrange their work in a useful order, and tell the host agent which skill to use at each step.

The user should be able to give one outcome (for example, `/ezy gama ani`) and have Ezy coordinate the necessary stages toward that outcome, instead of stopping after recommending a bundle for the user to hand-coordinate. The exact code-change sequence is an implementation choice; the product outcome and division of responsibility are the requirements.

## Goals

- Ezy understands the requested outcome and breaks it into specialist work stages.
- Ezy maintains or queries a skill catalog as its known pool of specialist workers.
- The catalog can represent both individual skills and skill sets/contractors that bring their own internal workflow, such as Superpowers.
- When the catalog lacks a suitable specialist, Ezy can search for candidates, including skills hosted on GitHub, and evaluate their fit, provenance, and trust before adding or recommending them.
- If no suitable external or catalog skill exists, Ezy can define a task-specific specialist instruction for the host agent to use as a temporary fallback.
- Ezy composes a minimum useful set of skills and orders their work, including relevant dependencies and handoffs between stages.
- Ezy directs the host agent to run each selected skill at the appropriate stage and to carry forward useful results.
- The host agent remains responsible for executing skills and producing the requested result.
- The user can inspect and control the proposed workflow and any installation or use of external skills.

## Non-goals

- Ezy does not itself do the specialist work or become another coding agent.
- Ezy is not a generic multi-agent runtime, skill marketplace, or blind GitHub skill installer.
- This design does not decide the exact GitHub discovery, trust scoring, or runtime adapter implementation.
- This design does not authorize silently installing or executing third-party content.

## Approaches considered

1. **Recommendation and handoff (current model):** Ezy chooses skills and prepares a handoff; the host agent decides how to use them. This is simple but leaves sequencing and coordination to the user or host agent.
2. **Broker-directed workflow (selected):** Ezy chooses and orders specialist skills, defines their tasks and handoffs, and instructs the host agent to run them stage by stage. This matches the user's broker analogy while keeping execution with the host agent.
3. **Ezy executes skills itself:** Ezy loads and runs skill instructions as an autonomous worker. This does not match the desired division of responsibility and would move Ezy toward being the worker/agent.

## Selected direction

Use approach 2. A specialist skill is like a trade contractor's expertise; Ezy is the broker that determines which expertise is needed and in what sequence; Cursor, Claude Code, Codex, or another host agent is the worker that carries out those instructions in the repository.

At a high level:

```text
User outcome
    ↓
Ezy translates the request into a task brief and identifies work stages
    ↓
Ezy searches its skill catalog for needed specialists
    ↓ (when coverage is missing)
Ezy discovers and evaluates candidate GitHub skills
    ↓
Ezy chooses a suitable contractor/skill set (for example, Superpowers)
or composes individual specialist skills
    ↓
Ezy directs the host agent stage by stage
    ↓
Host agent runs skills and creates the result
    ↓
Ezy coordinates remaining stages and completion
```

Ezy's task brief and a selected contractor's own intake process are separate layers. For example, Ezy may identify that a software task fits Superpowers and give the host agent the outcome/context; the host agent then uses Superpowers Brainstorming to refine the design with the user and follows the contractor's relevant workflow. Ezy routes and coordinates the contractor, while the host agent follows the skills and performs the work.

### Intended user flow

1. The user describes an outcome in `/ezy`.
2. Ezy creates enough task/project context to understand what kinds of work are needed.
3. Ezy looks in its known catalog for individual skills and contractor-style skill sets; if coverage is missing, it searches available external sources such as GitHub/skills.sh.
4. Ezy evaluates task fit and trust evidence, then chooses either a suitable contractor as a unit (for example, Superpowers for a software-development workflow) or a composed set of individual skills.
5. If no suitable candidate exists for a stage, Ezy creates temporary task-specific instructions for the host agent.
6. Ezy presents/directs the stages and their handoffs. The host agent runs the chosen contractor's workflow or individual skills and does the actual work.
7. The host agent continues through the workflow and returns the result; Ezy's handoff/adapter keeps the selected workflow and stage order clear.

Ezy's first task brief is for routing. It should not duplicate a chosen contractor's own intake. For example, if Superpowers is selected, its Brainstorming skill leads the detailed user-facing design discussion before its implementation workflow.

## Proposed implementation sequence

The sequence is flexible as long as it delivers the intended flow. A low-risk first slice is:

1. Add the minimum representation for individual skills and contractor/skill-set entries.
2. Reuse current search and selection code to route one coding task to a contractor or individual skills.
3. Produce an ordered, stage-aware handoff and update the `/ezy` adapter to carry it through.
4. Add the temporary homemade-instruction fallback for uncovered stages.
5. Expand catalog coverage and external discovery based on gaps the first slice exposes.
6. Sync roadmap and product docs to the approved direction.

This is an engineering proposal, not a product constraint. Another implementation order is acceptable if it reaches the same user flow.

## Catalog and discovery

The catalog is necessary: it is Ezy's searchable labor pool of known skills, their sources, capabilities, and evaluation evidence. It lets Ezy quickly match a task stage to specialists it already knows about. The catalog is not the whole broker workflow; Ezy also needs a discovery process to find candidates when a required capability is missing or current entries are unsuitable.

Discovery does not automatically make a GitHub skill trusted or available for execution. Ezy should inspect candidate metadata/content as untrusted input, evaluate task fit and provenance, show the evidence and review state, then add or recommend a candidate according to the user's controls. The catalog should distinguish discovered candidates from evaluated/recommended skills so that presence alone is not treated as endorsement.

If discovery still finds no suitable specialist, Ezy may write a task-specific instruction for that stage and direct the host agent to perform it. Treat this as a temporary, task-scoped fallback by default; adding it as a reusable catalog skill should be a separate, user-visible choice.

## Constraints and trust

- Keep Make It Ezy local-first and provider-independent.
- Keep skills and briefs as untrusted input. Discovery must not imply endorsement, installation, or execution.
- Preserve user control over external skills and consequential actions.
- Do not add runtime dependencies, hosted services, telemetry, or LLM calls without an explicit product decision.
- Keep the distinction clear: Ezy coordinates and routes; the host agent executes.

## Open design questions

- What host-agent mechanism lets Ezy direct multiple stages: a richer prompt/handoff, a persistent host skill, or a runtime integration?
- What is the lightest way for the host agent to track completed stages and carry results forward? This can be settled during implementation design if it does not require Ezy itself to execute skills.
- How much dependency/parallelism support is needed in the first coding-task slice?
- Keep the existing explicit approval for external skill installation; whether workflow selection also needs a separate approval is an implementation/product detail to settle before that interaction is built.
- How should this direction be phased relative to the current Phase 8 launch work?

Several open questions can be settled during the remaining handoff/adapter work (see plan Task 2–3). **Until workflow stages appear in `ezy next` output and `skills/ezy/SKILL.md`,** existing shipped CLI behavior in `docs/MVP-SPECIFICATION.md` remains authoritative.

## Implementation status vs plan (2026-11-19)

Compared to [`2026-11-18-broker-workflow.md`](../plans/2026-11-18-broker-workflow.md):

| Slice | Spec intent | Code / docs (this repo, `feat/phase8-launch`) |
|-------|-------------|-----------------------------------------------|
| Contractor catalog | Built-in Superpowers entry; recommend only for coding brief task types | **Done:** `packages/core/src/contractors.ts`, `PlanReport.contractors` in `plan.ts` / `plan-types.ts` |
| Ordered workflow | `WorkflowStage` union; contractor owns internal process; custom stages for uncovered work | **Done:** `buildWorkflow` in `handoff.ts`, `formatHandoff` Workflow section |
| Handoff prompt | Stage-ordered instructions for the host agent | **Done:** `Workflow (run in order)` in prompt when stages exist |
| `/ezy` adapter + product docs | Execute stages in order; distinguish contractor routing from future GitHub discovery | **Partial:** `skills/ezy/SKILL.md` + product doc callouts; broader discovery still future |
| Broader discovery | GitHub/skills.sh when catalog lacks coverage | **Future** (unchanged from pre-broker behavior) |

**User-visible behavior today:** `ezy next` includes a **Workflow** section (and prompt stages) when a contractor and/or uncovered requirements apply; coding briefs can recommend Superpowers as the first contractor stage.

## Acceptance criteria for a future implementation

- Given an outcome requiring multiple kinds of expertise, Ezy proposes a staged workflow with a clear reason for each chosen skill and its position.
- Ezy can recommend an appropriate skill set/contractor as a unit or compose individual skills where that is a better fit.
- Ezy tells the host agent what to do at each stage and what information to pass to later stages.
- The host agent, rather than Ezy, performs the specialist work and edits the project.
- The workflow exposes untrusted or unevaluated candidates and does not install or run them silently.
- Ezy can represent why a stage is skipped, excluded, or left uncovered.
- Ezy can recommend a contractor such as Superpowers as a unit and let that contractor's own skills guide its internal workflow.
- Missing coverage can be handled with temporary task-specific instructions without silently turning them into permanent catalog entries.
