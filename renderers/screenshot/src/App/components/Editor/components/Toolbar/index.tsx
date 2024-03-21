import React, { RefObject } from "react";

import { DrawTool } from "../../types";

import "./style.less";

export const Toolbar: React.FC<{
  drawTool: DrawTool;
  editorCanvas: RefObject<HTMLCanvasElement>;
  editorCanvasCtx: RefObject<CanvasRenderingContext2D>;
  setDrawTool(drawTool: DrawTool): void;
}> = (props) => {
  const { drawTool, editorCanvas, setDrawTool } = props;

  const onSave = () => {
    editorCanvas.current.toBlob(async (blob) => {
      const data = [new ClipboardItem({ "image/png": blob })];

      await navigator.clipboard.write(data);
      window.bridge.exitScreenshot();
    });
  };

  const onUseRect = () => {
    setDrawTool({
      name: "rect",
      options: {
        width: 2,
        color: "#f00",
      },
    });
  };

  return (
    <div className="editor-toolbar">
      <div
        className={`editor-toolbar-item ${
          drawTool?.name === "rect" ? "active" : ""
        }`}
        onClick={onUseRect}
      >
        矩形
      </div>
      <div className="editor-toolbar-item" onClick={onSave}>
        保存
      </div>
    </div>
  );
};
