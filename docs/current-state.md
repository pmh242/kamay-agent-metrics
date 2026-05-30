# Current State

This document records the factual project state. It should be updated when reality changes, not when a feature is merely discussed.

## Planned

- A provider-agnostic local agent metrics and HUD system.
- Modular boundaries for data collection, normalization, storage or state, and display.
- Privacy-safe defaults that avoid collecting secrets or unnecessary content.
- Incremental delivery through a narrow MVP before provider-specific extensions.
- Future HUD work after the read-only discovery assumptions are validated further.
- Future ecosystem alignment with Kamay main, Kamay Adapter, Kamay-X, and Kamay Buddy after local service boundaries stabilize.
- Future Kamay Buddy systems may use this repository as a telemetry/service proving ground for the Operational Spine, but this repository is not the full Kamay Buddy product.
- Future Kamay Buddy runtime evaluation across Electron, Godot, hybrid, 2D, 2.5D, and Aseprite-informed asset workflows.
- Future runtime spike findings may inform Kamay Buddy direction after they are documented and reviewed.
- Future human visual verification of Electron transparent-window behavior on target desktop environments.
- Future runtime work may build on validated polling lifecycle semantics after a durable runtime direction is separately chosen.
- Future companion expression may build on validated signal mappings only after product behavior is separately approved.
- Future companion expression may use signal UX findings only after vocabulary, runtime direction, and product behavior are separately approved.
- Future companion temporal attention behavior may use timing findings only after product behavior and human visual review are separately approved.

## Implemented

- Minimal local TypeScript CLI for read-only Codex telemetry discovery.
- Localhost-only in-memory metrics service bound to `127.0.0.1`.
- `GET /metrics/current` endpoint for current normalized snapshot state with `contractVersion: "metrics.current.v1"`.
- Disposable static browser diagnostics UI served at `GET /diagnostics`.
- Service-owned polling lifecycle for snapshot refresh.
- Disposable terminal diagnostics consumer that reads only the local service endpoint.
- Docs-only Kamay Buddy runtime evaluation posture.
- Docs-only Kamay Buddy core thesis as durable product-direction guidance.
- Isolated disposable Electron transparent-window runtime spike under `experiments/`.
- Experiment-local runtime/service lifecycle bridge validation under `experiments/`.
- Experiment-local runtime signal mapping for simple labels, glyphs, reasons, and CSS tone changes.
- Experiment-local runtime signal UX metadata and CSS-only visual priority refinements.
- Experiment-local runtime temporal signal timing for persistence, fade, escalation, recovery, and cooldown.
- Discovery of local Codex source locations under the configured Codex home.
- JSONL parsing with malformed-line accounting.
- SQLite inspection through Node `node:sqlite` using read-only immutable URI mode.
- Allowlisted normalization into a `TelemetrySnapshot`-like console object.
- Repeated console snapshots with `--interval-ms`; one-shot snapshots with `--once`.

Not implemented:

- No durable Electron product runtime, overlay, tray, HUD window, daemon, provider API client, persistence layer, deployment, or infrastructure.
- No remote HTTP server; the metrics service is localhost-only and in-memory.
- No durable UI/runtime architecture; the terminal and browser diagnostics surfaces are disposable contract-validation tooling.
- No Godot, Aseprite, overlay, tray, pet/avatar runtime, desktop hook, durable runtime prototype, or asset pipeline.
- No personality, dialogue, lore, memory, behavior tree, AI agent behavior, or pet logic.
- No general AI assistant, chatbot shell, autonomous agent platform, companion interface, or interchangeable avatar embodiment layer.
- No animation framework, behavior tree/state-machine framework, temporal product behavior, or companion attention model.
- The Electron spike is disposable experiment code only; it is not a product runtime or HUD implementation.
- Electron is viable for further isolated HUD/runtime shell experimentation, but runtime choice remains undecided.
- No Kamay main, Kamay Adapter, Kamay-X, or Kamay Buddy integration exists yet.
- No external Kamay ecosystem code, assets, drivers, MCP surfaces, or capabilities have been imported.

## Tested

- `pnpm typecheck` passes.
- `pnpm build` passes.
- `pnpm test` passes focused unit coverage for JSONL parsing, allowlist filtering, missing-thread handling, and stale-session handling.
- `pnpm poc --once` produced a local normalized snapshot.
- `pnpm poc --interval-ms 1000` produced repeated snapshots.
- Metrics service unit and HTTP tests cover polling ownership, current snapshot JSON, offline/degraded behavior, and 404/405 routing.
- Diagnostics consumer tests cover service fetch behavior, plain-text rendering, offline/error rendering, and CLI argument parsing.
- Contract tests cover the versioned `/metrics/current` response for online, offline/null snapshot, degraded previous-snapshot, malformed, and wrong-version cases.
- Browser diagnostics route tests cover static HTML serving and non-GET rejection.
- Root typecheck, build, and test validation covers the telemetry/service backbone; the Electron spike is validated separately through experiment-local install and launch checks.
- Runtime lifecycle bridge behavior is validated through an experiment-local harness, not root service architecture changes.
- Runtime signal mapping is validated through an experiment-local harness, not root service architecture changes.
- Runtime signal UX priority and persistence behavior is validated through an experiment-local harness, not root service architecture changes.
- Runtime temporal signal behavior is validated through an experiment-local harness, not root service architecture changes.

## Deploy-ready

- Nothing is deploy-ready.
- No service, binary package, extension, or deployment target exists.

## Deployed

- Nothing has been deployed.

## Verified

- Local PoC runtime behavior has been manually validated against a live local Codex state on May 25, 2026.
- Local metrics service runtime behavior has been manually validated against `GET /metrics/current`.
- Versioned metrics contract marker `metrics.current.v1` has been manually observed from `GET /metrics/current`.
- Disposable diagnostics consumer has been manually validated against the local service endpoint and service-offline behavior.
- Sensitive content fields are denied by code and covered by unit test.
- No production readiness, deployment readiness, or cross-machine reliability has been verified.
- A live metadata before/after comparison was inconclusive for proving no provider-state writes because Codex itself was actively writing during validation.
- Ecosystem placement is documented as product/architecture intent only, not implemented integration.
- The Electron spike launched as an isolated runtime shell and consumed the versioned local metrics service without telemetry/service backbone changes.
- Electron always-on-top behavior was observed programmatically during smoke validation.
- Electron visual transparency has not yet been human-verified and remains pending.
- Electron transparent-window and always-on-top feasibility are experiment findings only, not runtime selection or production readiness.
- Runtime lifecycle validation demonstrates startup-before-service, startup-after-service, reconnect, offline/null snapshot, stale, degraded/recovered, real-service compatibility, and multi-consumer polling behavior as experiment findings.
- Runtime signal validation maps `idle`, `active`, `degraded`, `offline`, `reconnecting`, `stale`, `error`, and `unknown` as experiment findings only.
- Runtime signal UX validation covers priority ordering, persistence timing, higher-priority interruption, and conservative visual treatment as experiment findings only.
- Runtime temporal signal validation covers fade, escalation, recovery, cooldown, and calm active/idle behavior as experiment findings only.

## Update Rule

Move items between sections only when the corresponding evidence exists. Planned work is not implemented. Implemented work is not tested. Tested work is not deployed. Deployed work is not verified until verification has actually happened.
