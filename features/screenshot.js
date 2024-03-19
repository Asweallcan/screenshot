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
  /**
   * @type BrowserWindow
   */
  current: null,
};

exports.screenshot = async () => {
  if (this.screenshotWindow.current) return;

  if (systemPreferences.getMediaAccessStatus("screen") !== "granted") {
    dialog.showErrorBox("抱歉！", "请在设置里打开录屏权限");
    return;
  }

  const {
    id,
    bounds: { width, height, x, y },
    scaleFactor,
  } = screen.getPrimaryDisplay();

  const source = (
    await desktopCapturer.getSources({
      types: ["screen"],
      thumbnailSize: {
        width: width * scaleFactor,
        height: height * scaleFactor,
      },
    })
  ).find((source) => source.display_id == id);

  this.screenshotWindow.current = new BrowserWindow({
    x,
    y,
    frame: false,
    width,
    height,
    movable: false,
    closable: false,
    resizable: false,
    focusable: false,
    hasShadow: false,
    alwaysOnTop: true,
    transparent: true,
    roundedCorners: false,
    enableLargerThanScreen: true,
    webPreferences: {
      preload: path.resolve(__dirname, "../preload/screenshot.js"),
    },
  });

  BrowserWindow.getAllWindows().forEach((window) => {
    if (!window.isFocused()) {
      window.blur();
      window.setFocusable(false);
    }
  });

  this.screenshotWindow.current.setAlwaysOnTop(true, "screen-saver");
  this.screenshotWindow.current.setFullScreenable(false);
  this.screenshotWindow.current.setVisibleOnAllWorkspaces(true);
  this.screenshotWindow.current.loadFile(
    path.resolve(__dirname, "../renderers/screenshot.html")
  );
  this.screenshotWindow.current.webContents.executeJavaScript(
    `init("${source.thumbnail.toDataURL()}")`
  );

  globalShortcut.register("Esc", () => {
    this.screenshotWindow.current.destroy();
    this.screenshotWindow.current = null;
    globalShortcut.unregister("Esc");
    BrowserWindow.getAllWindows().forEach((window) => {
      window.setFocusable(true);
    });
  });
};
