import type { SkillHit } from "./search-types.js";

export type RecommendItem = {
  hit: SkillHit;
  reason: string;
};

export type RecommendReport = {
  query: string;
  recommended: RecommendItem[];
  optional: RecommendItem[];
  notNeeded: string[];
  notes: string[];
};
