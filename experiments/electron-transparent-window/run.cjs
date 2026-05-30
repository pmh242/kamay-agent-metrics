const { spawn } = require("node:child_process");
const { existsSync } = require("node:fs");
const path = require("node:path");
const electronPath = require("electron");

const experimentDir = __dirname;
const repoRoot = path.resolve(experimentDir, "../..");
const serviceCli = path.join(repoRoot, "dist", "serviceCli.js");
const servicePort = process.env.KAMAY_SERVICE_PORT || "8765";
const intervalMs = process.env.KAMAY_SERVICE_INTERVAL_MS || "1000";
const metricsUrl = `http://127.0.0.1:${servicePort}/metrics/current`;

if (!existsSync(serviceCli)) {
  console.error("Missing ../../dist/serviceCli.js. Run `pnpm build` from the repository root before `pnpm --dir experiments/electron-transparent-window run`.");
  process.exit(1);
}

let shuttingDown = false;

const service = spawn(process.execPath, [serviceCli, "--port", servicePort, "--interval-ms", intervalMs], {
  cwd: repoRoot,
  env: process.env,
  stdio: "inherit"
});

const electron = spawn(electronPath, ["."], {
  cwd: experimentDir,
  env: {
    ...process.env,
    KAMAY_METRICS_URL: metricsUrl
  },
  stdio: "inherit"
});

service.on("exit", (code, signal) => {
  if (!shuttingDown) {
    console.error(`Local metrics service exited early (${formatExit(code, signal)}).`);
    shutdown(1);
  }
});

electron.on("exit", (code, signal) => {
  shutdown(code ?? (signal ? 1 : 0));
});

process.on("SIGINT", () => shutdown(130));
process.on("SIGTERM", () => shutdown(143));

function shutdown(code) {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;
  stopChild(electron);
  stopChild(service);
  setTimeout(() => {
    process.exit(code);
  }, 250);
}

function stopChild(child) {
  if (child.exitCode === null && child.signalCode === null) {
    child.kill();
  }
}

function formatExit(code, signal) {
  if (signal) {
    return `signal ${signal}`;
  }
  return `code ${code}`;
}
