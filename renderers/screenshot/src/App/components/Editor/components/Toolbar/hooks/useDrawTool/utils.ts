import Konva from "konva";
import { Rect, Ellipse } from "react-konva";

import { DrawNode, DrawTool } from "../../../../types";

export const getDrawNode = <T extends DrawTool>(
  drawTool: T
): DrawNode<T["name"]> => {
  switch (drawTool.name) {
    case "rect":
      return { Node: Rect, props: {} };
    case "circle":
      return { Node: Ellipse, props: {} };
  }
};

export const drawRect = <T extends DrawTool = DrawTool<"rect">>(
  drawTool: T,
  positions: { x0: number; y0: number; x1: number; y1: number },
  setDrawingNodeProps: (props: DrawNode<T["name"]>["props"]) => void
) => {
  const { x0, x1, y0, y1 } = positions;

  const {
    options: { color, strokeWidth },
  } = drawTool;

  const top = Math.min(y0, y1);
  const left = Math.min(x0, x1);
  const width = Math.abs(x0 - x1);
  const height = Math.abs(y0 - y1);

  setDrawingNodeProps({
    position: {
      x: left,
      y: top,
    },
    size: {
      width,
      height,
    },
    stroke: color,
    strokeWidth,
  });
};

export const drawCircle = <T extends DrawTool = DrawTool<"circle">>(
  drawTool: T,
  positions: { x0: number; y0: number; x1: number; y1: number },
  setDrawingNodeProps: (props: DrawNode<T["name"]>["props"]) => void
) => {
  const { x0, x1, y0, y1 } = positions;

  const {
    options: { color, strokeWidth },
  } = drawTool;

  const top = Math.min(y0, y1);
  const left = Math.min(x0, x1);
  const width = Math.abs(x0 - x1);
  const height = Math.abs(y0 - y1);

  setDrawingNodeProps({
    position: {
      x: left + width / 2,
      y: top + height / 2,
    },
    radiusX: width / 2,
    radiusY: height / 2,
    stroke: color,
    strokeWidth,
  });
};
