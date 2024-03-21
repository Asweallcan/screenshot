import { CSSProperties, MutableRefObject, useEffect } from "react";

export const useSelectEditor = (props: {
  startPos: MutableRefObject<{
    x: number;
    y: number;
  }>;
  size: MutableRefObject<HTMLDivElement>;
  editor: MutableRefObject<HTMLDivElement>;
  bgCanvasCtx: MutableRefObject<CanvasRenderingContext2D>;
  editorCanvas: MutableRefObject<HTMLCanvasElement>;
  interactiveState: MutableRefObject<{
    move: boolean;
    select: boolean;
    forbidMove: boolean;
    forbidSelect: boolean;
  }>;
  editorCanvasCtx: MutableRefObject<CanvasRenderingContext2D>;
}) => {
  const {
    size,
    editor,
    startPos,
    bgCanvasCtx,
    editorCanvas,
    editorCanvasCtx,
    interactiveState,
  } = props;

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

      size.current.textContent = `${width}x${height}`;
      editor.current.style.cssText = `top: ${top}px; left: ${left}px; width: ${width}px; height: ${height}px; display: block;`;
      editorCanvas.current.width = width * scaleFactor;
      editorCanvas.current.height = height * scaleFactor;

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
    });

    document.body.addEventListener("mouseup", () => {
      if (!interactiveState.current.select) return;

      interactiveState.current.select = false;
      interactiveState.current.forbidSelect = true;
    });
  }, []);
};
