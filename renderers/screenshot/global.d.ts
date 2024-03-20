interface Window {
  screenInfo: {
    sourceId: string;
    width: number;
    height: number;
    scaleFactor: number;
  };
  init(screenInfo: Window["screenInfo"]): void;
}
