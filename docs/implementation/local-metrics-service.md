# Local Metrics Service

This document describes the first local metrics service boundary. It is implemented for local development and architecture validation only.

## Endpoint

```text
GET http://127.0.0.1:8765/metrics/current
```

The response contains:

- `contractVersion`: currently `metrics.current.v1`
- `service`: service status, start time, last update time, polling interval, and last refresh error
- `sourceHealth`: `ok`, `degraded`, or `offline` plus warnings
- `snapshot`: the latest normalized `TelemetrySnapshot`, or `null` if no snapshot has succeeded

## V1 Contract

`GET /metrics/current` is the stable consumer boundary for this phase. The v1 response shape is:

```json
{
  "contractVersion": "metrics.current.v1",
  "service": {
    "status": "ok",
    "startedAt": "2026-05-25T00:00:00.000Z",
    "lastUpdatedAt": "2026-05-25T00:00:01.000Z",
    "pollingIntervalMs": 2000,
    "lastError": null
  },
  "sourceHealth": {
    "status": "ok",
    "warnings": []
  },
  "snapshot": null
}
```

Compatibility rules:

- Consumers may depend on the documented top-level fields and enum values.
- Additive fields are allowed within the same contract version.
- Removing fields, renaming fields, changing enum meanings, or changing nullable semantics requires a new contract version.
- Runtime validation is intentionally shallow: it checks the contract version, service metadata, source health, and whether `snapshot` is `null` or an object. It does not validate every nested `TelemetrySnapshot` field.
- `snapshot` may be `null` when no snapshot has succeeded.
- When `snapshot` is not `null`, it contains `observedAt`, `codexHome`, `sources`, `activeThread`, `metrics`, and `warnings`.
- `snapshot.activeThread` may be `null` when no reliable active thread can be resolved.
- `service.lastUpdatedAt` may be `null` before a successful refresh.
- `service.lastError` may be `null` when there is no current refresh error.
- Source statuses are `discovered`, `missing`, `error`, or `stale`.
- Active-thread staleness values are `active`, `stale`, or `unknown`.

## Runtime Behavior

- Binds only to `127.0.0.1`.
- Keeps state in memory only.
- Performs an immediate refresh at startup, then polls on the configured interval.
- Owns the polling lifecycle in the service layer.
- Reuses the existing read-only telemetry snapshot collector.
- Survives missing Codex sources or refresh errors without crashing.

## Failure Semantics

- `ok`: latest snapshot exists and has no source warnings.
- `degraded`: a previous snapshot exists but the latest refresh failed or source warnings exist.
- `offline`: no snapshot has succeeded, or all discovered sources are missing/error and no active thread is resolved.

`sourceHealth.status` follows the same `ok`, `degraded`, and `offline` vocabulary from the source perspective. A stale active thread is represented inside `snapshot.activeThread.staleness` as `active`, `stale`, or `unknown` when a snapshot exists.

Refresh errors are exposed as strings in service metadata. Raw provider content is not exposed.

## Non-goals

- No persistence or database creation.
- No remote binding.
- No auth system.
- No WebSockets.
- No UI, HUD, overlay, tray, Electron, Godot, pet, or Aseprite runtime.
- No Cloudflare, Docker, CI/CD, deployment, or infrastructure.
- No provider cloud APIs, Kamay imports, Kamay Adapter imports, MCP integration, or multi-provider expansion.
