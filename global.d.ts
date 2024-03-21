interface Handler {
  initScreenshot?(screenInfo: {
    sourceId: string;
    width: number;
    height: number;
    scaleFactor: number;
  }): void;
  disableScreenshot?(): void;
}

interface Bridge {
  registerHandler<T extends keyof Handler>(name: T, callback: Handler[T]);
  screenshot(): void;
  exitScreenshot(): void;
  disableScreenshot(): void;
}

interface Window {
  handler: Handler;
  bridge: Bridge;
}
