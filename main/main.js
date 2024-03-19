const { BrowserWindow } = require("electron");
const path = require("path");

exports.mainWindow = {
  /**
   * @type BrowserWindow
   */
  current: null,
};

exports.createWindow = () => {
  this.mainWindow.current = new BrowserWindow({
    webPreferences: {
      preload: path.resolve(__dirname, "../preload/index.js"),
    },
  });

  this.mainWindow.current.loadFile(
    path.resolve(__dirname, "../renderers/index.html")
  );
};
