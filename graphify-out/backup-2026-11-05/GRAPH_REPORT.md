# Graph Report - make-it-ezy  (2026-11-05)

## Corpus Check
- Corpus is ~10,889 words - fits in a single context window. You may not need a graph.

## Summary
- 278 nodes · 389 edges · 23 communities (14 shown, 9 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 45 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- core/src/index.ts
- Make It Ezy
- Agent Skills
- Layer A — Build Make It Ezy
- package.json
- Phase 1 MVP (done)
- compilerOptions
- cli/package.json
- core/package.json
- cli/tsconfig.json
- Claude Code (INTEGRATE Phase 4, NO_LICENSE)
- core/tsconfig.json
- cli.test.ts
- Agent Skills Format Stance
- Avoid New Swarm Framework
- Minimum Useful Composition
- tsconfig.json
- Specialist
- pnpm-workspace.yaml
- Tool
- apps/cli
- catalog/ (reserved empty)
- packages/core

## God Nodes (most connected - your core abstractions)
1. `Make It Ezy` - 24 edges
2. `compilerOptions` - 15 edges
3. `Agent Skills` - 11 edges
4. `analyzeProject()` - 10 edges
5. `vitest` - 8 edges
6. `Skill (Conceptual Model)` - 8 edges
7. `Phase 0 — Ecosystem Research and Foundation` - 8 edges
8. `Layer A — Build Make It Ezy` - 8 edges
9. `detectFrameworks()` - 7 edges
10. `findProjectRoot()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Phase 1 Status (doctor + analyze)` --semantically_similar_to--> `Phase 1 MVP (done)`  [INFERRED] [semantically similar]
  README.md → docs/MVP-SPECIFICATION.md
- `Make It Ezy` --semantically_similar_to--> `Local-First Capability Discovery Layer`  [INFERRED] [semantically similar]
  README.md → docs/architecture/ARCHITECTURE.md
- `Phase 2 Discovery (ezy search)` --semantically_similar_to--> `ezy search (Phase 2 next)`  [INFERRED] [semantically similar]
  README.md → docs/MVP-SPECIFICATION.md
- `Above Package Managers` --rationale_for--> `Make It Ezy`  [INFERRED]
  docs/architecture/INTEGRATION-STRATEGY.md → README.md
- `Phase 1 MVP (done)` --semantically_similar_to--> `Phase 1 Minimal CLI (implemented)`  [INFERRED] [semantically similar]
  docs/MVP-SPECIFICATION.md → docs/ROADMAP.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Layer A Development Skill Installs** — docs_architecture_architecture_layer_a, docs_research_project_comparison_superpowers, docs_research_project_comparison_ponytail, docs_research_project_comparison_graphify, docs_research_reference_directory_52_skills, docs_research_project_comparison_layer_a_installed_locally [EXTRACTED 1.00]
- **Live 2026-11-05 Decisions Bundle** — docs_roadmap_gsd_archived_ignore, docs_architecture_security_model_license_gaps, docs_architecture_integration_strategy_phase_2_skills_sh, docs_roadmap_layer_a_skills_installed, docs_mvp_specification_phase_1_mvp, docs_roadmap_phase_2_discovery_next [EXTRACTED 1.00]
- **Make It Ezy Conceptual Model** — make_it_ezy_master_handoff_specialist, make_it_ezy_master_handoff_capability, make_it_ezy_master_handoff_skill_concept, make_it_ezy_master_handoff_workflow, make_it_ezy_master_handoff_tool, make_it_ezy_master_handoff_runtime, make_it_ezy_master_handoff_model_provider [EXTRACTED 1.00]
- **Previously Inspected Ecosystem Components** — make_it_ezy_master_handoff_openseo, make_it_ezy_master_handoff_rea, make_it_ezy_master_handoff_taste, make_it_ezy_master_handoff_agency_agents [EXTRACTED 1.00]
- **Delivery Phases 0–6** — make_it_ezy_master_handoff_phase_0, make_it_ezy_master_handoff_phase_1, make_it_ezy_master_handoff_phase_2, make_it_ezy_master_handoff_phase_3, make_it_ezy_master_handoff_phase_4, make_it_ezy_master_handoff_phase_5, make_it_ezy_master_handoff_phase_6 [EXTRACTED 1.00]
- **Phase 2 Discovery INTEGRATE Targets** — docs_architecture_integration_strategy_phase_2_skills_sh, docs_research_project_comparison_skills_sh, docs_research_project_comparison_vercel_skills, docs_mvp_specification_phase_2_ezy_search, docs_roadmap_phase_2_discovery_next [EXTRACTED 1.00]

## Communities (23 total, 9 thin omitted)

### Community 0 - "core/src/index.ts"
Cohesion: 0.12
Nodes (25): exitCode, main(), AnalyzeOptions, analyzeProject(), allDeps(), detectFrameworks(), hasDep(), PackageJsonLike (+17 more)

### Community 1 - "Make It Ezy"
Cohesion: 0.07
Nodes (30): Agency Agents, Agent Browser, Conceptual Architecture Pipeline, Browser Use, Claude Code, Codex, Cursor, DISCOVER → EVALUATE → COMPOSE → EXECUTE → VERIFY (+22 more)

### Community 2 - "Agent Skills"
Cohesion: 0.09
Nodes (31): Agent Skills, agentskills.io, Anthropic Skills, Awesome Agent Skills, BMAD Method, Capability, CLI-First Architecture, Development Workflow Sequence (+23 more)

### Community 3 - "Layer A — Build Make It Ezy"
Cohesion: 0.11
Nodes (20): .agents/skills/ Layer A Installs, Layer A — Build Make It Ezy, Workflow, Phase 2 INTEGRATE skills.sh / Vercel Skills, BMAD (STUDY/OPTIONAL), Cursor (INTEGRATE now), Graphify (OPTIONAL), GSD (IGNORE, ARCHIVED) (+12 more)

### Community 4 - "package.json"
Cohesion: 0.10
Nodes (21): description, devDependencies, tsx@^4.19.3, @types/node@^22.13.10, typescript@^5.8.2, vitest@^3.0.9, engines, node (+13 more)

### Community 5 - "Phase 1 MVP (done)"
Cohesion: 0.12
Nodes (16): Layer B — Product, Local-First Capability Discovery Layer, Phase 1 Security Guarantees, Canonical Handoff Pointer, ezy analyze, ezy doctor, Phase 1 MVP (done), ezy search (Phase 2 next) (+8 more)

### Community 6 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, declarationMap, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, lib, module (+7 more)

### Community 7 - "cli/package.json"
Cohesion: 0.17
Nodes (12): bin, ezy, dependencies, @make-it-ezy/core@workspace:*, files, name, private, scripts (+4 more)

### Community 8 - "core/package.json"
Cohesion: 0.18
Nodes (10): exports, files, main, name, private, scripts, build, type (+2 more)

### Community 9 - "cli/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, composite, outDir, rootDir, exclude, extends, include, ../../tsconfig.base.json (+1 more)

### Community 10 - "Claude Code (INTEGRATE Phase 4, NO_LICENSE)"
Cohesion: 0.20
Nodes (8): Runtime, Prefer Claude Code Adapter First, Install Gate (Phase 4+), Anthropic Skills (STUDY, NO_LICENSE), Claude Code (INTEGRATE Phase 4, NO_LICENSE), Codex (INTEGRATE Phase 4+), Phase 3 Decision Engine, Phase 4 Install + Runtime Adapter

### Community 11 - "core/tsconfig.json"
Cohesion: 0.22
Nodes (8): compilerOptions, composite, outDir, rootDir, exclude, extends, include, ../../tsconfig.base.json

### Community 12 - "cli.test.ts"
Cohesion: 0.29
Nodes (3): cliEntry, root, tsx

### Community 13 - "Agent Skills Format Stance"
Cohesion: 0.40
Nodes (3): Skill (SKILL.md), Agent Skills (STUDY/INTEGRATE), Taste (INTEGRATE/OPTIONAL)

## Knowledge Gaps
- **51 isolated node(s):** `../../tsconfig.base.json`, `../../tsconfig.base.json`, `Motto: User Describes Outcome`, `TypeScript`, `Node.js` (+46 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 135 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Make It Ezy` connect `Make It Ezy` to `Agent Skills`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `Agent Skills` (e.g. with `Skill (Conceptual Model)` and `Anthropic Skills`) actually correct?**
  _`Agent Skills` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `../../tsconfig.base.json`, `../../tsconfig.base.json`, `Motto: User Describes Outcome` to the rest of the system?**
  _51 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `core/src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11748381128584644 - nodes in this community are weakly interconnected._
- **Why does `vitest` connect `core/src/index.ts` to `cli.test.ts`, `package.json`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Should `Make It Ezy` be split into smaller, more focused modules?**
  _Cohesion score 0.06906906906906907 - nodes in this community are weakly interconnected._
- **Why does `Phase 2 Discovery (next)` connect `Phase 1 MVP (done)` to `Claude Code (INTEGRATE Phase 4, NO_LICENSE)`, `Layer A — Build Make It Ezy`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._