# Manual Runtime UX Review

This document operationalizes Kamay Test Lab for human-reviewed runtime UX evidence. It is a local review workflow only: no Playwright setup, scripts, dependencies, framework behavior, experiment changes, or product UI commitment are approved here.

Human visual verification has not happened until a reviewer runs a session, records observations, and reports a verdict.

## Review Purpose

Use this review to judge whether the isolated runtime signal experiments are readable, useful, calm, and low-noise over time. The review should focus on human attention and interpretation, not implementation expansion.

## Suggested Local Evidence Paths

Keep artifacts local and ignored by default:

- `agent-lab/screenshots/`
- `agent-lab/logs/`
- `agent-lab/reports/`

Do not create tracked placeholder directories. Do not commit artifacts unless a task explicitly approves specific files.

Suggested names:

- `2026-05-26-idle-state.png`
- `2026-05-26-degraded-state.png`
- `2026-05-26-review-notes.md`

Artifacts must avoid secrets, raw prompts, raw responses, provider files, raw tool output with private content, and sensitive telemetry content.

## Evidence Collection Workflow

1. Start the metrics service or an approved experiment harness for the specific state under review.
2. Launch the isolated runtime experiment only if the task asks for live visual review.
3. Observe each target state long enough to judge readability and fatigue.
4. Capture screenshots only when they clarify a finding or make the review reproducible.
5. Write notes in a local report under `agent-lab/reports/` if useful.
6. Report what was observed, what was not observed, and whether human verification is complete.

## Review Checklist

Record pass, fail, or notes for each item:

- Transparency visibility: window contents remain readable against likely desktop backgrounds.
- Always-on-top usefulness: persistent placement helps rather than distracts.
- Idle readability: idle is visible enough to confirm baseline state but does not demand attention.
- Degraded/offline distinction: degraded service and offline/unreachable service are easy to tell apart.
- Stale-state visibility: stale active-thread state is noticeable without looking like a hard failure.
- Reconnect/recovery clarity: reconnecting and recovered states communicate transition rather than crash.
- Pulse/glow distraction: lightweight effects support attention without becoming noisy.
- Fatigue over time: repeated polling and persistent states remain tolerable after several minutes.
- Readability at distance: label, glyph, and priority are legible without close inspection.
- Calm vs noisy behavior: active and idle stay calm; error/offline states get appropriate emphasis.
- Escalation appropriateness: escalated states feel justified by duration or severity.

## Observation Log Format

Use a simple text report:

```text
Review date:
Reviewer:
Runtime state:
Evidence files:

Transparency visibility: pass/fail/notes
Always-on-top usefulness: pass/fail/notes
Idle readability: pass/fail/notes
Degraded/offline distinction: pass/fail/notes
Stale-state visibility: pass/fail/notes
Reconnect/recovery clarity: pass/fail/notes
Pulse/glow distraction: pass/fail/notes
Fatigue over time: pass/fail/notes
Readability at distance: pass/fail/notes
Calm vs noisy behavior: pass/fail/notes
Escalation appropriateness: pass/fail/notes

Human verdict: pass/fail/inconclusive
Follow-up:
```

## Pass / Fail Guidance

- **Pass**: the state is readable, useful, and appropriately calm or attention-getting for its severity.
- **Fail**: the state is confusing, too subtle, too noisy, misleading, or exposes unsafe information.
- **Notes**: record uncertainty, environment limits, and whether more human review is needed.

Keep findings scoped as experiment evidence. A passing review does not select a runtime, approve product behavior, or turn signal vocabulary into durable companion design.
