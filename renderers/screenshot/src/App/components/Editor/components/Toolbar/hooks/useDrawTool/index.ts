import {
  MutableRefObject,
  RefObject,
  useCallback,
  useEffect,
  useRef,
} from "react";

import { DrawNode, DrawTool } from "../../../../types";
import { getDrawNode, drawCircle, drawRect } from "./utils";

const draw = <T extends DrawTool>(
  drawTool: T,
  positions: { x0: number; y0: number; x1: number; y1: number },
  setDrawingNodeProps: (props: DrawNode<T["name"]>["props"]) => void
) => {
  if (drawTool.name === "rect") {
    drawRect(drawTool, positions, setDrawingNodeProps);
  } else if (drawTool.name === "circle") {
    drawCircle(drawTool, positions, setDrawingNodeProps);
  }
};

export const useDrawTool = <T extends DrawTool>(props: {
  editor: RefObject<HTMLDivElement>;
  drawTool: RefObject<T>;
  drewNodes: MutableRefObject<Array<DrawNode>>;
  editorPosSize: RefObject<{
    left: number;
    top: number;
  }>;
  setDrewNodes(Nodes: Array<DrawNode>): void;
}) => {
  const { editor, drawTool, drewNodes, editorPosSize, setDrewNodes } = props;

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
    editor.current.addEventListener("mousedown", (e) => {
      if (drawing.current || !drawTool.current) return;
      drawing.current = true;

      startPos.current.x = e.pageX;
      startPos.current.y = e.pageY;

      setDrewNodes(drewNodes.current.concat(getDrawNode(drawTool.current)));
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
        setDrawingNodeProps
      );
    });

    const onDone = () => {
      if (!drawing.current) return;
      drawing.current = false;
    };

    editor.current.addEventListener("mouseup", onDone);
    editor.current.addEventListener("mouseout", onDone);
  }, []);
};
