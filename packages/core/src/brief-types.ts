export type BriefTaskType =
  | "feature"
  | "bugfix"
  | "refactor"
  | "greenfield"
  | "research"
  | "ui-change"
  | "other";

export type ResearchKind =
  | "technical"
  | "repository"
  | "web"
  | "decision"
  | "empirical"
  | "scientific"
  | "project"
  | "verification";

export type BriefRequirement = {
  id: string;
  label: string;
  priority: "required" | "optional";
  why: string;
  searchTerms: string[];
};

export type Exclusion = { label: string; why: string };

export type ResearchFinding = { kind: ResearchKind; finding: string; source: string | null };

export type Brief = {
  version: 1;
  outcome: string;
  taskType: BriefTaskType;
  requirements: BriefRequirement[];
  exclusions: Exclusion[];
  research: ResearchFinding[];
};

export type BriefResult = { ok: true; brief: Brief; notes: string[] } | { ok: false; errors: string[] };
