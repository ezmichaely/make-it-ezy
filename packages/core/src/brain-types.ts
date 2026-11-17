export type BrainProject = {
  projectRoot: string | null;
  packageName: string | null;
  language: string | null;
  frameworks: string[];
  packageManager: string | null;
  localSkills: string[];
};

export type BrainLastPlan = {
  outcome: string;
  requirements: string[];
  recommended: string[];
  at: string;
};

export type BrainAgentEntry = {
  what?: string;
  label?: string;
  name?: string;
  why: string;
  detail?: string;
  source: string | null;
};

export type BrainAgentGraphify = {
  recommended: boolean;
  note?: string;
  outDir?: string;
};

export type BrainAgentSlice = {
  updatedAt: string;
  decisions: { what: string; why: string; source: string | null }[];
  conventions: { label: string; detail: string; source: string | null }[];
  rejectedSkills: { name: string; why: string; source: string | null }[];
  graphify?: BrainAgentGraphify;
};

export type BrainFile = {
  version: 1;
  updatedAt: string;
  fingerprint: string;
  project: BrainProject;
  lastPlan?: BrainLastPlan;
  agent?: BrainAgentSlice;
};

export type AgentSliceResult =
  | { ok: true; agent: BrainAgentSlice }
  | { ok: false; errors: string[] };