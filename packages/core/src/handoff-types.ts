import type { ResearchFinding } from "./brief-types.js";

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
};
