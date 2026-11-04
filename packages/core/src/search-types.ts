export type SkillSourceKind = "local" | "skills.sh";

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
  notes: string[];
};
