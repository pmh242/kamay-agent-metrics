const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("node:path");

const METRICS_URL = "http://127.0.0.1:8765/metrics/current";
const SMOKE_MODE = process.env.KAMAY_SPIKE_SMOKE === "1";

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
    }, 3000);
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
      return {
        ok: false,
        error: `HTTP ${response.status}`,
        body: text
      };
    }

    try {
      return {
        ok: true,
        value: JSON.parse(text)
      };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  } catch (error) {
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
