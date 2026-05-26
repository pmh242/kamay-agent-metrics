const {
  SIGNALS,
  createTemporalSignalMemory,
  applyTemporalSignalTiming
} = require("./signalMapper.js");

function main() {
  assertTimingMetadata();
  assertReconnectingEscalatesAfterSustainedTime();
  assertDegradedFadesBeforeEscalation();
  assertErrorAndOfflinePersist();
  assertRecoveryPhaseBeforeCalmReturn();
  assertCooldownSuppressesFlapping();
  assertActiveAndIdleStayCalm();

  console.log(JSON.stringify({
    event: "runtime-temporal-signal-harness-complete",
    scenarios: [
      "timing metadata",
      "reconnecting escalation",
      "degraded fade before escalation",
      "error and offline persistence",
      "recovery phase",
      "cooldown suppression",
      "active and idle calm"
    ]
  }));
}

function assertTimingMetadata() {
  for (const signal of Object.values(SIGNALS)) {
    assert(Number.isInteger(signal.fadeAfterMs), `${signal.signal} fadeAfterMs must be an integer`);
    assert(signal.escalateAfterMs === null || Number.isInteger(signal.escalateAfterMs), `${signal.signal} escalateAfterMs must be null or integer`);
    assert(Number.isInteger(signal.cooldownMs), `${signal.signal} cooldownMs must be an integer`);
    assert(Number.isInteger(signal.recoveryMs), `${signal.signal} recoveryMs must be an integer`);
  }

  assert(SIGNALS.active.escalateAfterMs === null, "active must not escalate");
  assert(SIGNALS.idle.escalateAfterMs === null, "idle must not escalate");
  pass("timing metadata");
}

function assertReconnectingEscalatesAfterSustainedTime() {
  const memory = createTemporalSignalMemory();
  const fresh = applyTemporalSignalTiming(SIGNALS.reconnecting, memory, 1000);
  const faded = applyTemporalSignalTiming(SIGNALS.reconnecting, memory, 5600);
  const escalated = applyTemporalSignalTiming(SIGNALS.reconnecting, memory, 7600);

  assert(fresh.temporalPhase === "fresh", "reconnecting starts fresh");
  assert(faded.temporalPhase === "faded", "reconnecting fades before escalation");
  assert(escalated.temporalPhase === "escalated", "reconnecting escalates after sustained time");
  pass("reconnecting escalation");
}

function assertDegradedFadesBeforeEscalation() {
  const memory = createTemporalSignalMemory();
  const fresh = applyTemporalSignalTiming(SIGNALS.degraded, memory, 2000);
  const faded = applyTemporalSignalTiming(SIGNALS.degraded, memory, 7100);
  const escalated = applyTemporalSignalTiming(SIGNALS.degraded, memory, 11200);

  assert(fresh.temporalPhase === "fresh", "degraded starts fresh");
  assert(faded.temporalPhase === "faded", "degraded fades after sustained visibility");
  assert(escalated.temporalPhase === "escalated", "degraded escalates only after longer persistence");
  pass("degraded fade before escalation");
}

function assertErrorAndOfflinePersist() {
  const errorMemory = createTemporalSignalMemory();
  const offlineMemory = createTemporalSignalMemory();
  const earlyError = applyTemporalSignalTiming(SIGNALS.error, errorMemory, 1000);
  const earlyOffline = applyTemporalSignalTiming(SIGNALS.offline, offlineMemory, 1000);
  const escalatedError = applyTemporalSignalTiming(SIGNALS.error, errorMemory, 9600);
  const escalatedOffline = applyTemporalSignalTiming(SIGNALS.offline, offlineMemory, 10100);

  assert(earlyError.temporalPhase === "fresh", "error starts readable");
  assert(earlyOffline.temporalPhase === "fresh", "offline starts readable");
  assert(escalatedError.temporalPhase === "escalated", "error escalates after sustained failure");
  assert(escalatedOffline.temporalPhase === "escalated", "offline escalates after sustained failure");
  pass("error and offline persistence");
}

function assertRecoveryPhaseBeforeCalmReturn() {
  const memory = createTemporalSignalMemory();
  applyTemporalSignalTiming(SIGNALS.offline, memory, 1000);
  const recovered = applyTemporalSignalTiming(SIGNALS.active, memory, 1400);
  const calm = applyTemporalSignalTiming(SIGNALS.active, memory, 3401);

  assert(recovered.temporalPhase === "recovered", "active shows recovery after offline");
  assert(recovered.temporalAttentionStyle === "glow", "recovery uses visible but calm glow");
  assert(calm.temporalPhase === "fresh", "active returns to calm after recovery window");
  pass("recovery phase");
}

function assertCooldownSuppressesFlapping() {
  const memory = createTemporalSignalMemory();
  applyTemporalSignalTiming(SIGNALS.offline, memory, 1000);
  applyTemporalSignalTiming(SIGNALS.active, memory, 1400);
  const suppressed = applyTemporalSignalTiming(SIGNALS.offline, memory, 1800);
  const restored = applyTemporalSignalTiming(SIGNALS.offline, memory, 5701);

  assert(suppressed.temporalPhase === "cooldown", "offline re-entry is suppressed during cooldown");
  assert(suppressed.temporalAttentionStyle === "steady", "cooldown removes pulse");
  assert(restored.temporalPhase === "fresh", "offline returns after cooldown expires");
  pass("cooldown suppression");
}

function assertActiveAndIdleStayCalm() {
  const activeMemory = createTemporalSignalMemory();
  const idleMemory = createTemporalSignalMemory();
  const active = applyTemporalSignalTiming(SIGNALS.active, activeMemory, 1000);
  const fadedActive = applyTemporalSignalTiming(SIGNALS.active, activeMemory, 9000);
  const idle = applyTemporalSignalTiming(SIGNALS.idle, idleMemory, 1000);
  const fadedIdle = applyTemporalSignalTiming(SIGNALS.idle, idleMemory, 3600);

  assert(active.temporalPhase === "fresh", "active starts fresh");
  assert(fadedActive.temporalPhase === "faded", "active fades instead of escalating");
  assert(fadedActive.temporalWeight === "calm", "active remains calm after fading");
  assert(idle.temporalPhase === "fresh", "idle starts fresh");
  assert(fadedIdle.temporalPhase === "faded", "idle fades quietly");
  assert(fadedIdle.temporalWeight === "quiet", "idle remains quiet after fading");
  pass("active and idle calm");
}

function pass(name) {
  console.log(JSON.stringify({
    event: "runtime-temporal-signal-scenario-pass",
    name
  }));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

main();
