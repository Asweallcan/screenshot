import { Rect, Ellipse, Group } from "react-konva";
import { RefObject } from "react";

import { DrawNode, DrawShape, DrawTool } from "../../../../types";

type Props<T extends DrawShape> = {
  drawTool: DrawTool<T>;
  positions: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
  mousePos: { x: number; y: number };
  drawingNode: DrawNode<T>;
  bgCanvasCtx: RefObject<CanvasRenderingContext2D>;
  setDrawingNodeProps: (props: DrawNode<T>["props"]) => void;
};

export const getDrawNode = <T extends DrawTool>(
  drawTool: T
): DrawNode<T["name"]> => {
  switch (drawTool.name) {
    case "rect":
      return { Node: Rect, props: {} };
    case "circle":
      return { Node: Ellipse, props: {} };
    case "mosaic":
      return { Node: Group, props: { childNodes: [] } };
  }
};

const drawRect = (props: Props<"rect">) => {
  const { drawTool, positions, setDrawingNodeProps } = props;
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

const drawCircle = (props: Props<"circle">) => {
  const { drawTool, positions, setDrawingNodeProps } = props;
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

const drawMosaic = (props: Props<"mosaic">) => {
  const { mousePos, positions, bgCanvasCtx, drawingNode, setDrawingNodeProps } =
    props;

  const { x1, y1 } = positions;
  const { scaleFactor } = window.screenInfo;
  const [r, g, b, a] = bgCanvasCtx.current.getImageData(
    mousePos.x * scaleFactor,
    mousePos.y * scaleFactor,
    1,
    1
  ).data;

  setDrawingNodeProps({
    childNodes: drawingNode.props.childNodes.concat({
      Node: Rect,
      props: {
        x: x1 - 5,
        y: y1 - 5,
        key: drawingNode.props.childNodes.length,
        width: 10,
        height: 10,
        blurRadius: 5,
        cornerRadius: 2,
        fill: `rgba(${r}, ${g}, ${b}, ${a})`,
      },
    }),
  });
};

export const draw = <T extends DrawShape>(props: Props<T>) => {
  const { drawTool } = props;

  if (drawTool.name === "rect") {
    drawRect(props as Props<"rect">);
  } else if (drawTool.name === "circle") {
    drawCircle(props as Props<"circle">);
  } else if (drawTool.name === "mosaic") {
    drawMosaic(props as Props<"mosaic">);
  }
};
