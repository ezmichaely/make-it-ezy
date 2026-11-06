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
};
