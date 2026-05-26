const {
  createSignalMemory,
  mapRuntimeSignal
} = require("./signalMapper.js");

function main() {
  const cases = [
    {
      name: "offline before first success",
      responses: [{ ok: false, errorCategory: "unreachable" }],
      expected: "offline"
    },
    {
      name: "reconnecting after success",
      responses: [
        { ok: true, value: metricsResponse("ok", "ok", activeThread("active")) },
        { ok: false, errorCategory: "unreachable" }
      ],
      expected: "reconnecting"
    },
    {
      name: "http error",
      responses: [{ ok: false, errorCategory: "http_status" }],
      expected: "error"
    },
    {
      name: "invalid contract",
      responses: [{ ok: true, value: { contractVersion: "wrong" } }],
      expected: "unknown"
    },
    {
      name: "degraded source",
      responses: [{ ok: true, value: metricsResponse("ok", "degraded", activeThread("active")) }],
      expected: "degraded"
    },
    {
      name: "stale thread",
      responses: [{ ok: true, value: metricsResponse("ok", "ok", activeThread("stale")) }],
      expected: "stale"
    },
    {
      name: "unknown freshness",
      responses: [{ ok: true, value: metricsResponse("ok", "ok", activeThread("unknown")) }],
      expected: "stale"
    },
    {
      name: "active thread",
      responses: [{ ok: true, value: metricsResponse("ok", "ok", activeThread("active")) }],
      expected: "active"
    },
    {
      name: "idle service",
      responses: [{ ok: true, value: metricsResponse("ok", "ok", null) }],
      expected: "idle"
    },
    {
      name: "offline service health",
      responses: [{ ok: true, value: metricsResponse("offline", "offline", null) }],
      expected: "offline"
    }
  ];

  for (const testCase of cases) {
    const memory = createSignalMemory();
    let result = null;
    for (const response of testCase.responses) {
      result = mapRuntimeSignal(response, memory);
    }
    assert(result.signal === testCase.expected, `${testCase.name}: expected ${testCase.expected}, got ${result.signal}`);
    console.log(JSON.stringify({
      event: "runtime-signal-scenario-pass",
      name: testCase.name,
      signal: result.signal
    }));
  }

  console.log(JSON.stringify({
    event: "runtime-signal-harness-complete",
    scenarios: cases.map((testCase) => testCase.name)
  }));
}

function metricsResponse(serviceStatus, sourceHealthStatus, activeThreadValue) {
  const now = new Date().toISOString();
  return {
    contractVersion: "metrics.current.v1",
    service: {
      status: serviceStatus,
      startedAt: now,
      lastUpdatedAt: now,
      pollingIntervalMs: 500,
      lastError: null
    },
    snapshot: {
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
      warnings: []
    },
    sourceHealth: {
      status: sourceHealthStatus,
      warnings: []
    }
  };
}

function activeThread(staleness) {
  return {
    id: `mock-${staleness}`,
    updatedAt: new Date().toISOString(),
    source: "mock",
    modelProvider: "mock",
    model: "mock",
    archived: false,
    staleness,
    resolvedFrom: "mock"
  };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

main();
