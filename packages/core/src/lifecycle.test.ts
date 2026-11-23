import { describe, expect, it } from "vitest";
import {
  aggregateEvidence,
  buildIntentIntake,
  composeSkillSpec,
  evaluateOutcome,
  evaluateSkillCandidate,
  proposeImprovement,
} from "./lifecycle.js";

describe("lifecycle contracts", () => {
  it("marks unresolved blocking decisions for clarification", () => {
    const intake = buildIntentIntake("Build a finance app", {
      objective: "Build a finance app",
      requirements: ["authentication"],
      unknowns: ["target platform"],
      assumptions: [],
      blockingDecisions: ["web or mobile"],
      clarificationRequired: false,
      questions: [{ id: "platform", question: "Web or mobile?", blocking: true }],
    });
    expect(intake.clarificationRequired).toBe(true);
    expect(intake.blockingDecisions).toEqual(["web or mobile"]);
  });

  it("keeps skill evaluation explicit instead of hiding trust in one score", () => {
    const result = evaluateSkillCandidate({
      name: "example",
      source: "owner/repo",
      taskFit: "strong",
      provenance: "known",
      reviewState: "approved",
      securityState: "passed",
      qualityEvidence: ["repeated verified use"],
      maintenanceEvidence: ["recent release"],
      compatibility: "compatible",
      dependencies: [],
      overlap: [],
      contextCost: "low",
    });
    expect(result.decision).toBe("eligible");
    expect(result.reasons.length).toBeGreaterThan(0);
  });

  it("creates an internal skill spec without replacing SKILL.md", () => {
    const spec = composeSkillSpec({
      capabilityId: "payments",
      purpose: "Handle payments",
      inputs: ["requirements"],
      outputs: ["implementation"],
      trust: "approved",
      compositionRole: "primary",
      order: 1,
    });
    expect(spec.capabilityId).toBe("payments");
    expect(spec.order).toBe(1);
  });

  it("does not equate command success with outcome success", () => {
    const result = evaluateOutcome({
      originalIntent: "Add subscriptions",
      requirements: [{ id: "subscriptions", label: "Subscriptions", required: true }],
      unmetRequirements: ["subscriptions"],
      verification: { execution: "completed", testsPassed: true, buildPassed: true },
    });
    expect(result.decision).toBe("FAIL");
    expect(result.nextAction).toBe("iterate");
  });

  it("returns uncertain when execution completed without enough verification", () => {
    const result = evaluateOutcome({
      originalIntent: "Improve onboarding",
      requirements: [{ id: "onboarding", label: "Onboarding", required: true }],
      verification: { execution: "completed" },
    });
    expect(result.decision).toBe("UNCERTAIN");
    expect(result.nextAction).toBe("escalate");
  });

  it("aggregates privacy-safe outcomes without private context", () => {
    const event = {
      version: 1 as const,
      privacyClass: "aggregate-safe" as const,
      taskClass: "typescript_refactor",
      capabilities: ["code-analysis"],
      skills: ["skill-x"],
      agent: "claude-code",
      model: "local",
      outcome: "success" as const,
      verification: { testsPassed: true, buildPassed: true, checksPassed: 1, checksFailed: 0 },
      durationMs: 1000,
      evaluationVersion: "v1",
    };
    const aggregates = aggregateEvidence([event]);
    expect(aggregates[0]?.samples).toBe(1);
    expect(aggregates[0]?.verifiedSuccessRate).toBe(1);
  });

  it("only proposes improvement when evidence is large enough and failure is meaningful", () => {
    const aggregate = {
      key: "bugfix|testing|skill-x",
      taskClass: "bugfix",
      capability: "testing",
      skill: "skill-x",
      samples: 5,
      success: 2,
      failure: 3,
      uncertain: 0,
      verifiedSuccessRate: 0.4,
    };
    const proposal = proposeImprovement(aggregate);
    expect(proposal?.status).toBe("proposed");
    expect(proposal?.reversible).toBe(true);
  });
});
