# Runtime Signal Mapping Experiment

Date: 2026-05-26

Status: Accepted

## Context

The project has a validated local metrics service, versioned `metrics.current.v1` contract, disposable diagnostics consumers, an isolated Electron runtime spike, and a lifecycle bridge experiment. The next uncertainty is how service states become useful runtime signals without building product behavior.

## Decision

Allow an isolated signal mapping experiment inside the Electron runtime spike.

The experiment may map `metrics.current.v1` responses and runtime fetch reachability into simple labels, glyphs, reasons, and CSS tone changes. It must remain disposable and must not become pet logic, avatar behavior, dialogue, personality, memory, animation framework, provider parsing, or product UI.

## Consequences

- Future companion work gets an evidence-backed starting vocabulary for runtime signals.
- The service remains authoritative for telemetry state; the signal layer only interprets normalized service responses.
- Signal mappings can be changed or deleted without changing the service contract.
- Product behavior, companion personality, and durable runtime selection remain deferred.
