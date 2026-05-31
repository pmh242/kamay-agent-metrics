# Long-Session Embodiment Trial

Date: 2026-05-30

Status: Completed first meaningful long-session field trial

Recommendation: continue

## Summary

This trial evaluated whether the refined signal-reactive sprite embodiment survives real workflow usage without becoming visual clutter, wallpaper, or cognitive overhead.

The valid long-session run lasted approximately 31 minutes, from `2026-05-30T23:24:36Z` through at least `2026-05-30T23:55:36Z`. A prior shorter launch was closed by the operator by mistake and is treated as setup/partial evidence, not a runtime failure.

No runtime, source, package, dependency, or experiment behavior was changed during this trial.

## Workflow Context

The runtime stayed visible during normal repo work:

- reading runtime renderer and embodiment files
- reviewing field-trial guidance
- searching docs and experiment files
- monitoring terminal output
- reviewing Codex output and status updates
- switching attention between terminal, desktop surface, and code/doc context

The observed runtime state remained healthy/active throughout the valid long-session window.

## Evidence

Directly observed:

- Electron runtime launched with `alwaysOnTopObserved: true`.
- Runtime consumed `http://127.0.0.1:8765/metrics/current`.
- Runtime repeatedly reported `contractVersion: "metrics.current.v1"` and `contractOk: true`.
- Service status remained `ok`.
- Source health remained `ok`.
- Snapshot was present.
- Active thread staleness remained `active`.
- Visual checks showed the refined active sprite as a low-contrast peripheral marker beside the compact active label.

Not persisted:

- Desktop screenshots were inspected during the trial but not saved as committed artifacts because they included local desktop context.
- Runtime logs remained terminal-local and were not committed.

## Verified

Confidence: medium to high

- The refined active-state sprite did not create obvious distraction over a 30-minute real workflow session.
- The active-state sprite became peripheral rather than attention-seeking.
- The sprite did not become unreadable; it remained visible when deliberately checked.
- The compact panel remained necessary for exact state details, while the sprite helped as a faster ambient marker.
- Healthy/active treatment stayed calm.
- The runtime did not increase apparent cognitive load during code/doc reading and terminal activity.
- The runtime earned temporary long-session screen space for operational awareness during this repo workflow.
- Operational trust was preserved because the sprite matched the same service-bound healthy state shown by logs and panel text.
- No personality, dialogue, memory, lore, assistant behavior, autonomous behavior, or provider access drift was observed.

## Partially Verified

Confidence: low to medium

- Embodiment improved awareness modestly: it made the runtime feel more like an ambient operational surface than raw diagnostics, but the benefit was subtle during a stable healthy session.
- The sprite avoided becoming noise during healthy operation, but only active/healthy behavior was exercised for the full duration.
- The sprite did become somewhat ignorable over time, but in a healthy state that read as acceptable backgrounding rather than failure.
- Screen-space legitimacy improved compared with the earlier diagnostics-heavy surface, but the runtime has not yet proven placement and size across broader desktop layouts.

## Unverified

Confidence: not observed in this trial

- Degraded-state readability over a long session.
- Offline-state readability over a long session.
- Reconnecting-state noticeability and recovery clarity.
- Stale-state visibility.
- Whether escalation remains useful during repeated state changes.
- Whether the sprite helps identify state changes faster than the badge alone.
- Whether the runtime survives a 45 to 60 minute session without becoming background wallpaper.

## Focus Review

### Distraction

The refined active sprite did not interrupt the workflow. It was noticeable when glanced at but did not pull attention while reading code or docs.

### Readability

The active label, `OK` badge, and sprite were readable together. The sprite worked best as a peripheral cue, not as a standalone information source.

### Awareness

Awareness improved modestly. The sprite made it easier to recognize that the runtime was alive without reading the details every time.

### Usefulness

Useful for calm heartbeat awareness. Not sufficient for diagnosis; the panel remains necessary for precise service and contract details.

### Fatigue

No meaningful fatigue was observed in the 30-minute valid run. The healthy-state sprite faded into the background in a tolerable way.

### Screen-Space Legitimacy

The runtime earned screen space for this workflow session. It remained useful enough to keep open during real repository work, though broader placement and longer sessions remain open questions.

### Signal Clarity

Healthy/active clarity was verified. Degraded, offline, reconnecting, stale, and recovery clarity were not exercised during this long run.

### Operational Trust

Trust improved slightly because the sprite stayed aligned with the service contract and did not invent behavior beyond the observed signal state.

## Direct Questions

Did the sprite attract attention appropriately?

Yes for healthy/active. It was quiet unless deliberately checked.

Did the sprite become invisible?

Partially. It became backgrounded, but remained visible when checked. For a healthy state this is acceptable.

Did the sprite become annoying?

No, not during this trial.

Did the sprite improve awareness?

Yes, modestly. It improved the runtime's peripheral readability more than its diagnostic usefulness.

Did the sprite help identify state changes?

Unverified. No meaningful non-healthy state changes occurred during the valid long-session window.

Did the panel remain necessary?

Yes. The sprite supports ambient awareness; the panel still carries exact operational facts.

Did embodiment improve trust?

Slightly. It made the surface feel more intentional while staying service-bound and non-personified.

Did embodiment increase cognitive load?

No meaningful increase was observed.

Did healthy states remain calm?

Yes.

Were degraded/offline/reconnecting states noticeable?

Unverified in this long run.

Did screen-space feel earned?

Yes for this 30-minute repo workflow session, with moderate confidence.

## Scores

Mechanical correctness: 3/3

Operational usefulness: 2/3

Ambient usefulness: 2/3

Long-session fatigue: 2/3

Earned screen space: 2/3

## Recommendation

Continue.

The refined embodiment is safe to continue testing as a restrained, signal-reactive operational layer. Do not expand into personality, dialogue, memory, lore, autonomous behavior, or avatar-system architecture.

The next useful evidence pass should deliberately exercise degraded, offline, reconnecting, stale, and recovery states during a longer session or controlled field scenario.
