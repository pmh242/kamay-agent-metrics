const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("kamayMetrics", {
  fetchCurrent: () => ipcRenderer.invoke("metrics-current:fetch")
});
