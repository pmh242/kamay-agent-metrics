const { spawn } = require("node:child_process");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const electronPath = require("electron");

const CONTRACT_VERSION = "metrics.current.v1";

async function main() {
  const results = [];
  results.push(await runtimeStartsBeforeService());
  results.push(await serviceStartsBeforeRuntime());
  results.push(await serviceStopsAndRestarts());
  results.push(await offlineStaleDegradedTransitions());
  results.push(await multiConsumerCoexistence());
  results.push(await realServiceCompatibility());

  console.log(JSON.stringify({
    event: "runtime-lifecycle-harness-complete",
    scenarios: results.map((result) => result.name)
  }));
}

async function runtimeStartsBeforeService() {
  const port = await getFreePort();
  const url = metricsUrl(port);
  const runtime = spawnRuntime("runtime-before-service", url, 7500);
  await wait(2600);
  const server = createMockServer(() => okResponse());
  await server.listen(port);
  const result = await runtime.done;
  await server.close();

  assert(hasFetch(result.events, { reachable: false, errorCategory: "unreachable" }), "runtime-before-service did not observe unreachable service");
  assert(hasFetch(result.events, { reachable: true, contractOk: true }), "runtime-before-service did not recover to a valid contract response");
  return pass("runtime-starts-before-service");
}

async function serviceStartsBeforeRuntime() {
  const server = createMockServer(() => okResponse());
  const port = await server.listen(0);
  const result = await spawnRuntime("service-before-runtime", metricsUrl(port), 3500).done;
  await server.close();

  assert(hasFetch(result.events, { reachable: true, contractOk: true, serviceStatus: "ok" }), "service-before-runtime did not observe ok contract response");
  return pass("service-starts-before-runtime");
}

async function serviceStopsAndRestarts() {
  const port = await getFreePort();
  let server = createMockServer(() => okResponse());
  await server.listen(port);
  const runtime = spawnRuntime("service-restart", metricsUrl(port), 9000);
  await wait(2600);
  await server.close();
  await wait(3000);
  server = createMockServer(() => okResponse());
  await server.listen(port);
  const result = await runtime.done;
  await server.close();

  const reachableCount = result.events.filter((event) => event.event === "metrics-fetch" && event.reachable === true).length;
  assert(reachableCount >= 2, "service-restart did not observe reachable service before and after restart");
  assert(hasFetch(result.events, { reachable: false, errorCategory: "unreachable" }), "service-restart did not observe unreachable service during stop");
  return pass("service-stops-and-restarts");
}

async function offlineStaleDegradedTransitions() {
  const responses = [
    offlineResponse(),
    staleResponse(),
    degradedResponse(),
    okResponse()
  ];
  let index = 0;
  const server = createMockServer(() => responses[Math.min(index++, responses.length - 1)]);
  const port = await server.listen(0);
  const result = await spawnRuntime("state-transitions", metricsUrl(port), 9000).done;
  await server.close();

  assert(hasFetch(result.events, { reachable: true, serviceStatus: "offline", hasSnapshot: false }), "state-transitions did not observe offline/null snapshot");
  assert(hasFetch(result.events, { reachable: true, activeThreadStaleness: "stale" }), "state-transitions did not observe stale active thread");
  assert(hasFetch(result.events, { reachable: true, serviceStatus: "degraded", sourceHealthStatus: "degraded" }), "state-transitions did not observe degraded response");
  assert(hasFetch(result.events, { reachable: true, serviceStatus: "ok", sourceHealthStatus: "ok" }), "state-transitions did not recover to ok response");
  return pass("offline-stale-degraded-transitions");
}

async function multiConsumerCoexistence() {
  let requestCount = 0;
  const server = createMockServer(() => {
    requestCount += 1;
    return okResponse();
  });
  const port = await server.listen(0);
  const first = spawnRuntime("multi-consumer-a", metricsUrl(port), 4500);
  const second = spawnRuntime("multi-consumer-b", metricsUrl(port), 4500);
  const firstResult = await first.done;
  const secondResult = await second.done;
  await server.close();

  assert(hasFetch(firstResult.events, { reachable: true, contractOk: true }), "first runtime did not observe valid contract");
  assert(hasFetch(secondResult.events, { reachable: true, contractOk: true }), "second runtime did not observe valid contract");
  assert(requestCount >= 4, "mock service did not receive multiple consumer requests");
  return pass("multi-consumer-coexistence");
}

async function realServiceCompatibility() {
  const port = await getFreePort();
  const missingCodexHome = path.join(os.tmpdir(), `kamay-agent-metrics-missing-${process.pid}`);
  const service = spawn("node", [
    path.join(__dirname, "..", "..", "dist", "serviceCli.js"),
    "--port",
    String(port),
    "--interval-ms",
    "500",
    "--codex-home",
    missingCodexHome
  ], {
    cwd: __dirname,
    stdio: ["ignore", "pipe", "pipe"]
  });

  try {
    await waitForOutput(service, "endpoint", 8000);
    const result = await spawnRuntime("real-service-compatibility", metricsUrl(port), 4500).done;
    assert(hasFetch(result.events, { reachable: true, contractOk: true }), "real service compatibility did not observe valid contract");
    return pass("real-service-compatibility");
  } finally {
    service.kill("SIGINT");
    await waitForExit(service, 3000).catch(() => service.kill());
  }
}

function spawnRuntime(label, url, smokeMs) {
  const events = [];
  const child = spawn(electronPath, ["."], {
    cwd: __dirname,
    env: {
      ...process.env,
      KAMAY_METRICS_URL: url,
      KAMAY_SPIKE_SMOKE: "1",
      KAMAY_SPIKE_SMOKE_MS: String(smokeMs)
    },
    stdio: ["ignore", "pipe", "pipe"]
  });

  child.stdout.on("data", (chunk) => {
    for (const line of chunk.toString().split(/\r?\n/)) {
      if (line.trim().length === 0) {
        continue;
      }
      try {
        const parsed = JSON.parse(line);
        events.push(parsed);
      } catch {
        events.push({ event: "stdout", label, text: line.trim() });
      }
    }
  });

  child.stderr.on("data", (chunk) => {
    for (const line of chunk.toString().split(/\r?\n/)) {
      if (line.trim().length > 0) {
        events.push({ event: "stderr", label, text: line.trim() });
      }
    }
  });

  return {
    done: waitForExit(child, smokeMs + 8000).then((code) => {
      if (code !== 0) {
        throw new Error(`${label} exited with code ${code}`);
      }
      return { label, events };
    })
  };
}

function createMockServer(responseFactory) {
  let server = null;
  return {
    listen: (port) => new Promise((resolve, reject) => {
      server = http.createServer((request, response) => {
        if (request.method !== "GET" || request.url !== "/metrics/current") {
          response.writeHead(404, { "content-type": "application/json" });
          response.end(JSON.stringify({ error: "not_found" }));
          return;
        }
        response.writeHead(200, { "content-type": "application/json" });
        response.end(JSON.stringify(responseFactory()));
      });
      server.once("error", reject);
      server.listen(port, "127.0.0.1", () => {
        server.off("error", reject);
        const address = server.address();
        resolve(address.port);
      });
    }),
    close: () => new Promise((resolve, reject) => {
      if (server === null || !server.listening) {
        resolve();
        return;
      }
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    })
  };
}

function okResponse() {
  return metricsResponse("ok", "ok", activeThread("active"), []);
}

function offlineResponse() {
  return metricsResponse("offline", "offline", null, ["mock offline"]);
}

function staleResponse() {
  return metricsResponse("ok", "ok", activeThread("stale"), []);
}

function degradedResponse() {
  return metricsResponse("degraded", "degraded", activeThread("active"), ["mock degraded"]);
}

function metricsResponse(serviceStatus, sourceHealthStatus, activeThreadValue, warnings) {
  const now = new Date().toISOString();
  const snapshot = activeThreadValue === null
    ? null
    : {
        observedAt: now,
        codexHome: "mock",
        sources: [],
        activeThread: activeThreadValue,
        metrics: {
          sessionIndexRows: 1,
          sessionJsonlFiles: 1,
          sessionJsonlEvents: 1,
          malformedJsonlLines: 0,
          sqliteTables: {},
          sqliteRows: {}
        },
        warnings
      };

  return {
    contractVersion: CONTRACT_VERSION,
    service: {
      status: serviceStatus,
      startedAt: now,
      lastUpdatedAt: snapshot === null ? null : now,
      pollingIntervalMs: 500,
      lastError: warnings[0] || null
    },
    snapshot,
    sourceHealth: {
      status: sourceHealthStatus,
      warnings
    }
  };
}

function activeThread(staleness) {
  return {
    id: `mock-${staleness}`,
    updatedAt: new Date(Date.now() - (staleness === "stale" ? 30 * 60 * 1000 : 1000)).toISOString(),
    source: "mock",
    modelProvider: "mock",
    model: "mock",
    archived: false,
    staleness,
    resolvedFrom: "mock"
  };
}

async function getFreePort() {
  const server = createMockServer(() => okResponse());
  const port = await server.listen(0);
  await server.close();
  return port;
}

function metricsUrl(port) {
  return `http://127.0.0.1:${port}/metrics/current`;
}

function hasFetch(events, expected) {
  return events.some((event) => {
    if (event.event !== "metrics-fetch") {
      return false;
    }
    return Object.entries(expected).every(([key, value]) => event[key] === value);
  });
}

function pass(name) {
  console.log(JSON.stringify({ event: "runtime-lifecycle-scenario-pass", name }));
  return { name };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitForOutput(child, pattern, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`Timed out waiting for ${pattern}`)), timeoutMs);
    const onData = (chunk) => {
      if (chunk.toString().includes(pattern)) {
        clearTimeout(timeout);
        child.stdout.off("data", onData);
        resolve();
      }
    };
    child.stdout.on("data", onData);
    child.once("exit", (code) => {
      clearTimeout(timeout);
      reject(new Error(`Process exited before ${pattern}: ${code}`));
    });
  });
}

function waitForExit(child, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Process exit timed out")), timeoutMs);
    child.once("exit", (code) => {
      clearTimeout(timeout);
      resolve(code ?? 0);
    });
  });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
