import { Rect, Ellipse, Image as KonvaImage, Group } from "react-konva";
import Konva from "konva";

import { DrawNode, DrawTool } from "../../../../types";

export const getDrawNode = <T extends DrawTool>(
  drawTool: T
): DrawNode<T["name"]> => {
  switch (drawTool.name) {
    case "rect":
      return { Node: Rect, props: {} };
    case "circle":
      return { Node: Ellipse, props: {} };
    case "mosaic":
      return { Node: Group, props: { children: [] } };
  }
};

export const drawRect = (
  drawTool: DrawTool<"rect">,
  positions: { x0: number; y0: number; x1: number; y1: number },
  setDrawingNodeProps: (props: DrawNode<"rect">["props"]) => void
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

export const drawCircle = (
  drawTool: DrawTool<"circle">,
  positions: { x0: number; y0: number; x1: number; y1: number },
  setDrawingNodeProps: (props: DrawNode<"circle">["props"]) => void
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

export const drawMosaic = (
  drawTool: DrawTool<"mosaic">,
  positions: { x0: number; y0: number; x1: number; y1: number },
  drawingNode: DrawNode<"mosaic">,
  setDrawingNodeProps: (props: DrawNode<"mosaic">["props"]) => void
) => {
  const { x1, y1 } = positions;

  const imageObj = new Image();
  const konvaImage = KonvaImage({
    image: imageObj,
    filters: [Konva.Filters.Pixelate],
    pixelSize: 10,
    x: x1,
    y: y1,
  });

  setDrawingNodeProps({
    children: drawingNode.props.children.concat(konvaImage),
  });
};
