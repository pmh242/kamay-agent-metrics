# MVP

The MVP should prove the smallest useful provider-agnostic path for a local agent metrics HUD.

## Goal

Show normalized local agent metrics in a HUD from a controlled read-only input source.

## Included

- One initial input shape.
- One normalization path into project-owned metric concepts.
- A minimal local state model.
- A basic HUD view of current metrics and status.
- Tests for normalization and any non-trivial state behavior.
- Documentation updates that distinguish planned, implemented, tested, and verified work.

## Excluded

- Multiple provider adapters.
- Remote sync.
- Cloud deployment.
- Background service architecture.
- Persistent database selection.
- Full transcript capture.
- Write/control actions against agents.
- Production packaging.

## Acceptance Direction

The MVP is acceptable when a local sample input can be processed into normalized state and displayed by the HUD, with tests covering the core transformation. Until that exists, the MVP remains planned.
