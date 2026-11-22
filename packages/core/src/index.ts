export { analyzeProject } from "./analyze.js";
export type { AnalyzeOptions } from "./analyze.js";
export { runDoctor } from "./doctor.js";
export type { DoctorOptions } from "./doctor.js";
export { detectPackageManager } from "./detect-package-manager.js";
export { detectFrameworks, readPackageJson } from "./detect-frameworks.js";
export { findProjectRoot } from "./find-project-root.js";
export { isGitRepository } from "./is-git-repo.js";
export {
  formatAnalysis,
  formatDoctor,
  formatInspect,
  formatHandoff,
  formatInstallPreview,
  formatInstallResult,
  formatPlan,
  formatRecommend,
  formatSearch,
} from "./format.js";
export { buildHandoff, composeHandoffFromItems } from "./handoff.js";
export type { BuildHandoffOptions, HandoffItemInput } from "./handoff.js";
export type { HandoffReport, HandoffSkill } from "./handoff-types.js";
export { searchSkills } from "./search.js";
export type { SearchOptions } from "./search.js";
export { recommendSkills } from "./recommend.js";
export type { RecommendItem, RecommendReport } from "./recommend-types.js";
export { extractCapabilities } from "./capabilities.js";
export { extractRequirements } from "./requirements.js";
export { buildProjectSummary, planOutcome, preferRecommendItem } from "./plan.js";
export type {
  CapabilityDecision,
  PlanProjectSummary,
  PlanReport,
  Requirement,
} from "./plan-types.js";
export {
  shouldUseSuperpowers,
  SUPERPOWERS_CONTRACTOR,
  type Contractor,
  type ContractorRecommendation,
} from "./contractors.js";
export {
  buildInstallPreview,
  isSkillInstalledLocally,
  runInstall,
} from "./install.js";
export type { InstallPreview, InstallResult } from "./install-types.js";
export { inspectSkill } from "./inspect-skill.js";
export type { InspectOptions } from "./inspect-skill.js";
export { loadLocalSkills, loadSkillsLock } from "./load-local-skills.js";
export { searchSkillsSh } from "./search-remote.js";
export { parseSkillFrontmatter } from "./parse-skill-frontmatter.js";
export {
  STOPWORDS,
  nameTokens,
  requirementRelevance,
  scoreSkillText,
  significantTokens,
  tokenizeQuery,
} from "./score-skill.js";
export type { SearchReport, SkillHit, SkillSourceKind } from "./search-types.js";
export type {
  InspectFinding,
  InspectRiskLevel,
  SkillInspection,
} from "./inspect-types.js";
export type {
  Confidence,
  DetectedItem,
  DoctorCheck,
  DoctorReport,
  ProjectAnalysis,
} from "./types.js";
export {
  brainPath,
  buildLastPlanDigest,
  computeFingerprint,
  formatBrainEnrichInstructions,
  formatBrainHuman,
  isBrainStale,
  loadBrainFile,
  mergeBrainMachine,
  parseAgentSlice,
  persistBrainAfterPlan,
  refreshBrainProject,
  saveBrainFile,
} from "./brain.js";
export type {
  AgentSliceResult,
  BrainAgentSlice,
  BrainFile,
  BrainLastPlan,
  BrainProject,
} from "./brain-types.js";
export { formatBriefInstructions, loadBrief, parseBrief, sanitizeText } from "./brief.js";
export type {
  Brief,
  BriefRequirement,
  BriefResult,
  BriefTaskType,
  Exclusion,
  ResearchFinding,
  ResearchKind,
} from "./brief-types.js";
export {
  coverageReason,
  matchesExclusion,
  preferHit,
  scoreCandidates,
  selectCapabilities,
} from "./select.js";
export type { Candidate, Selection } from "./select.js";
