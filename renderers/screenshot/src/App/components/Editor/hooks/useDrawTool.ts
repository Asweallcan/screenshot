import { RefObject, useEffect, useRef, useState } from "react";
import Konva from "konva";

import { DrawTool, DrawTools } from "../types";
import { useRefState } from "../../../../hooks";

const getDrawItem = <T extends DrawTool>(
  drawTool: T
): DrawTools[T["name"]]["item"] => {
  switch (drawTool.name) {
    case "rect":
      return new Konva.Rect();
    case "circle":
      return new Konva.Ellipse();
  }
};

const draw = <T extends DrawTool>(
  drawTool: T,
  positions: { x0: number; y0: number; x1: number; y1: number },
  drawingItem: DrawTools[T["name"]]["item"]
) => {
  const { x0, x1, y0, y1 } = positions;

  if (drawTool.name === "rect") {
    const {
      options: { color, strokeWidth },
    } = drawTool;

    const top = Math.min(y0, y1);
    const left = Math.min(x0, x1);
    const width = Math.abs(x0 - x1);
    const height = Math.abs(y0 - y1);

    drawingItem.setPosition({
      x: left,
      y: top,
    });
    drawingItem.setSize({
      width,
      height,
    });
    drawingItem.stroke(color);
    drawingItem.strokeWidth(strokeWidth);
  } else if (drawTool.name === "circle") {
    const {
      options: { color, strokeWidth },
    } = drawTool;

    const top = Math.min(y0, y1);
    const left = Math.min(x0, x1);
    const width = Math.abs(x0 - x1);
    const height = Math.abs(y0 - y1);

    drawingItem.setPosition({
      x: left + width / 2,
      y: top + height / 2,
    });
    drawingItem.radius({
      x: width / 2,
      y: height / 2,
    });
    drawingItem.stroke(color);
    drawingItem.strokeWidth(strokeWidth);
  }
};

export const useDrawTool = <T extends DrawTool>(props: {
  editor: RefObject<HTMLDivElement>;
  drawTool: RefObject<T>;
  drawLayer: RefObject<Konva.Layer>;
  editorPosSize: RefObject<{
    left: number;
    top: number;
  }>;
}) => {
  const { editor, drawTool, drawLayer, editorPosSize } = props;

  const [operations, operationsRef, setOperations] = useRefState<
    Array<DrawTools[T["name"]]["item"]>
  >([]);

  const drawing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const drawingItem = useRef<DrawTools[T["name"]]["item"]>();

  useEffect(() => {
    editor.current.addEventListener("mousedown", (e) => {
      if (drawing.current || !drawTool.current) return;
      drawing.current = true;

      startPos.current.x = e.pageX;
      startPos.current.y = e.pageY;

      drawingItem.current = getDrawItem(drawTool.current);
      drawLayer.current.add(drawingItem.current);
    });

    editor.current.addEventListener("mousemove", (e) => {
      if (!drawing.current) return;

      const { pageX, pageY } = e;

      const { top, left } = editorPosSize.current;

      draw(
        drawTool.current,
        {
          x0: startPos.current.x - left,
          y0: startPos.current.y - top,
          x1: pageX - left,
          y1: pageY - top,
        },
        drawingItem.current
      );
    });

    document.body.addEventListener("mouseup", () => {
      drawing.current = false;

      setOperations(operationsRef.current.concat(drawingItem.current));
      drawingItem.current = null;
    });
  }, []);
};
