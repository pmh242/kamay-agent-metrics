# Runtime Service Lifecycle Bridge

This document records the disposable lifecycle experiment for future Kamay Buddy runtimes.

## Purpose

The lifecycle bridge validates how an isolated runtime behaves around the local metrics service starting, stopping, recovering, and serving stale/offline states.

It does not add a durable runtime, daemon, orchestration layer, realtime transport, or product UI.

## Boundary

Runtime experiments consume only:

```text
GET http://127.0.0.1:<port>/metrics/current
```

The default remains:

```text
GET http://127.0.0.1:8765/metrics/current
```

Experiment harnesses may set `KAMAY_METRICS_URL`, but the Electron spike accepts only `http://127.0.0.1:<port>/metrics/current`.

## Validated Behaviors

- Runtime can start before the service, render unreachable state, and recover after the service appears.
- Runtime can start after the service and consume the first reachable `metrics.current.v1` response.
- Runtime can survive service stop/restart and recover without restarting itself.
- Runtime can render offline/null snapshot, stale active-thread, degraded, and recovered states as lifecycle states.
- Multiple runtime processes can poll the same local endpoint at the same time.
- A real root service CLI instance can be consumed through the same lifecycle boundary with a missing Codex home for safe offline validation.

## IPC Rules

- Preload exposes only `kamayMetrics.fetchCurrent()`.
- The renderer does not receive arbitrary IPC channels.
- The renderer has no direct network access and no browser storage.
- The main process fetches only the validated local metrics endpoint.
- Lifecycle logs are sanitized summaries: contract version, service status, source health status, snapshot presence, active-thread staleness, and error category.
- Lifecycle logs must not include raw snapshots, prompt text, response text, tool output, provider files, response bodies, or provider-state paths.

## Runtime Semantics

- The service remains authoritative for telemetry discovery, polling, normalization, source health, and snapshot state.
- Runtimes are consumers only.
- Polling remains the approved bridge mechanism for now.
- Service unavailability is a normal runtime state, not a fatal runtime error.
- Recovery means the next successful `metrics.current.v1` poll updates the runtime surface without process restart.
- Realtime infrastructure, event buses, orchestration frameworks, and runtime-owned state remain deferred.

## Non-goals

- No root telemetry/service architecture rewrite.
- No provider parsing change.
- No persistence, auth, WebSockets, event bus, orchestration framework, tray, settings, pet, animation, Godot, Aseprite, deployment, Kamay import, or Kamay Adapter import.
- No product runtime selection.
