(function initSpriteEmbodiment(root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  root.kamaySpriteEmbodiment = factory();
})(globalThis, function createSpriteEmbodiment() {
  const SPRITE_SHEET = {
    description: "Aseprite-first placeholder atlas contract for signal-reactive 2D embodiment.",
    image: null,
    frameWidth: 32,
    frameHeight: 32,
    rows: {
      idle: 0,
      active: 1,
      degraded: 2,
      reconnecting: 3,
      offline: 4
    }
  };

  const EMBODIMENTS = {
    idle: {
      state: "idle",
      label: "Idle",
      frameRow: SPRITE_SHEET.rows.idle,
      frameLoop: [0, 1],
      cadenceMs: 1600,
      intensity: "quiet",
      motion: "breathe",
      glow: "low",
      opacity: 0.62
    },
    active: {
      state: "active",
      label: "Active",
      frameRow: SPRITE_SHEET.rows.active,
      frameLoop: [0, 1, 2],
      cadenceMs: 1200,
      intensity: "calm",
      motion: "steady",
      glow: "soft",
      opacity: 0.78
    },
    degraded: {
      state: "degraded",
      label: "Degraded",
      frameRow: SPRITE_SHEET.rows.degraded,
      frameLoop: [0, 1, 2],
      cadenceMs: 900,
      intensity: "watch",
      motion: "tense",
      glow: "warn",
      opacity: 0.92
    },
    reconnecting: {
      state: "reconnecting",
      label: "Reconnect",
      frameRow: SPRITE_SHEET.rows.reconnecting,
      frameLoop: [0, 1, 2, 1],
      cadenceMs: 700,
      intensity: "watch",
      motion: "scan",
      glow: "warn",
      opacity: 0.9
    },
    offline: {
      state: "offline",
      label: "Offline",
      frameRow: SPRITE_SHEET.rows.offline,
      frameLoop: [0, 1],
      cadenceMs: 1100,
      intensity: "strong",
      motion: "low",
      glow: "bad",
      opacity: 0.96
    }
  };

  function mapSignalToEmbodiment(signal) {
    const signalName = typeof signal === "string" ? signal : signal && signal.signal;
    if (signalName === "error" || signalName === "unknown") {
      return {
        ...EMBODIMENTS.offline,
        state: signalName,
        label: signalName === "error" ? "Error" : "Unknown"
      };
    }
    if (signalName === "stale") {
      return {
        ...EMBODIMENTS.degraded,
        state: "stale",
        label: "Stale"
      };
    }
    return EMBODIMENTS[signalName] || EMBODIMENTS.idle;
  }

  return {
    SPRITE_SHEET,
    EMBODIMENTS,
    mapSignalToEmbodiment
  };
});
