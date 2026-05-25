# Versioned Metrics Current Contract

Date: 2026-05-25

Status: Accepted

## Context

The local metrics service is now the boundary between provider-specific telemetry collection and future consumers such as HUDs, Kamay Buddy, Kamay-X integrations, and disposable diagnostics tools.

Without an explicit contract version, consumers could accidentally depend on whatever JSON shape the service happens to return during early implementation.

## Decision

Use a top-level contract marker on `GET /metrics/current`:

```json
{
  "contractVersion": "metrics.current.v1"
}
```

The v1 response contract includes `contractVersion`, `service`, `sourceHealth`, and `snapshot`.

Additive fields are allowed within v1. Removing fields, renaming fields, changing enum meanings, or changing nullable semantics requires a new contract version.

Runtime validation is intentionally shallow. Consumers validate the contract version, service metadata, source health, and whether `snapshot` is `null` or an object; nested `TelemetrySnapshot` fields are documented but not exhaustively validated at runtime.

## Consequences

- Consumers can reject unsupported or malformed service responses before rendering.
- Offline and null-snapshot responses are part of the contract rather than error cases.
- The PoC CLI snapshot output remains unversioned; the version applies to the service response boundary only.
- This does not add UI, runtime, persistence, deployment, provider expansion, or ecosystem imports.
