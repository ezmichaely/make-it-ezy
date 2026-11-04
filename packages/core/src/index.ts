export { analyzeProject } from "./analyze.js";
export type { AnalyzeOptions } from "./analyze.js";
export { runDoctor } from "./doctor.js";
export type { DoctorOptions } from "./doctor.js";
export { detectPackageManager } from "./detect-package-manager.js";
export { detectFrameworks, readPackageJson } from "./detect-frameworks.js";
export { findProjectRoot } from "./find-project-root.js";
export { isGitRepository } from "./is-git-repo.js";
export { formatAnalysis, formatDoctor } from "./format.js";
export type {
  Confidence,
  DetectedItem,
  DoctorCheck,
  DoctorReport,
  ProjectAnalysis,
} from "./types.js";
