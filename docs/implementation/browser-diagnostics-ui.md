# Browser Diagnostics UI

This document describes the disposable browser diagnostics page served by the local metrics service.

## Purpose

The page validates visual information hierarchy, polling behavior, and stale/offline rendering against the versioned service contract.

It is not product UI, not a HUD, and not a desktop/runtime commitment.

## Endpoint

```text
GET http://127.0.0.1:8765/diagnostics
```

The page is static HTML/CSS/JS returned by the existing localhost service. It fetches only:

```text
GET /metrics/current
```

## Runtime Behavior

- Polls `/metrics/current` every 2000ms.
- Displays `contractVersion`, service status, source health, provider/model, active thread, freshness/staleness, warnings/errors, and key counters.
- Handles unsupported contract versions, malformed responses, HTTP errors, offline/degraded service state, and `snapshot: null`.
- Uses no framework, build pipeline, external assets, CDN, WebSockets, or browser storage.

## Non-goals

- No Electron, Godot, Aseprite, pet/avatar runtime, overlay, always-on-top window, tray, or desktop hook.
- No persistence, auth, WebSockets, provider expansion, MCP, Cloudflare, deployment, Docker, k8s, CI/CD, Kamay imports, or Kamay Adapter imports.
- No durable product UI contract beyond exercising the existing `metrics.current.v1` service response.
