# Roadmap

This roadmap describes direction, not completed work.

## Phase 0: Documentation Baseline

- Establish current-state, principles, architecture, roadmap, MVP, decision-log, and vnext docs.
- Keep planned, implemented, tested, deployed, and verified status separate.

## Phase 1: MVP Definition and First Slice

- Choose the first telemetry input shape.
- Define the minimal normalized metric model.
- Build a local read-only path from sample input to HUD-visible state.
- Add tests for normalization and current-state behavior.

## Phase 2: Provider and Runtime Expansion

- Add provider or runtime adapters only after the adapter boundary is proven.
- Keep provider-specific parsing outside the HUD.
- Expand metrics based on observed MVP gaps.

## Phase 3: Operational Polish

- Improve local diagnostics, error states, and usability.
- Consider persistence only when live state is insufficient.
- Add packaging or deployment only after local behavior is tested and verified.

## Roadmap Rule

Items on this roadmap are not implementation claims. When work becomes real, update [Current State](../current-state.md) with evidence.
