import { BrowserWindow } from "electron";
import path from "path";

export const mainWindow = {
  /**
   * @type BrowserWindow
   */
  current: null,
};

export const createWindow = () => {
  mainWindow.current = new BrowserWindow({
    webPreferences: {
      preload: path.resolve(__dirname, "../preload/index.js"),
    },
  });

  mainWindow.current.loadFile(
    path.resolve(__dirname, "../../renderers/index/index.html")
  );
};
