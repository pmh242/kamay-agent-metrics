# First Operator Field Trial

Date: 2026-05-27

Status: Completed short field-trial evidence pass

## Workflow Context

The runtime companion experiment was launched during real Codex desktop work on `kamay-agent-metrics`: reviewing the existing field-trial workflow, running the local metrics service, observing the Electron runtime spike, collecting local evidence, and preparing this findings report.

This was a short smoke field trial, not a long-session fatigue review.

## Session Duration

Observed runtime log window: approximately 58 seconds, from `2026-05-27T20:28:57Z` through `2026-05-27T20:29:55Z`.

Additional setup and evidence review took several minutes, but the visible runtime field-trial window itself was about one minute.

## Evidence Collected

Local ignored evidence artifacts were captured under `agent-lab/`:

- `agent-lab/screenshots/2026-05-27-first-field-trial-runtime.png`
- `agent-lab/logs/2026-05-27-first-field-trial-electron.log`
- `agent-lab/logs/2026-05-27-first-field-trial-service.log`
- `agent-lab/logs/2026-05-27-first-field-trial-service-recovery.log`
- `agent-lab/logs/2026-05-27-first-field-trial-service-interrupt.log`

These artifacts are local evidence only and are not intended for commit. The screenshot includes desktop context and should be treated as local review material, not a shareable sanitized artifact.

## Observed Behavior

- The Electron runtime window launched and requested transparent and always-on-top behavior.
- Runtime logs reported `alwaysOnTopObserved: true`.
- The runtime consumed `http://127.0.0.1:8765/metrics/current`.
- The runtime observed `contractVersion: "metrics.current.v1"` and `contractOk: true`.
- The active workflow initially rendered as service `ok`, source health `ok`, snapshot present, and active thread staleness `active`.
- One degraded service/source-health sample was observed during the session.
- After the local service was interrupted, the runtime logged repeated `unreachable` fetch states.
- Recovery in the same visible runtime session was not observed before the smoke window ended.
- Stale active-thread state was not observed during this field trial.

## Usefulness Evaluation

Mechanical correctness: 2/3

The runtime launched, stayed visible, polled the service, showed an active state, and logged degraded/unreachable states. The short smoke window limited recovery observation.

Operational usefulness: 2/3

The runtime made local service health visible without opening the diagnostics page. The `ok` and degraded/unreachable transitions were useful, but the current surface is still too diagnostic-dense for effortless workflow use.

Ambient usefulness: 1/3

The runtime was visible and recognizable at a glance, but it occupied prominent screen space and overlapped active work. It behaved more like a compact diagnostics panel than a calm ambient companion.

Long-session fatigue: uncertain

The session was too short to evaluate fatigue over time. Pulse, glow, opacity, and persistence behavior need a longer session before drawing conclusions.

Earned screen space: uncertain

The runtime earned temporary screen space for debugging and field evidence. It has not yet proven that it deserves persistent screen space during normal development work.

## Readability

The active/OK badge and signal label were readable in the screenshot. The detailed metrics text was harder to parse while working because the window overlapped document content and used a dense diagnostics layout.

The current visual hierarchy is good for confirming that the service is alive, but not yet refined enough for low-effort ambient use.

## Fatigue And Noise

No severe distraction was observed during the short session. The window was visually prominent, though, and likely needs a quieter compact mode before longer field use.

Fatigue remains unverified because the trial did not run long enough.

## Stale / Offline / Recovery Clarity

Offline or unreachable behavior was logged after service interruption. The visible recovery path was not captured in the same runtime window before the smoke timeout ended.

Stale-state visibility was not observed because the active thread remained `active` during the observed metrics samples.

## Signal Usefulness

The active signal was useful as a baseline heartbeat: it showed that the service, contract, and runtime bridge were alive.

The degraded sample is promising because it shows the runtime can surface service health changes during workflow use. More evidence is needed to judge whether degraded/offline/reconnecting distinctions are visually clear without reading the detailed text.

## Strongest Observations

- Service-first runtime consumption worked during real workflow use.
- Always-on-top behavior was observed programmatically and the window was visible in the desktop screenshot.
- Sanitized lifecycle logs provided useful evidence without raw prompts or response bodies.
- The active/OK state was clear enough to confirm the runtime was alive.
- Interrupting the service produced unreachable lifecycle evidence.

## Weakest Observations

- The visible surface felt like diagnostics, not yet a calm companion layer.
- The window occupied meaningful screen space and overlapped active work.
- Recovery clarity was not observed in the same visible runtime session.
- Stale-state behavior was not exercised.
- The field-trial duration was too short to assess fatigue, trust over time, or earned persistent screen space.

## Likely Next UX Improvements

- Add or evaluate a compact ambient mode that prioritizes signal, badge, and reason over detailed metrics text.
- Reduce default footprint or support a placement that does not cover active work.
- Make degraded, offline, reconnecting, and recovered states visually distinct without requiring detailed reading.
- Run a longer 30 to 60 minute field trial with real coding work before judging fatigue or persistent usefulness.
- Capture recovery evidence in a longer runtime window or with a manual session that does not auto-exit before restart completes.

## Thesis Verdict

Uncertain, with early support.

The field trial supports the Kamay Buddy thesis that ambient operational awareness can be useful: the runtime made service health and activity visible during real workflow use. It does not yet validate the full companion model. The current experience is still closer to a diagnostics panel than an ambient operational companion, and longer human review is needed before claiming earned screen space or durable product direction.

## Outcome

Pass/fail/uncertain: uncertain

Human verdict: useful as an evidence and diagnostics surface; not yet proven as a persistent companion.

Recommended follow-up: run a longer operator field trial after refining or selecting a compact ambient presentation mode.
