# Kamay Buddy Runtime Evaluation Posture

Date: 2026-05-25

Status: Accepted

## Context

The telemetry/service backbone is now validated enough to evaluate future Kamay Buddy runtime directions. The project has read-only telemetry discovery, normalized snapshots, a localhost metrics service, a versioned `GET /metrics/current` contract, and disposable terminal/browser consumers.

Runtime evaluation can now be grounded in the service boundary rather than speculation about raw provider telemetry.

## Decision

Proceed with runtime evaluation as documentation and research only.

No Electron, Godot, Aseprite, overlay, tray, pet/avatar runtime, desktop hook, framework setup, dependency addition, runtime prototype, repo merge, or Kamay Buddy import is approved by this decision.

Future runtime prototypes must consume the versioned service contract and must not parse provider files directly.

## Consequences

- Electron, Godot, and hybrid approaches can be compared without creating implementation pressure.
- The metrics service remains runtime-agnostic and independent short-term.
- Kamay Buddy remains the intended long-term product home, but absorption waits for stable service, snapshot, state vocabulary, and runtime responsibility boundaries.
- Aseprite remains an asset-workflow consideration only until a separate decision approves pipeline work.
