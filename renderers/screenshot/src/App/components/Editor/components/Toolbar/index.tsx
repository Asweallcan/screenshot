import React, { RefObject } from "react";
import Konva from "konva";

import { DrawTool } from "../../types";

import "./style.less";

export const Toolbar: React.FC<{
  stage: RefObject<Konva.Stage>;
  drawTool: DrawTool;
  setDrawTool(drawTool: DrawTool): void;
}> = (props) => {
  const { stage, drawTool, setDrawTool } = props;

  const onSave = () => {
    stage.current.toBlob({
      async callback(blob) {
        const data = [new ClipboardItem({ "image/png": blob })];

        await navigator.clipboard.write(data);
        window.bridge.exitScreenshot();
      },
    });
  };

  const onUseRect = () => {
    setDrawTool({
      name: "rect",
      options: {
        color: "#f00",
        strokeWidth: 2,
      },
    });
  };

  const onUseCircle = () => {
    setDrawTool({
      name: "circle",
      options: {
        color: "#f00",
        strokeWidth: 2,
      },
    });
  };

  return (
    <div className="editor-toolbar">
      <div
        className={`editor-toolbar-item ${
          drawTool?.name === "circle" ? "active" : ""
        }`}
        onClick={onUseCircle}
      >
        圆圈
      </div>
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
