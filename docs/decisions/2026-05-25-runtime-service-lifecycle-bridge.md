# Runtime Service Lifecycle Bridge

Date: 2026-05-25

Status: Accepted

## Context

The project has a validated local metrics service, a versioned `metrics.current.v1` contract, disposable diagnostics consumers, and an isolated Electron runtime spike. The next uncertainty is lifecycle behavior between runtimes and the service, not rendering feasibility.

## Decision

Use polling over `GET /metrics/current` as the runtime/service bridge for now.

Runtime experiments may validate startup ordering, reconnect behavior, stale/offline transitions, recovery, narrow IPC rules, and multi-consumer coexistence, but they must remain isolated under `experiments/` and must not change the telemetry/service backbone.

## Consequences

- The service remains authoritative for telemetry discovery, normalization, polling, and source health.
- Runtimes remain disposable consumers and must tolerate service unavailability as a normal state.
- Realtime transports, WebSockets, event buses, orchestration frameworks, runtime-owned telemetry state, and product runtime commitments remain deferred.
- Future runtimes must keep IPC narrow and must not read provider files directly.
