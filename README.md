# Kamay Agent Metrics

Kamay Agent Metrics is a planned provider-agnostic local agent metrics and HUD system. Its purpose is to help inspect local agent activity without tying the project to one model provider, runtime, editor, or deployment target.

## Maturity

This repository is at local PoC stage.

- Implementation: read-only Codex telemetry CLI, localhost metrics service, and disposable diagnostics consumer.
- Runtime: local CLI and localhost-only in-memory service.
- Tests: TypeScript build/typecheck and focused unit tests.
- Deployment: not present.
- Verification: local PoC validation only.

Do not treat this project as production-ready, deploy-ready, or feature-complete.

## Ecosystem Role

Within the broader Kamay ecosystem, this repository is the short-term telemetry and service proving ground.

- Kamay main: local OS, kernel, and governance direction.
- Kamay Adapter: remote repo-read driver and delegation layer direction.
- Kamay-X: future apps, drivers, capabilities, and integrations.
- Kamay Buddy: intended long-term unified companion and product home.
- Kamay Agent Metrics: independent near-term place to stabilize read-only telemetry discovery, normalization, and snapshot contracts before absorption into Kamay Buddy or Kamay-X is considered.

No Kamay, Kamay Adapter, Kamay-X, or Kamay Buddy code is imported here today.

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
pnpm service -- --port 8765 --interval-ms 1000
pnpm consumer -- --once
pnpm consumer -- --interval-ms 1000
```

The CLI reads local Codex state only. It does not start a server, create a database, run an overlay, or call provider APIs.

## Local Metrics Service

The local service exposes the current in-memory snapshot for future consumers:

```text
GET http://127.0.0.1:8765/metrics/current
```

The response uses the stable v1 contract marker `contractVersion: "metrics.current.v1"`.

The service binds only to `127.0.0.1`, owns snapshot polling, and keeps state in memory. It is not a deployment target and does not add persistence, auth, WebSockets, UI, provider APIs, or remote telemetry.

The same service also exposes a disposable browser diagnostics page:

```text
http://127.0.0.1:8765/diagnostics
```

That page is static HTML/CSS/JS served locally. It reads only `GET /metrics/current` and does not establish a product UI or desktop runtime.

## Disposable Diagnostics Consumer

The diagnostics consumer validates future UI consumption patterns without committing to a UI runtime:

```powershell
pnpm service -- --port 8765 --interval-ms 1000
pnpm consumer -- --once
pnpm consumer -- --interval-ms 1000
```

The consumer reads only `GET /metrics/current`, renders plain terminal text, and is disposable validation tooling. It does not read provider files directly and is not a HUD, overlay, tray, Electron app, Godot runtime, pet, or product UI.

## Documentation Map

- [Current State](docs/current-state.md): factual status of what is planned, implemented, tested, deploy-ready, deployed, and verified.
- [Principles](docs/principles.md): constraints that keep the project provider-agnostic, read-only, privacy-safe, and incremental.
- [Architecture](docs/architecture.md): target boundaries and component responsibilities, without claiming they exist yet.
- [Codex Telemetry PoC](docs/implementation/codex-telemetry-poc.md): observed local sources, allowlist, denied fields, and unstable assumptions.
- [Local Metrics Service](docs/implementation/local-metrics-service.md): localhost service behavior and versioned `/metrics/current` contract.
- [Browser Diagnostics UI](docs/implementation/browser-diagnostics-ui.md): disposable static visual diagnostics page served by the local service.
- [MVP](docs/roadmap/mvp.md): first minimal usable target.
- [Roadmap](docs/roadmap/roadmap.md): phased direction beyond the MVP.
- [Decisions](docs/decisions/README.md): lightweight decision log process.
- [Future Ideas](vnext/future-ideas.md): speculative, non-committed ideas.

## Contribution Posture

Before adding code, update the relevant docs when scope, architecture, or product direction changes. Keep current reality separate from planned work. Avoid adding dependencies, runtime surfaces, telemetry parsers, services, or adapters until the MVP boundary is explicit.
