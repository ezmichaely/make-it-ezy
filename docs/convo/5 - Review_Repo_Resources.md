# 5 - Review Repo Resources

## You

📎 [Attached file: 1000421489.mp4 — MP4, 1.8 MB]
📎 [Attached file: 1000421488.mp4 — MP4, 1.3 MB]
📎 [Attached file: 1000421487.mp4 — MP4, 1.4 MB]
📎 [Attached file: 1000421486.mp4 — MP4, 1.1 MB]
📎 [Attached file: 1000421472.mp4 — MP4, 1 MB]
🖼️ [Uploaded image: 1000421579.jpg — JPG, 163 KB]
🖼️ [Uploaded image: 1000421482.jpg — JPG, 125 KB]
🖼️ [Uploaded image: 1000421444.jpg — JPG, 148 KB]
🖼️ [Uploaded image: 1000421473.jpg — JPG, 188 KB]
🖼️ [Uploaded image: 1000421257.jpg — JPG, 211 KB]
https://app.notion.com/p/The-Free-Ai-Software-Engineering-Team-68-Agents-286-Skills-3c913313097a812e884cde1fd4eea187



Pag tablaw ug review ani nilaa. E check unsay mga repo resources ani nila para ma dugang nato sa hand offf.

After ani naa naay 2 videos and ang hand off file v5

## ChatGPT

Sige. I’ll dissect the Notion list first, trace the actual GitHub repos behind the recommendations, then cross-check which ones are genuinely useful for Make It Ezy versus hype/duplicate tooling. I’ll keep the useful repo resources ready for the handoff v5 update.

## ChatGPT

Na-confirm nako ang pinakaduol sa Make It Ezy: **ECC, Integralist Agent Skills, PracticalSwan, ug Kalaris** are materially useful; OmniRoute/Caveman are mostly cost/context infrastructure, while Dify/n8n/Langflow/RAGFlow are full platforms rather than skills we should blindly add.

## ChatGPT

One important correction: **we should not dump whole repositories into the handoff.** The useful output is a curated source map—what to borrow, what to study, what not to adopt, and why—so Cursor/Codex won’t inherit a giant noisy skill pile.

## ChatGPT

Oo. **Na-tabla na nako ang list, gi-cross-check ang repos, ug gi-compare nako sa current Make It Ezy handoff.** Naay important nga findings—especially kay dili nato dapat himuong “collection of cool AI repos” ang handoff.

### Pinaka-importanteng correction

Ang screenshot nag-ingon **ECC = 68 agents / 286 skills**. Stale na na. Ang current official ECC repo kay **71 agents, 314 skills, 98 legacy command shims**, and it now has a fairly mature plugin/harness architecture. So sa handoff, mas maayo nga i-reference nato ang **ECC as an evolving reference architecture**, dili ang old numbers. 

### Ang mga repo nga tinuod nga valuable para sa Make It Ezy

| Reference | Ezy decision | Ngano |
|---|---|---|
| **affaan-m/ECC** | **STUDY — HIGH** | Very useful prior art for skills/agents/hooks/rules + plan → test → review → verify → remember. But **do not install wholesale**.  |
| **anthropics/claude-plugins-official — claude-code-setup** | **STUDY — VERY HIGH** | This is almost directly aligned with Ezy: scans a codebase and recommends the most useful MCPs, skills, hooks, subagents, etc. It is a strong benchmark for our capability planner.  |
| **Integralist/agent-skills** | **STUDY — VERY HIGH** | Excellent pattern for deep research, sourced reference documents, critique, decision-making, evidence tracking, and project artifacts.  |
| **PracticalSwan/agent-skills** | **STUDY — VERY HIGH** | Strong evidence-first research: primary sources, citations, verification, cross-client portability, MCP fallback.  |
| **KalarisLabs/research-agent-skills** | **OPTIONAL SPECIALIST CATALOG** | Huge scientific-research catalog, but more importantly it has explicit guidance around selective installation and security scanning of third-party skills.  |
| **mattpocock/skills** | **STUDY — HIGH** | Good benchmark for small, composable engineering skills rather than giant “agent personalities.” Useful for routing, TDD, review, handoff, research.  |
| **anthropics/claude-plugins-official — claude-security** | **STUDY — HIGH** | Good prior art for risk assessment, threat modeling, independent verification and safe handling of untrusted repos.  |
| **Panniantong/Agent-Reach** | **OPTIONAL PROVIDER** | Excellent example of a capability provider that gives agents access to web/social sources, with fallbacks and explicit security considerations. Not core infrastructure.  |
| **cheaper-inference/OmniRoute** | **OPTIONAL PROVIDER** | Useful model/provider-routing prior art. Potentially relevant later for cost-aware execution, but absolutely not core Ezy architecture.  |
| **JuliusBrussee/caveman** | **STUDY** | Interesting prior art for context compression, reducing unnecessary model input, and cost-aware execution. Treat its performance numbers as project-reported claims rather than established facts.  |
| **ashishpatel26/500-AI-Agents-Projects** | **STUDY / DISCOVERY INDEX** | Useful as a giant ecosystem directory of agent projects. **Not something Ezy should install or depend on.**  |
| **NousResearch/hermes-agent** | **STUDY / OPTIONAL RUNTIME** | Interesting because it combines skills, memory, MCP, scheduling and a persistent agent runtime. Useful architectural reference, not a core dependency.  |

### The biggest thing I would change in the handoff

The screenshots are actually pointing at a **very important product insight**:

> **“Research” is not one capability.**

The repos support that.

We should probably model research more like:

```text
Research
├── technical research
├── repository/code research
├── decision research
├── web research
├── competitive research
├── scientific literature research
├── citation verification
├── source verification
└── research synthesis
```

That is much closer to what Ezy actually needs than:

```text
skill = "research"
```

PracticalSwan, Integralist, Kalaris and the Hermes ecosystem all show different versions of this distinction. 

And **Claude Code Setup is especially important** because it demonstrates the other half of the problem: the system should inspect the current project and determine *which* capabilities are useful instead of exposing a giant list. That is extremely close to what our Phase 5 planner is trying to become. 

### What I would NOT add as core dependencies

The “Top 12 AI repos” screenshot is useful, but most of those are **ecosystem providers/platforms**, not things Make It Ezy should absorb:

**OpenClaw, n8n, Langflow, Dify, LangChain, Open WebUI, RAGFlow, Gemini CLI, Ollama, CrewAI** etc. should be treated as things Ezy may eventually **discover, evaluate, or integrate with**, not as architectural dependencies.

That distinction is important because otherwise Ezy turns into another orchestration framework instead of staying the **decision/discovery layer above the ecosystem**. LangChain, Dify, Langflow and RAGFlow all describe themselves as platforms/frameworks rather than lightweight capability packages. 

---

## This is the section I'd add to Handoff v5

:::writing{variant="document" id="58321" title="Make It Ezy — 2026-11 Ecosystem Recon Addendum"}
# 2026-11 Ecosystem Recon Addendum

A further ecosystem review identified several projects that should influence Make It Ezy's architecture and research model.

## High-Value References

### ECC — affaan-m/ECC

**Decision:** STUDY

ECC is useful prior art for a large, composable engineering capability ecosystem containing agents, skills, hooks, rules, memory, security tooling, and workflow conventions.

Important lesson:

> Do not reproduce ECC as a monolithic dependency.

Study its patterns for:

- capability organization
- skill/agent separation
- workflow composition
- hooks and runtime integration
- verification
- security scanning
- persistent project knowledge
- model/runtime adapters

The repository is evolving quickly; counts shown in older material should not be treated as canonical.

---

### Claude Code Setup — anthropics/claude-plugins-official

**Decision:** STUDY — HIGH PRIORITY

This is particularly relevant to Make It Ezy because it scans a codebase and recommends useful development capabilities such as:

- MCP servers
- skills
- hooks
- subagents
- commands

This should be treated as prior art and potentially as a benchmark for the Make It Ezy capability planner.

The key architectural idea is:

> Inspect the actual project first, then recommend only the smallest useful set of capabilities.

---

### Claude Security — anthropics/claude-plugins-official

**Decision:** STUDY — HIGH PRIORITY

Provides prior art for:

- architecture discovery
- threat modeling
- security-oriented agents
- independent verification
- finding vulnerabilities
- suggested remediation

This is relevant to Make It Ezy's future:

```text
DISCOVER
→ EVALUATE
→ RISK CHECK
→ EXECUTE
→ VERIFY
```

Security should be treated as part of capability evaluation rather than as an unrelated plugin.

---

### Integralist/agent-skills

**Decision:** STUDY — HIGH PRIORITY

Particularly valuable patterns:

- research
- architect
- critique
- decide
- eval
- execute-plan
- evidence tracking
- project artifacts
- read-only research delegation

Important architectural lesson:

> Research should produce durable project artifacts, not merely a conversational answer.

Potential artifact model:

```text
research/
├── mission.md
├── sources.md
├── findings.md
├── assumptions.md
├── unknowns.md
└── decision.md
```

---

### PracticalSwan/agent-skills

**Decision:** STUDY — HIGH PRIORITY

Useful patterns include:

- primary-source research
- citation-aware research
- source verification
- Tavily research workflows
- peer-review
- scientific workflows
- cross-client skill portability
- MCP fallback strategies

Important architectural lesson:

> A research capability should include an evidence policy.

Potential capability metadata:

```text
research_mode
source_requirements
citation_policy
verification_strategy
artifact_type
recency_requirement
confidence
```

---

### KalarisLabs/research-agent-skills

**Decision:** OPTIONAL SPECIALIST CATALOG

Use as a source of scientific/research capabilities rather than importing the whole catalog.

Important lesson:

> Large skill catalogs should be selectively composed, not installed wholesale.

The project also provides useful prior art for third-party skill security review.

Potential future category:

```text
scientific-research
├── literature
├── hypothesis
├── experimental-design
├── citation-verification
├── peer-review
└── reproducibility
```

---

### mattpocock/skills

**Decision:** STUDY

Useful benchmark for:

- small composable engineering skills
- TDD
- research
- code review
- domain modeling
- handoff
- focused skill activation

Use it as an independent reference for how small a capability can be while remaining useful.

---

## Research Capability Taxonomy

Make It Ezy should not model "research" as one generic capability.

Instead:

```text
research
├── technical-research
├── repository-research
├── decision-research
├── web-research
├── competitive-research
├── scientific-research
├── literature-review
├── source-verification
├── citation-verification
└── research-synthesis
```

The planner should select the appropriate research mode based on the user's goal.

Example:

```text
"Compare three libraries for my Next.js app"
→ technical + repository + decision research

"Find the latest evidence on this scientific topic"
→ scientific + literature + citation verification

"Investigate this GitHub repository"
→ repository research

"Research this company's competitors"
→ web + competitive research
```

---

## Capability Providers

Some projects should be modeled as external capability providers rather than dependencies.

Examples:

```text
Agent-Reach
→ internet / social / research access

OmniRoute
→ model/provider routing

Caveman
→ context and token optimization

Ollama
→ local model runtime

Claude Code
→ coding runtime

Codex
→ coding runtime

Cursor
→ coding runtime
```

Make It Ezy should discover and evaluate these providers rather than embedding them into core.

---

## Ecosystem Platforms

Projects such as:

- OpenClaw
- n8n
- Langflow
- Dify
- LangChain
- RAGFlow
- Open WebUI
- CrewAI
- Gemini CLI

should generally be treated as:

```text
PLATFORM / RUNTIME / WORKFLOW PROVIDER
```

rather than:

```text
CORE MAKE IT EZY DEPENDENCY
```

They may become supported targets, integration sources, or capability providers later.

---

## New Architectural Principle

The ecosystem review reinforces a central product principle:

> Make It Ezy should not ask "Which agent should I use?"

It should ask:

> "What is the smallest trustworthy combination of capabilities required to achieve this outcome?"

The planner should therefore optimize for:

```text
USEFULNESS
+
MINIMUM SUFFICIENT CAPABILITIES
+
MINIMUM SUFFICIENT CONTEXT
+
TRUST
+
VERIFIABILITY
```

not:

```text
NUMBER OF AGENTS
NUMBER OF SKILLS
NUMBER OF TOOLS
```

---

## New Research / Capability Evaluation Fields

Future capability records should be able to describe:

```text
identity
purpose
capabilities
inputs
outputs

source
version
license
maintenance
runtime

dependencies
permissions
security-risk
trust-level

research-mode
evidence-policy
citation-policy
verification-strategy

cost
latency
local-vs-cloud

compatibility
related-capabilities
overlap

evidence
confidence
```

This allows Make It Ezy to reason about capabilities instead of merely indexing them.

---

## Rule for Large Catalogs

Do not assume:

```text
more skills = better agent
```

Prefer:

```text
discover
→ inspect
→ evaluate
→ select
→ compose
```

Large catalogs are reference material.

Only the minimum useful subset should enter an execution plan.
:::

**My recommendation:** this is the material worth carrying into v5. I would **not** add 50+ repo links just because we found them. The valuable upgrade is that the handoff now teaches Ezy how to distinguish **skill vs workflow vs tool vs runtime vs capability provider vs research mode**, which is much more important to the product itself.

And yes—**I have not merged this into the repo/handoff yet**. I’m treating it as the research delta so we can reconcile it cleanly with the two videos and your handoff v5 next.

## You

📎 [Attached file: 1000421582.mp4 — MP4, 606 KB]
📎 [Attached file: 1000421581.mp4 — MP4, 714 KB]
📎 [Attached file: make-it-ezy-cursor-handoff-v5.md — MD]
Cge gamag v6 nga handoff lets make sure e attach ang mga usefull references. Dapat dili redundant ha.

## ChatGPT

Done. **Handoff v6** na siya, and I intentionally cleaned up the redundancy from v5 instead of just appending more links.

Key changes:
- Added the **2 new videos' findings**.
- Added **Stageshow** as a concrete domain-skill reference.
- Added the **Claude Code Skills Directory** as a discovery/catalog reference.
- Added/kept only the useful architecture references:
  - ECC
  - Claude Code Setup
  - Integralist
  - PracticalSwan
  - Kalaris
  - Agency Agents
  - Agent Master Skills
  - 500 AI Agents
  - APM
  - skillpm
  - Ruflo
  - OmniRoute
  - Stageshow
- Explicitly separates **Ezy vs skill vs agent vs runtime vs package manager vs model router**.
- Added the important **Discovery ≠ Recommendation** principle.
- Added provenance, trust, evaluation, and minimum-useful-set concepts.
- Removed the temptation to turn Ezy into a giant skill catalog or another orchestration/package/router framework.

I also cross-checked the important references against their current repositories/docs rather than relying only on the videos or old v5 claims. For example, ECC currently documents 71 agents/314 skills, while Kalaris describes 280+ research skills and selective loading; Claude Code Setup explicitly focuses on inspecting a codebase and recommending tailored capabilities. 

And Stageshow is particularly useful as a **capability example**, because its skill includes not just instructions but examples, a reusable kit, and verification/filming tooling. 

**Download v6:**

[**make-it-ezy-cursor-handoff-v6.md**](sandbox:/mnt/data/make-it-ezy-cursor-handoff-v6.md)

This is the one I'd use as the new Cursor/Codex handoff.

## You

This is alot but good

## ChatGPT

😂 Hahaha yeah, **v6 got chunky**.

But I’d rather have it chunky **once** than have Cursor/Codex keep guessing what we meant.

The important thing is that it’s not just a dump of repositories. The handoff now gives the next agent a map:

**what Ezy is → what it isn't → what each reference is for → what NOT to duplicate → how to decide what to research/use.**

So v6 can be the **reference baseline**, while the actual implementation instructions can stay much shorter.

And yeah — **no need to keep adding every cool repo we find.** From here, we should be ruthless about whether a new reference actually adds something missing. 😆

## You

I thought omniroute offers 7b tokens. Hmm

## ChatGPT

Ahhh **yes — mao na ang confusing part.** 😄 You remembered something real, but the **7B isn't "7 billion tokens."**

There are actually two different numbers floating around:

- **7B = 7 billion parameters** — e.g. a 7B model.
- **7B tokens = 7 billion tokens** — a usage/quota amount.

For OmniRoute specifically, I checked the current documentation. Its current headline is around **1.62 billion free tokens/month**, aggregated from third-party provider free tiers. And importantly, **OmniRoute itself does not give you that token budget**; you connect your own eligible provider accounts, and OmniRoute aggregates/routes them. 

There *was* also a documented calculation where the underlying catalog could add up to about **7.4B tokens/month if counted per-model**, but OmniRoute deliberately **doesn't advertise that as the usable number**, because shared provider pools would get counted multiple times. 

So the clean mental model is:

```text
OmniRoute
   │
   ├── connects your provider accounts
   │
   ├── aggregates their free tiers
   │
   ├── routes between providers
   │
   └── falls back when one hits its limit

Current documented usable aggregate:
≈ 1.62B tokens/month
```

And **7B model** is a completely different thing:

```text
Mistral-7B
      ↑
7 billion parameters
      ≠
7 billion tokens of free usage
```

So **our v6 wording is actually safer** because it doesn't claim "OmniRoute gives 7B free tokens." But I think we should add one clarification to the handoff:

> **OmniRoute is a free-tier aggregation/routing gateway, not a provider that grants a fixed token quota. Its advertised aggregate changes as provider quotas change.**

That's important for Ezy because otherwise Cursor/Codex could interpret OmniRoute as a **free-token provider**, when it's really an **aggregation + routing layer**. 

## You

So if i install omniroute it doesnt actually automatically give me all the free tokens. I still need to connect my accounts there.

## ChatGPT

Exactly. 👍

**Installing OmniRoute ≠ receiving a giant pool of free tokens automatically.**

Think of OmniRoute as the **router/aggregator**, not the source of the tokens:

```text
You
 │
 ├── Provider account A ── free quota
 ├── Provider account B ── free quota
 ├── Provider account C ── free quota
 │
 └──────────┬─────────────
            ▼
        OmniRoute
            │
            ▼
       chooses/routes
       the request
            │
            ▼
          Model
```

So you generally need to **configure your own provider credentials/accounts**. OmniRoute can then aggregate the eligible quotas and route requests between them.

That's why the "7B tokens" claim can be misleading. It doesn't mean:

> "Install OmniRoute → boom, 7 billion tokens are yours." 😂

It means the ecosystem of supported free tiers can potentially provide a large aggregate amount, **subject to the individual providers' quotas and account requirements**.

And this distinction is actually worth keeping in the v6 handoff because it reinforces our architecture boundary:

**OmniRoute = routing/aggregation infrastructure**  
**Ezy = decides what capabilities/workflow should be used.**

So Ezy could *optionally* use OmniRoute underneath later, but it shouldn't depend on the assumption that OmniRoute itself supplies free inference.

---

If you want, I can:

- Draft a v6 handoff section clarifying OmniRoute token aggregation and setup
- Suggest next steps to verify OmniRoute integration requirements for Make It Ezy
- Propose updating v6 handoff to caution against misinterpreting token quotas as automatic allocations