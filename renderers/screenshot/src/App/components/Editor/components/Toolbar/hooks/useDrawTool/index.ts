import { MutableRefObject, RefObject, useEffect, useRef } from "react";
import Konva from "konva";

import { DrawTool, DrawTools } from "../../../../types";
import { getDrawItem, drawCircle, drawRect } from "./utils";

const draw = <T extends DrawTool>(
  drawTool: T,
  positions: { x0: number; y0: number; x1: number; y1: number },
  drawingItem: DrawTools[T["name"]]["item"]
) => {
  if (drawTool.name === "rect") {
    drawRect(drawTool, positions, drawingItem);
  } else if (drawTool.name === "circle") {
    drawCircle(drawTool, positions, drawingItem);
  }
};

export const useDrawTool = <T extends DrawTool>(props: {
  editor: RefObject<HTMLDivElement>;
  drawTool: RefObject<T>;
  drawLayer: RefObject<Konva.Layer>;
  operations: MutableRefObject<Konva.Shape[]>;
  editorPosSize: RefObject<{
    left: number;
    top: number;
  }>;
}) => {
  const { editor, drawTool, drawLayer, operations, editorPosSize } = props;

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

    const onDone = () => {
      if (!drawing.current) return;
      drawing.current = false;

      operations.current.push(drawingItem.current);
      drawingItem.current = null;
    };

    editor.current.addEventListener("mouseup", onDone);
    editor.current.addEventListener("mouseout", onDone);
  }, []);
};
