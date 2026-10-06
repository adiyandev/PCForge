const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { scanSystem } = require("./system.cjs");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1000,
    minHeight: 680,
    backgroundColor: "#0b0d10",
    autoHideMenuBar: true,
    title: "PCForge",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (process.env.ELECTRON_DEV_SERVER_URL) mainWindow.loadURL(process.env.ELECTRON_DEV_SERVER_URL);
  else mainWindow.loadFile(path.join(__dirname, "..", "dist", "index.html"));
}

ipcMain.handle("pcforge:scan-system", async () => {
  try {
    return { ok: true, data: await scanSystem() };
  } catch (error) {
    return { ok: false, error: error.message || "Hardware scan failed." };
  }
});

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
