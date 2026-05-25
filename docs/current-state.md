# Current State

This document records the factual project state. It should be updated when reality changes, not when a feature is merely discussed.

## Planned

- A provider-agnostic local agent metrics and HUD system.
- Modular boundaries for data collection, normalization, storage or state, and display.
- Privacy-safe defaults that avoid collecting secrets or unnecessary content.
- Incremental delivery through a narrow MVP before provider-specific extensions.
- Future HUD work after the read-only discovery assumptions are validated further.
- Future ecosystem alignment with Kamay main, Kamay Adapter, Kamay-X, and Kamay Buddy after local service boundaries stabilize.

## Implemented

- Minimal local TypeScript CLI for read-only Codex telemetry discovery.
- Localhost-only in-memory metrics service bound to `127.0.0.1`.
- `GET /metrics/current` endpoint for current normalized snapshot state.
- Service-owned polling lifecycle for snapshot refresh.
- Discovery of local Codex source locations under the configured Codex home.
- JSONL parsing with malformed-line accounting.
- SQLite inspection through Node `node:sqlite` using read-only immutable URI mode.
- Allowlisted normalization into a `TelemetrySnapshot`-like console object.
- Repeated console snapshots with `--interval-ms`; one-shot snapshots with `--once`.

Not implemented:

- No Electron, overlay, tray, HUD window, daemon, provider API client, persistence layer, deployment, or infrastructure.
- No remote HTTP server; the metrics service is localhost-only and in-memory.
- No Kamay main, Kamay Adapter, Kamay-X, or Kamay Buddy integration exists yet.
- No external Kamay ecosystem code, assets, drivers, MCP surfaces, or capabilities have been imported.

## Tested

- `pnpm typecheck` passes.
- `pnpm build` passes.
- `pnpm test` passes focused unit coverage for JSONL parsing, allowlist filtering, missing-thread handling, and stale-session handling.
- `pnpm poc --once` produced a local normalized snapshot.
- `pnpm poc --interval-ms 1000` produced repeated snapshots.
- Metrics service unit and HTTP tests cover polling ownership, current snapshot JSON, offline/degraded behavior, and 404/405 routing.

## Deploy-ready

- Nothing is deploy-ready.
- No service, binary package, extension, or deployment target exists.

## Deployed

- Nothing has been deployed.

## Verified

- Local PoC runtime behavior has been manually validated against a live local Codex state on May 25, 2026.
- Local metrics service runtime behavior has been manually validated against `GET /metrics/current`.
- Sensitive content fields are denied by code and covered by unit test.
- No production readiness, deployment readiness, or cross-machine reliability has been verified.
- A live metadata before/after comparison was inconclusive for proving no provider-state writes because Codex itself was actively writing during validation.
- Ecosystem placement is documented as product/architecture intent only, not implemented integration.

## Update Rule

Move items between sections only when the corresponding evidence exists. Planned work is not implemented. Implemented work is not tested. Tested work is not deployed. Deployed work is not verified until verification has actually happened.
