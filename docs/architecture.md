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
6. Serve the latest snapshot to future local consumers through the versioned `GET /metrics/current` contract.
7. Validate consumer behavior with a disposable terminal diagnostics consumer.
8. Validate visual information hierarchy with a disposable static browser diagnostics page.

The PoC and service are not a provider abstraction layer, daemon, remote HTTP service, overlay, Electron app, persistence layer, or deployment target.

## Local Service Boundary

The service layer owns polling and in-memory current-state management. Future HUD, Kamay Buddy, Kamay-X, or runtime consumers should read normalized snapshots from this boundary instead of talking directly to provider-specific collectors.

The service currently binds only to `127.0.0.1` and exposes only `GET /metrics/current`. That response includes `contractVersion: "metrics.current.v1"` so future consumers can depend on an explicit service boundary rather than incidental JSON shape.

The current diagnostics consumer is not part of the durable architecture. It exists to validate service reachability, refresh semantics, stale/offline rendering, and future consumer expectations without choosing a UI/runtime framework.

The browser diagnostics page is also disposable. It is static HTML/CSS/JS served by the local service at `GET /diagnostics`, reads only `GET /metrics/current`, and does not choose Electron, Godot, overlay, pet, tray, or product UI architecture.

The Electron transparent-window spike is isolated under `experiments/` and is not part of the durable service architecture. It consumes only `GET http://127.0.0.1:8765/metrics/current`, requests transparent and always-on-top behavior for feasibility research, and must not own provider discovery, telemetry polling, normalization, persistence, or provider file access.

The spike provides evidence that Electron can act as an isolated HUD/runtime shell experiment over the versioned service contract. It does not change the durable architecture: the telemetry/service backbone remains runtime-independent, and Electron is not selected as the final product runtime.

The lifecycle bridge experiment validates runtime/service behavior over polling only. Runtime startup order, reconnect, offline/stale transitions, recovery, and multi-consumer coexistence are runtime-consumer concerns; they do not move telemetry discovery, normalization, polling ownership, or source health authority out of the local service.

The signal mapping experiment interprets the versioned service response into disposable runtime labels and CSS tones. It is not part of the service contract, does not introduce product behavior, and can change independently of `metrics.current.v1`.

The signal UX experiment adds priority, persistence, visual weight, and attention-style metadata inside the isolated Electron spike. These rules are interaction findings only. They may help evaluate future companion expression, but they do not define durable product behavior, pet/avatar logic, animation architecture, or final runtime vocabulary.

The temporal signal experiment adds persistence, fade, escalation, recovery, and cooldown timing inside the isolated Electron spike. These timing rules are disposable attention-design findings only. They do not create a runtime state machine, behavior tree, animation framework, pet/avatar system, memory system, or durable companion attention model.

## Runtime Evaluation Posture

Kamay Buddy runtime evaluation is now documented as research only. Electron, Godot, and hybrid approaches may be compared against the validated service contract, but no runtime is selected or implemented.

The likely near-term posture is service-first and hybrid-friendly: keep telemetry discovery, normalization, polling, and `metrics.current.v1` independent; evaluate browser or Electron-style surfaces for diagnostics and controls; evaluate Godot, 2D/2.5D, and Aseprite-informed workflows only for future companion presence if product needs justify that complexity.

Runtime surfaces must consume the versioned service endpoint, must not parse provider files directly, and must not own provider-specific telemetry logic.

Runtime spikes may live under `experiments/` when explicitly approved. Findings from those spikes can inform future Kamay Buddy direction, but experiment code should remain disposable until a separate decision promotes a runtime path.

Godot, 2D, 2.5D, and Aseprite-informed workflows remain future exploration paths. They are not displaced by the Electron spike.

Polling remains the approved runtime/service bridge until a later decision proves realtime infrastructure is necessary. WebSockets, event buses, runtime-owned telemetry state, and orchestration frameworks are not part of the current architecture.

Signal mappings may inform future companion expression, but pet/avatar logic, personality, dialogue, memory, behavior trees, animation systems, and durable product behavior remain out of scope.

Signal UX findings may inform attention design, but runtime surfaces must remain quiet by default and avoid promoting transient telemetry states into product behavior without a separate decision.

Temporal signal findings may inform future attention behavior, but time-based escalation and recovery must remain experiment-local until human visual review and product direction justify promotion.

## Boundary Rules

- Collectors and adapters may know about provider-specific formats.
- The normalizer should define project-owned concepts.
- The HUD should not parse raw provider telemetry.
- Future consumers should not own telemetry polling.
- Future consumers should use the versioned service endpoint rather than parsing provider files directly.
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
