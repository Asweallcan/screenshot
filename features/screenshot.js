const {
  screen,
  dialog,
  BrowserWindow,
  globalShortcut,
  systemPreferences,
  desktopCapturer,
} = require("electron");
const path = require("path");

exports.screenshotWindow = {
  enable: false,
  /**
   * @type BrowserWindow[]
   */
  current: [],
};

exports.screenshot = async () => {
  if (this.screenshotWindow.enable) return;
  if (systemPreferences.getMediaAccessStatus("screen") !== "granted") {
    dialog.showErrorBox("抱歉！", "请在设置里打开录屏权限");
    return;
  }

  const sources = await desktopCapturer.getSources({
    types: ["screen", "window"],
  });

  screen.getAllDisplays().map(async (display, index) => {
    const {
      id,
      bounds: { x, y, width, height },
      scaleFactor,
    } = display;

    const source = sources.find((source) => source.display_id == id);

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
      `init("${source.id}", ${width}, ${height}, ${scaleFactor})`
    );
    win.loadFile(path.resolve(__dirname, "../renderers/screenshot/index.html"));

    win.on("ready-to-show", () => {
      win.showInactive();
    });

    this.screenshotWindow.current[index] = win;
  });

  this.screenshotWindow.enable = true;

  globalShortcut.register("Esc", async () => {
    this.screenshotWindow.current.forEach((win) => {
      win.destroy();
    });
    this.screenshotWindow.current = [];
    this.screenshotWindow.enable = false;
    globalShortcut.unregister("Esc");
  });
};
