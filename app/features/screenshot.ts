import {
  screen,
  dialog,
  BrowserWindow,
  globalShortcut,
  systemPreferences,
  desktopCapturer,
} from "electron";
import path from "path";

export const screenshotWindow = {
  enable: false,
  /**
   * @type BrowserWindow[]
   */
  current: [],
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
        preload: path.resolve(__dirname, "../preload/screenshot.js"),
      },
    });
    win.setAlwaysOnTop(true, "screen-saver");
    win.setFullScreenable(false);
    win.setVisibleOnAllWorkspaces(true);
    win.webContents.openDevTools();
    win.webContents.executeJavaScript(
      `window.init({ sourceId: "${source.id}", width: ${width}, height: ${height}, scaleFactor: ${scaleFactor} });`
    );
    win.loadFile(
      path.resolve(__dirname, "../../renderers/screenshot/index.html")
    );

    win.on("ready-to-show", () => {
      win.showInactive();
    });

    screenshotWindow.current[index] = win;
  });

  screenshotWindow.enable = true;

  globalShortcut.register("Esc", async () => {
    screenshotWindow.current.forEach((win) => {
      win.destroy();
    });
    screenshotWindow.current = [];
    screenshotWindow.enable = false;
    globalShortcut.unregister("Esc");
  });
};
