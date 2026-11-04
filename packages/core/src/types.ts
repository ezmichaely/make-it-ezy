export type Confidence = "high" | "medium" | "low";

export type DetectedItem = {
  id: string;
  label: string;
  value: string;
  confidence: Confidence;
  evidence?: string;
};

export type ProjectAnalysis = {
  cwd: string;
  projectRoot: string | null;
  isGitRepository: boolean;
  packageManager: string | null;
  nodeVersion: string;
  packageJson: {
    present: boolean;
    name: string | null;
    parseError: string | null;
  };
  language: string | null;
  frameworks: DetectedItem[];
  tools: DetectedItem[];
  notes: string[];
};

export type DoctorCheck = {
  id: string;
  label: string;
  status: "ok" | "warn" | "fail";
  detail: string;
};

export type DoctorReport = {
  checks: DoctorCheck[];
  ok: boolean;
};
