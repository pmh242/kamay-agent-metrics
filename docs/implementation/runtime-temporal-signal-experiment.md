# Runtime Temporal Signal Experiment

This document records the disposable temporal signal experiment inside `experiments/electron-transparent-window/`.

## Purpose

The experiment evaluates how mapped runtime signals should persist, fade, escalate, recover, and cool down over time.

It is interaction research only. It does not define product behavior, companion logic, pet/avatar behavior, animation architecture, memory, personality, or runtime selection.

## Temporal Rules

| Signal | Fade | Escalate | Cooldown | Recovery | Finding |
| --- | --- | --- | --- | --- | --- |
| `idle` | 2000 ms | None | 800 ms | 900 ms | Quiet baseline. It should fade rather than attract attention. |
| `active` | 7000 ms | None | 900 ms | 1000 ms | Useful as calm presence, but should not become urgent over time. |
| `degraded` | 5000 ms | 9000 ms | 2200 ms | 1400 ms | Should become more visible only after source health remains impaired. |
| `offline` | 7000 ms | 9000 ms | 4200 ms | 1800 ms | Foundational failure state. It should persist, escalate, then visibly recover. |
| `reconnecting` | 4500 ms | 6500 ms | 3200 ms | 1400 ms | Useful during disconnects, but needs cooldown to avoid flapping noise. |
| `stale` | 5000 ms | 8500 ms | 2200 ms | 1400 ms | Should communicate lingering uncertainty without flashing. |
| `error` | 6500 ms | 8500 ms | 4200 ms | 1800 ms | Hard failure state. It should remain readable and avoid rapid repeat pulses. |
| `unknown` | 5000 ms | None | 2600 ms | 1200 ms | Contract drift should stay visible, but not become companion behavior. |

## Phases

- `fresh`: default phase when a signal starts or remains below fade/escalation thresholds.
- `held`: existing UX persistence prevents a lower-priority signal from replacing a higher-priority one too quickly.
- `faded`: sustained signal is softened to reduce attention fatigue.
- `escalated`: sustained warning/failure signal becomes more visible after elapsed time.
- `recovered`: calm signal follows a warning/failure and stays visibly recovered for a short window.
- `cooldown`: repeated high-attention signal is suppressed after recent recovery to reduce flapping noise.

## Boundaries

- The temporal layer consumes only experiment-local signal output derived from `metrics.current.v1`.
- The service remains authoritative for telemetry, source health, polling, and snapshot state.
- The renderer still receives data only through the existing narrow `kamayMetrics.fetchCurrent()` IPC bridge.
- Visual treatment remains CSS-level: opacity, border weight, glyph scale, and restrained glow/pulse changes.
- No provider parsing, persistence, browser storage, WebSockets, event bus, behavior framework, pet/avatar system, personality, dialogue, lore, memory, Godot, Aseprite, MCP, Kamay import, or Kamay Adapter import is introduced.

## Useful vs Risky Timing

Useful:

- Sustained `reconnecting`, `stale`, `degraded`, `error`, and `offline` states need time-aware treatment because a single poll can be noisy.
- Recovery should be visible so users can notice that a hard state resolved.
- Cooldown helps prevent rapid failure/recovery/failure loops from feeling frantic.
- `active` should fade rather than escalate to avoid making normal work feel urgent.

Risky:

- Escalating too quickly could make transient local service startup look severe.
- Cooldown could hide a repeated hard failure if applied too aggressively.
- Temporal states can feel like product personality if they are over-styled.
- These defaults need human visual review before promotion beyond experiment status.

## Validation

Validated in this experiment:

- Temporal metadata exists for all mapped signals.
- Reconnecting, degraded, error, and offline timing behavior is covered by an experiment-local harness.
- Recovery and cooldown behavior is covered by an experiment-local harness.
- Active and idle remain calm and do not escalate.

Still speculative:

- Whether these timing values are appropriate for a durable Kamay Buddy companion.
- Whether richer motion, sound, or character expression should exist.
- Whether future runtimes should share these temporal rules or define their own.
