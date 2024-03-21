import Konva from "konva";
import { RefObject, MutableRefObject, useEffect } from "react";

export const useSelectEditor = (props: {
  stage: RefObject<Konva.Stage>;
  bgLayer: RefObject<Konva.Layer>;
  startPos: MutableRefObject<{
    x: number;
    y: number;
  }>;
  bgCanvas: RefObject<HTMLCanvasElement>;
  editorPosSize: { width: number; height: number; top: number; left: number };
  interactiveState: MutableRefObject<{
    move: boolean;
    select: boolean;
    forbidMove: boolean;
    forbidSelect: boolean;
  }>;
  setSizeInfo(sizeInfo: string): void;
  setEditorPosSize(posSize: {
    top: number;
    left: number;
    width: number;
    height: number;
  }): void;
}) => {
  const {
    stage,
    bgLayer,
    startPos,
    bgCanvas,
    editorPosSize,
    interactiveState,
    setSizeInfo,
    setEditorPosSize,
  } = props;

  useEffect(() => {
    if (!window.screenInfo) return;

    const { top, left, width, height } = editorPosSize;

    if (!width || !height) return;

    const { scaleFactor } = window.screenInfo;

    stage.current.width(width);
    stage.current.height(height);

    bgLayer.current.clear();
    bgLayer.current.add(
      new Konva.Image({
        image: bgCanvas.current,
        scale: {
          x: 1 / scaleFactor,
          y: 1 / scaleFactor,
        },
      })
    );
  }, [editorPosSize]);

  useEffect(() => {
    document.body.addEventListener("mousedown", (e) => {
      if (
        interactiveState.current.select ||
        interactiveState.current.forbidSelect
      ) {
        return;
      }

      window.bridge.disableScreenshot();

      interactiveState.current.select = true;

      startPos.current.x = e.pageX;
      startPos.current.y = e.pageY;
    });

    document.body.addEventListener("mousemove", (e) => {
      if (!interactiveState.current.select) return;

      const { x, y } = startPos.current;
      const { pageX, pageY } = e;
      const { scaleFactor } = window.screenInfo;

      const left = Math.min(x, pageX);
      const top = Math.min(y, pageY);
      const width = Math.abs(x - pageX);
      const height = Math.abs(y - pageY);

      setSizeInfo(`${width}x${height}`);
      setEditorPosSize({
        top,
        left,
        width,
        height,
      });
    });

    document.body.addEventListener("mouseup", () => {
      if (!interactiveState.current.select) return;

      interactiveState.current.select = false;
      interactiveState.current.forbidSelect = true;
    });
  }, []);
};
