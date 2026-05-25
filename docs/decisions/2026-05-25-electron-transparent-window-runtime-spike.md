# Electron Transparent Window Runtime Spike

Date: 2026-05-25

Status: Accepted

## Context

The project has a read-only telemetry collector, normalized snapshot shape, localhost metrics service, versioned `metrics.current.v1` contract, and disposable terminal/browser consumers. Runtime evaluation has identified Electron as a candidate for diagnostic and control surfaces, but no runtime has been selected for Kamay Buddy.

## Decision

Allow one isolated Electron transparent-window spike under `experiments/electron-transparent-window/`.

The spike may consume `GET http://127.0.0.1:8765/metrics/current`, request transparent and always-on-top window behavior, and render minimal diagnostics from the versioned service contract.

The spike must not read provider files, modify the telemetry/service backbone, add root runtime dependencies, introduce persistence, create tray/settings/pet/animation systems, or imply Electron has been selected as the product runtime.

## Consequences

- Electron feasibility can be evaluated without contaminating the durable service architecture.
- Future runtime prototypes must continue to consume the service contract instead of parsing provider files directly.
- Transparent-window and always-on-top observations are research findings, not production readiness claims.
- The first spike supports Electron as viable for isolated HUD/runtime shell experimentation, but does not select Electron as the final Kamay Buddy runtime.
- Godot, 2D, 2.5D, and Aseprite-informed companion directions remain future exploration paths.
