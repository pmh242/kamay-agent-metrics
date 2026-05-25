# Kamay Agent Metrics

Kamay Agent Metrics is a planned provider-agnostic local agent metrics and HUD system. Its purpose is to help inspect local agent activity without tying the project to one model provider, runtime, editor, or deployment target.

## Maturity

This repository is at local PoC stage.

- Implementation: minimal read-only Codex telemetry discovery CLI.
- Runtime: local CLI only.
- Tests: TypeScript build/typecheck and focused unit tests.
- Deployment: not present.
- Verification: local PoC validation only.

Do not treat this project as production-ready, deploy-ready, or feature-complete.

## Local PoC Command

Requirements:

- Node with `node:sqlite` available. This is a PoC-only runtime assumption.
- pnpm.

Commands:

```powershell
pnpm install
pnpm build
pnpm poc --once
pnpm poc --interval-ms 1000
```

The CLI reads local Codex state only. It does not start a server, create a database, run an overlay, or call provider APIs.

## Documentation Map

- [Current State](docs/current-state.md): factual status of what is planned, implemented, tested, deploy-ready, deployed, and verified.
- [Principles](docs/principles.md): constraints that keep the project provider-agnostic, read-only, privacy-safe, and incremental.
- [Architecture](docs/architecture.md): target boundaries and component responsibilities, without claiming they exist yet.
- [Codex Telemetry PoC](docs/implementation/codex-telemetry-poc.md): observed local sources, allowlist, denied fields, and unstable assumptions.
- [MVP](docs/roadmap/mvp.md): first minimal usable target.
- [Roadmap](docs/roadmap/roadmap.md): phased direction beyond the MVP.
- [Decisions](docs/decisions/README.md): lightweight decision log process.
- [Future Ideas](vnext/future-ideas.md): speculative, non-committed ideas.

## Contribution Posture

Before adding code, update the relevant docs when scope, architecture, or product direction changes. Keep current reality separate from planned work. Avoid adding dependencies, runtime surfaces, telemetry parsers, services, or adapters until the MVP boundary is explicit.
