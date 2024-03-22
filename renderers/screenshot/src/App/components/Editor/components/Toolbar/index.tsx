import React, { useRef, MutableRefObject, RefObject } from "react";
import Konva from "konva";

import { DrawTool, DrawTools } from "../../types";
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
];

export const Toolbar: React.FC<{
  stage: RefObject<Konva.Stage>;
  editor: RefObject<HTMLDivElement>;
  drawLayer: RefObject<Konva.Layer>;
  editorPosSize: RefObject<{ top: number; left: number }>;
  interactiveState: MutableRefObject<{
    forbidMove: boolean;
    forbidResize: boolean;
  }>;
}> = (props) => {
  const { stage, editor, drawLayer, editorPosSize, interactiveState } = props;

  const operations = useRef<Array<Konva.Shape>>([]);
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

  const onUseTool = (name: keyof DrawTools) => {
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
          const lastItem = operations.current.pop();
          lastItem?.destroy();
        }
      });
    }
  };

  useDrawTool({
    editor,
    drawTool: drawToolRef,
    drawLayer,
    operations,
    editorPosSize,
  });

  return (
    <div className="editor-toolbar">
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
