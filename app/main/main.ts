import { BrowserWindow } from "electron";
import path from "path";

export const mainWindow = {
  current: null as BrowserWindow,
};

export const createWindow = () => {
  mainWindow.current = new BrowserWindow({
    webPreferences: {
      contextIsolation: false,
      preload: path.resolve(__dirname, "../preload/index.js"),
    },
  });

  mainWindow.current.loadFile(
    path.resolve(__dirname, "../../renderers/index/index.html")
  );
};
