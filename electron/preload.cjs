const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("pcforge", {
  desktop: true,
  platform: process.platform,
  version: process.versions.electron
});
