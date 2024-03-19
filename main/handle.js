const { ipcMain } = require("electron");

const { screenshot } = require("../features/screenshot");

ipcMain.on("screenshot", () => {
  screenshot();
});
