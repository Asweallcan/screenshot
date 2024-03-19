const { globalShortcut } = require("electron");

const { screenshot } = require("../features/screenshot");

globalShortcut.register("Command+A", screenshot);
