# Kamay Buddy Direction Review

Kamay Buddy is the intended long-term unified product home for companion-facing agent metrics experiences. For now, it remains external reference material only: it is not merged into this repository and is not an implementation dependency.

## Useful Inputs

Kamay Buddy may inform future design thinking in these areas:

- companion UX patterns for presence, attention, and lightweight status expression
- event and state modeling for agent activity that needs to feel understandable at a glance
- local-first interaction flows that do not require cloud services or provider APIs
- future visual direction for 2D or 2.5D companion surfaces
- possible Aseprite-oriented asset workflow exploration

## What Must Not Be Imported Yet

- No Kamay Buddy code.
- No Godot project files.
- No Godot assets.
- No pet or Neon Braid runtime files.
- No Electron, overlay, tray, HUD window, or companion UI implementation.
- No Aseprite implementation or asset pipeline.
- No repository merge, fork, or shared runtime dependency.

## Boundary for This Project

Kamay Agent Metrics remains the short-term independent telemetry and service proving ground. The next implementation work should continue to harden read-only local telemetry discovery and normalization before any companion runtime, overlay, or visual surface is introduced.

If companion UX becomes active scope later, it should consume normalized metrics from this project rather than pulling provider-specific telemetry directly.

Future absorption into Kamay Buddy should wait until the service boundary, snapshot contract, and HUD/runtime direction are stable enough to merge without muddying the telemetry backbone.

## Deferred Exploration

Future exploration may compare Kamay Buddy concepts against the metric snapshot model, event naming, status vocabulary, attention states, and local-first UX constraints. That exploration should happen through a new plan and decision record before any runtime, asset, or repository absorption work begins.
