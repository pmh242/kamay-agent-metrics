# Architecture

This is the target architecture direction. It is not implemented yet.

## Kamay Ecosystem Placement

Kamay Agent Metrics is the independent short-term telemetry and service proving ground within the broader Kamay ecosystem.

- Kamay main is the local OS, kernel, and governance direction.
- Kamay Adapter is the remote repo-read driver and delegation layer direction.
- Kamay-X is the future home for apps, drivers, capabilities, and integrations.
- Kamay Buddy is the intended long-term unified companion and product home.
- Kamay Agent Metrics should stabilize read-only telemetry discovery, normalization, and snapshot contracts so the work can later be absorbed into Kamay Buddy or Kamay-X without pulling provider-specific assumptions into the companion runtime.

This is ecosystem intent only. No Kamay main, Kamay Adapter, Kamay-X, or Kamay Buddy code is imported or integrated in the current repository.

## Target Boundaries

Kamay Agent Metrics is expected to use a local, provider-agnostic pipeline:

1. **Collectors** observe local agent activity or exported telemetry.
2. **Adapters** translate provider-specific or runtime-specific inputs into a shared shape.
3. **Normalizer** converts incoming events into stable metrics and status records.
4. **State layer** holds the current local view needed by the HUD.
5. **HUD/UI** presents metrics, status, and recent activity without depending on raw provider formats.

## Current PoC Boundary

The implemented PoC and local service cover the first local discovery and serving slice:

1. Discover local Codex state locations.
2. Inspect JSONL and SQLite sources in read-only mode.
3. Extract allowlisted operational metadata.
4. Normalize the result into a console `TelemetrySnapshot`-like object.
5. Keep the latest snapshot in memory inside a localhost-only service.
6. Serve the latest snapshot to future local consumers through `GET /metrics/current`.
7. Validate consumer behavior with a disposable terminal diagnostics consumer.

The PoC and service are not a provider abstraction layer, daemon, remote HTTP service, overlay, Electron app, persistence layer, or deployment target.

## Local Service Boundary

The service layer owns polling and in-memory current-state management. Future HUD, Kamay Buddy, Kamay-X, or runtime consumers should read normalized snapshots from this boundary instead of talking directly to provider-specific collectors.

The service currently binds only to `127.0.0.1` and exposes only `GET /metrics/current`.

The current diagnostics consumer is not part of the durable architecture. It exists to validate service reachability, refresh semantics, stale/offline rendering, and future consumer expectations without choosing a UI/runtime framework.

## Boundary Rules

- Collectors and adapters may know about provider-specific formats.
- The normalizer should define project-owned concepts.
- The HUD should not parse raw provider telemetry.
- Future consumers should not own telemetry polling.
- Future consumers should use the service endpoint rather than parsing provider files directly.
- Storage or state should start local and minimal.
- Cross-process services, background daemons, cloud sync, and deployment targets are out of scope until separately decided.
- Ecosystem integration must wait until the local service boundary and snapshot contract are stable.

## Target Data Posture

The system should prefer operational metadata such as timestamps, provider/runtime labels, event types, durations, counts, statuses, and error categories. It should avoid collecting raw prompt or response content by default.

The current PoC follows this posture by denying raw prompt, response, tool-output, history text, log body, summary/memory, instruction, row JSON, result JSON, and encrypted content fields.

## Not Yet Defined

- Production runtime language and framework.
- Stable telemetry input format.
- Adapter interface.
- Storage mechanism.
- HUD technology.
- Packaging or deployment model.

These decisions should be recorded in the decision log when they are made.
