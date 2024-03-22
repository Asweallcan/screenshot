import {
  screen,
  dialog,
  ipcMain,
  BrowserWindow,
  globalShortcut,
  systemPreferences,
  desktopCapturer,
} from "electron";
import path from "path";
import { executeJavaScript } from "../utils";

export const screenshotWindow = {
  enable: false,
  current: [] as BrowserWindow[],
};

export const screenshot = async () => {
  if (screenshotWindow.enable) return;
  if (systemPreferences.getMediaAccessStatus("screen") !== "granted") {
    dialog.showErrorBox("抱歉！", "请在设置里打开录屏权限");
    return;
  }

  const sources = await desktopCapturer.getSources({
    types: ["screen"],
  });

  screen.getAllDisplays().map(async (display, index) => {
    const {
      id,
      bounds: { x, y, width, height },
      scaleFactor,
    } = display;

    const source = sources.find((source) => +source.display_id === id);

    const win = new BrowserWindow({
      x,
      y,
      width,
      height,
      show: false,
      frame: false,
      movable: false,
      closable: false,
      resizable: false,
      hasShadow: false,
      alwaysOnTop: true,
      transparent: true,
      roundedCorners: false,
      enableLargerThanScreen: true,
      webPreferences: {
        contextIsolation: false,
        preload: path.resolve(__dirname, "../preload/index.js"),
      },
    });
    win.setAlwaysOnTop(true, "screen-saver");
    win.setFullScreenable(false);
    win.setVisibleOnAllWorkspaces(true);
    win.loadFile(
      path.resolve(__dirname, "../../renderers/screenshot/index.html")
    );
    // win.webContents.openDevTools();
    executeJavaScript(win, "initScreenshot", {
      sourceId: source.id,
      width,
      height,
      scaleFactor,
    });

    win.on("ready-to-show", () => {
      win.showInactive();
    });

    screenshotWindow.current[index] = win;
  });

  screenshotWindow.enable = true;
  globalShortcut.register("Esc", exitScreenshot);
  ipcMain.on("exitScreenshot", exitScreenshot);
  ipcMain.on("disableScreenshot", disableScreenshot);
};

export const disableScreenshot = () => {
  screenshotWindow.current.forEach((win) => {
    executeJavaScript(win, "disableScreenshot");
  });
};

export const exitScreenshot = () => {
  screenshotWindow.current.forEach((win) => {
    win.destroy();
  });
  screenshotWindow.current = [];
  screenshotWindow.enable = false;
  globalShortcut.unregister("Esc");
  ipcMain.off("exitScreenshot", exitScreenshot);
  ipcMain.off("disableScreenshot", disableScreenshot);
};
