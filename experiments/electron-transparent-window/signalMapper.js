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
      attentionStyle: "steady"
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
      attentionStyle: "steady"
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
      attentionStyle: "glow"
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
      attentionStyle: "muted-pulse"
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
      attentionStyle: "pulse"
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
      attentionStyle: "glow"
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
      attentionStyle: "muted-pulse"
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
      attentionStyle: "glow"
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

  return {
    CONTRACT_VERSION,
    SIGNALS,
    createSignalMemory,
    createSignalUxMemory,
    mapRuntimeSignal,
    applySignalUx,
    isMetricsCurrentResponse
  };
});
