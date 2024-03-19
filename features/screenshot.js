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
   * @type BrowserWindow
   */
  current: null,
};

exports.screenshot = async () => {
  if (this.screenshotWindow.enable) return;

  if (systemPreferences.getMediaAccessStatus("screen") !== "granted") {
    dialog.showErrorBox("抱歉！", "请在设置里打开录屏权限");
    return;
  }

  const {
    id,
    bounds: { width, height, x, y },
    scaleFactor,
  } = screen.getPrimaryDisplay();

  const s = Date.now();

  const source = (
    await desktopCapturer.getSources({
      types: ["screen"],
      thumbnailSize: {
        width: width * scaleFactor,
        height: height * scaleFactor,
      },
    })
  ).find((source) => source.display_id == id);

  console.error(Date.now() - s);

  this.screenshotWindow.current = new BrowserWindow({
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
  this.screenshotWindow.current.setAlwaysOnTop(true, "screen-saver");
  this.screenshotWindow.current.setFullScreenable(false);
  this.screenshotWindow.current.setVisibleOnAllWorkspaces(true);
  this.screenshotWindow.current.loadFile(
    path.resolve(__dirname, "../renderers/screenshot.html")
  );

  this.screenshotWindow.current.on("ready-to-show", () => {
    this.screenshotWindow.enable = true;
    this.screenshotWindow.current.showInactive();
  });

  this.screenshotWindow.current.webContents.executeJavaScript(
    `init("${source.thumbnail.toDataURL()}")`
  );

  globalShortcut.register("Esc", async () => {
    this.screenshotWindow.current.destroy();
    this.screenshotWindow.current = null;
    this.screenshotWindow.enable = false;
    globalShortcut.unregister("Esc");
  });
};
