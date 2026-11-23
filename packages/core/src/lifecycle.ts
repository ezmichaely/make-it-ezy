import type {
  EvidenceAggregate,
  ImprovementProposal,
  IntentIntake,
  OutcomeEvaluation,
  OutcomeEvaluationInput,
  SharedEvidenceEvent,
  SkillEvaluation,
  SkillEvaluationInput,
  SkillSpec,
} from "./lifecycle-types.js";

export function buildIntentIntake(
  rawIntent: string,
  input: Omit<IntentIntake, "rawIntent">,
): IntentIntake {
  const unknowns = [...new Set(input.unknowns.filter(Boolean))];
  const blockingDecisions = [...new Set(input.blockingDecisions.filter(Boolean))];
  const questions = input.questions.map((q) => ({ ...q }));
  return {
    rawIntent: rawIntent.trim(),
    objective: input.objective.trim(),
    requirements: [...new Set(input.requirements.map((v) => v.trim()).filter(Boolean))],
    unknowns,
    assumptions: [...new Set(input.assumptions.map((v) => v.trim()).filter(Boolean))],
    blockingDecisions,
    clarificationRequired:
      input.clarificationRequired || blockingDecisions.length > 0 || questions.some((q) => q.blocking),
    questions,
  };
}

export function evaluateSkillCandidate(input: SkillEvaluationInput): SkillEvaluation {
  const reasons: string[] = [];
  const evidence = [
    ...input.qualityEvidence,
    ...input.maintenanceEvidence,
  ].filter(Boolean);

  if (input.taskFit === "poor") {
    return {
      name: input.name,
      source: input.source,
      decision: "rejected",
      reasons: ["Poor task fit."],
      evidence,
      reviewState: input.reviewState,
    };
  }

  if (input.compatibility === "incompatible") {
    return {
      name: input.name,
      source: input.source,
      decision: "rejected",
      reasons: ["Incompatible with the selected host/runtime."],
      evidence,
      reviewState: input.reviewState,
    };
  }

  if (input.securityState === "failed" || input.reviewState === "rejected") {
    return {
      name: input.name,
      source: input.source,
      decision: "rejected",
      reasons: ["Security or review state rejects this artifact."],
      evidence,
      reviewState: input.reviewState,
    };
  }

  if (input.provenance === "unknown") reasons.push("Provenance is unknown.");
  if (input.reviewState === "unreviewed") reasons.push("Artifact has not been reviewed.");
  if (input.securityState === "unknown") reasons.push("Security state is unknown.");
  if (input.securityState === "warning") reasons.push("Security review contains warnings.");
  if (input.compatibility === "uncertain") reasons.push("Host/runtime compatibility is uncertain.");
  if (input.contextCost === "high") reasons.push("Expected context cost is high.");
  if (input.overlap.length) reasons.push(`Overlaps with: ${input.overlap.join(", ")}.`);
  if (input.dependencies.length) reasons.push(`Dependencies: ${input.dependencies.join(", ")}.`);
  if (input.taskFit === "partial") reasons.push("Task fit is partial.");

  const needsReview = reasons.length > 0;
  return {
    name: input.name,
    source: input.source,
    decision: needsReview ? "review" : "eligible",
    reasons: needsReview ? reasons : ["Task fit and current review evidence are sufficient."],
    evidence,
    reviewState: input.reviewState,
  };
}

export function composeSkillSpec(input: {
  capabilityId: string;
  purpose: string;
  inputs?: string[];
  outputs?: string[];
  requirements?: string[];
  constraints?: string[];
  host?: string | null;
  dependencies?: string[];
  trust: SkillEvaluation["reviewState"];
  evidence?: string[];
  compositionRole?: SkillSpec["compositionRole"];
  order?: number | null;
}): SkillSpec {
  return {
    capabilityId: input.capabilityId,
    purpose: input.purpose,
    inputs: [...(input.inputs ?? [])],
    outputs: [...(input.outputs ?? [])],
    requirements: [...(input.requirements ?? [])],
    constraints: [...(input.constraints ?? [])],
    host: input.host ?? null,
    dependencies: [...(input.dependencies ?? [])],
    trust: input.trust,
    evidence: [...(input.evidence ?? [])],
    compositionRole: input.compositionRole ?? "supporting",
    order: input.order ?? null,
  };
}

export function evaluateOutcome(input: OutcomeEvaluationInput): OutcomeEvaluation {
  const required = input.requirements.filter((r) => r.required);
  const unmet = new Set(input.unmetRequirements ?? []);
  const reasons: string[] = [];
  const evidence: string[] = [];

  for (const requirement of required) {
    if (unmet.has(requirement.id)) {
      reasons.push(`Unmet requirement: ${requirement.label}.`);
    }
  }

  if (input.verification.execution === "failed") {
    reasons.push("Execution reported failure.");
    return {
      decision: "FAIL",
      reasons,
      unmetRequirements: [...unmet],
      evidence,
      nextAction: "iterate",
    };
  }

  if (unmet.size > 0) {
    return {
      decision: "FAIL",
      reasons,
      unmetRequirements: [...unmet],
      evidence,
      nextAction: "iterate",
    };
  }

  if (input.verification.testsPassed === true) evidence.push("Tests passed.");
  if (input.verification.testsPassed === false) reasons.push("Tests failed.");
  if (input.verification.buildPassed === true) evidence.push("Build passed.");
  if (input.verification.buildPassed === false) reasons.push("Build failed.");

  const failedChecks = (input.verification.checks ?? []).filter((c) => !c.passed);
  const passedChecks = (input.verification.checks ?? []).filter((c) => c.passed);
  if (passedChecks.length) evidence.push(`${passedChecks.length} verification checks passed.`);
  if (failedChecks.length) reasons.push(`${failedChecks.length} verification checks failed.`);

  if (input.verification.testsPassed === false || input.verification.buildPassed === false || failedChecks.length) {
    return {
      decision: "FAIL",
      reasons,
      unmetRequirements: [],
      evidence,
      nextAction: "iterate",
    };
  }

  const hasStrongVerification =
    input.verification.testsPassed === true ||
    input.verification.buildPassed === true ||
    passedChecks.length > 0 ||
    input.verification.artifactProduced === true;

  if (input.verification.execution === "completed" && hasStrongVerification) {
    return {
      decision: "PASS",
      reasons: ["Requirements are satisfied and execution has supporting verification evidence."],
      unmetRequirements: [],
      evidence,
      nextAction: "deliver",
    };
  }

  return {
    decision: "UNCERTAIN",
    reasons: ["The available evidence is insufficient to prove the intended outcome."],
    unmetRequirements: [],
    evidence,
    nextAction: "escalate",
  };
}

export function aggregateEvidence(events: SharedEvidenceEvent[]): EvidenceAggregate[] {
  const groups = new Map<string, EvidenceAggregate>();
  for (const event of events) {
    for (const capability of event.capabilities) {
      for (const skill of event.skills.length ? event.skills : ["(none)"]) {
        const key = [event.taskClass, capability, skill].join("|");
        const current = groups.get(key) ?? {
          key,
          taskClass: event.taskClass,
          capability,
          skill,
          samples: 0,
          success: 0,
          failure: 0,
          uncertain: 0,
          verifiedSuccessRate: null,
        };
        current.samples += 1;
        if (event.outcome === "success") current.success += 1;
        else if (event.outcome === "failure") current.failure += 1;
        else current.uncertain += 1;
        const verified = current.success + current.failure;
        current.verifiedSuccessRate = verified > 0 ? current.success / verified : null;
        groups.set(key, current);
      }
    }
  }
  return [...groups.values()].sort((a, b) => b.samples - a.samples || a.key.localeCompare(b.key));
}

export function proposeImprovement(
  aggregate: EvidenceAggregate,
  options: { minSamples?: number; failureRateThreshold?: number } = {},
): ImprovementProposal | null {
  const minSamples = options.minSamples ?? 5;
  const failureRateThreshold = options.failureRateThreshold ?? 0.4;
  const verified = aggregate.success + aggregate.failure;
  if (aggregate.samples < minSamples || verified === 0) return null;

  const failureRate = aggregate.failure / verified;
  if (failureRate < failureRateThreshold) return null;

  return {
    id: `review-${aggregate.key.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    target: "skill-ranking",
    status: "proposed",
    evidenceKeys: [aggregate.key],
    rationale: `Observed ${aggregate.failure} failures in ${verified} verified outcomes for ${aggregate.skill} on ${aggregate.taskClass} / ${aggregate.capability}; review its ranking and alternatives.`,
    reversible: true,
  };
}
