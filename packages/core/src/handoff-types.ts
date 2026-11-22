import type { ContractorRecommendation } from "./contractors.js";
import type { Exclusion, ResearchFinding } from "./brief-types.js";
import type { Requirement } from "./plan-types.js";

export type HandoffSkill = {
  name: string;
  source: string;
  reason: string;
  installed: boolean;
  path: string | null;
  bucket: "recommended" | "optional";
  covers: string[];
};

/** A single stage in the ordered workflow. */
export type WorkflowStage =
  | {
      type: "contractor";
      order: number;
      task: string;
      reason: string;
      contractorName: string;
      contractorSource: string;
    }
  | {
      type: "skill";
      order: number;
      task: string;
      reason: string;
      skillName: string;
      skillSource: string;
      installed: boolean;
    }
  | {
      type: "custom";
      order: number;
      task: string;
      reason: string;
      instructions: string;
    };

export type HandoffReport = {
  outcome: string;
  capabilities: string[];
  skills: HandoffSkill[];
  checklist: string[];
  prompt: string;
  notes: string[];
  basis: "brief" | "heuristic";
  research: ResearchFinding[];
  uncovered: Requirement[];
  excluded: Exclusion[];
  /** Ordered workflow stages (empty array if none). */
  workflow: WorkflowStage[];
  /** Contractor recommendations from the plan. */
  contractors: ContractorRecommendation[];
};
