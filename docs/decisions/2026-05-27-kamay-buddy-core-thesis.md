# Kamay Buddy Core Thesis

Date: 2026-05-27

Status: Accepted

## Context

Kamay Buddy is the intended long-term unified product home for companion-facing AI-assisted development workflows. The metrics service, diagnostics consumers, runtime bridge, signal mapping, signal UX, and temporal signal experiments have produced enough evidence to record a durable product-direction thesis without merging repos or implementing product runtime behavior.

## Decision

Record `docs/kamay-buddy-thesis.md` as the durable product-direction source of truth for this repository.

Kamay Buddy is defined as a persistent desktop companion platform for ambient operational awareness, built around an Operational Spine, Ambient Runtime Layer, interchangeable Embodiment Layer, and Governance Layer.

This decision does not approve implementation of a durable runtime, avatar, personality, memory, dialogue, lore, autonomous companion behavior, asset pipeline, repo merge, or dependency addition.

## Consequences

- `kamay-agent-metrics` remains a telemetry/service proving ground for future Kamay Buddy systems, not the full Kamay Buddy product.
- Future runtime or avatar surfaces should consume normalized service contracts and must not bypass the service boundary by reading provider files directly.
- Personality, memory, dialogue, lore, and autonomous companion behavior remain deferred until the ambient operational model proves useful.
