const { app } = require("electron");

const { createWindow } = require("./main");

app.whenReady().then(() => {
  require("./handle");
  require("./shotcut");

  createWindow();
});
