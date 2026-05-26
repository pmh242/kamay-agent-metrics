# Runtime Signal Mapping Experiment

This document records the disposable signal-mapping experiment inside `experiments/electron-transparent-window/`.

## Purpose

The experiment maps versioned metrics service responses into lightweight runtime signals that future companion surfaces can evaluate before any pet, avatar, behavior, dialogue, or product runtime system exists.

It is interaction semantics research only.

## Signal Mapping

| Signal | Evidence | Visual Treatment |
| --- | --- | --- |
| `offline` | Metrics poll is unreachable before first success, or service/source health is `offline`. | Offline label, muted opacity, red tone. |
| `reconnecting` | Metrics poll is unreachable after a prior successful contract response. | Reconnecting label, warning tone. |
| `error` | HTTP status failure, invalid JSON, or other non-contract fetch failure. | Error label, red tone. |
| `unknown` | Missing, wrong, or malformed `metrics.current.v1` contract. | Unknown label, neutral tone. |
| `degraded` | Service or source health is `degraded`. | Degraded label, warning tone. |
| `stale` | Active-thread staleness is `stale` or `unknown`. | Stale label, warning tone. |
| `active` | Service/source are `ok` and active-thread staleness is `active`. | Active label, green tone. |
| `idle` | Service/source are `ok` but no active thread is resolved. | Idle label, neutral tone. |

## Boundaries

- The mapper consumes only the `metrics.current.v1` service response and current runtime fetch state.
- The service remains authoritative for telemetry discovery, normalization, polling, source health, and snapshot content.
- The signal layer does not parse provider files or own telemetry state.
- Renderer network access remains blocked; the renderer receives metrics only through the existing narrow IPC method.
- Visual treatment is limited to label, glyph, reason text, opacity, and simple CSS tone changes.

## Non-goals

- No pet/avatar system.
- No personality, dialogue, lore, memory, behavior tree, AI agent behavior, or product behavior.
- No animation framework, Aseprite runtime integration, Godot implementation, tray/settings system, persistence, WebSockets, event bus, deployment, Kamay import, or Kamay Adapter import.
- No durable runtime selection.

## Validated vs Speculative

Validated in this experiment:

- Direct mapper scenarios for `idle`, `active`, `degraded`, `offline`, `reconnecting`, `stale`, `error`, and `unknown`.
- Minimal Electron rendering of those signals through CSS-only visual changes.

Speculative:

- Whether these signals become the final companion state vocabulary.
- Whether future Kamay Buddy visuals express signals through character motion, 2D/2.5D art, sound, or richer interaction.
- Whether additional signals are needed after broader provider/runtime evidence exists.
