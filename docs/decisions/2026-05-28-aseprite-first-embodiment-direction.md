# Aseprite-first Embodiment Direction

Date: 2026-05-28

Status: Accepted

## Context

Runtime field evidence suggests the metrics panel should remain a functional operational surface, while reactive visual presence belongs in the avatar or sprite embodiment layer.

Kamay Buddy needs an embodiment direction that can move quickly without coupling the operational telemetry/service core to a visual asset tool or runtime engine.

## Decision

Use an Aseprite-first 2D avatar workflow as the default near-term embodiment direction for Kamay Buddy exploration.

The embodiment layer consumes interpreted operational signals. It does not own telemetry discovery, provider parsing, polling, normalization, persistence, or service contracts.

2.5D and 3D embodiment paths remain future-compatible alternatives, but they are deferred until the Aseprite-first 2D path or later field evidence proves a need for depth, camera, lighting, rigging, or scene complexity.

## Consequences

- The operational telemetry/service core must not depend on Aseprite, Godot, Blender, avatar assets, or any avatar runtime.
- Metrics and info panels remain functional UI; avatar embodiment is the reactive and expressive layer.
- No Aseprite, Godot, Blender, asset pipeline, runtime code, dependency, or tooling implementation is approved by this decision.
- Personality, dialogue, memory, lore, and autonomous companion behavior remain deferred.
