import type { SkillInspection } from "./inspect-types.js";
import type { SearchReport } from "./search-types.js";
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

export function formatSearch(report: SearchReport): string {
  const lines = [
    "Make It Ezy — search",
    "",
    `Query: ${report.query || "(empty)"}`,
    `Local matches: ${report.localCount} · Remote matches: ${report.remoteCount}`,
    "",
  ];

  if (!report.hits.length) {
    lines.push("No skills matched.");
  } else {
    lines.push("Results");
    lines.push("────────────────────────");
    report.hits.forEach((hit, index) => {
      const where = hit.sourceKind === "local" ? "local" : "skills.sh";
      const installs = hit.installs != null ? ` · ${hit.installs.toLocaleString()} installs` : "";
      const installed = hit.installedLocally ? " · installed" : "";
      lines.push(`${index + 1}. ${hit.name}`);
      lines.push(`   ${where} · ${hit.source}${installs}${installed}`);
      if (hit.description) {
        const desc =
          hit.description.length > 140 ? `${hit.description.slice(0, 137)}...` : hit.description;
        lines.push(`   ${desc}`);
      }
      if (hit.url) {
        lines.push(`   ${hit.url}`);
      }
      if (hit.installedLocally) {
        lines.push(`   next: ezy inspect ${hit.name}`);
      } else if (hit.source.includes("/")) {
        lines.push(`   next: ezy inspect ${hit.name}  (install first if needed)`);
        lines.push(`   list:  npx skills add ${hit.source} --skill ${hit.name} -l`);
      }
      lines.push("");
    });
  }

  if (report.notes.length) {
    lines.push("Notes");
    for (const note of report.notes) {
      lines.push(`- ${note}`);
    }
  }

  return lines.join("\n").trimEnd();
}

export function formatInspect(report: SkillInspection): string {
  const lines = ["Make It Ezy — inspect", "", `Query: ${report.query}`];

  if (!report.found) {
    lines.push("Status: not found locally");
    if (report.remoteInstalls != null) {
      lines.push(`skills.sh installs (best match): ${report.remoteInstalls.toLocaleString()}`);
    }
    lines.push("");
    lines.push("Notes");
    for (const note of report.notes) {
      lines.push(`- ${note}`);
    }
    return lines.join("\n");
  }

  lines.push("Status: found (local)");
  lines.push(`Name: ${report.name}`);
  lines.push(`Source: ${report.source ?? "unknown"}`);
  if (report.sourcePath) {
    lines.push(`Upstream path: ${report.sourcePath}`);
  }
  if (report.skillMdPath) {
    lines.push(`Local path: ${report.skillMdPath}`);
  }
  if (report.contentHash) {
    lines.push(`Content hash: ${report.contentHash.slice(0, 16)}…`);
  }
  if (report.installMode) {
    lines.push(`Install mode: ${report.installMode}`);
  }
  if (report.url) {
    lines.push(`URL: ${report.url}`);
  }
  if (report.remoteInstalls != null) {
    lines.push(`skills.sh installs: ${report.remoteInstalls.toLocaleString()}`);
  }
  if (report.description) {
    lines.push("");
    lines.push("Description");
    lines.push(report.description);
  }

  lines.push("");
  lines.push("Files");
  for (const file of report.files.slice(0, 25)) {
    lines.push(`- ${file}`);
  }
  if (report.files.length > 25) {
    lines.push(`- … +${report.files.length - 25} more`);
  }

  lines.push("");
  lines.push("Risk findings");
  for (const finding of report.findings) {
    const mark = finding.level === "high" ? "✗" : finding.level === "medium" ? "!" : "✓";
    lines.push(`${mark} [${finding.level}] ${finding.detail}`);
  }

  if (report.bodyPreview) {
    lines.push("");
    lines.push("Preview");
    lines.push("────────────────────────");
    lines.push(report.bodyPreview);
  }

  lines.push("");
  lines.push("Notes");
  for (const note of report.notes) {
    lines.push(`- ${note}`);
  }

  return lines.join("\n");
}
