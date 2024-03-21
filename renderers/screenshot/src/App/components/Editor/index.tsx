import React, { useEffect, useRef, RefObject, useState, useMemo } from "react";

import { useSelectEditor } from "./hooks/useSelectEditor";
import { useMoveEditor } from "./hooks/useMoveEditor";
import { useRefState } from "../../../hooks";

import "./style.less";

export const Editor: React.FC<{
  bgCanvasCtx: RefObject<CanvasRenderingContext2D>;
  onStartSelect(): void;
}> = (props) => {
  const { bgCanvasCtx, onStartSelect } = props;

  const interactiveState = useRef({
    move: false,
    select: false,
    forbidMove: false,
    forbidSelect: false,
  });

  const editor = useRef<HTMLDivElement>(null);
  const editorCanvas = useRef<HTMLCanvasElement>(null);
  const editorCanvasCtx = useRef<CanvasRenderingContext2D>();

  const [sizeInfo, setSizeInfo] = useState("");
  const [editorPosSize, editorPosSizeRef, setEditorPosSize] = useRefState(
    {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    },
    true
  );
  const [editorOffset, editorOffsetRef, setEditorOffset] = useRefState({
    x: 0,
    y: 0,
  });
  const [editorCanvasSize, editorCanvasSizeRef, setEditorCanvasSize] =
    useRefState({
      width: 0,
      height: 0,
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

  const startPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    editorCanvasCtx.current = editorCanvas.current?.getContext("2d")!;
  }, []);

  useEffect(() => {
    if (editorPosSize.width > 0) {
      onStartSelect();
    }
  }, [editorPosSize.width]);

  useSelectEditor({
    startPos,
    bgCanvasCtx,
    editorPosSize,
    editorCanvasCtx,
    interactiveState,
    setSizeInfo,
    setEditorPosSize,
    setEditorCanvasSize,
  });

  useMoveEditor({
    editor,
    startPos,
    bgCanvasCtx,
    editorOffset,
    editorOffsetRef,
    editorPosSizeRef,
    editorCanvasCtx,
    interactiveState,
    editorCanvasSizeRef,
    setEditorOffset,
    setEditorPosSize,
  });

  return (
    <div ref={editor} style={editorStyle} className="editor">
      <div className="editor-size">{sizeInfo}</div>
      <canvas
        ref={editorCanvas}
        width={editorCanvasSize.width}
        height={editorCanvasSize.height}
        className="editor-canvas"
      />
    </div>
  );
};
