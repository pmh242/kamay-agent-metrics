# Multi-Session Operator Field Trial

Date: 2026-05-27

Status: Completed short multi-session evidence pass

Recommendation: refine

## Summary

This pass compared repeated runtime companion experiment sessions during real local operator activity. It included the first short field trial plus two additional bounded sessions:

- First short field trial: approximately 58 seconds of visible runtime logging.
- Active repeat session: approximately 82 seconds of healthy `ok`/`active` polling.
- Offline observation session: approximately 32 seconds of unreachable service polling.

This is not a long-session fatigue study. The evidence is useful for repeated launch, state readability, screen-space pressure, and early ambient usefulness, but confidence remains limited for sustained coding work.

## Evidence

Local ignored evidence artifacts were captured under `agent-lab/`:

- `agent-lab/logs/2026-05-27-first-field-trial-electron.log`
- `agent-lab/logs/2026-05-27-multi-session-active-electron.log`
- `agent-lab/logs/2026-05-27-multi-session-offline-electron.log`
- `agent-lab/screenshots/2026-05-27-first-field-trial-runtime.png`
- `agent-lab/screenshots/2026-05-27-multi-session-active-runtime.png`
- `agent-lab/screenshots/2026-05-27-multi-session-offline-runtime.png`

The screenshots include local desktop context and should remain local/untracked evidence only.

## Session Comparison

| Session | Duration | Observed state | Evidence confidence |
| --- | ---: | --- | --- |
| First short field trial | ~58 sec | Active/ok, one degraded sample, then unreachable after service interruption | Medium |
| Active repeat session | ~82 sec | Active/ok throughout, 42 reachable metrics samples | Medium |
| Offline observation session | ~32 sec | Offline/unreachable throughout, 17 unreachable samples | Medium |

The active repeat session produced consistent `metrics.current.v1` polling with `serviceStatus: "ok"`, `sourceHealthStatus: "ok"`, snapshot present, and active thread staleness `active`.

The offline session produced repeated `unreachable` fetch states and a visible offline treatment.

## Validated Observations

Confidence: medium

- The runtime can be launched repeatedly without changing the telemetry/service backbone.
- The runtime consumes only the local `metrics.current.v1` service endpoint during these sessions.
- Always-on-top was reported as observed by the Electron runtime in each session.
- Active/ok state is readable enough to confirm the runtime is alive.
- Offline/unreachable state is visibly distinct from active/ok.
- Local lifecycle logs provide useful evidence without raw prompts or response bodies.
- Repeated sessions reduced novelty: the runtime began to read as a small diagnostics surface rather than a surprising new object.

Confidence: low to medium

- The runtime can support ambient operational awareness, but the current presentation is still too diagnostic-dense.
- The signal layer is useful as a heartbeat, especially for service availability and active thread freshness.
- The offline state is useful when deliberately checking service reachability, but it may become ignorable if it persists.

## Uncertain Observations

Confidence: low

- Long-session fatigue remains unproven because no session lasted 30 minutes or longer.
- Stale-state readability was not directly observed in this pass.
- Recovery clarity was not observed in a clean repeated-session path.
- It is not yet clear whether the runtime improves coding workflow confidence enough to justify persistent visibility.
- Screen-space retention is unresolved because the visible window competed with active desktop content.

## Short vs Longer Sessions

The active repeat session was longer than the first short pass and felt less novel, but it was still brief. It confirmed that the active/ok state remains understandable across repeated exposure.

It did not prove low fatigue. The current window still looks like a compact diagnostics panel, so longer sessions are likely to expose screen-space and attention-cost issues before they validate companion usefulness.

## Active vs Idle Workflows

Active workflow evidence is stronger than idle workflow evidence.

Active/ok was observed repeatedly while the local service was running and agent workflow work continued. Idle as a true low-attention state was not directly observed because the service continued reporting an active thread.

Offline/unreachable was observed as a service-absent state, not as a normal idle workflow state.

## Usefulness Persistence

The runtime remained useful as a service-health indicator across repeated sessions. It did not become more useful over time; instead, its diagnostic-panel nature became more obvious.

This suggests the service-first thesis is directionally useful, but the visible runtime needs a more compact ambient mode before it can prove persistent value.

## Fatigue, Distraction, And Noise

No severe short-session fatigue was observed.

The main noise issue is footprint rather than animation: the window is large enough and text-heavy enough to compete with active work. Pulse/glow behavior was not the dominant distraction in this pass.

The offline state was clear, but persistent offline visibility may become ignorable without a recovery-oriented presentation.

## Signal Readability Over Time

Active/ok and offline/unreachable were readable across repeated sessions.

Degraded appeared only in the first field trial. Stale and clean recovery were not observed directly.

The signal badge and label are useful, but the supporting metrics text is too dense for ambient reading.

## Ambient Awareness Usefulness

Ambient awareness is partially supported.

The runtime gives fast confirmation that the local metrics service is alive or unreachable. That improves confidence when validating the runtime/service bridge.

It does not yet feel like a companion layer. It feels like always-on diagnostics that could become ambient after a tighter, quieter presentation pass.

## Screen-Space Retention

The runtime did not clearly earn persistent screen space.

It earned temporary screen space during evidence collection and debugging. During real active desktop use, the always-on-top window was visible but competed with the foreground task.

A compact mode should be considered a prerequisite before another longer field trial.

## Natural Keep-Open Behavior

The operator kept the runtime open for the bounded evidence windows because the task required observation.

There is not enough evidence that the operator would naturally keep it open without a field-trial prompt.

## Did Signals Become Ignorable?

Active/ok began to fade into the background after repeated exposure, which is acceptable for a healthy baseline.

Offline/unreachable was clear when intentionally observed. It may become ignorable if it remains persistent and does not communicate recovery or next action.

## Workflow Confidence

Operational confidence improved for service validation: it was easy to know the service was reachable, contract-compatible, and active.

Workflow confidence for actual development improved only slightly. The runtime did not yet replace a need for logs or diagnostics when investigating behavior.

## Strongest Validated Behaviors

- Repeated launch and service consumption worked.
- Active/ok and offline/unreachable states were distinct.
- Always-on-top behavior kept the runtime visible.
- Sanitized lifecycle logs supported evidence collection.
- The service-first runtime boundary held across sessions.

## Weakest / Problematic Behaviors

- The runtime footprint is too large for durable ambient presence.
- The text-heavy layout competes with active work.
- Recovery and stale-state clarity remain under-tested.
- Idle workflow behavior was not directly observed.
- Field evidence is still short-session biased.

## Next Likely UX Refinements

- Add or evaluate a compact ambient mode focused on glyph, label, priority, and one-line reason.
- Reduce or hide detailed metrics by default.
- Add clearer recovery presentation and test it without smoke-timeout pressure.
- Run a 30 to 60 minute coding-focused field trial after compact mode exists.
- Add a field-trial checklist that explicitly captures whether the operator voluntarily keeps the runtime open.

## Thesis Verdict

Validated: low to medium confidence

The Operational Spine and service-first ambient awareness thesis remains supported. The runtime can expose useful local operational state without owning telemetry.

Uncertain: medium to high confidence

The current runtime presentation has not yet proven durable companion usefulness. It is useful as diagnostics and early ambient evidence, but it has not earned persistent screen space.

Invalidated: low confidence

Nothing in this pass invalidates the thesis. The main pressure is UX refinement, not architecture reversal.

## Final Recommendation

Refine.

Continue the ambient operational awareness direction, but do not expand architecture, add avatar/personality behavior, or select a durable runtime yet. The next useful move is a smaller, quieter runtime surface followed by a longer coding-focused field trial.
