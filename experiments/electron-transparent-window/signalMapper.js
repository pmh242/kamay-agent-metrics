(function initSignalMapper(root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  root.kamaySignalMapper = factory();
})(globalThis, function createSignalMapper() {
  const CONTRACT_VERSION = "metrics.current.v1";

  const SIGNALS = {
    idle: {
      signal: "idle",
      label: "Idle",
      glyph: "ID",
      tone: "neutral",
      reason: "Service is healthy and no active thread is resolved.",
      priority: 1,
      persistenceMs: 800,
      visualWeight: "quiet",
      attentionStyle: "steady",
      fadeAfterMs: 2000,
      escalateAfterMs: null,
      cooldownMs: 800,
      recoveryMs: 900
    },
    active: {
      signal: "active",
      label: "Active",
      glyph: "AC",
      tone: "good",
      reason: "Service is healthy and the active thread is current.",
      priority: 2,
      persistenceMs: 1200,
      visualWeight: "calm",
      attentionStyle: "steady",
      fadeAfterMs: 7000,
      escalateAfterMs: null,
      cooldownMs: 900,
      recoveryMs: 1000
    },
    degraded: {
      signal: "degraded",
      label: "Degraded",
      glyph: "DG",
      tone: "warn",
      reason: "Service or source health is degraded.",
      priority: 3,
      persistenceMs: 2200,
      visualWeight: "visible",
      attentionStyle: "glow",
      fadeAfterMs: 5000,
      escalateAfterMs: 9000,
      cooldownMs: 2200,
      recoveryMs: 1400
    },
    offline: {
      signal: "offline",
      label: "Offline",
      glyph: "OF",
      tone: "bad",
      reason: "Metrics service is unavailable or reports offline health.",
      priority: 4,
      persistenceMs: 3200,
      visualWeight: "strong",
      attentionStyle: "muted-pulse",
      fadeAfterMs: 7000,
      escalateAfterMs: 9000,
      cooldownMs: 4200,
      recoveryMs: 1800
    },
    reconnecting: {
      signal: "reconnecting",
      label: "Reconnecting",
      glyph: "RC",
      tone: "warn",
      reason: "Service was reachable before, but the latest poll failed.",
      priority: 3,
      persistenceMs: 2600,
      visualWeight: "visible",
      attentionStyle: "pulse",
      fadeAfterMs: 4500,
      escalateAfterMs: 6500,
      cooldownMs: 3200,
      recoveryMs: 1400
    },
    stale: {
      signal: "stale",
      label: "Stale",
      glyph: "ST",
      tone: "warn",
      reason: "The active thread is stale or has unknown freshness.",
      priority: 3,
      persistenceMs: 2200,
      visualWeight: "visible",
      attentionStyle: "glow",
      fadeAfterMs: 5000,
      escalateAfterMs: 8500,
      cooldownMs: 2200,
      recoveryMs: 1400
    },
    error: {
      signal: "error",
      label: "Error",
      glyph: "ER",
      tone: "bad",
      reason: "The latest poll failed with an HTTP or parsing error.",
      priority: 4,
      persistenceMs: 3200,
      visualWeight: "strong",
      attentionStyle: "muted-pulse",
      fadeAfterMs: 6500,
      escalateAfterMs: 8500,
      cooldownMs: 4200,
      recoveryMs: 1800
    },
    unknown: {
      signal: "unknown",
      label: "Unknown",
      glyph: "UN",
      tone: "neutral",
      reason: "The metrics response does not match the expected v1 contract.",
      priority: 4,
      persistenceMs: 2600,
      visualWeight: "strong",
      attentionStyle: "glow",
      fadeAfterMs: 5000,
      escalateAfterMs: null,
      cooldownMs: 2600,
      recoveryMs: 1200
    }
  };

  function createSignalMemory() {
    return {
      hadReachable: false,
      previousSignal: null
    };
  }

  function createSignalUxMemory() {
    return {
      currentSignal: null,
      holdUntilMs: 0
    };
  }

  function createTemporalSignalMemory() {
    return {
      currentSignalName: null,
      currentSinceMs: 0,
      previousSignalName: null,
      recoveredUntilMs: 0,
      cooldownUntilMs: 0,
      lastHighAttentionSignalName: null
    };
  }

  function mapRuntimeSignal(response, memory) {
    const state = memory || createSignalMemory();
    const next = chooseSignal(response, state);
    if (response && response.ok === true && isMetricsCurrentResponse(response.value)) {
      state.hadReachable = true;
    }
    state.previousSignal = next.signal;
    return {
      ...next,
      memory: {
        hadReachable: state.hadReachable,
        previousSignal: state.previousSignal
      }
    };
  }

  function applySignalUx(nextSignal, memory, nowMs) {
    const state = memory || createSignalUxMemory();
    const observedAtMs = Number.isFinite(nowMs) ? nowMs : Date.now();
    const current = state.currentSignal;

    if (current &&
        current.signal !== nextSignal.signal &&
        observedAtMs < state.holdUntilMs &&
        current.priority >= nextSignal.priority) {
      return {
        ...current,
        transition: "held",
        pendingSignal: nextSignal.signal,
        remainingMs: state.holdUntilMs - observedAtMs
      };
    }

    const transition = current && current.signal !== nextSignal.signal ? "changed" : "steady";
    state.currentSignal = nextSignal;
    state.holdUntilMs = observedAtMs + nextSignal.persistenceMs;
    return {
      ...nextSignal,
      transition,
      pendingSignal: null,
      remainingMs: nextSignal.persistenceMs
    };
  }

  function applyTemporalSignalTiming(nextSignal, memory, nowMs) {
    const state = memory || createTemporalSignalMemory();
    const observedAtMs = Number.isFinite(nowMs) ? nowMs : Date.now();
    const previousName = state.currentSignalName;
    const changed = previousName !== nextSignal.signal;

    if (changed) {
      state.previousSignalName = previousName;
      state.currentSignalName = nextSignal.signal;
      state.currentSinceMs = observedAtMs;

      if (isRecoveryTransition(previousName, nextSignal.signal)) {
        state.recoveredUntilMs = observedAtMs + nextSignal.recoveryMs;
        state.cooldownUntilMs = observedAtMs + cooldownFor(previousName);
        state.lastHighAttentionSignalName = previousName;
      }
    }

    const elapsedMs = Math.max(0, observedAtMs - state.currentSinceMs);
    const inRecovery = observedAtMs < state.recoveredUntilMs;
    const inCooldown = observedAtMs < state.cooldownUntilMs;
    let temporalPhase = changed ? "fresh" : "fresh";
    let temporalWeight = nextSignal.visualWeight;
    let temporalAttentionStyle = nextSignal.attentionStyle;

    if (inRecovery && isCalmSignal(nextSignal.signal)) {
      temporalPhase = "recovered";
      temporalWeight = "calm";
      temporalAttentionStyle = "glow";
    } else if (inCooldown && isHighAttentionSignal(nextSignal)) {
      temporalPhase = "cooldown";
      temporalWeight = nextSignal.priority >= 4 ? "visible" : "calm";
      temporalAttentionStyle = "steady";
    } else if (shouldEscalate(nextSignal, elapsedMs)) {
      temporalPhase = "escalated";
      temporalWeight = "strong";
      temporalAttentionStyle = nextSignal.attentionStyle === "steady" ? "glow" : nextSignal.attentionStyle;
    } else if (shouldFade(nextSignal, elapsedMs)) {
      temporalPhase = "faded";
      temporalWeight = softenVisualWeight(nextSignal.visualWeight);
      temporalAttentionStyle = nextSignal.attentionStyle === "pulse" ? "glow" : "steady";
    }

    return {
      ...nextSignal,
      temporalPhase,
      temporalWeight,
      temporalAttentionStyle,
      elapsedMs,
      recoveredUntilMs: state.recoveredUntilMs,
      cooldownUntilMs: state.cooldownUntilMs
    };
  }

  function chooseSignal(response, memory) {
    if (!response || response.ok !== true) {
      if (isErrorCategory(response && response.errorCategory)) {
        return SIGNALS.error;
      }
      return memory.hadReachable ? SIGNALS.reconnecting : SIGNALS.offline;
    }

    const value = response.value;
    if (!isMetricsCurrentResponse(value)) {
      return SIGNALS.unknown;
    }

    if (value.service.status === "offline" || value.sourceHealth.status === "offline") {
      return SIGNALS.offline;
    }

    if (value.service.status === "degraded" || value.sourceHealth.status === "degraded") {
      return SIGNALS.degraded;
    }

    if (value.snapshot === null || value.snapshot.activeThread === null) {
      return SIGNALS.idle;
    }

    const staleness = value.snapshot.activeThread.staleness;
    if (staleness === "stale" || staleness === "unknown") {
      return SIGNALS.stale;
    }

    if (staleness === "active") {
      return SIGNALS.active;
    }

    return SIGNALS.unknown;
  }

  function isMetricsCurrentResponse(value) {
    return isRecord(value) &&
      value.contractVersion === CONTRACT_VERSION &&
      isRecord(value.service) &&
      isServiceStatus(value.service.status) &&
      isRecord(value.sourceHealth) &&
      isServiceStatus(value.sourceHealth.status) &&
      Object.prototype.hasOwnProperty.call(value, "snapshot") &&
      (value.snapshot === null || isRecord(value.snapshot));
  }

  function isErrorCategory(value) {
    return value === "http_status" || value === "invalid_json" || value === "fetch_error";
  }

  function isServiceStatus(value) {
    return value === "ok" || value === "degraded" || value === "offline";
  }

  function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  function shouldFade(signal, elapsedMs) {
    return Number.isInteger(signal.fadeAfterMs) && elapsedMs >= signal.fadeAfterMs;
  }

  function shouldEscalate(signal, elapsedMs) {
    return Number.isInteger(signal.escalateAfterMs) && elapsedMs >= signal.escalateAfterMs;
  }

  function softenVisualWeight(value) {
    if (value === "strong") {
      return "visible";
    }
    if (value === "visible") {
      return "calm";
    }
    return value;
  }

  function isRecoveryTransition(previousName, nextName) {
    return isHighAttentionSignalName(previousName) && isCalmSignal(nextName);
  }

  function isHighAttentionSignal(signal) {
    return signal && signal.priority >= 3;
  }

  function isHighAttentionSignalName(value) {
    const signal = value ? SIGNALS[value] : null;
    return isHighAttentionSignal(signal);
  }

  function isCalmSignal(value) {
    return value === "active" || value === "idle";
  }

  function cooldownFor(signalName) {
    const signal = signalName ? SIGNALS[signalName] : null;
    return signal && Number.isInteger(signal.cooldownMs) ? signal.cooldownMs : 0;
  }

  return {
    CONTRACT_VERSION,
    SIGNALS,
    createSignalMemory,
    createSignalUxMemory,
    createTemporalSignalMemory,
    mapRuntimeSignal,
    applySignalUx,
    applyTemporalSignalTiming,
    isMetricsCurrentResponse
  };
});
