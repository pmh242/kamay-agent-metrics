# Principles

These principles constrain project decisions before implementation begins.

## Anti-drift

- Current state, roadmap, MVP, decisions, and speculative ideas must remain separate.
- Documentation should be updated when direction changes.
- Do not describe planned behavior as existing behavior.
- Avoid broad abstractions until a concrete MVP need exists.

## Provider-agnostic

- The core system should not depend on one model provider, IDE, agent runtime, or telemetry format.
- Provider-specific logic belongs behind explicit adapter boundaries.
- Shared concepts should be named around behavior and metrics, not vendor terminology.

## Read-only by Default

- The system should observe local activity without controlling agents, mutating sessions, or changing provider state.
- Any future write capability must be explicitly designed, documented, and justified before implementation.

## Modular Boundaries

- Collection, normalization, state/storage, and display should be separable concerns.
- Components should expose narrow interfaces and avoid hidden coupling.
- The HUD should consume normalized state rather than provider-specific raw data.

## Privacy-safe

- Do not collect secrets, environment values, credentials, private prompts, or full transcript content unless a future decision explicitly approves it.
- Prefer aggregate metrics, timing, status, and operational metadata over raw content.
- Local-first behavior is the default assumption until a decision says otherwise.

## Incremental Execution

- Build the smallest useful path first.
- Keep MVP scope narrow enough to validate the architecture.
- Defer advanced visualization, multi-provider coverage, persistence, and remote sync until the basics are real and tested.
