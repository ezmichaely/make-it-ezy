import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { analyzeProject } from "./analyze.js";
import { sanitizeText } from "./brief.js";
import { findProjectRoot } from "./find-project-root.js";
import { loadLocalSkills } from "./load-local-skills.js";
import type {
  AgentSliceResult,
  BrainAgentSlice,
  BrainFile,
  BrainLastPlan,
  BrainProject,
} from "./brain-types.js";
import type { PlanProjectSummary, PlanReport } from "./plan-types.js";

const MAX_STRING = 200;
const MAX_LIST = 10;
const MAX_BYTES = 8 * 1024;
const STALE_MS = 7 * 24 * 60 * 60 * 1000;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function readString(v: unknown, path: string, errors: string[], allowEmpty = false): string {
  if (typeof v !== "string") {
    errors.push(`${path}: must be a string`);
    return "";
  }
  const s = sanitizeText(v);
  if (s.length > MAX_STRING) errors.push(`${path}: at most ${String(MAX_STRING)} characters`);
  else if (s.length === 0 && !allowEmpty) errors.push(`${path}: must not be empty`);
  return s;
}

function readList(v: unknown, path: string, max: number, errors: string[]): unknown[] {
  if (!Array.isArray(v)) {
    errors.push(`${path}: must be an array`);
    return [];
  }
  if (v.length > max) errors.push(`${path}: at most ${String(max)}`);
  return v as unknown[];
}

export function brainPath(projectRoot: string): string {
  return join(projectRoot, ".ezy", "brain.json");
}

export function computeFingerprint(projectRoot: string): string {
  const pkgPath = join(projectRoot, "package.json");
  const pkgBytes = existsSync(pkgPath) ? readFileSync(pkgPath) : Buffer.alloc(0);
  const skillsDir = join(projectRoot, ".agents", "skills");
  let names: string[] = [];
  if (existsSync(skillsDir)) {
    names = readdirSync(skillsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort();
  }
  const payload = Buffer.concat([pkgBytes, Buffer.from("\0"), Buffer.from(names.join("\n"), "utf8")]);
  return createHash("sha256").update(payload).digest("hex");
}

export function isBrainStale(brain: BrainFile, fingerprint: string, now = new Date()): boolean {
  if (brain.fingerprint !== fingerprint) return true;
  const t = Date.parse(brain.updatedAt);
  if (Number.isNaN(t)) return true;
  return now.getTime() - t > STALE_MS;
}

export function projectFromSummary(
  summary: PlanProjectSummary,
  packageManager: string | null,
): BrainProject {
  return {
    projectRoot: summary.projectRoot,
    packageName: summary.packageName,
    language: summary.language,
    frameworks: [...summary.frameworks],
    packageManager,
    localSkills: [...summary.localSkills],
  };
}

export function buildLastPlanDigest(report: PlanReport): BrainLastPlan {
  return {
    outcome: report.outcome,
    requirements: report.requirements.map((r) => r.label).slice(0, MAX_LIST),
    recommended: report.recommended.map((r) => r.hit.name).slice(0, MAX_LIST),
    at: new Date().toISOString(),
  };
}

function parseOptionalSource(
  v: unknown,
  path: string,
  errors: string[],
): string | null {
  if (v === undefined || v === null) return null;
  return readString(v, path, errors);
}

export function parseAgentSlice(raw: unknown): AgentSliceResult {
  if (!isRecord(raw)) return { ok: false, errors: ["agent: must be an object"] };
  const errors: string[] = [];
  const updatedAt = readString(raw.updatedAt, "agent.updatedAt", errors);
  if (updatedAt && Number.isNaN(Date.parse(updatedAt))) {
    errors.push("agent.updatedAt: must be ISO-8601");
  }

  const decisions = readList(raw.decisions, "agent.decisions", MAX_LIST, errors).map((item, i) => {
    if (!isRecord(item)) {
      errors.push(`agent.decisions[${String(i)}]: must be an object`);
      return null;
    }
    return {
      what: readString(item.what, `agent.decisions[${String(i)}].what`, errors),
      why: readString(item.why, `agent.decisions[${String(i)}].why`, errors),
      source: parseOptionalSource(item.source, `agent.decisions[${String(i)}].source`, errors),
    };
  });

  const conventions = readList(raw.conventions, "agent.conventions", MAX_LIST, errors).map((item, i) => {
    if (!isRecord(item)) {
      errors.push(`agent.conventions[${String(i)}]: must be an object`);
      return null;
    }
    return {
      label: readString(item.label, `agent.conventions[${String(i)}].label`, errors),
      detail: readString(item.detail, `agent.conventions[${String(i)}].detail`, errors),
      source: parseOptionalSource(item.source, `agent.conventions[${String(i)}].source`, errors),
    };
  });

  const rejectedSkills = readList(raw.rejectedSkills, "agent.rejectedSkills", MAX_LIST, errors).map(
    (item, i) => {
      if (!isRecord(item)) {
        errors.push(`agent.rejectedSkills[${String(i)}]: must be an object`);
        return null;
      }
      return {
        name: readString(item.name, `agent.rejectedSkills[${String(i)}].name`, errors),
        why: readString(item.why, `agent.rejectedSkills[${String(i)}].why`, errors),
        source: parseOptionalSource(item.source, `agent.rejectedSkills[${String(i)}].source`, errors),
      };
    },
  );

  let graphify: BrainAgentSlice["graphify"];
  if (raw.graphify !== undefined && raw.graphify !== null) {
    if (!isRecord(raw.graphify)) {
      errors.push("agent.graphify: must be an object");
    } else {
      if (typeof raw.graphify.recommended !== "boolean") {
        errors.push("agent.graphify.recommended: must be boolean");
      }
      graphify = {
        recommended: raw.graphify.recommended === true,
        ...(raw.graphify.note !== undefined
          ? { note: readString(raw.graphify.note, "agent.graphify.note", errors, true) }
          : {}),
        ...(raw.graphify.outDir !== undefined
          ? { outDir: readString(raw.graphify.outDir, "agent.graphify.outDir", errors, true) }
          : {}),
      };
    }
  }

  if (errors.length) return { ok: false, errors };

  return {
    ok: true,
    agent: {
      updatedAt: updatedAt || new Date().toISOString(),
      decisions: decisions.filter((x): x is NonNullable<typeof x> => x !== null),
      conventions: conventions.filter((x): x is NonNullable<typeof x> => x !== null),
      rejectedSkills: rejectedSkills.filter((x): x is NonNullable<typeof x> => x !== null),
      ...(graphify ? { graphify } : {}),
    },
  };
}

export function loadBrainFile(projectRoot: string): { ok: true; brain: BrainFile } | { ok: false; reason: string } {
  const path = brainPath(projectRoot);
  if (!existsSync(path)) return { ok: false, reason: "missing" };
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return { ok: false, reason: "invalid JSON" };
  }
  if (!isRecord(raw) || raw.version !== 1) return { ok: false, reason: "unsupported version" };
  if (!isRecord(raw.project)) return { ok: false, reason: "invalid project" };

  const brain: BrainFile = {
    version: 1,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : "",
    fingerprint: typeof raw.fingerprint === "string" ? raw.fingerprint : "",
    project: raw.project as BrainProject,
    ...(isRecord(raw.lastPlan) ? { lastPlan: raw.lastPlan as BrainLastPlan } : {}),
  };

  if (raw.agent !== undefined) {
    const parsed = parseAgentSlice(raw.agent);
    if (parsed.ok) brain.agent = parsed.agent;
  }

  return { ok: true, brain };
}

function assertSize(json: string): boolean {
  return Buffer.byteLength(json, "utf8") <= MAX_BYTES;
}

export function saveBrainFile(projectRoot: string, brain: BrainFile): { ok: true } | { ok: false; reason: string } {
  const dir = join(projectRoot, ".ezy");
  mkdirSync(dir, { recursive: true });
  const json = JSON.stringify(brain, null, 2) + "\n";
  if (!assertSize(json)) return { ok: false, reason: "brain file exceeds size limit" };
  writeFileSync(brainPath(projectRoot), json, "utf8");
  return { ok: true };
}

export function mergeBrainMachine(
  existing: BrainFile | undefined,
  project: BrainProject,
  fingerprint: string,
  lastPlan?: BrainLastPlan,
): BrainFile {
  const agent = existing?.agent;
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    fingerprint,
    project,
    ...(lastPlan ? { lastPlan } : existing?.lastPlan ? { lastPlan: existing.lastPlan } : {}),
    ...(agent ? { agent } : {}),
  };
}

export function formatBrainHuman(brain: BrainFile, opts?: { stale?: boolean }): string {
  const lines = [
    "Project Brain (.ezy/brain.json)",
    "",
    "Machine (from Ezy analyze/plan)",
    `- Updated: ${brain.updatedAt}`,
    `- Fingerprint: ${brain.fingerprint.slice(0, 12)}\u2026`,
    ...(opts?.stale === undefined
      ? []
      : [
          `- Status: ${opts.stale ? "stale (project changed or brain older than 7 days) — run ezy brain refresh" : "current"}`,
        ]),
    `- Root: ${brain.project.projectRoot ?? "(none)"}`,
    `- Name: ${brain.project.packageName ?? "(unknown)"}`,
    `- Language: ${brain.project.language ?? "(unknown)"}`,
    `- Package manager: ${brain.project.packageManager ?? "(unknown)"}`,
    `- Frameworks: ${brain.project.frameworks.length ? brain.project.frameworks.join(", ") : "(none)"}`,
    `- Local skills: ${brain.project.localSkills.length}${brain.project.localSkills.length ? ` (${brain.project.localSkills.slice(0, 8).join(", ")}${brain.project.localSkills.length > 8 ? ", ..." : ""})` : ""}`,
  ];
  if (brain.lastPlan) {
    lines.push(
      "",
      "Last plan",
      `- Outcome: ${brain.lastPlan.outcome}`,
      `- At: ${brain.lastPlan.at}`,
      `- Requirements: ${brain.lastPlan.requirements.length ? brain.lastPlan.requirements.join("; ") : "(none)"}`,
      `- Recommended: ${brain.lastPlan.recommended.length ? brain.lastPlan.recommended.join(", ") : "(none)"}`,
    );
  }
  if (brain.agent) {
    lines.push("", "Agent slice", `- Updated: ${brain.agent.updatedAt}`);
    if (brain.agent.decisions.length) {
      lines.push("- Decisions:");
      for (const d of brain.agent.decisions) lines.push(`  - ${d.what}: ${d.why}`);
    }
    if (brain.agent.conventions.length) {
      lines.push("- Conventions:");
      for (const c of brain.agent.conventions) lines.push(`  - ${c.label}: ${c.detail}`);
    }
    if (brain.agent.rejectedSkills.length) {
      lines.push("- Rejected skills:");
      for (const r of brain.agent.rejectedSkills) lines.push(`  - ${r.name}: ${r.why}`);
    }
    if (brain.agent.graphify) {
      lines.push(
        `- Graphify: ${brain.agent.graphify.recommended ? "recommended" : "not needed"}${brain.agent.graphify.note ? ` (${brain.agent.graphify.note})` : ""}`,
      );
    }
  }
  return lines.join("\n");
}

const AGENT_SCHEMA = `{
  "updatedAt": "ISO-8601",
  "decisions": [
    { "what": "Use pnpm workspaces", "why": "Root package.json declares workspaces", "source": "package.json" }
  ],
  "conventions": [
    { "label": "Tests", "detail": "Vitest in packages/core", "source": null }
  ],
  "rejectedSkills": [
    { "name": "some-skill", "why": "Overlap with local skill", "source": null }
  ],
  "graphify": {
    "recommended": false,
    "note": "Only for cross-package refactors",
    "outDir": "graphify-out"
  }
}`;

export function formatBrainEnrichInstructions(project?: PlanProjectSummary): string {
  const lines = [
    "Project Brain — agent slice",
    "",
    "Instructions for the agent",
    "1. Read .ezy/brain.json; edit only the top-level \"agent\" object (machine fields are written by Ezy).",
    "2. Record decisions, conventions, and rejected skills with short whys; set source when you have a URL or repo path.",
    "3. Do not store secrets, env values, or full research text.",
    "4. Optional: set graphify.recommended true only for cross-package / architecture work and only if graphify is installed under .agents/skills.",
    "5. Adjunct skills: find-skills when the plan shows Uncovered; verification-before-completion before claiming done.",
    "",
    'Schema for "agent" (merge into existing brain.json)',
    AGENT_SCHEMA,
    "",
    "Next: ezy brain   # verify",
  ];
  if (project) {
    lines.splice(
      2,
      0,
      "Project (from analyze)",
      `- Root: ${project.projectRoot ?? "(not detected)"}`,
      `- Name: ${project.packageName ?? "(unknown)"}`,
      "",
    );
  }
  return lines.join("\n");
}

export function refreshBrainProject(cwd: string): { ok: true; brain: BrainFile } | { ok: false; reason: string } {
  const projectRoot = findProjectRoot(cwd);
  if (!projectRoot) return { ok: false, reason: "no project root" };
  const analysis = analyzeProject({ cwd });
  const localSkills = loadLocalSkills(projectRoot, "").map((h) => h.name);
  const summary: PlanProjectSummary = {
    projectRoot: analysis.projectRoot,
    packageName: analysis.packageJson.name,
    language: analysis.language,
    frameworks: analysis.frameworks.filter((f) => f.id !== "typescript").map((f) => f.label),
    localSkills,
  };
  const project = projectFromSummary(summary, analysis.packageManager);
  const fingerprint = computeFingerprint(projectRoot);
  const existing = loadBrainFile(projectRoot);
  const merged = mergeBrainMachine(existing.ok ? existing.brain : undefined, project, fingerprint);
  const saved = saveBrainFile(projectRoot, merged);
  if (!saved.ok) return { ok: false, reason: saved.reason };
  return { ok: true, brain: merged };
}

export function persistBrainAfterPlan(
  cwd: string,
  report: PlanReport,
): { written: boolean; note?: string; warning?: string } {
  const root = report.project.projectRoot ?? findProjectRoot(cwd);
  if (!root) return { written: false };

  const analysis = analyzeProject({ cwd });
  const project = projectFromSummary(
    report.project,
    analysis.packageManager,
  );
  const fingerprint = computeFingerprint(root);
  const existing = loadBrainFile(root);
  const lastPlan = buildLastPlanDigest(report);
  const merged = mergeBrainMachine(existing.ok ? existing.brain : undefined, project, fingerprint, lastPlan);
  const saved = saveBrainFile(root, merged);
  if (!saved.ok) {
    return { written: false, warning: `Could not write brain: ${saved.reason}` };
  }
  return {
    written: true,
    note: "Cached project summary at .ezy/brain.json (updated).",
  };
}