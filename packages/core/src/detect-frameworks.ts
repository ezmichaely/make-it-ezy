import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { DetectedItem } from "./types.js";

type PackageJsonLike = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

function allDeps(pkg: PackageJsonLike): Record<string, string> {
  return {
    ...(pkg.dependencies ?? {}),
    ...(pkg.devDependencies ?? {}),
    ...(pkg.peerDependencies ?? {}),
  };
}

function hasDep(deps: Record<string, string>, name: string): boolean {
  return Object.prototype.hasOwnProperty.call(deps, name);
}

/**
 * Detect common frameworks/tools from package.json + a few config files.
 * Only reports what evidence supports; never guesses.
 */
export function detectFrameworks(projectRoot: string, pkg: PackageJsonLike | null): DetectedItem[] {
  const items: DetectedItem[] = [];
  const deps = pkg ? allDeps(pkg) : {};

  const rules: Array<{
    id: string;
    label: string;
    dep?: string;
    files?: string[];
    valueFromDep?: boolean;
  }> = [
    { id: "next", label: "Next.js", dep: "next", valueFromDep: true },
    { id: "react", label: "React", dep: "react", valueFromDep: true },
    { id: "vue", label: "Vue", dep: "vue", valueFromDep: true },
    { id: "svelte", label: "Svelte", dep: "svelte", valueFromDep: true },
    { id: "angular", label: "Angular", dep: "@angular/core", valueFromDep: true },
    { id: "express", label: "Express", dep: "express", valueFromDep: true },
    { id: "fastify", label: "Fastify", dep: "fastify", valueFromDep: true },
    { id: "nestjs", label: "NestJS", dep: "@nestjs/core", valueFromDep: true },
    { id: "vite", label: "Vite", dep: "vite", valueFromDep: true },
    { id: "tailwind", label: "Tailwind CSS", dep: "tailwindcss", valueFromDep: true },
    {
      id: "typescript",
      label: "TypeScript",
      dep: "typescript",
      files: ["tsconfig.json"],
      valueFromDep: true,
    },
  ];

  for (const rule of rules) {
    const depPresent = rule.dep ? hasDep(deps, rule.dep) : false;
    const filePresent = (rule.files ?? []).some((f) => existsSync(join(projectRoot, f)));

    if (!depPresent && !filePresent) {
      continue;
    }

    let value = "detected";
    let confidence: DetectedItem["confidence"] = "medium";
    let evidence = "";

    if (depPresent && rule.dep) {
      value = deps[rule.dep] ?? "present";
      confidence = "high";
      evidence = `package.json dependency: ${rule.dep}`;
    } else if (filePresent) {
      value = "config present";
      confidence = "medium";
      evidence = `file: ${(rule.files ?? []).find((f) => existsSync(join(projectRoot, f)))}`;
    }

    items.push({
      id: rule.id,
      label: rule.label,
      value,
      confidence,
      evidence,
    });
  }

  return items;
}

export function readPackageJson(
  projectRoot: string,
): { pkg: PackageJsonLike | null; name: string | null; parseError: string | null; present: boolean } {
  const path = join(projectRoot, "package.json");
  if (!existsSync(path)) {
    return { pkg: null, name: null, parseError: null, present: false };
  }

  try {
    const raw = readFileSync(path, "utf8");
    const parsed = JSON.parse(raw) as PackageJsonLike & { name?: unknown };
    const name = typeof parsed.name === "string" ? parsed.name : null;
    return { pkg: parsed, name, parseError: null, present: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { pkg: null, name: null, parseError: message, present: true };
  }
}
