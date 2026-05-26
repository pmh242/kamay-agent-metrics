const {
  SIGNALS,
  createSignalUxMemory,
  applySignalUx
} = require("./signalMapper.js");

function main() {
  assertSignalMetadata();
  assertPriorityOrder();
  assertPersistenceHold();
  assertHigherPriorityInterrupt();

  console.log(JSON.stringify({
    event: "runtime-signal-ux-harness-complete",
    scenarios: [
      "signal metadata",
      "priority ordering",
      "persistence hold",
      "higher priority interrupt"
    ]
  }));
}

function assertSignalMetadata() {
  const expected = {
    idle: ["quiet", "steady", 800],
    active: ["calm", "steady", 1200],
    degraded: ["visible", "glow", 2200],
    offline: ["strong", "muted-pulse", 3200],
    reconnecting: ["visible", "pulse", 2600],
    stale: ["visible", "glow", 2200],
    error: ["strong", "muted-pulse", 3200],
    unknown: ["strong", "glow", 2600]
  };

  for (const [signalName, [visualWeight, attentionStyle, persistenceMs]] of Object.entries(expected)) {
    const signal = SIGNALS[signalName];
    assert(signal, `${signalName} metadata is missing`);
    assert(signal.visualWeight === visualWeight, `${signalName} visualWeight mismatch`);
    assert(signal.attentionStyle === attentionStyle, `${signalName} attentionStyle mismatch`);
    assert(signal.persistenceMs === persistenceMs, `${signalName} persistenceMs mismatch`);
    assert(Number.isInteger(signal.priority), `${signalName} priority must be an integer`);
  }

  pass("signal metadata");
}

function assertPriorityOrder() {
  assert(SIGNALS.idle.priority < SIGNALS.active.priority, "idle must be quieter than active");
  assert(SIGNALS.active.priority < SIGNALS.degraded.priority, "active must be quieter than degraded");
  assert(SIGNALS.active.priority < SIGNALS.stale.priority, "active must be quieter than stale");
  assert(SIGNALS.degraded.priority <= SIGNALS.offline.priority, "degraded must not outrank offline");
  assert(SIGNALS.reconnecting.priority <= SIGNALS.error.priority, "reconnecting must not outrank error");
  assert(SIGNALS.unknown.priority === SIGNALS.error.priority, "unknown contract drift should be high priority");

  pass("priority ordering");
}

function assertPersistenceHold() {
  const memory = createSignalUxMemory();
  const first = applySignalUx(SIGNALS.error, memory, 1000);
  const held = applySignalUx(SIGNALS.idle, memory, 1200);
  const released = applySignalUx(SIGNALS.idle, memory, 4301);

  assert(first.signal === "error", "first signal should be error");
  assert(first.transition === "steady", "first signal should be steady");
  assert(held.signal === "error", "lower priority idle should be held behind error persistence");
  assert(held.transition === "held", "held transition should be reported");
  assert(held.pendingSignal === "idle", "held transition should expose pending idle signal");
  assert(released.signal === "idle", "idle should apply after error persistence expires");
  assert(released.transition === "changed", "released transition should be changed");

  pass("persistence hold");
}

function assertHigherPriorityInterrupt() {
  const memory = createSignalUxMemory();
  const first = applySignalUx(SIGNALS.idle, memory, 1000);
  const interrupted = applySignalUx(SIGNALS.offline, memory, 1100);

  assert(first.signal === "idle", "first signal should be idle");
  assert(interrupted.signal === "offline", "offline should interrupt idle");
  assert(interrupted.transition === "changed", "higher priority interrupt should be changed");

  pass("higher priority interrupt");
}

function pass(name) {
  console.log(JSON.stringify({
    event: "runtime-signal-ux-scenario-pass",
    name
  }));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

main();
