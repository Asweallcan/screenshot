import React, { RefObject } from "react";

import "./style.less";

export const Toolbar: React.FC<{
  editorCanvas: RefObject<HTMLCanvasElement>;
  editorCanvasCtx: RefObject<CanvasRenderingContext2D>;
}> = (props) => {
  const { editorCanvas } = props;

  const onSave = () => {
    editorCanvas.current.toBlob(async (blob) => {
      const data = [new ClipboardItem({ "image/png": blob })];

      await navigator.clipboard.write(data);
      window.bridge.exitScreenshot();
    });
  };

  return (
    <div className="editor-toolbar">
      <div className="editor-toolbar-item" onClick={onSave}>
        保存
      </div>
    </div>
  );
};
