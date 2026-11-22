import type { Exclusion, ResearchFinding } from "./brief-types.js";
import type { ContractorRecommendation } from "./contractors.js";
import type { RecommendItem } from "./recommend-types.js";

export type Requirement = {
  id: string;
  label: string;
  rationale: string;
  priority: "required" | "optional";
  searchTerms?: string[];
};

export type CapabilityDecision = {
  name: string;
  source: string;
  decision: "use" | "install" | "optional" | "skip";
  reason: string;
  covers: string[];
};

export type PlanProjectSummary = {
  projectRoot: string | null;
  packageName: string | null;
  language: string | null;
  frameworks: string[];
  localSkills: string[];
};

export type PlanReport = {
  outcome: string;
  /** Back-compat: requirement labels (required first). */
  capabilities: string[];
  requirements: Requirement[];
  project: PlanProjectSummary;
  decisions: CapabilityDecision[];
  recommended: RecommendItem[];
  optional: RecommendItem[];
  notNeeded: string[];
  notes: string[];
  basis: "brief" | "heuristic";
  taskType: string | null;
  research: ResearchFinding[];
  uncovered: Requirement[];
  excluded: Exclusion[];
  /** Recommended contractors for this task (e.g. Superpowers for coding tasks). */
  contractors: ContractorRecommendation[];
  /** Path of the brief file the plan was built from (set by the CLI; used for the Next hint). */
  briefPath?: string;
};

export const EMPTY_PLAN_PROJECT: PlanProjectSummary = {
  projectRoot: null,
  packageName: null,
  language: null,
  frameworks: [],
  localSkills: [],
};
