# Disposable Diagnostics Consumer

This document describes the terminal diagnostics consumer used to validate the local metrics service contract.

## Purpose

The consumer is disposable validation tooling. It exists to prove that a future HUD, Kamay Buddy surface, Kamay-X integration, or runtime consumer can read normalized metrics through the service boundary.

It is not product UI and does not establish a frontend/runtime architecture.

## Data Source

The consumer reads only:

```text
GET http://127.0.0.1:8765/metrics/current
```

It does not inspect Codex files, SQLite databases, JSONL files, provider state, or telemetry sources directly.

## Runtime Behavior

- Renders plain terminal text.
- Supports one-shot mode with `--once`.
- Supports interval refresh with `--interval-ms`.
- Shows service reachability, service status, source health, provider/model state, active thread, freshness/staleness, source counts, warnings, and last error.
- Handles service offline, HTTP errors, malformed service responses, missing snapshots, degraded state, and offline source health without crashing.

## Non-goals

- No Electron, browser app, HUD, overlay, tray, Godot, pet, Aseprite, animation, or transparent window.
- No persistence, auth, WebSockets, remote telemetry, provider APIs, MCP, Cloudflare, deployment, Docker, k8s, CI/CD, Kamay imports, or Kamay Adapter imports.
- No durable UI contract beyond validating the existing service response shape.
