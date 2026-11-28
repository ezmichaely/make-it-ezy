import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

export function commandSucceeds(command, args, run = spawnSync) {
  try {
    const r = run(command, args, { stdio: "ignore" });
    return r.status === 0;
  } catch {
    return false;
  }
}

export function hasGraphify(run = spawnSync) {
  return commandSucceeds("graphify", ["--version"], run);
}

export function ensureGraphify(run = spawnSync, log = console.log) {
  if (hasGraphify(run)) {
    log("graphify CLI already on PATH");
    return true;
  }

  const has = (cmd, args) => commandSucceeds(cmd, args, run);
  const tryInstall = (cmd, args) => {
    try {
      const r = run(cmd, args, { stdio: "inherit" });
      return r.status === 0;
    } catch {
      return false;
    }
  };

  const pip3 = has("python3", ["-m", "pip", "--version"]);
  const pip = has("python", ["-m", "pip", "--version"]);
  const attempts = [];

  if (has("uv", ["--version"])) attempts.push(["uv", ["tool", "install", "graphifyy"]]);
  if (has("pipx", ["--version"])) attempts.push(["pipx", ["install", "graphifyy"]]);
  if (pip3) {
    attempts.push(["python3", ["-m", "pip", "install", "graphifyy"]]);
    attempts.push(["python3", ["-m", "pip", "install", "graphifyy", "--break-system-packages"]]);
  }
  if (pip) {
    attempts.push(["python", ["-m", "pip", "install", "graphifyy"]]);
    attempts.push(["python", ["-m", "pip", "install", "graphifyy", "--break-system-packages"]]);
  }

  for (const [cmd, args] of attempts) {
    log(`graphify not found; trying: ${cmd} ${args.join(" ")}`);
    tryInstall(cmd, args);
    if (hasGraphify(run)) {
      log("graphify CLI installed");
      return true;
    }
  }

  log(
    "graphify CLI not installed; vendored graphify skill + committed graphify-out still work; `graphify query` needs `graphify` on PATH (try `uv tool install graphifyy` / `pipx install graphifyy` / `pip install graphifyy`). pnpm skills:install succeeded.",
  );
  return false;
}

export function main(run = spawnSync, log = console.log) {
  return ensureGraphify(run, log);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
