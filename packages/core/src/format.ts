import type { DoctorReport, ProjectAnalysis } from "./types.js";

export function formatDoctor(report: DoctorReport): string {
  const lines = ["Make It Ezy — doctor", ""];
  for (const check of report.checks) {
    const mark = check.status === "ok" ? "✓" : check.status === "warn" ? "!" : "✗";
    lines.push(`${mark} ${check.label}: ${check.detail}`);
  }
  lines.push("");
  lines.push(report.ok ? "Status: OK" : "Status: FAILED");
  return lines.join("\n");
}

export function formatAnalysis(analysis: ProjectAnalysis): string {
  const lines = ["Make It Ezy", "", "Project", "────────────────────────"];

  if (!analysis.projectRoot) {
    lines.push("No project detected in this directory.");
    lines.push(`cwd: ${analysis.cwd}`);
    lines.push(`Git: ${analysis.isGitRepository ? "yes" : "no"}`);
    lines.push(`Node: ${analysis.nodeVersion}`);
    if (analysis.notes.length) {
      lines.push("");
      lines.push("Notes");
      for (const note of analysis.notes) {
        lines.push(`- ${note}`);
      }
    }
    return lines.join("\n");
  }

  lines.push(`Root: ${analysis.projectRoot}`);
  if (analysis.packageJson.name) {
    lines.push(`Name: ${analysis.packageJson.name}`);
  }
  lines.push(`Language: ${analysis.language ?? "unknown"}`);
  lines.push(`Package manager: ${analysis.packageManager ?? "unknown"}`);
  lines.push(`Node: ${analysis.nodeVersion}`);
  lines.push(`Git: ${analysis.isGitRepository ? "yes" : "no"}`);

  const frameworks = analysis.frameworks.filter((f) => f.id !== "typescript");
  if (frameworks.length) {
    lines.push("");
    lines.push("Detected");
    for (const item of frameworks) {
      lines.push(`✓ ${item.label}: ${item.value}`);
    }
  }

  if (analysis.packageJson.parseError) {
    lines.push("");
    lines.push(`! package.json parse error: ${analysis.packageJson.parseError}`);
  }

  if (analysis.notes.length) {
    lines.push("");
    lines.push("Notes");
    for (const note of analysis.notes) {
      lines.push(`- ${note}`);
    }
  }

  return lines.join("\n");
}
