import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("bridge", {
  screenshot() {
    ipcRenderer.send("screenshot");
  },
});
