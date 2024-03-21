import { BrowserWindow } from "electron";

export const executeJavaScript = <T extends keyof Handler>(
  win: BrowserWindow,
  name: T,
  ...args: Parameters<Handler[T]>
): ReturnType<Handler[T]> => {
  const res = win.webContents.executeJavaScript(
    `window.handler.${name}(...${JSON.stringify(args)})`
  );

  return res as ReturnType<Handler[T]>;
};
