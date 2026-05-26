# Runtime Temporal Signal Experiment

Date: 2026-05-26

Status: Accepted for isolated experiment only

## Context

The Electron experiment now maps `metrics.current.v1` responses into runtime signals and applies lightweight UX priority metadata. The next uncertainty is temporal attention behavior: how long signals should persist, when they should fade or escalate, and how recovery should avoid visual fatigue.

## Decision

Allow a temporal signal experiment inside `experiments/electron-transparent-window/` only.

The experiment may add timing metadata and deterministic helpers for persistence, fade, escalation, recovery, and cooldown. It may apply simple CSS phase classes in the renderer.

This does not approve an animation framework, behavior tree, state-machine framework, pet/avatar system, personality, dialogue, lore, memory, AI-agent behavior, product UI, durable companion behavior, or runtime selection.

## Consequences

- The telemetry/service backbone remains unchanged and authoritative.
- Runtime surfaces still consume only the versioned local service contract.
- Temporal behavior remains experiment evidence and can change independently of `metrics.current.v1`.
- Any future durable companion timing model requires a separate decision after human visual review and product direction are clearer.
