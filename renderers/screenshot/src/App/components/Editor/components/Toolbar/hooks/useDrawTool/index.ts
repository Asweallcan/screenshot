import {
  useRef,
  RefObject,
  useEffect,
  useCallback,
  MutableRefObject,
} from "react";

import { DrawNode, DrawTool } from "../../../../types";
import { draw, getDrawNode } from "./utils";

export const useDrawTool = <T extends DrawTool>(props: {
  drawTool: RefObject<T>;
  drewNodes: MutableRefObject<Array<DrawNode>>;
  editorCanvas: RefObject<HTMLDivElement>;
  editorPosSize: RefObject<{
    left: number;
    top: number;
  }>;
  bgCanvasCtx: RefObject<CanvasRenderingContext2D>;
  setDrewNodes(Nodes: Array<DrawNode>): void;
}) => {
  const {
    drawTool,
    drewNodes,
    bgCanvasCtx,
    editorCanvas,
    editorPosSize,
    setDrewNodes,
  } = props;

  const drawing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  const setDrawingNodeProps = useCallback(
    (props: DrawNode<T["name"]>["props"]) => {
      drewNodes.current[drewNodes.current.length - 1].props = props;
      setDrewNodes(drewNodes.current.concat());
    },
    []
  );

  useEffect(() => {
    editorCanvas.current.addEventListener("mousedown", (e) => {
      if (drawing.current || !drawTool.current) return;
      drawing.current = true;

      startPos.current.x = e.pageX;
      startPos.current.y = e.pageY;

      setDrewNodes(drewNodes.current.concat(getDrawNode(drawTool.current)));
    });

    editorCanvas.current.addEventListener("mousemove", (e) => {
      if (!drawing.current) return;

      const { pageX, pageY } = e;

      const { top, left } = editorPosSize.current;

      draw({
        drawTool: drawTool.current,
        mousePos: {
          x: pageX,
          y: pageY,
        },
        positions: {
          x0: startPos.current.x - left,
          y0: startPos.current.y - top,
          x1: pageX - left,
          y1: pageY - top,
        },
        drawingNode: drewNodes.current[drewNodes.current.length - 1],
        bgCanvasCtx,
        setDrawingNodeProps,
      });
    });

    editorCanvas.current.addEventListener("mouseup", () => {
      if (!drawing.current) return;
      drawing.current = false;
    });
  }, []);
};
