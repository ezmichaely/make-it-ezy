/** A contractor is a skill set that owns its own workflow (e.g. Superpowers). */
export type Contractor = {
  /** Canonical name, e.g. "superpowers". */
  name: string;
  /** GitHub source, e.g. "obra/superpowers". */
  source: string;
  /** Task types this contractor is suitable for. */
  taskTypes: string[];
  /** Description of the contractor and its role. */
  description: string;
  /** Does this contractor own its internal workflow? Ezy routes to it as a unit. */
  ownsWorkflow: boolean;
};

/** A contractor recommendation selected for the current task. */
export type ContractorRecommendation = {
  contractor: Contractor;
  reason: string;
};

/** Built-in Superpowers contractor entry. */
export const SUPERPOWERS_CONTRACTOR: Contractor = {
  name: "superpowers",
  source: "obra/superpowers",
  taskTypes: ["feature", "bugfix", "refactor", "greenfield", "ui-change"],
  description:
    "Superpowers is a structured development workflow for coding tasks. It guides design (Brainstorming), planning (Writing Plans), and implementation (Test-Driven Development, Subagent-Driven Development) with explicit verification at each stage.",
  ownsWorkflow: true,
};

/** Coding task types that Superpowers covers. */
export const SUPERPOWERS_TASK_TYPES = SUPERPOWERS_CONTRACTOR.taskTypes;

/** Check if a brief's task type should route to Superpowers. */
export function shouldUseSuperpowers(taskType: string | null): boolean {
  if (!taskType) return false;
  return SUPERPOWERS_TASK_TYPES.includes(taskType);
}
