# Read-only Codex Telemetry Discovery PoC

Date: 2026-05-25

Status: Accepted for PoC

## Context

The project needs to validate whether local Codex telemetry can be discovered safely before building overlays, daemons, provider abstractions, persistence, or infrastructure.

Observed local Codex state includes JSONL and SQLite sources. Some fields may contain sensitive prompt, response, tool-output, memory, summary, or log-body content.

## Decision

Build only a local read-only CLI PoC that discovers Codex local state, inspects JSONL and SQLite sources, extracts allowlisted operational metadata, and prints normalized snapshots to the console.

Use `node:sqlite` only as a PoC runtime assumption. If unavailable, the implementation is blocked rather than adding SQLite dependencies or changing the architecture.

## Consequences

- The PoC can validate discovery and normalization assumptions without provider-state writes.
- Sensitive content fields are denied by design.
- No Electron, HUD, HTTP server, daemon, persistence, provider API, deployment, or infrastructure is introduced.
- Production runtime and provider abstraction decisions remain open.
