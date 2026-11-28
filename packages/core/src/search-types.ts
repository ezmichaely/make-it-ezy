export type SkillSourceKind = "local" | "skills.sh" | "github";

export type SkillHit = {
  id: string;
  name: string;
  description: string;
  source: string;
  sourceKind: SkillSourceKind;
  path: string | null;
  installs: number | null;
  score: number;
  installedLocally: boolean;
  url: string | null;
};

export type SearchReport = {
  query: string;
  hits: SkillHit[];
  localCount: number;
  remoteCount: number;
  remoteError: string | null;
  /** Per-source discovery state. */
  sourceStates?: Record<string, import("./skill-source.js").SourceState>;
  notes: string[];
};
