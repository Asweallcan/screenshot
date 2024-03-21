import { MutableRefObject, useEffect, CSSProperties, Ref } from "react";

export const useMoveEditor = (props: {
  editor: MutableRefObject<HTMLDivElement>;
  startPos: MutableRefObject<{
    x: number;
    y: number;
  }>;
  bgCanvasCtx: MutableRefObject<CanvasRenderingContext2D>;
  editorOffset: { x: number; y: number };
  editorOffsetRef: MutableRefObject<{ x: number; y: number }>;
  editorPosSizeRef: MutableRefObject<{
    left: number;
    top: number;
    width: number;
    height: number;
  }>;
  editorCanvasCtx: MutableRefObject<CanvasRenderingContext2D>;
  interactiveState: MutableRefObject<{
    move: boolean;
    select: boolean;
    forbidMove: boolean;
    forbidSelect: boolean;
  }>;
  editorCanvasSizeRef: MutableRefObject<{ width: number; height: number }>;
  setEditorOffset(offset: { x: number; y: number }): void;
  setEditorPosSize(posSize: {
    top: number;
    left: number;
    width: number;
    height: number;
  }): void;
}) => {
  const {
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
  } = props;

  useEffect(() => {
    if (!window.screenInfo) return;

    const { x, y } = editorOffset;
    const { scaleFactor } = window.screenInfo;

    editorCanvasCtx.current.clearRect(
      0,
      0,
      editorCanvasSizeRef.current.width,
      editorCanvasSizeRef.current.height
    );
    editorCanvasCtx.current.putImageData(
      bgCanvasCtx.current.getImageData(
        (editorPosSizeRef.current.left + x) * scaleFactor,
        (editorPosSizeRef.current.top + y) * scaleFactor,
        editorCanvasSizeRef.current.width,
        editorCanvasSizeRef.current.height
      ),
      0,
      0
    );
  }, [editorOffset]);

  useEffect(() => {
    editor.current.addEventListener("mousedown", (e) => {
      if (
        interactiveState.current.move ||
        interactiveState.current.forbidMove
      ) {
        return;
      }
      interactiveState.current.move = true;

      startPos.current.x = e.pageX;
      startPos.current.y = e.pageY;
    });

    document.body.addEventListener("mousemove", (e) => {
      if (!interactiveState.current.move) return;

      setEditorOffset({
        x: e.pageX - startPos.current.x,
        y: e.pageY - startPos.current.y,
      });
    });

    document.body.addEventListener("mouseup", () => {
      if (!interactiveState.current.move) return;
      interactiveState.current.move = false;

      setEditorPosSize({
        ...editorPosSizeRef.current,
        top: editorPosSizeRef.current.top + editorOffsetRef.current.y,
        left: editorPosSizeRef.current.left + editorOffsetRef.current.x,
      });
      setEditorOffset({ x: 0, y: 0 });
    });
  }, []);
};
