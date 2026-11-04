import { platform } from "node:os";
import { detectFrameworks, readPackageJson } from "./detect-frameworks.js";
import { detectPackageManager } from "./detect-package-manager.js";
import { findProjectRoot } from "./find-project-root.js";
import { isGitRepository } from "./is-git-repo.js";
import type { ProjectAnalysis } from "./types.js";

export type AnalyzeOptions = {
  cwd?: string;
};

export function analyzeProject(options: AnalyzeOptions = {}): ProjectAnalysis {
  const cwd = options.cwd ?? process.cwd();
  const projectRoot = findProjectRoot(cwd);
  const notes: string[] = [];

  if (!projectRoot) {
    notes.push("No project markers found (package.json / workspace config).");
    return {
      cwd,
      projectRoot: null,
      isGitRepository: isGitRepository(cwd),
      packageManager: null,
      nodeVersion: process.version,
      packageJson: { present: false, name: null, parseError: null },
      language: null,
      frameworks: [],
      tools: [],
      notes,
    };
  }

  const { pkg, name, parseError, present } = readPackageJson(projectRoot);
  if (parseError) {
    notes.push(`package.json could not be parsed: ${parseError}`);
  }

  const frameworks = detectFrameworks(projectRoot, pkg);
  const typescript = frameworks.find((f) => f.id === "typescript");
  const language = typescript
    ? "TypeScript"
    : present
      ? "JavaScript (inferred from package.json; no TypeScript evidence)"
      : null;

  const tools = [
    {
      id: "os",
      label: "Operating system",
      value: `${platform()}`,
      confidence: "high" as const,
      evidence: "node:os.platform()",
    },
  ];

  return {
    cwd,
    projectRoot,
    isGitRepository: isGitRepository(projectRoot),
    packageManager: detectPackageManager(projectRoot),
    nodeVersion: process.version,
    packageJson: { present, name, parseError },
    language,
    frameworks,
    tools,
    notes,
  };
}
