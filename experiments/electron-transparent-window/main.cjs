const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("node:path");

const CONTRACT_VERSION = "metrics.current.v1";
const DEFAULT_METRICS_URL = "http://127.0.0.1:8765/metrics/current";
const METRICS_URL = resolveMetricsUrl(process.env.KAMAY_METRICS_URL);
const SMOKE_MODE = process.env.KAMAY_SPIKE_SMOKE === "1";
const SMOKE_MS = parsePositiveInteger(process.env.KAMAY_SPIKE_SMOKE_MS, 3000);

let windowRef = null;

function createWindow() {
  Menu.setApplicationMenu(null);

  windowRef = new BrowserWindow({
    width: 380,
    height: 260,
    minWidth: 320,
    minHeight: 220,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: true,
    backgroundColor: "#00000000",
    title: "Kamay Metrics Runtime Spike",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, "preload.cjs")
    }
  });

  windowRef.setAlwaysOnTop(true, "floating");
  windowRef.loadFile(path.join(__dirname, "renderer.html"));

  console.log(JSON.stringify({
    event: "electron-runtime-spike-window-created",
    transparentRequested: true,
    alwaysOnTopRequested: true,
    alwaysOnTopObserved: windowRef.isAlwaysOnTop(),
    metricsUrl: METRICS_URL
  }));

  if (SMOKE_MODE) {
    setTimeout(() => {
      app.quit();
    }, SMOKE_MS);
  }
}

ipcMain.handle("metrics-current:fetch", async () => {
  try {
    const response = await fetch(METRICS_URL, {
      method: "GET",
      headers: { accept: "application/json" }
    });
    const text = await response.text();

    if (!response.ok) {
      logLifecycleEvent({
        event: "metrics-fetch",
        reachable: false,
        errorCategory: "http_status",
        httpStatus: response.status
      });
      return {
        ok: false,
        error: `HTTP ${response.status}`
      };
    }

    try {
      const value = JSON.parse(text);
      logLifecycleEvent(summarizeMetricsResponse(value));
      return {
        ok: true,
        value
      };
    } catch (error) {
      logLifecycleEvent({
        event: "metrics-fetch",
        reachable: false,
        errorCategory: "invalid_json"
      });
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  } catch (error) {
    logLifecycleEvent({
      event: "metrics-fetch",
      reachable: false,
      errorCategory: categorizeFetchError(error)
    });
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  app.quit();
});

function resolveMetricsUrl(value) {
  if (value === undefined || value.length === 0) {
    return DEFAULT_METRICS_URL;
  }

  const parsed = new URL(value);
  const port = Number(parsed.port);
  if (
    parsed.protocol !== "http:" ||
    parsed.hostname !== "127.0.0.1" ||
    parsed.pathname !== "/metrics/current" ||
    parsed.search !== "" ||
    parsed.hash !== "" ||
    !Number.isInteger(port) ||
    port <= 0 ||
    port > 65535
  ) {
    throw new Error("KAMAY_METRICS_URL must be http://127.0.0.1:<port>/metrics/current");
  }

  return `http://127.0.0.1:${port}/metrics/current`;
}

function parsePositiveInteger(value, fallback) {
  if (value === undefined || value.length === 0) {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 60000) {
    throw new Error("KAMAY_SPIKE_SMOKE_MS must be a positive integer up to 60000");
  }
  return parsed;
}

function summarizeMetricsResponse(value) {
  const snapshot = isRecord(value) && isRecord(value.snapshot) ? value.snapshot : null;
  const activeThread = snapshot !== null && isRecord(snapshot.activeThread) ? snapshot.activeThread : null;
  const service = isRecord(value) && isRecord(value.service) ? value.service : {};
  const sourceHealth = isRecord(value) && isRecord(value.sourceHealth) ? value.sourceHealth : {};

  return {
    event: "metrics-fetch",
    reachable: true,
    contractVersion: isRecord(value) && typeof value.contractVersion === "string" ? value.contractVersion : null,
    contractOk: isRecord(value) && value.contractVersion === CONTRACT_VERSION,
    serviceStatus: typeof service.status === "string" ? service.status : null,
    sourceHealthStatus: typeof sourceHealth.status === "string" ? sourceHealth.status : null,
    hasSnapshot: snapshot !== null,
    activeThreadStaleness: activeThread !== null && typeof activeThread.staleness === "string"
      ? activeThread.staleness
      : null,
    errorCategory: null
  };
}

function logLifecycleEvent(payload) {
  console.log(JSON.stringify({
    kind: "kamay-runtime-lifecycle",
    observedAt: new Date().toISOString(),
    metricsUrl: METRICS_URL,
    ...payload
  }));
}

function categorizeFetchError(error) {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("ECONNREFUSED") || message.includes("fetch failed")) {
    return "unreachable";
  }
  return "fetch_error";
}

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
