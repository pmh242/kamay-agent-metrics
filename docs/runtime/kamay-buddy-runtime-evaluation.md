# Kamay Buddy Runtime Evaluation

This document evaluates future Kamay Buddy runtime directions using the current metrics service backbone as the operational reference point.

It is research and architecture evaluation only. It does not approve Electron, Godot, Aseprite, overlay, tray, pet, or companion runtime implementation.

## Current Implemented State

- Read-only local Codex telemetry discovery exists.
- Normalized snapshot generation exists.
- A localhost-only in-memory metrics service exists.
- `GET /metrics/current` exposes the versioned `metrics.current.v1` contract.
- Disposable terminal and browser diagnostics consumers validate the service contract.
- An isolated Electron transparent-window spike exists under `experiments/` and consumes only the versioned local metrics service.

No durable Kamay Buddy runtime, product desktop shell, overlay, animation system, asset pipeline, or repo merge is implemented.

## Evaluation Frame

The service boundary should remain independent of runtime choice. Future companion surfaces should consume `GET /metrics/current` and should not parse provider files, own telemetry polling, normalize raw telemetry, or persist metrics unless a later decision explicitly changes that boundary.

The near-term runtime question is not "which engine owns metrics?" It is "which surface best presents already-normalized local state?"

## Electron Direction

Evidence-backed posture:

- Electron is viable for isolated HUD/runtime shell experimentation against the current `metrics.current.v1` service boundary.
- The spike launched without changing the telemetry/service backbone and observed always-on-top behavior programmatically.
- Visual transparency is still human-verification pending; requested Electron flags are not the same as confirmed product feasibility.

Likely fit:

- Diagnostic dashboards, settings, controls, and text-heavy operational views.
- Fast iteration on HTML/CSS UI patterns already proven by the static browser diagnostics page.
- Strong ecosystem for desktop app shells if a product UI later needs menus, panels, notifications, or OS integration.

Risks:

- Can pull the project toward product UI and desktop packaging before the companion behavior is understood.
- Overlay, tray, and window management can become scope traps.
- A companion character may feel like a web app unless animation and presence are handled carefully.

Boundary rule:

- Electron-like surfaces may read the service contract, but must not absorb telemetry discovery, provider parsing, or local Codex file access.
- Electron remains a candidate for further isolated experiments, not the selected final product runtime.

## Godot Direction

Likely fit:

- Companion presence, animation, expressive state, and 2D or 2.5D scenes.
- Game-like interaction loops where attention, timing, motion, and character state matter.
- Asset-driven companion UX that benefits from sprite, scene, and animation workflows.

Risks:

- Less natural for dense operational dashboards and text-heavy metrics controls.
- Can pull the project toward runtime and asset work before the state vocabulary is stable.
- Repository and build-system integration may become heavy if introduced before the service contract is mature.

Boundary rule:

- Godot-like surfaces may visualize normalized state, but must not become the telemetry service, provider adapter, or persistence layer.

## Hybrid Direction

Likely future direction:

- Keep `kamay-agent-metrics` as the runtime-agnostic telemetry/service proving ground.
- Use browser or Electron-style surfaces for diagnostics, settings, and operational controls if needed.
- Evaluate Godot or another scene runtime only for companion presence, animation, or expressive 2D/2.5D behavior.
- Allow Kamay Buddy to become the long-term product home only after the service boundary, snapshot contract, and runtime responsibilities are stable.

This is not a hard commitment to a hybrid product. It is the lowest-risk evaluation posture because it preserves the service boundary while allowing separate visual/runtime experiments later.

The Electron spike strengthens this posture: runtime shells can be evaluated independently while the telemetry/service backbone remains durable and runtime-independent.

## 2D vs 2.5D Direction

Likely direction:

- Start with 2D state expression when companion visuals become active scope.
- Treat 2.5D as a later exploration if depth, lighting, camera motion, or spatial presence materially improves the companion experience.

Tradeoffs:

- 2D is easier to constrain, asset-review, and iterate. It pairs naturally with sprite states, simple mood/status loops, and Aseprite-style production.
- 2.5D may create stronger presence but increases runtime, camera, asset, and performance complexity.

Undecided:

- Whether Kamay Buddy should be primarily a dashboard-adjacent companion, an animated desktop presence, or a deeper scene/runtime experience.

## Aseprite Implications

Aseprite is only an asset-workflow consideration at this stage.

Potential value:

- Sprite sheets and small animation loops for agent states.
- Clear art-direction constraints for 2D companion presence.
- Local-first asset iteration before committing to a runtime pipeline.

Risks:

- Asset work can create false certainty about product direction.
- Animation tooling can pull attention away from service contract and state vocabulary.
- Automated export pipelines should wait until runtime and asset conventions are actually chosen.

No Aseprite automation, asset import, export scripts, or runtime integration is approved by this evaluation.

## Service/Runtime Separation Rules

- Runtime surfaces consume `GET /metrics/current`.
- Runtime surfaces check or respect `contractVersion`.
- Runtime surfaces do not read Codex/provider files directly.
- Runtime surfaces do not own telemetry polling or normalization.
- Runtime surfaces do not introduce persistence without a separate decision.
- Runtime experiments must remain replaceable until a product runtime is explicitly selected.
- Provider-specific assumptions stay behind the telemetry/service boundary.

## Risks

- Premature runtime choice could force telemetry architecture around UI needs.
- Companion visuals could obscure the operational metrics purpose if state vocabulary is weak.
- Desktop shell work could introduce packaging, permissions, and OS integration problems before they are needed.
- Hybrid architecture could become fragmented unless the service contract remains the shared boundary.

## Explicitly Undecided

- Whether the first durable Kamay Buddy runtime is Electron, Godot, hybrid, or another surface.
- Whether companion visuals should be 2D, 2.5D, or non-character UI.
- Whether Aseprite becomes part of the production asset workflow.
- Whether overlay, tray, always-on-top, or desktop hooks are desirable.
- Whether transparent windows are visually acceptable on the target desktop environments.
- When, how, or whether this repository is absorbed into Kamay Buddy or Kamay-X.

## Likely Next Research Path

1. Keep hardening the local metrics service and `metrics.current.v1` contract.
2. Define a small state vocabulary for companion-facing status, attention, and activity.
3. Compare that vocabulary against simple browser/Electron-style panels and lightweight 2D companion sketches.
4. Decide whether a runtime prototype is justified only after the state vocabulary and consumer responsibilities are clear.
