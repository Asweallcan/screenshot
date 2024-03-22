import { app, BrowserWindow } from "electron";

import { createWindow } from "./main";

app.whenReady().then(() => {
  require("./handle");
  require("./shotcut");

  createWindow();
});

app.on("window-all-closed", () => {});

app.on("activate", () => {
  BrowserWindow.getAllWindows().forEach((w) => w.show());
});
