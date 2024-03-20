import { globalShortcut } from "electron";

import { screenshot } from "../features/screenshot";

globalShortcut.register("Command+A", screenshot);
