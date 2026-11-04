export type InstallPreview = {
  skillName: string;
  source: string;
  destination: string;
  projectRoot: string;
  alreadyInstalled: boolean;
  command: string;
  commandArgs: string[];
  riskNotes: string[];
  notes: string[];
  url: string | null;
};

export type InstallResult = {
  ok: boolean;
  skillName: string;
  destination: string;
  alreadyInstalled: boolean;
  skipped: boolean;
  stdout: string;
  stderr: string;
  error: string | null;
};
