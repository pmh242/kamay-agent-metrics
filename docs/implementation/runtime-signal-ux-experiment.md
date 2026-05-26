# Runtime Signal UX Experiment

This document records the disposable signal UX refinement inside `experiments/electron-transparent-window/`.

## Purpose

The experiment evaluates which mapped runtime signals are readable and low-noise enough to inform a future Kamay Buddy companion layer.

It is interaction research only. It does not define product behavior, final companion vocabulary, pet logic, runtime selection, or a durable UI system.

## Signal UX Rules

| Signal | Priority | Persistence | Visual Weight | Attention Style | Finding |
| --- | --- | --- | --- | --- | --- |
| `offline` | High | 3200 ms | Strong | Muted pulse | Useful because service reachability is foundational. Should stay visible until recovery. |
| `reconnecting` | Medium-high | 2600 ms | Visible | Pulse | Useful only after prior success. Too much emphasis would be noisy during brief service restarts. |
| `error` | High | 3200 ms | Strong | Muted pulse | Useful for HTTP, invalid JSON, or parsing failures. Should remain sanitized and concise. |
| `unknown` | High | 2600 ms | Strong | Glow | Useful for contract drift. Should draw attention without implying provider failure. |
| `degraded` | Medium-high | 2200 ms | Visible | Glow | Useful when service still responds but source health is impaired. Should not dominate like offline. |
| `stale` | Medium-high | 2200 ms | Visible | Glow | Useful when freshness is uncertain. Should remain quieter than hard failure states. |
| `active` | Medium | 1200 ms | Calm | Steady | Useful as current-work presence. Pulse was avoided to reduce attention noise. |
| `idle` | Low | 800 ms | Quiet | Steady | Useful baseline. Should be readable but not attention-seeking. |

## Transition Behavior

Short persistence windows prevent lower-priority states from immediately replacing higher-priority states. For example, `error` can hold briefly before `idle` appears, while `offline` can interrupt `idle` immediately.

This is not a behavior framework. The logic is a small experiment-local smoothing rule for readability testing.

## Boundaries

- The signal UX layer consumes only the existing signal mapper output derived from `metrics.current.v1`.
- The runtime still receives metrics through the existing narrow `kamayMetrics.fetchCurrent()` IPC method.
- The renderer does not read provider files, own telemetry polling, or access browser storage.
- Visual treatment is limited to labels, glyphs, priority badges, opacity, glow, and small CSS transition effects.

## Useful vs Noisy Findings

Useful:

- High-priority states need stronger visual weight than `idle` and `active`.
- `active` is better as calm presence than as a pulsing attention state.
- `unknown` should be visible because it can indicate contract drift, but it should not look identical to provider offline.
- Brief persistence makes failure-to-recovery transitions easier to read during polling.

Potentially noisy:

- Constant pulse for healthy `active` state.
- Treating `degraded` the same as `offline`.
- Letting a transient `idle` response immediately erase an error signal.
- Adding richer animation or character behavior before the signal vocabulary is product-approved.

## Validation

Validated in this experiment:

- Priority metadata exists for all mapped signals.
- Persistence timing and priority ordering are covered by an experiment-local harness.
- The Electron renderer applies signal priority, visual weight, and attention style without adding a framework.

Still speculative:

- Whether these priorities match long-term companion behavior.
- Whether future 2D, 2.5D, Godot, or Aseprite-informed surfaces should express these signals differently.
- Whether sound, motion, personality, memory, or richer interaction should exist at all.
