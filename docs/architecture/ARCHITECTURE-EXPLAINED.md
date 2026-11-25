# Make It Ezy — architecture explained (human version)

> **Para kanimo, dili para sa LLM.** Taglish / Bisaya-English explainer. Kung mag-clash ni sa official docs, sundoga ang current hierarchy: [`AGENTS.md`](../../AGENTS.md), [`STATUS.md`](../STATUS.md), [`PRODUCT-DIRECTION.md`](../PRODUCT-DIRECTION.md), [`ROADMAP.md`](../ROADMAP.md), [`MVP-SPECIFICATION.md`](../MVP-SPECIFICATION.md). Technical reference: [`ARCHITECTURE.md`](./ARCHITECTURE.md). This is a human explainer, not an authority.

---

## Una, unsa man gyud ni?

**Make It Ezy** kay **local-first “decision layer”** sa imong repo.

Ikaw: *“Gusto nako i-add ang Stripe subscriptions.”*  
**Ezy:** *“Okay, ani ang klase sa trabaho, ani ang project setup, ani ang minimum nga skills nga makes sense, nganong gipili ko sila, unsay wala pa covered, ug unsay i-paste nimo sa Cursor/Codex/Claude aron magtrabaho sila.”*  
**Imong agent (Cursor, Codex, Claude Code):** mao na ang **mu-code, mu-refactor, mu-test** sa tinuod.

So dili ni bag-ong AI model. Dili ni swarm of agents. Dili ni marketplace nga automatic mu-install ug tanan skills.sh hits. **Planner + router + handoff generator** ni siya — **decide**, dili **execute**.

Product line sa README: *Tell Ezy what you want. It figures out what you need.*

---

## Mental model (usa ra ka story)

```text
IKAW (outcome)
   │
   ▼
MAKE IT EZY ── walay LLM sulod; rules + heuristics + optional brief JSON
   │            mu-read sa project, mu-search skills (local + skills.sh)
   │            mu-pick minimum set, mu-explain, optional gated install
   ▼
HOST AGENT (Cursor / Codex / Claude) ── actual implementation
   │
   ▼
RESULT sa imong codebase
```

**Important distinction:** *Nakita sa skills.sh* ≠ *trusted nga i-recommend*. Discovery ug recommendation **separate** intentionally — parehas sa “nakita nako sa Facebook” vs “sulod nako sa balay”.

---

## Typical flow kung naa kay real task

| Step | Command / artifact | Unsa bay nahitabo |
|------|-------------------|-------------------|
| 1 | `ezy doctor` / `ezy analyze` | Check environment ug basaha ang project (package manager, frameworks, etc.) |
| 2 | `ezy brief "…"` | Instructions sa **host agent** — research, then write `.ezy/brief.json` (requirements, exclusions, search terms) |
| 3 | Host writes `.ezy/brief.json` | Structured untrusted input; Ezy validates, exit 2 kung invalid |
| 4 | `ezy plan` / `ezy next` | Goal + project + (optional) brief → requirements → score candidates → **minimum skill set** + exclusions + uncovered |
| 5 | `ezy install …` (optional) | Preview, confirm/`--yes`, then `npx skills add` → `.agents/skills` |
| 6 | `ezy next` prompt block | Imong agent mo-follow sa checklist ug skill `SKILL.md` files |

Kung wala kay brief: naa **heuristic fallback** (lexicon + keywords) — mu-work gihapon pero mas hubog; ang CLI mudagan og ingon nga heuristic path, dili pretend nga fully researched.

Sa Cursor/Claude mismo: ang `skills/ezy` adapter nag-ingon — **after CLI, continue building**, dili humana sa “na-print na ang handoff”.

---

## Repo layout (asa nahimutang ang logic)

Monorepo, **TypeScript / Node / pnpm**, CLI-first.

```text
make-it-ezy/
├── AGENTS.md              ← shared guide (Codex, Cursor); Claude via CLAUDE.md
├── CLAUDE.md              ← bridge lang to AGENTS.md
├── apps/cli/              ← `pnpm ezy …` — thin shell, formatting, TTY picker
├── packages/core/         ← analyze, search, plan, select, brief, brain, install, handoff
│   └── src/golden/        ← fake mini-projects + expected plans (regression tests)
├── skills/ezy/            ← Agent Skill #1 — “run Ezy, then keep coding”
├── skills/ + skills-lock.json  ← pins; `pnpm skills:install` → `.agents/skills/` (gitignored)
├── catalog/               ← reserved (empty for now)
└── docs/                  ← handoff, roadmap, specs, architecture (imong reading list)
```

### `packages/core` — asa nag-decide

| Module area | Role (technical) |
|-------------|------------------|
| `detect-*`, `find-project-root`, `analyze` | Project inspection — unsa nga stack, asa ang root |
| `capabilities`, `requirements` | Gikan sa outcome (+ brief kung naa) → list sa capability IDs |
| `search`, `load-local-skills`, `search-remote` | Candidates gikan local `.agents/skills` ug skills.sh |
| `score-skill`, `select` | Score + greedy minimum set; required coverage picks **local skills before remote** (audit #3 fixed 2026-11-17) |
| `brief` | Parse/validate `.ezy/brief.json`, sanitize untrusted strings |
| `brain` | `.ezy/brain.json` machine slice + optional `agent` slice (merge on plan) |
| `plan`, `format` | Orchestrate planning output |
| `install` | Gated spawn `npx skills add` |
| `handoff` | Checklist + paste-ready agent prompt para `ezy next` |

**Walay AI SDK sulod sa Ezy.** Walay database. Walay mandatory cloud backend. Ang “smart” research anaa sa **host agent** (brief step).

### `apps/cli`

Parser sa commands, flags (`--local-only`, `--brief`, `--yes`), human-readable output. Ang business logic sa `core`.

---

## Duha ka layers (ayaw i-confuse)

| Layer | Unsay meaning | Examples |
|-------|----------------|----------|
| **A — Build Make It Ezy** | Tools/skills **para sa mga agent nga nag-develop sa Make It Ezy repo** | Ponytail, Superpowers, Vercel skills sa `.agents/skills` |
| **B — Product** | Unsay gi-offer sa end user — CLI + `skills/ezy` sa **ilang** project | `ezy plan`, install, next |

Layer A **dili** required runtime sa product. Dili ta mo-LangGraph/LangChain core para sa Ezy mismo — intentional lightweight design.

---

## Scope karon vs vision

| | |
|---|---|
| **Long-term direction** | Broader domains, one at a time |
| **Karon (shipped focus)** | **Coding tasks sa imong repo** — JS/TS first, Python later |
| **Later** | Other domains **one at a time** (each needs golden cases + detection + lexicon) |

Domain-neutral na ang brief/plan/select pipeline; ang JS/TS-specific part mostly `analyze` + `capabilities` lexicon.

---

## Na-ship na (Phase 0–7) vs wala pa

**Na-ship:**

- Discovery: `search`, `inspect`, `recommend`
- Project-aware `plan` / `next` (Phase 5)
- `ezy brief` + `--brief` (Phase 6)
- **Phase 7:** `ezy brain` / `brain refresh` / `brain enrich`; `.ezy/brain.json` on plan/next
- Gated `install` → `.agents/skills`
- `skills/ezy` adapter

**Wala pa / later:**

- **Phase 8 — Launch and Distribution** — **current** (make the CLI installable outside this repository)
- **Phase 9 — Verification** (did the outcome actually happen?)
- Deep skill verification, trusted-auto, Soft-C spawn, Web UI (Phase 10)
- Full “trust score” pipeline nga naa sa product handoff vision — **partial** lang today (heuristics + brief + risk notes sa inspect)

****Historical:** archived audit findings are evidence only. **Current roadmap:** Phase 8 Launch and Distribution.

---

## Example: “Add Stripe subscriptions”

1. Agent mo-run `ezy brief "Add Stripe subscriptions"` → research → `.ezy/brief.json`
2. `ezy next "…" --brief .ezy/brief.json` → requirements (stripe, webhooks, security, etc.) + skill picks + checklist
3. Ikaw mo-approve installs kung naa
4. Agent mu-read `.agents/skills/<name>/SKILL.md` ug **mu-implement sa imong app repo**

Ang golden case `packages/core/src/golden/stripe-subscriptions/` naa ang automated test nga nag-expect unsay dapat ma-recommend — useful kung mag-change ka sa selection logic.

---

## Asa ka magbasa kung na-confuse ka

| Ikaw nagtanong… | Open this |
|-----------------|-----------|
| Unsa buhaton sa agent karon? | [`AGENTS.md`](../../AGENTS.md) |
| Unsa gyud ang product direction? | [`docs/PRODUCT-DIRECTION.md`](../PRODUCT-DIRECTION.md) |
| Phase 0–7 done na ba? Unsay sunod? | [`docs/ROADMAP.md`](../ROADMAP.md) |
| Exact CLI contract | [`docs/MVP-SPECIFICATION.md`](../MVP-SPECIFICATION.md) |
| Short technical architecture | [`ARCHITECTURE.md`](./ARCHITECTURE.md) |

**Ayaw:** plan ug product decisions gikan sa `MAKE-IT-EZY-HANDOFF-V2.md`, `v6`, etc. — historical snapshots ra na.

---

## One-liner para i-share nimo sa tawo

> **Make It Ezy** kay local tool nga, given imong goal ug repo, **mu-pili ug minimum skills ug handoff** para sa imong Cursor/Codex/Claude — sila ang mag-code, dili si Ezy.

---

*Last aligned: 2026-11-25 — human explainer aligned to current Phase 8 docs; lifecycle contracts remain unwired; current authority is the repository documentation hierarchy.*
