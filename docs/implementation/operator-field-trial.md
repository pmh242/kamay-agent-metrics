# Operator Field Trial

This document defines a lightweight real-workflow review for the runtime companion experiments. It is evidence workflow only: no automation, Playwright setup, scripts, runtime changes, product commitment, or new tooling is approved here.

No operator field evidence exists until a human runs a real session, records observations, and reports a verdict.

## Trial Purpose

Use an operator field trial to evaluate whether the runtime companion experiments help during actual AI-assisted development work.

The review should distinguish:

- **Mechanical correctness**: the runtime launches, polls, renders expected states, and recovers without obvious breakage.
- **Operational usefulness**: the runtime helps the operator understand service, source, or workflow health.
- **Ambient usefulness**: the runtime communicates status without requiring focused inspection.
- **Long-session fatigue**: the runtime remains tolerable over time and does not create attention debt.

## Session Guidance

Run the trial during a real scoped development session, not a synthetic state checklist.

Suggested duration:

- **15 minutes** for a quick smoke field trial.
- **30 to 60 minutes** for a useful operator review.
- **90 minutes or more** only when fatigue, interruption, or earned screen-space questions are the main target.

Record the session length, the kind of work being performed, and whether the runtime was visible for the full session.

## Evidence Collection

Keep evidence local and ignored by default:

- `agent-lab/screenshots/`
- `agent-lab/logs/`
- `agent-lab/reports/`

Recommended names:

- `2026-05-27-field-trial-idle.png`
- `2026-05-27-field-trial-reconnecting.png`
- `2026-05-27-field-trial-notes.md`
- `2026-05-27-field-trial-summary.md`

Collect only evidence that helps explain a finding. Do not capture secrets, raw prompts, raw responses, provider files, private tool output, or sensitive telemetry content.

## Observation Categories

Record notes for:

- Visibility: readable while doing real work.
- Placement: useful position and size, or screen-space conflict.
- State clarity: idle, active, stale, degraded, offline, reconnecting, error, and recovery are distinguishable.
- Timing: persistence, fade, escalation, and cooldown feel understandable.
- Interruption: pulse, glow, opacity, or badge changes interrupt only when justified.
- Recovery: returning to healthy or idle state is clear.
- Trust: displayed state matches what the operator believes is happening.
- Friction: setup, launch, positioning, focus, or window behavior gets in the way.
- Noise: repeated state changes or visual emphasis become distracting.
- Privacy: screenshots and visible text avoid sensitive workflow content.

## Earned Screen Space Criteria

The runtime earns screen space only if most of these are true:

- It answers a real question without opening a terminal or diagnostics page.
- It makes degraded, offline, stale, or reconnecting states easier to notice.
- It remains calm during idle or healthy active work.
- It does not obscure important editor, terminal, or browser content.
- It becomes less distracting, not more distracting, as the session continues.
- It gives enough value to justify persistent visibility.

If the runtime is merely decorative, confusing, or frequently hidden, it has not earned screen space yet.

## Usefulness Scoring

Use a 0 to 3 score for each dimension:

```text
0 = harmful or not useful
1 = occasionally useful, but noisy or unclear
2 = useful with manageable friction
3 = clearly useful and low-noise
```

Score:

- Mechanical correctness:
- Operational usefulness:
- Ambient usefulness:
- Long-session fatigue:
- Earned screen space:

Treat any privacy exposure, misleading state, or severe focus disruption as a blocking failure even if other scores are high.

## Operator Review Questions

Answer briefly:

- What real workflow was underway?
- What did the runtime help you notice?
- What did you ignore?
- What was confusing or misleading?
- Did any state arrive too late, too early, or too often?
- Did pulse, glow, opacity, or priority treatment feel justified?
- Did the runtime reduce terminal or diagnostics checking?
- Did it earn persistent screen space?
- Would you run it again during similar work?
- What must change before another field trial?

## Report Template

```text
Trial date:
Operator:
Workflow:
Duration:
Runtime visible for full session: yes/no/partial
Evidence files:

Mechanical correctness score (0-3):
Operational usefulness score (0-3):
Ambient usefulness score (0-3):
Long-session fatigue score (0-3):
Earned screen space score (0-3):

Mechanical correctness notes:
Operational usefulness notes:
Ambient usefulness notes:
Long-session fatigue notes:
Failure/noise/friction notes:
Privacy or data concerns:

Pass/fail/uncertain:
Human verdict:
Recommended follow-up:
```

## Outcome Guidance

- **Pass**: the runtime is mechanically reliable, useful in real work, low-noise, and earns screen space.
- **Fail**: the runtime misleads, distracts, exposes unsafe information, or adds more friction than awareness.
- **Uncertain**: the session was too short, the workflow did not exercise meaningful states, or evidence is mixed.

Field-trial findings are operational evidence only. They do not select a runtime, approve product behavior, or promote avatar, personality, memory, dialogue, lore, or autonomous companion behavior.
