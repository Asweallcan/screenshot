import React, { useEffect, useRef, RefObject, useState, useMemo } from "react";
import { Stage, Layer, Image } from "react-konva";

import { useSelectEditor } from "./hooks/useSelectEditor";
import { useMoveEditor } from "./hooks/useMoveEditor";
import { useRefState } from "../../../hooks";
import { Toolbar } from "./components/Toolbar";

import "./style.less";

export const Editor: React.FC<{
  bgCanvas: RefObject<HTMLCanvasElement>;
  onStartSelect(): void;
}> = (props) => {
  const { scaleFactor } = window.screenInfo;

  const { bgCanvas, onStartSelect } = props;

  const interactiveState = useRef({
    move: false,
    select: false,
    resize: false,
    forbidMove: false,
    forbidSelect: false,
    forbidResize: false,
  });

  const editor = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const [sizeInfo, setSizeInfo] = useState("");
  const [editorPosSize, editorPosSizeRef, setEditorPosSize] = useRefState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const [editorOffset, editorOffsetRef, setEditorOffset] = useRefState({
    x: 0,
    y: 0,
  });

  const editorStyle = useMemo(() => {
    return {
      ...editorPosSize,
      transform:
        editorOffset.x || editorOffset.y
          ? `translate(${editorOffset.x}px, ${editorOffset.y}px)`
          : "unset",
    };
  }, [editorPosSize, editorOffset]);

  useEffect(() => {
    window.bridge.registerHandler("disableScreenshot", () => {
      interactiveState.current.forbidSelect = true;
    });
  }, []);

  useEffect(() => {
    if (editorPosSize.width > 0) {
      onStartSelect();
    }
  }, [editorPosSize.width]);

  useSelectEditor({
    startPos,
    editorPosSize: editorPosSizeRef,
    interactiveState,
    setSizeInfo,
    setEditorPosSize,
  });

  useMoveEditor({
    editor,
    startPos,
    editorOffset: editorOffsetRef,
    editorPosSize: editorPosSizeRef,
    interactiveState,
    setEditorOffset,
    setEditorPosSize,
  });

  return (
    <div ref={editor} style={editorStyle} className="editor">
      <div className="editor-size">{sizeInfo}</div>
      <Stage width={editorPosSize.width} height={editorPosSize.height}>
        <Layer>
          <Image
            image={bgCanvas.current}
            scaleX={1 / scaleFactor}
            scaleY={1 / scaleFactor}
            offsetY={(editorPosSize.top + editorOffset.y) * scaleFactor}
            offsetX={(editorPosSize.left + editorOffset.x) * scaleFactor}
          />
        </Layer>
      </Stage>
      <Toolbar
        editor={editor}
        editorPosSize={editorPosSizeRef}
        interactiveState={interactiveState}
      />
    </div>
  );
};
