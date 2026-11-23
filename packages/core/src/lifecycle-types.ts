export type LifecycleDecision = "PASS" | "FAIL" | "UNCERTAIN";

export type ClarificationQuestion = {
  id: string;
  question: string;
  blocking: boolean;
};

export type IntentIntake = {
  rawIntent: string;
  objective: string;
  requirements: string[];
  unknowns: string[];
  assumptions: string[];
  blockingDecisions: string[];
  clarificationRequired: boolean;
  questions: ClarificationQuestion[];
};

export type SkillReviewState = "unreviewed" | "reviewed" | "approved" | "rejected";

export type SkillEvaluationInput = {
  name: string;
  source: string;
  taskFit: "strong" | "partial" | "poor";
  provenance: "known" | "unknown";
  reviewState: SkillReviewState;
  securityState: "passed" | "warning" | "failed" | "unknown";
  qualityEvidence: string[];
  maintenanceEvidence: string[];
  compatibility: "compatible" | "uncertain" | "incompatible";
  dependencies: string[];
  overlap: string[];
  contextCost: "low" | "medium" | "high" | "unknown";
};

export type SkillEvaluation = {
  name: string;
  source: string;
  decision: "eligible" | "review" | "rejected";
  reasons: string[];
  evidence: string[];
  reviewState: SkillReviewState;
};

export type SkillSpec = {
  capabilityId: string;
  purpose: string;
  inputs: string[];
  outputs: string[];
  requirements: string[];
  constraints: string[];
  host: string | null;
  dependencies: string[];
  trust: SkillReviewState;
  evidence: string[];
  compositionRole: "primary" | "supporting" | "verification" | "context";
  order: number | null;
};

export type OutcomeVerification = {
  execution: "completed" | "failed" | "unknown";
  testsPassed?: boolean;
  buildPassed?: boolean;
  checks?: { id: string; passed: boolean }[];
  artifactProduced?: boolean;
};

export type OutcomeEvaluationInput = {
  originalIntent: string;
  requirements: { id: string; label: string; required: boolean }[];
  unmetRequirements?: string[];
  verification: OutcomeVerification;
};

export type OutcomeEvaluation = {
  decision: LifecycleDecision;
  reasons: string[];
  unmetRequirements: string[];
  evidence: string[];
  nextAction: "deliver" | "iterate" | "replan" | "escalate";
};

export type SharedEvidenceEvent = {
  version: 1;
  privacyClass: "aggregate-safe";
  taskClass: string;
  capabilities: string[];
  skills: string[];
  agent: string | null;
  model: string | null;
  outcome: "success" | "failure" | "uncertain";
  verification: {
    testsPassed: boolean | null;
    buildPassed: boolean | null;
    checksPassed: number;
    checksFailed: number;
  };
  durationMs: number | null;
  evaluationVersion: string;
};

export type EvidenceAggregate = {
  key: string;
  taskClass: string;
  capability: string;
  skill: string;
  samples: number;
  success: number;
  failure: number;
  uncertain: number;
  verifiedSuccessRate: number | null;
};

export type ImprovementProposal = {
  id: string;
  target: "skill-ranking" | "capability-routing" | "verification";
  status: "proposed" | "validated" | "approved" | "rejected";
  evidenceKeys: string[];
  rationale: string;
  reversible: boolean;
};
