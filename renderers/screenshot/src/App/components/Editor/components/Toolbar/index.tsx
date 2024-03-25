import React, {
  useRef,
  MutableRefObject,
  RefObject,
  CSSProperties,
} from "react";
import Konva from "konva";

import { DrawNode, DrawShape, DrawTool } from "../../types";
import { useRefState } from "../../../../../hooks";
import { useDrawTool } from "./hooks/useDrawTool";

import "./style.less";

const TOOLS: (DrawTool & { label: string })[] = [
  {
    name: "rect",
    label: "矩形",
    options: {
      color: "#F00",
      strokeWidth: 2,
    },
  },
  {
    name: "circle",
    label: "圆圈",
    options: {
      color: "#F00",
      strokeWidth: 2,
    },
  },
  {
    name: "mosaic",
    label: "马赛克",
    options: {},
  },
];

export const Toolbar: React.FC<{
  style: CSSProperties;
  stage: RefObject<Konva.Stage>;
  drewNodes: MutableRefObject<Array<DrawNode>>;
  bgCanvasCtx: RefObject<CanvasRenderingContext2D>;
  editorCanvas: RefObject<HTMLDivElement>;
  editorPosSize: RefObject<{ top: number; left: number }>;
  interactiveState: MutableRefObject<{
    forbidMove: boolean;
    forbidResize: boolean;
  }>;
  setDrewNodes(Nodes: Array<DrawNode>): void;
}> = (props) => {
  const {
    style,
    stage,
    drewNodes,
    bgCanvasCtx,
    editorCanvas,
    editorPosSize,
    interactiveState,
    setDrewNodes,
  } = props;

  const addedKeydown = useRef(false);
  const [drawTool, drawToolRef, setDrawTool] = useRefState<DrawTool | null>(
    null
  );

  const onSave = () => {
    stage.current.toBlob({
      async callback(blob) {
        const data = [new ClipboardItem({ "image/png": blob })];

        await navigator.clipboard.write(data);
        window.bridge.exitScreenshot();
      },
    });
  };

  const onUseTool = (name: DrawShape) => {
    interactiveState.current.forbidMove = true;
    interactiveState.current.forbidResize = true;
    setDrawTool({
      name,
      options: TOOLS.find((t) => t.name === name).options,
    });
    if (!addedKeydown.current) {
      addedKeydown.current = true;
      window.addEventListener("keydown", (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "z") {
          drewNodes.current.pop();
          setDrewNodes(drewNodes.current.concat());
        }
      });
    }
  };

  useDrawTool({
    drawTool: drawToolRef,
    drewNodes,
    bgCanvasCtx,
    editorCanvas,
    editorPosSize,
    setDrewNodes,
  });

  return (
    <div style={style} className="editor-toolbar">
      {TOOLS.map((tool) => {
        return (
          <div
            key={tool.name}
            className={`editor-toolbar-item ${
              drawTool?.name === tool.name ? "active" : ""
            }`}
            onClick={() => onUseTool(tool.name)}
          >
            {tool.label}
          </div>
        );
      })}
      <div className="editor-toolbar-item" onClick={onSave}>
        保存
      </div>
    </div>
  );
};
