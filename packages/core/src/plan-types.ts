import type { RecommendItem } from "./recommend-types.js";

export type PlanReport = {
  outcome: string;
  capabilities: string[];
  recommended: RecommendItem[];
  optional: RecommendItem[];
  notNeeded: string[];
  notes: string[];
};
