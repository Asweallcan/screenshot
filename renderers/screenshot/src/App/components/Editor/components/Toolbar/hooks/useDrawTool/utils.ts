import Konva from "konva";

import { DrawTool, DrawTools } from "../../../../types";

export const getDrawItem = <T extends DrawTool>(
  drawTool: T
): DrawTools[T["name"]]["item"] => {
  switch (drawTool.name) {
    case "rect":
      return new Konva.Rect();
    case "circle":
      return new Konva.Ellipse();
  }
};

export const drawRect = <T extends DrawTool>(
  drawTool: T,
  positions: { x0: number; y0: number; x1: number; y1: number },
  drawingItem: DrawTools[T["name"]]["item"]
) => {
  const { x0, x1, y0, y1 } = positions;

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
};

export const drawCircle = <T extends DrawTool>(
  drawTool: T,
  positions: { x0: number; y0: number; x1: number; y1: number },
  drawingItem: DrawTools[T["name"]]["item"]
) => {
  const { x0, x1, y0, y1 } = positions;

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
  (drawingItem as Konva.Ellipse).radius({
    x: width / 2,
    y: height / 2,
  });
  drawingItem.stroke(color);
  drawingItem.strokeWidth(strokeWidth);
  drawingItem.strokeWidth(strokeWidth);
};
