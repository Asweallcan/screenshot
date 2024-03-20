import { ipcMain } from "electron";

import { screenshot } from "../features/screenshot";

ipcMain.on("screenshot", () => {
  screenshot();
});
