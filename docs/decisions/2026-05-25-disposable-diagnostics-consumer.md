# Disposable Diagnostics Consumer

Date: 2026-05-25

Status: Accepted

## Context

The local metrics service now exposes normalized snapshots through `GET /metrics/current`. Before choosing any HUD, companion, runtime, or UI architecture, the project needs a tiny consumer to validate service reachability, refresh behavior, stale/offline states, and snapshot rendering expectations.

## Decision

Add a disposable terminal diagnostics consumer that reads only the local service endpoint and renders plain text.

The consumer is not a product UI, not a runtime commitment, and not an integration with Kamay Buddy, Kamay-X, Electron, Godot, overlays, trays, or pets.

## Consequences

- The service contract can be exercised from an external consumer path.
- Offline/error/stale rendering can be validated without adding UI architecture.
- The consumer can be replaced or deleted when durable product surfaces begin.
