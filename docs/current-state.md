# Current State

This document records the factual project state. It should be updated when reality changes, not when a feature is merely discussed.

## Planned

- A provider-agnostic local agent metrics and HUD system.
- Modular boundaries for data collection, normalization, storage or state, and display.
- Privacy-safe defaults that avoid collecting secrets or unnecessary content.
- Incremental delivery through a narrow MVP before provider-specific extensions.
- Future HUD work after the read-only discovery assumptions are validated further.

## Implemented

- Minimal local TypeScript CLI for read-only Codex telemetry discovery.
- Discovery of local Codex source locations under the configured Codex home.
- JSONL parsing with malformed-line accounting.
- SQLite inspection through Node `node:sqlite` using read-only immutable URI mode.
- Allowlisted normalization into a `TelemetrySnapshot`-like console object.
- Repeated console snapshots with `--interval-ms`; one-shot snapshots with `--once`.

Not implemented:

- No Electron, overlay, tray, HUD window, daemon, HTTP server, provider API client, persistence layer, deployment, or infrastructure.

## Tested

- `pnpm typecheck` passes.
- `pnpm build` passes.
- `pnpm test` passes focused unit coverage for JSONL parsing, allowlist filtering, missing-thread handling, and stale-session handling.
- `pnpm poc --once` produced a local normalized snapshot.
- `pnpm poc --interval-ms 1000` produced repeated snapshots.

## Deploy-ready

- Nothing is deploy-ready.
- No service, binary package, extension, or deployment target exists.

## Deployed

- Nothing has been deployed.

## Verified

- Local PoC runtime behavior has been manually validated against a live local Codex state on May 25, 2026.
- Sensitive content fields are denied by code and covered by unit test.
- No production readiness, deployment readiness, or cross-machine reliability has been verified.
- A live metadata before/after comparison was inconclusive for proving no provider-state writes because Codex itself was actively writing during validation.

## Update Rule

Move items between sections only when the corresponding evidence exists. Planned work is not implemented. Implemented work is not tested. Tested work is not deployed. Deployed work is not verified until verification has actually happened.
