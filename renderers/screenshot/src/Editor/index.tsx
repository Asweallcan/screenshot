import React, { useEffect, useRef, RefObject } from "react";

import { useSelectEditor } from "./hooks/useSelectEditor";
import { useMoveEditor } from "./hooks/useMoveEditor";

import "./style.less";

export const Editor: React.FC<{
  bgCanvasCtx: RefObject<CanvasRenderingContext2D>;
}> = (props) => {
  const { bgCanvasCtx } = props;

  const interactiveState = useRef({
    move: false,
    select: false,
    forbidMove: false,
    forbidSelect: false,
  });

  const size = useRef<HTMLDivElement>(null);
  const editor = useRef<HTMLDivElement>(null);
  const editorCanvas = useRef<HTMLCanvasElement>(null);
  const editorCanvasCtx = useRef<CanvasRenderingContext2D>();
  const offset = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    editorCanvasCtx.current = editorCanvas.current?.getContext("2d")!;
  }, []);

  useSelectEditor({
    size,
    editor,
    startPos,
    bgCanvasCtx,
    editorCanvas,
    editorCanvasCtx,
    interactiveState,
  });

  useMoveEditor({
    editor,
    offset,
    startPos,
    bgCanvasCtx,
    editorCanvasCtx,
    interactiveState,
  });

  return (
    <div ref={editor} className="editor">
      <div ref={size} className="editor-size"></div>
      <canvas ref={editorCanvas} className="editor-canvas" />
    </div>
  );
};
