import { ipcRenderer } from "electron";

window.bridge = {
  registerHandler(name, callback) {
    if (!window.handler) {
      window.handler = {};
    }

    window.handler[name] = callback;
  },
  screenshot() {
    ipcRenderer.send("screenshot");
  },
  exitScreenshot() {
    ipcRenderer.send("exitScreenshot");
  },
  disableScreenshot() {
    ipcRenderer.send("disableScreenshot");
  },
};
