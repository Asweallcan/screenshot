import { app } from "electron";

import { createWindow } from "./main";

app.whenReady().then(() => {
  require("./handle");
  require("./shotcut");

  createWindow();
});
