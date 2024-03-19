const { ipcMain, clipboard } = require("electron");
const { exec } = require("child_process");

const { screenshot } = require("../features/screenshot");

ipcMain.on("screenshot", () => {
  screenshot();
});
