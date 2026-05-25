# Localhost In-memory Metrics Service Boundary

Date: 2026-05-25

Status: Accepted

## Context

Future HUD, Kamay Buddy, Kamay-X, and runtime consumers need a stable local boundary for normalized telemetry snapshots. Provider-specific collectors should not communicate directly with UI or runtime layers.

The existing read-only telemetry PoC already normalizes Codex local state into a `TelemetrySnapshot`-like structure.

## Decision

Add a localhost-only in-memory metrics service on top of the existing snapshot collector.

The service owns polling, keeps only the latest snapshot in memory, and exposes `GET /metrics/current` on `127.0.0.1`.

## Consequences

- Future consumers can target a stable normalized snapshot boundary.
- Polling lifecycle is centralized in the service layer.
- No persistence, remote server, UI, auth, provider API, deployment, or ecosystem integration is introduced.
- The boundary remains reversible and small while service behavior is validated.
