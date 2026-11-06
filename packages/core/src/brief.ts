import { readFileSync } from "node:fs";
import type {
  Brief,
  BriefRequirement,
  BriefResult,
  BriefTaskType,
  Exclusion,
  ResearchFinding,
  ResearchKind,
} from "./brief-types.js";

const TASK_TYPES: readonly BriefTaskType[] = [
  "feature",
  "bugfix",
  "refactor",
  "greenfield",
  "research",
  "ui-change",
  "other",
];
const RESEARCH_KINDS: readonly ResearchKind[] = [
  "technical",
  "repository",
  "web",
  "decision",
  "empirical",
  "scientific",
  "project",
  "verification",
];
const KNOWN_KEYS = new Set(["version", "outcome", "taskType", "requirements", "exclusions", "research"]);
const ID_RE = /^[a-z0-9-]{1,40}$/;
const MAX_STRING = 200;
const MAX_LIST = 10;

function isInvisible(code: number): boolean {
  return (
    (code >= 0x200b && code <= 0x200f) ||
    code === 0xfeff ||
    (code >= 0x202a && code <= 0x202e) ||
    (code >= 0x2066 && code <= 0x2069)
  );
}

export function sanitizeText(s: string): string {
  let out = "";
  for (const ch of s) {
    const code = ch.codePointAt(0) ?? 0;
    if (code <= 0x1f || (code >= 0x7f && code <= 0x9f)) out += " ";
    else if (!isInvisible(code)) out += ch;
  }
  return out.trim();
}

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

function readList(v: unknown, path: string, min: number, errors: string[]): unknown[] {
  if (!Array.isArray(v)) {
    errors.push(`${path}: must be an array`);
    return [];
  }
  if (v.length > MAX_LIST) {
    errors.push(`${path}: at most ${String(MAX_LIST)}`);
    return [];
  }
  if (v.length < min) errors.push(`${path}: at least ${String(min)}`);
  return v as unknown[];
}

function parseRequirement(
  v: unknown,
  path: string,
  seen: Set<string>,
  errors: string[],
): BriefRequirement | null {
  if (!isRecord(v)) {
    errors.push(`${path}: must be an object`);
    return null;
  }
  let id = "";
  if (typeof v.id !== "string" || !ID_RE.test(v.id)) {
    errors.push(`${path}.id: must match ^[a-z0-9-]{1,40}$`);
  } else if (seen.has(v.id)) {
    errors.push(`${path}.id: duplicate "${v.id}"`);
  } else {
    id = v.id;
    seen.add(id);
  }
  const label = readString(v.label, `${path}.label`, errors);
  const why = readString(v.why, `${path}.why`, errors);
  if (v.priority !== "required" && v.priority !== "optional") {
    errors.push(`${path}.priority: must be "required" or "optional"`);
  }
  const searchTerms = readList(v.searchTerms, `${path}.searchTerms`, 1, errors).map((t, i) =>
    readString(t, `${path}.searchTerms[${String(i)}]`, errors),
  );
  return {
    id,
    label,
    priority: v.priority === "optional" ? "optional" : "required",
    why,
    searchTerms,
  };
}

function parseExclusion(v: unknown, path: string, errors: string[]): Exclusion | null {
  if (!isRecord(v)) {
    errors.push(`${path}: must be an object`);
    return null;
  }
  return { label: readString(v.label, `${path}.label`, errors), why: readString(v.why, `${path}.why`, errors) };
}

function parseFinding(v: unknown, path: string, errors: string[]): ResearchFinding | null {
  if (!isRecord(v)) {
    errors.push(`${path}: must be an object`);
    return null;
  }
  const kind = RESEARCH_KINDS.find((k) => k === v.kind);
  if (!kind) errors.push(`${path}.kind: must be one of ${RESEARCH_KINDS.join(", ")}`);
  const finding = readString(v.finding, `${path}.finding`, errors);
  const source =
    v.source === undefined || v.source === null ? null : readString(v.source, `${path}.source`, errors);
  return { kind: kind ?? "technical", finding, source };
}

function compact<T>(items: (T | null)[]): T[] {
  return items.filter((x): x is T => x !== null);
}

export function parseBrief(raw: unknown): BriefResult {
  if (!isRecord(raw)) return { ok: false, errors: ["$: must be an object"] };
  const errors: string[] = [];
  const notes: string[] = [];

  for (const key of Object.keys(raw)) {
    if (!KNOWN_KEYS.has(key)) notes.push(`ignored unknown field "${key}"`);
  }
  if (raw.version !== 1) errors.push("version: must be 1");
  const outcome = readString(raw.outcome, "outcome", errors);
  const taskType = TASK_TYPES.find((t) => t === raw.taskType);
  if (!taskType) errors.push(`taskType: must be one of ${TASK_TYPES.join(", ")}`);

  const seen = new Set<string>();
  const requirements = compact(
    readList(raw.requirements, "requirements", 1, errors).map((r, i) =>
      parseRequirement(r, `requirements[${String(i)}]`, seen, errors),
    ),
  );
  const exclusions = compact(
    (raw.exclusions === undefined ? [] : readList(raw.exclusions, "exclusions", 0, errors)).map((e, i) =>
      parseExclusion(e, `exclusions[${String(i)}]`, errors),
    ),
  );
  const research = compact(
    (raw.research === undefined ? [] : readList(raw.research, "research", 0, errors)).map((f, i) =>
      parseFinding(f, `research[${String(i)}]`, errors),
    ),
  );

  if (errors.length > 0 || !taskType) return { ok: false, errors };
  const brief: Brief = { version: 1, outcome, taskType, requirements, exclusions, research };
  return { ok: true, brief, notes };
}

export function loadBrief(path: string): BriefResult {
  let text: string;
  try {
    text = readFileSync(path, "utf8");
  } catch {
    return { ok: false, errors: [`${path}: cannot read file`] };
  }
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { ok: false, errors: [`${path}: invalid JSON: ${message}`] };
  }
  return parseBrief(raw);
}
