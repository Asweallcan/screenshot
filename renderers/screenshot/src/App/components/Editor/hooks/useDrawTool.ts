import React, { MutableRefObject, RefObject, useEffect, useRef } from "react";
import { DrawTool } from "../types";

const draw = (
  drawTool: DrawTool,
  positions: { x0: number; y0: number; x1: number; y1: number },
  editorCanvasCtx: RefObject<CanvasRenderingContext2D>
) => {
  const { x0, x1, y0, y1 } = positions;
  const {
    options: { color, width },
  } = drawTool;

  if (drawTool.name === "rect") {
    const top = Math.min(y0, y1);
    const left = Math.min(x0, x1);
    const width = Math.abs(x0 - x1);
    const height = Math.abs(y0 - y1);

    editorCanvasCtx.current.strokeStyle = color;
    editorCanvasCtx.current.lineWidth = width;
    editorCanvasCtx.current.strokeRect(top, left, width, height);
  }
};

export const useDrawTool = (props: {
  drawTool: RefObject<DrawTool>;
  editorCanvas: RefObject<HTMLCanvasElement>;
  editorCanvasCtx: RefObject<CanvasRenderingContext2D>;
}) => {
  const { drawTool, editorCanvas, editorCanvasCtx } = props;

  const drawing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    editorCanvas.current.addEventListener("mousedown", (e) => {
      if (drawing.current || !drawTool.current) return;
      drawing.current = true;

      startPos.current.x = e.pageX;
      startPos.current.y = e.pageY;
    });

    editorCanvas.current.addEventListener("mousemove", (e) => {
      if (!drawing.current) return;

      const { pageX, pageY } = e;

      draw(
        drawTool.current,
        {
          x0: startPos.current.x,
          y0: startPos.current.y,
          x1: pageX,
          y1: pageY,
        },
        editorCanvasCtx
      );
    });

    document.body.addEventListener("mouseup", () => {
      drawing.current = false;
    });
  }, []);
};
