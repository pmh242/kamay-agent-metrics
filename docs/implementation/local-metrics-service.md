# Local Metrics Service

This document describes the first local metrics service boundary. It is implemented for local development and architecture validation only.

## Endpoint

```text
GET http://127.0.0.1:8765/metrics/current
```

The response contains:

- `service`: service status, start time, last update time, polling interval, and last refresh error
- `sourceHealth`: `ok`, `degraded`, or `offline` plus warnings
- `snapshot`: the latest normalized `TelemetrySnapshot`, or `null` if no snapshot has succeeded

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

Refresh errors are exposed as strings in service metadata. Raw provider content is not exposed.

## Non-goals

- No persistence or database creation.
- No remote binding.
- No auth system.
- No WebSockets.
- No UI, HUD, overlay, tray, Electron, Godot, pet, or Aseprite runtime.
- No Cloudflare, Docker, CI/CD, deployment, or infrastructure.
- No provider cloud APIs, Kamay imports, Kamay Adapter imports, MCP integration, or multi-provider expansion.
