# Architecture

This is the target architecture direction. It is not implemented yet.

## Target Boundaries

Kamay Agent Metrics is expected to use a local, provider-agnostic pipeline:

1. **Collectors** observe local agent activity or exported telemetry.
2. **Adapters** translate provider-specific or runtime-specific inputs into a shared shape.
3. **Normalizer** converts incoming events into stable metrics and status records.
4. **State layer** holds the current local view needed by the HUD.
5. **HUD/UI** presents metrics, status, and recent activity without depending on raw provider formats.

## Current PoC Boundary

The implemented PoC covers only the first local discovery slice:

1. Discover local Codex state locations.
2. Inspect JSONL and SQLite sources in read-only mode.
3. Extract allowlisted operational metadata.
4. Normalize the result into a console `TelemetrySnapshot`-like object.

The PoC is not a provider abstraction layer, daemon, HTTP service, overlay, Electron app, persistence layer, or deployment target.

## Boundary Rules

- Collectors and adapters may know about provider-specific formats.
- The normalizer should define project-owned concepts.
- The HUD should not parse raw provider telemetry.
- Storage or state should start local and minimal.
- Cross-process services, background daemons, cloud sync, and deployment targets are out of scope until separately decided.

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
