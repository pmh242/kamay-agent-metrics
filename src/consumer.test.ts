import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { METRICS_CURRENT_CONTRACT_VERSION } from "./contract.js";
import { fetchMetricsCurrent } from "./consumer.js";
import { renderConsumerState } from "./consumerRender.js";
import type { MetricsCurrentResponse } from "./contract.js";

describe("fetchMetricsCurrent", () => {
  it("uses only the configured service URL", async () => {
    const requestedUrls: string[] = [];
    const result = await fetchMetricsCurrent("http://127.0.0.1:8765/metrics/current", async (url: string) => {
      requestedUrls.push(url);
      return new Response(JSON.stringify(makeServiceState()), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    });

    assert.equal(result.reachable, true);
    assert.deepEqual(requestedUrls, ["http://127.0.0.1:8765/metrics/current"]);
  });

  it("reports non-200 responses without throwing", async () => {
    const result = await fetchMetricsCurrent("http://127.0.0.1:8765/metrics/current", async () => {
      return new Response("nope", { status: 503 });
    });

    assert.equal(result.reachable, false);
    assert.equal(result.error, "Service returned HTTP 503");
  });

  it("reports unreachable service errors without throwing", async () => {
    const result = await fetchMetricsCurrent("http://127.0.0.1:8765/metrics/current", async () => {
      throw new Error("connection refused");
    });

    assert.equal(result.reachable, false);
    assert.equal(result.error, "connection refused");
  });

  it("rejects wrong-version metrics responses as malformed", async () => {
    const result = await fetchMetricsCurrent("http://127.0.0.1:8765/metrics/current", async () => {
      return new Response(JSON.stringify({
        ...makeServiceState(),
        contractVersion: "metrics.current.v2"
      }), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    });

    assert.equal(result.reachable, false);
    assert.equal(result.error, "Service returned malformed metrics JSON");
  });
});

describe("renderConsumerState", () => {
  it("renders ok service state with provider, active thread, health, and freshness", () => {
    const output = renderConsumerState({
      reachable: true,
      url: "http://127.0.0.1:8765/metrics/current",
      receivedAt: "2026-05-25T00:00:05.000Z",
      data: makeServiceState()
    });

    assert.match(output, /Reachability: online/);
    assert.match(output, /Service: ok/);
    assert.match(output, /Source health: ok/);
    assert.match(output, /Provider: openai/);
    assert.match(output, /Model: gpt-test/);
    assert.match(output, /Active thread: thread-1/);
    assert.match(output, /Freshness: active/);
  });

  it("renders offline state when snapshot is null", () => {
    const output = renderConsumerState({
      reachable: true,
      url: "http://127.0.0.1:8765/metrics/current",
      receivedAt: "2026-05-25T00:00:05.000Z",
      data: makeServiceState({
        service: {
          status: "offline",
          startedAt: "2026-05-25T00:00:00.000Z",
          lastUpdatedAt: null,
          pollingIntervalMs: 1000,
          lastError: "missing telemetry"
        },
        sourceHealth: { status: "offline", warnings: ["missing telemetry"] },
        snapshot: null
      })
    });

    assert.match(output, /Service: offline/);
    assert.match(output, /Source health: offline/);
    assert.match(output, /Snapshot: unavailable/);
    assert.match(output, /Last error: missing telemetry/);
  });

  it("renders unreachable service state", () => {
    const output = renderConsumerState({
      reachable: false,
      url: "http://127.0.0.1:8765/metrics/current",
      receivedAt: "2026-05-25T00:00:05.000Z",
      error: "connection refused"
    });

    assert.match(output, /Reachability: offline/);
    assert.match(output, /Error: connection refused/);
  });
});

function makeServiceState(overrides: Partial<MetricsCurrentResponse> = {}): MetricsCurrentResponse {
  return {
    contractVersion: METRICS_CURRENT_CONTRACT_VERSION,
    service: {
      status: "ok",
      startedAt: "2026-05-25T00:00:00.000Z",
      lastUpdatedAt: "2026-05-25T00:00:04.000Z",
      pollingIntervalMs: 1000,
      lastError: null,
      ...overrides.service
    },
    sourceHealth: {
      status: "ok",
      warnings: [],
      ...overrides.sourceHealth
    },
    snapshot: overrides.snapshot === undefined ? {
      observedAt: "2026-05-25T00:00:04.000Z",
      codexHome: "C:\\fake\\.codex",
      sources: [
        { kind: "session_index", path: "C:\\fake\\.codex\\session_index.jsonl", status: "discovered" },
        { kind: "sqlite", path: "C:\\fake\\.codex\\state_5.sqlite", status: "discovered" }
      ],
      activeThread: {
        id: "thread-1",
        modelProvider: "openai",
        model: "gpt-test",
        updatedAt: "2026-05-25T00:00:03.000Z",
        staleness: "active",
        resolvedFrom: "sqlite_threads"
      },
      metrics: {
        sessionIndexRows: 3,
        sessionJsonlFiles: 2,
        sessionJsonlEvents: 10,
        malformedJsonlLines: 0,
        sqliteTables: { "state_5.sqlite": 10 },
        sqliteRows: { "state_5.sqlite:threads": 3 }
      },
      warnings: []
    } : overrides.snapshot
  };
}
