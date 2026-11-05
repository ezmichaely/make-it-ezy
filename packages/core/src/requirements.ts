import { extractCapabilities } from "./capabilities.js";
import { tokenizeQuery } from "./score-skill.js";
import type { Requirement } from "./plan-types.js";
import type { ProjectAnalysis } from "./types.js";

const FRONTEND_IDS = new Set(["next", "react", "vue", "svelte", "angular"]);

function slug(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function hasFrontendStack(analysis: ProjectAnalysis): boolean {
  return analysis.frameworks.some((f) => FRONTEND_IDS.has(f.id));
}

function isSmallUiChange(tokens: string[]): boolean {
  const small = ["add", "button", "tweak", "fix", "style", "css", "copy", "typo", "rename", "label"];
  const heavy = ["refactor", "architect", "rebuild", "migrate", "rewrite", "monorepo"];
  const hasSmall = small.some((t) => tokens.includes(t));
  const hasHeavy = heavy.some((t) => tokens.includes(t));
  return hasSmall && !hasHeavy;
}

function baseSkipHints(joinedCaps: string): string[] {
  const hints = [
    "multi-agent swarm — start with the minimum skill set first",
    "vector database — not required for planning/discovery",
  ];
  if (/frontend|ui\/ux|video|media/.test(joinedCaps)) {
    hints.push("full autonomous research pipeline — overkill for this outcome");
  }
  return hints;
}

export type RequirementsResult = {
  requirements: Requirement[];
  skipHints: string[];
};

/**
 * Map outcome + project snapshot to requirements and exclusion hints.
 * Heuristic only — no LLM.
 */
export function extractRequirements(
  outcome: string,
  analysis: ProjectAnalysis,
): RequirementsResult {
  const trimmed = outcome.trim();
  if (!trimmed) {
    return { requirements: [], skipHints: [] };
  }

  const tokens = tokenizeQuery(trimmed);
  let labels = extractCapabilities(trimmed);
  const frontend = hasFrontendStack(analysis);
  const smallUi = isSmallUiChange(tokens);
  const stackLabels = analysis.frameworks
    .filter((f) => FRONTEND_IDS.has(f.id))
    .map((f) => f.label);

  // Small UI outcomes often miss the frontend lexicon ("add a button") — normalize.
  if (smallUi) {
    const known = new Set(["frontend", "UI/UX", "testing"]);
    const onlyFallback = labels.every((l) => !known.has(l));
    if (onlyFallback) {
      labels = ["UI change"];
    } else if (!labels.includes("frontend") && !labels.includes("UI/UX")) {
      labels = ["UI change", ...labels.filter((l) => l !== "testing")];
    }
  }

  const requirements: Requirement[] = [];
  for (const label of labels) {
    let priority: Requirement["priority"] = "required";
    let rationale = `Needed for outcome “${trimmed}”.`;

    if (smallUi && label === "testing") {
      priority = "optional";
      rationale = "Testing is optional for a small UI change.";
    } else if (smallUi && frontend) {
      rationale = `Existing ${stackLabels.join("/")} app — keep the change local.`;
    } else if (smallUi) {
      rationale = "Small UI change — prefer existing project conventions; avoid new stacks.";
    } else if (!analysis.projectRoot) {
      rationale = "Greenfield / no project markers — capability needed from scratch.";
    }

    requirements.push({
      id: slug(label) || label,
      label,
      rationale,
      priority,
    });
  }

  const skipHints = baseSkipHints(labels.join(" ").toLowerCase());

  if (smallUi) {
    skipHints.push("Graphify / full codebase graph — overkill for a small UI change");
    if (stackLabels.length) {
      skipHints.push(
        `new frontend framework — project already has ${stackLabels.join(", ")}`,
      );
    }
  } else if (frontend && tokens.some((t) => ["website", "webapp", "saas", "dashboard", "landing"].includes(t))) {
    skipHints.push(
      `greenfield website scaffold — project already has ${stackLabels.join(", ") || "a frontend stack"}`,
    );
  }

  // Dedupe skip hints
  const seen = new Set<string>();
  const unique = skipHints.filter((h) => {
    const key = h.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return { requirements, skipHints: unique };
}
