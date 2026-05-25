# Kamay Buddy Long-term Product Home, No Merge Now

Date: 2026-05-25

Status: Accepted

## Context

Kamay Buddy may provide useful product and architecture ideas for companion UX, event/state modeling, local-first attention flows, and future 2D or 2.5D visual direction.

Kamay Buddy is the intended long-term unified product home for the companion-facing experience. The current repository remains the independent short-term telemetry and service proving ground. Merging companion runtime code or assets now would expand scope before the read-only metrics foundation is mature.

## Decision

Treat Kamay Buddy as the long-term product home, but keep it as external reference material only for now.

Do not merge, fork, import, or depend on Kamay Buddy code or assets now. Do not add Godot, Electron, overlay, pet, Aseprite, or companion runtime implementation as part of this decision.

Future absorption into Kamay Buddy should wait until the metrics service boundary, snapshot contract, and HUD/runtime direction are stable and explicitly approved.

## Consequences

- Kamay Buddy can inform future vocabulary, companion interaction models, and visual exploration.
- The telemetry PoC and metrics backbone remain unchanged and independent short-term.
- Future companion runtime, Aseprite exploration, or repository merge requires a separate plan and decision before implementation.
