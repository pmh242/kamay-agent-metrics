# Decisions

This directory is for lightweight architecture and product decisions.

## When to Add a Decision

Add a decision when a choice affects architecture, provider boundaries, privacy posture, runtime dependencies, deployment, data shape, or MVP scope.

## Decision Format

Use a short Markdown file with:

- Title
- Date
- Status
- Context
- Decision
- Consequences

Suggested filename format:

```text
YYYY-MM-DD-short-title.md
```

## Current Decisions

- [2026-05-25: Read-only Codex Telemetry Discovery PoC](2026-05-25-read-only-codex-telemetry-poc.md)
- [2026-05-25: Localhost In-memory Metrics Service Boundary](2026-05-25-local-metrics-service-boundary.md)
- [2026-05-25: Disposable Diagnostics Consumer](2026-05-25-disposable-diagnostics-consumer.md)
- [2026-05-25: Disposable Browser Diagnostics UI](2026-05-25-disposable-browser-diagnostics-ui.md)
- [2026-05-25: Versioned Metrics Current Contract](2026-05-25-versioned-metrics-current-contract.md)
- [2026-05-25: Kamay Buddy Long-term Product Home, No Merge Now](2026-05-25-kamay-buddy-reference-only.md)
- [2026-05-25: Kamay Buddy Runtime Evaluation Posture](2026-05-25-kamay-buddy-runtime-evaluation-posture.md)
- [2026-05-25: Electron Transparent Window Runtime Spike](2026-05-25-electron-transparent-window-runtime-spike.md)
- [2026-05-25: Runtime Service Lifecycle Bridge](2026-05-25-runtime-service-lifecycle-bridge.md)
- [2026-05-26: Runtime Signal Mapping Experiment](2026-05-26-runtime-signal-mapping-experiment.md)
- [2026-05-26: Runtime Signal UX Experiment](2026-05-26-runtime-signal-ux-experiment.md)
- [2026-05-26: Runtime Temporal Signal Experiment](2026-05-26-runtime-temporal-signal-experiment.md)

Known project direction from the baseline:

- Provider-agnostic local agent metrics and HUD system.
- Read-only default posture.
- Privacy-safe, incremental implementation.
- Clear separation between current reality, roadmap, MVP, and speculative ideas.

These are baseline constraints, not a substitute for future decision records.
