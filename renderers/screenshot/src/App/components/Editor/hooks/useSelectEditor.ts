import Konva from "konva";
import { RefObject, MutableRefObject, useEffect } from "react";

export const useSelectEditor = (props: {
  stage: RefObject<Konva.Stage>;
  bgImage: RefObject<Konva.Image>;
  startPos: MutableRefObject<{
    x: number;
    y: number;
  }>;
  editorPosSize: MutableRefObject<{
    left: number;
    top: number;
    width: number;
    height: number;
  }>;
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
    bgImage,
    startPos,
    editorPosSize,
    interactiveState,
    setSizeInfo,
    setEditorPosSize,
  } = props;

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

      const { width: screenWidth, height: screenHeight } = window.screenInfo;
      const { x, y } = startPos.current;
      const { pageX, pageY } = e;

      const nextLeft = Math.min(x, pageX);
      const nextTop = Math.min(y, pageY);
      const nextWidth = Math.abs(x - pageX);
      const nextHeight = Math.abs(y - pageY);

      const leftValid = nextLeft >= 0;
      const widthValid = nextLeft + nextWidth <= screenWidth;
      const topValid = nextTop >= 0;
      const heightValid = nextTop + nextHeight <= screenHeight;

      const left = leftValid ? nextLeft : editorPosSize.current.left;
      const top = topValid ? nextTop : editorPosSize.current.top;
      const width = widthValid ? nextWidth : editorPosSize.current.width;
      const height = heightValid ? nextHeight : editorPosSize.current.height;

      setSizeInfo(`${width}x${height}`);
      setEditorPosSize({
        top,
        left,
        width,
        height,
      });

      if (!width || !height) return;

      const { scaleFactor } = window.screenInfo;

      stage.current.setSize({
        width,
        height,
      });
      bgImage.current.offset({
        x: left * scaleFactor,
        y: top * scaleFactor,
      });
    });

    document.body.addEventListener("mouseup", () => {
      if (!interactiveState.current.select) return;

      interactiveState.current.select = false;
      interactiveState.current.forbidSelect = true;
    });
  }, []);
};
