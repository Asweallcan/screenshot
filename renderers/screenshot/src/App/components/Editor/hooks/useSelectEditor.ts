import { MutableRefObject, useEffect } from "react";

export const useSelectEditor = (props: {
  startPos: MutableRefObject<{
    x: number;
    y: number;
  }>;
  bgCanvasCtx: MutableRefObject<CanvasRenderingContext2D>;
  editorPosSize: { width: number; height: number; top: number; left: number };
  interactiveState: MutableRefObject<{
    move: boolean;
    select: boolean;
    forbidMove: boolean;
    forbidSelect: boolean;
  }>;
  editorCanvasCtx: MutableRefObject<CanvasRenderingContext2D>;
  setSizeInfo(sizeInfo: string): void;
  setEditorPosSize(posSize: {
    top: number;
    left: number;
    width: number;
    height: number;
  }): void;
  setEditorCanvasSize(size: { width: number; height: number }): void;
}) => {
  const {
    startPos,
    bgCanvasCtx,
    editorPosSize,
    editorCanvasCtx,
    interactiveState,
    setSizeInfo,
    setEditorPosSize,
    setEditorCanvasSize,
  } = props;

  useEffect(() => {
    if (!window.screenInfo) return;

    const { scaleFactor } = window.screenInfo;
    const { width, height, top, left } = editorPosSize;

    if (!width || !height) return;

    editorCanvasCtx.current.clearRect(
      0,
      0,
      width * scaleFactor,
      height * scaleFactor
    );
    editorCanvasCtx.current.putImageData(
      bgCanvasCtx.current.getImageData(
        left * scaleFactor,
        top * scaleFactor,
        width * scaleFactor,
        height * scaleFactor
      ),
      0,
      0
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
      setEditorCanvasSize({
        width: width * scaleFactor,
        height: height * scaleFactor,
      });
    });

    document.body.addEventListener("mouseup", () => {
      if (!interactiveState.current.select) return;

      interactiveState.current.select = false;
      interactiveState.current.forbidSelect = true;
    });
  }, []);
};
