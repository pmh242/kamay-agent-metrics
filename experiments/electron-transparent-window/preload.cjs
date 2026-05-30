const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("kamayMetrics", {
  fetchCurrent: () => ipcRenderer.invoke("metrics-current:fetch"),
  close: () => ipcRenderer.invoke("runtime-window:close")
});
