const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("bridge", {
  screenshot() {
    ipcRenderer.send("screenshot");
  },
});
