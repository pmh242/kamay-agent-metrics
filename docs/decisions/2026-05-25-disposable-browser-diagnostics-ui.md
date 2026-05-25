# Disposable Browser Diagnostics UI

Date: 2026-05-25

Status: Accepted

## Context

The service has a versioned `GET /metrics/current` contract and a disposable terminal consumer. Before choosing a HUD, companion runtime, or desktop technology, the project needs a small visual surface to test information hierarchy and polling UX.

## Decision

Serve a static browser diagnostics page from the existing localhost service at `GET /diagnostics`.

The page reads only `GET /metrics/current`, checks the `metrics.current.v1` contract marker, and renders service status, source health, active thread, freshness, warnings, and counters.

## Consequences

- The project can validate visual diagnostics without choosing a product UI framework or runtime.
- The page can be replaced or deleted when durable HUD or companion surfaces begin.
- No Electron, Godot, Aseprite, overlay, pet, tray, WebSocket, persistence, provider expansion, deployment, or ecosystem import is introduced.
