const assert = require("node:assert/strict");
const {
  SPRITE_SHEET,
  EMBODIMENTS,
  mapSignalToEmbodiment
} = require("./spriteEmbodiment.js");

const requiredStates = ["idle", "active", "degraded", "reconnecting", "offline"];

assert.equal(SPRITE_SHEET.frameWidth, 32);
assert.equal(SPRITE_SHEET.frameHeight, 32);

for (const state of requiredStates) {
  const embodiment = mapSignalToEmbodiment({ signal: state });
  assert.equal(embodiment.state, state);
  assert.ok(Number.isInteger(embodiment.frameRow));
  assert.ok(Array.isArray(embodiment.frameLoop));
  assert.ok(embodiment.frameLoop.length >= 2);
  assert.ok(Number.isInteger(embodiment.cadenceMs));
  assert.ok(embodiment.opacity > 0 && embodiment.opacity <= 1);
  assert.ok(embodiment.scale > 0 && embodiment.scale <= 1.1);
  console.log(JSON.stringify({
    event: "runtime-embodiment-scenario-pass",
    name: state,
    frameRow: embodiment.frameRow,
    motion: embodiment.motion,
    intensity: embodiment.intensity
  }));
}

assert.equal(mapSignalToEmbodiment({ signal: "stale" }).state, "stale");
assert.equal(mapSignalToEmbodiment({ signal: "error" }).state, "error");
assert.equal(mapSignalToEmbodiment({ signal: "unknown" }).state, "unknown");
assert.equal(mapSignalToEmbodiment(null).state, EMBODIMENTS.idle.state);
assert.ok(EMBODIMENTS.active.opacity < EMBODIMENTS.degraded.opacity);
assert.ok(EMBODIMENTS.active.opacity < EMBODIMENTS.offline.opacity);
assert.ok(EMBODIMENTS.active.cadenceMs > EMBODIMENTS.reconnecting.cadenceMs);
assert.ok(EMBODIMENTS.offline.scale > EMBODIMENTS.active.scale);

console.log(JSON.stringify({
  event: "runtime-embodiment-harness-complete",
  scenarios: requiredStates
}));
