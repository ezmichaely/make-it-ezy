export type InspectRiskLevel = "low" | "medium" | "high" | "unknown";

export type InspectFinding = {
  id: string;
  level: InspectRiskLevel;
  detail: string;
};

export type SkillInspection = {
  found: boolean;
  query: string;
  name: string | null;
  description: string | null;
  source: string | null;
  sourcePath: string | null;
  skillMdPath: string | null;
  contentHash: string | null;
  installMode: string | null;
  url: string | null;
  installedLocally: boolean;
  files: string[];
  findings: InspectFinding[];
  remoteInstalls: number | null;
  remoteError: string | null;
  notes: string[];
  bodyPreview: string | null;
};
