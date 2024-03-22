import { MutableRefObject, useEffect, RefObject } from "react";

export const useMoveEditor = (props: {
  editor: RefObject<HTMLDivElement>;
  startPos: MutableRefObject<{
    x: number;
    y: number;
  }>;
  editorOffset: MutableRefObject<{ x: number; y: number }>;
  editorPosSize: MutableRefObject<{
    left: number;
    top: number;
    width: number;
    height: number;
  }>;
  interactiveState: MutableRefObject<{
    move: boolean;
    select: boolean;
    forbidMove: boolean;
    forbidSelect: boolean;
  }>;
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
    editorOffset,
    editorPosSize,
    interactiveState,
    setEditorOffset,
    setEditorPosSize,
  } = props;

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

      const { width: screenWidth, height: screenHeight } = window.screenInfo;

      const x = e.pageX - startPos.current.x,
        y = e.pageY - startPos.current.y;

      const { top, left, width, height } = editorPosSize.current;

      const xValid =
        left + x < 0
          ? -left
          : left + x + width > screenWidth
          ? screenWidth - width - left
          : x;
      const yValid =
        top + y < 0
          ? -top
          : top + y + height > screenHeight
          ? screenHeight - height - top
          : y;

      setEditorOffset({
        x: xValid,
        y: yValid,
      });
    });

    document.body.addEventListener("mouseup", () => {
      if (!interactiveState.current.move) return;
      interactiveState.current.move = false;

      setEditorPosSize({
        ...editorPosSize.current,
        top: editorPosSize.current.top + editorOffset.current.y,
        left: editorPosSize.current.left + editorOffset.current.x,
      });
      setEditorOffset({ x: 0, y: 0 });
    });
  }, []);
};
