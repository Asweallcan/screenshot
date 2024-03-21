import { globalShortcut } from "electron";

import { screenshot } from "../features/screenshot";

globalShortcut.register("Shift+A", screenshot);
