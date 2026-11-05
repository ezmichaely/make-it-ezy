export type HandoffSkill = {
  name: string;
  reason: string;
  installed: boolean;
  path: string | null;
  bucket: "recommended" | "optional";
};

export type HandoffReport = {
  outcome: string;
  capabilities: string[];
  skills: HandoffSkill[];
  checklist: string[];
  prompt: string;
  notes: string[];
};
