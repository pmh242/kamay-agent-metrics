# Kamay Buddy Thesis

Kamay Buddy is the intended long-term unified product home for companion-facing AI-assisted development workflows.

The product thesis is a persistent desktop companion platform built around ambient operational awareness: it should help a developer understand what local AI-assisted work is doing, whether it is healthy, and when attention is useful.

`kamay-agent-metrics` is a telemetry/service proving ground for future Kamay Buddy systems, not the full Kamay Buddy product.

## Core Layers

- **Operational Spine**: the telemetry, normalization, service contracts, state interpretation, and intelligence boundary that turn provider-specific activity into safe operational signals.
- **Ambient Runtime Layer**: local runtime surfaces that present operational state quietly and continuously without owning telemetry discovery or provider parsing.
- **Embodiment Layer**: an interchangeable Desktop Mate-style avatar or visual presence layer that can express operational signals when that improves awareness. The near-term embodiment direction is Aseprite-first 2D sprites, with 2.5D and 3D kept future-compatible but deferred.
- **Governance Layer**: rules, permissions, task boundaries, privacy posture, and anti-drift controls that keep companion behavior bounded and explainable.

## Anti-Drift Boundary

Kamay Buddy is not a general AI assistant, chatbot shell, or autonomous agent platform. It focuses on ambient operational awareness for AI-assisted development workflows.

Personality, memory, dialogue, lore, and autonomous companion behavior are explicitly deferred until the ambient operational model proves useful.

## Relationship To This Repo

The current repository proves pieces of the Operational Spine:

- read-only provider telemetry discovery
- allowlisted normalization
- localhost-only in-memory service behavior
- versioned `GET /metrics/current` contract
- disposable diagnostics consumers
- isolated runtime and signal experiments

The runtime and signal experiments provide evidence for future Ambient Runtime Layer behavior, but they do not select a product runtime or define durable companion behavior.

No Embodiment Layer is implemented here. Desktop Mate-style avatar embodiment remains a future interchangeable presentation layer, not a dependency, integration, asset pipeline, or runtime commitment.

The metrics and information panel should remain functional UI. Reactive personality and visual presence belong to the avatar/sprite embodiment layer, which consumes interpreted signals rather than owning telemetry discovery.

## Service-First Separation

Future Kamay Buddy surfaces should consume normalized service contracts instead of reading provider files directly.

The Operational Spine should remain independent from avatar embodiment, runtime shell, personality, memory, dialogue, lore, and autonomous behavior decisions. Those choices can evolve only after the service boundary and ambient operational model are useful enough to justify product commitment.

The Operational Spine must not depend on Aseprite, Godot, Blender, or any avatar runtime. Asset workflow and embodiment runtime choices stay outside the telemetry/service core.
