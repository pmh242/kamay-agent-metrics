# Electron Transparent Window Spike

This document describes the isolated Electron runtime spike under `experiments/electron-transparent-window/`.

## Purpose

The spike reduces uncertainty around transparent windows, always-on-top behavior, and minimal polling/render cadence for a possible future Kamay Buddy companion surface.

It is disposable runtime research. It is not product UI, not a HUD, and not a runtime selection.

## Service Dependency

The spike consumes only:

```text
GET http://127.0.0.1:8765/metrics/current
```

It checks `contractVersion: "metrics.current.v1"` and renders only the normalized service response. It does not parse provider files, inspect Codex state, own telemetry polling, or normalize raw telemetry.

Because the renderer is loaded from a local file, the Electron main process performs the localhost fetch through a narrow preload IPC bridge. The renderer itself has no direct network access, and the service endpoint remains the only data source.

## Experiment Shape

- Electron dependency is pinned inside the experiment package.
- The main process creates a small frameless transparent window and requests always-on-top behavior.
- The renderer displays service status, source health, provider/model, active thread, freshness/staleness, warning count, and errors.
- The render cadence is 2000ms.
- Service-offline and malformed-contract states render as local diagnostics rather than crashing.

## Non-goals

- No root service or telemetry changes.
- No durable desktop runtime commitment.
- No tray, settings, animation system, pet/avatar logic, Aseprite pipeline, Godot implementation, WebSockets, persistence, auth, deployment, provider expansion, or Kamay/Kamay Adapter imports.
- No production packaging or installer work.

## Feasibility Notes

Transparent-window and always-on-top behavior depend on the local OS and desktop session. Validation should record whether those behaviors are observed, blocked, or inconclusive instead of treating the requested Electron flags as proof of product feasibility.
