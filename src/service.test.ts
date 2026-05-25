import { afterEach, describe, it } from "node:test";
import assert from "node:assert/strict";

import { METRICS_CURRENT_CONTRACT_VERSION } from "./contract.js";
import { createMetricsHttpServer } from "./httpServer.js";
import { MetricsService } from "./service.js";
import type { TelemetrySnapshot } from "./types.js";

const servers: Array<{ close: () => Promise<void> }> = [];

afterEach(async () => {
  while (servers.length > 0) {
    const server = servers.pop();
    if (server !== undefined) {
      await server.close();
    }
  }
});

describe("MetricsService", () => {
  it("owns polling and stores the latest snapshot", async () => {
    let calls = 0;
    const service = new MetricsService({
      pollingIntervalMs: 60_000,
      collectSnapshot: async () => {
        calls += 1;
        return makeSnapshot({ observedAt: `2026-05-25T00:00:0${calls}.000Z` });
      }
    });

    await service.start();
    service.stop();

    const current = service.getCurrent();
    assert.equal(calls, 1);
    assert.equal(current.service.status, "ok");
    assert.equal(current.snapshot?.observedAt, "2026-05-25T00:00:01.000Z");
    assert.equal(current.sourceHealth.status, "ok");
  });

  it("reports offline when the first refresh fails", async () => {
    const service = new MetricsService({
      pollingIntervalMs: 60_000,
      collectSnapshot: async () => {
        throw new Error("missing telemetry");
      }
    });

    await service.start();
    service.stop();

    const current = service.getCurrent();
    assert.equal(current.service.status, "offline");
    assert.equal(current.snapshot, null);
    assert.equal(current.sourceHealth.status, "offline");
    assert.equal(current.service.lastError, "missing telemetry");
  });

  it("keeps the previous snapshot and reports degraded after a later refresh fails", async () => {
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
    assert.equal(current.service.status, "degraded");
    assert.equal(current.snapshot?.observedAt, "2026-05-25T00:00:00.000Z");
    assert.equal(current.sourceHealth.status, "degraded");
    assert.equal(current.service.lastError, "locked sqlite");
  });
});

describe("createMetricsHttpServer", () => {
  it("serves the current metrics response as JSON", async () => {
    const service = new MetricsService({
      pollingIntervalMs: 60_000,
      collectSnapshot: async () => makeSnapshot()
    });
    await service.refresh();
    const server = createMetricsHttpServer(service);
    servers.push(server);
    const address = await server.listen(0);

    const response = await fetch(`http://${address.host}:${address.port}/metrics/current`);
    const body = await response.json() as Record<string, unknown>;

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "application/json; charset=utf-8");
    assert.equal(body.contractVersion, METRICS_CURRENT_CONTRACT_VERSION);
    assert.ok("service" in body);
    assert.ok("sourceHealth" in body);
    assert.ok("snapshot" in body);
  });

  it("returns 405 for non-GET metrics requests and 404 for unknown routes", async () => {
    const service = new MetricsService({
      pollingIntervalMs: 60_000,
      collectSnapshot: async () => makeSnapshot()
    });
    const server = createMetricsHttpServer(service);
    servers.push(server);
    const address = await server.listen(0);

    const methodResponse = await fetch(`http://${address.host}:${address.port}/metrics/current`, { method: "POST" });
    const missingResponse = await fetch(`http://${address.host}:${address.port}/nope`);

    assert.equal(methodResponse.status, 405);
    assert.equal(missingResponse.status, 404);
  });

  it("serves the disposable browser diagnostics UI as static HTML", async () => {
    const service = new MetricsService({
      pollingIntervalMs: 60_000,
      collectSnapshot: async () => makeSnapshot()
    });
    const server = createMetricsHttpServer(service);
    servers.push(server);
    const address = await server.listen(0);

    const response = await fetch(`http://${address.host}:${address.port}/diagnostics`);
    const html = await response.text();

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "text/html; charset=utf-8");
    assert.match(html, /Kamay Agent Metrics Diagnostics/);
    assert.match(html, /\/metrics\/current/);
    assert.match(html, /metrics\.current\.v1/);
  });

  it("returns 405 for non-GET diagnostics requests", async () => {
    const service = new MetricsService({
      pollingIntervalMs: 60_000,
      collectSnapshot: async () => makeSnapshot()
    });
    const server = createMetricsHttpServer(service);
    servers.push(server);
    const address = await server.listen(0);

    const response = await fetch(`http://${address.host}:${address.port}/diagnostics`, { method: "POST" });

    assert.equal(response.status, 405);
    assert.equal(response.headers.get("allow"), "GET");
  });

  it("returns an empty favicon response for browser diagnostics requests", async () => {
    const service = new MetricsService({
      pollingIntervalMs: 60_000,
      collectSnapshot: async () => makeSnapshot()
    });
    const server = createMetricsHttpServer(service);
    servers.push(server);
    const address = await server.listen(0);

    const response = await fetch(`http://${address.host}:${address.port}/favicon.ico`);

    assert.equal(response.status, 204);
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
