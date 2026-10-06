const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("pcforge", {
  desktop: true,
  platform: process.platform,
  version: process.versions.electron,
  scanSystem: () => ipcRenderer.invoke("pcforge:scan-system")
});
