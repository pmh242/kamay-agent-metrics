import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  isMetricsCurrentResponse,
  METRICS_CURRENT_CONTRACT_VERSION
} from "./contract.js";
import { MetricsService } from "./service.js";
import type { TelemetrySnapshot } from "./types.js";

describe("metrics current contract", () => {
  it("accepts an online v1 service response", async () => {
    const service = new MetricsService({
      pollingIntervalMs: 60_000,
      collectSnapshot: async () => makeSnapshot()
    });

    await service.refresh();
    const current = service.getCurrent();

    assert.equal(current.contractVersion, METRICS_CURRENT_CONTRACT_VERSION);
    assert.equal(isMetricsCurrentResponse(current), true);
    assert.equal(current.service.status, "ok");
    assert.notEqual(current.snapshot, null);
    assert.equal(current.sourceHealth.status, "ok");
  });

  it("accepts an offline v1 response with a null snapshot", async () => {
    const service = new MetricsService({
      pollingIntervalMs: 60_000,
      collectSnapshot: async () => {
        throw new Error("missing telemetry");
      }
    });

    await service.refresh();
    const current = service.getCurrent();

    assert.equal(isMetricsCurrentResponse(current), true);
    assert.equal(current.contractVersion, METRICS_CURRENT_CONTRACT_VERSION);
    assert.equal(current.service.status, "offline");
    assert.equal(current.snapshot, null);
    assert.equal(current.sourceHealth.status, "offline");
  });

  it("accepts a degraded v1 response that keeps the previous snapshot", async () => {
    let calls = 0;
    const service = new MetricsService({
      pollingIntervalMs: 60_000,
      collectSnapshot: async () => {
        calls += 1;
        if (calls === 1) {
          return makeSnapshot();
        }
        throw new Error("locked sqlite");
      }
    });

    await service.refresh();
    await service.refresh();
    const current = service.getCurrent();

    assert.equal(isMetricsCurrentResponse(current), true);
    assert.equal(current.service.status, "degraded");
    assert.equal(current.snapshot?.observedAt, "2026-05-25T00:00:00.000Z");
    assert.equal(current.service.lastError, "locked sqlite");
    assert.equal(current.sourceHealth.status, "degraded");
  });

  it("rejects missing or wrong contract versions", () => {
    assert.equal(isMetricsCurrentResponse({
      service: {},
      sourceHealth: {},
      snapshot: null
    }), false);

    assert.equal(isMetricsCurrentResponse({
      contractVersion: "metrics.current.v2",
      service: {},
      sourceHealth: {},
      snapshot: null
    }), false);
  });

  it("rejects wrong section shapes even with the v1 contract version", () => {
    assert.equal(isMetricsCurrentResponse({
      contractVersion: METRICS_CURRENT_CONTRACT_VERSION,
      service: {},
      sourceHealth: {},
      snapshot: null
    }), false);
  });
});

function makeSnapshot(overrides: Partial<TelemetrySnapshot> = {}): TelemetrySnapshot {
  return {
    observedAt: "2026-05-25T00:00:00.000Z",
    codexHome: "C:\\fake\\.codex",
    sources: [
      {
        kind: "session_index",
        path: "C:\\fake\\.codex\\session_index.jsonl",
        status: "discovered"
      }
    ],
    activeThread: {
      id: "thread-1",
      staleness: "active",
      resolvedFrom: "session_index"
    },
    metrics: {
      sessionIndexRows: 1,
      sessionJsonlFiles: 1,
      sessionJsonlEvents: 2,
      malformedJsonlLines: 0,
      sqliteTables: {},
      sqliteRows: {}
    },
    warnings: [],
    ...overrides
  };
}
