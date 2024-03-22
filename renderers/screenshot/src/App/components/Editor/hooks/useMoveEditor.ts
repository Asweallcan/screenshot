import Konva from "konva";
import { MutableRefObject, useEffect, RefObject } from "react";

export const useMoveEditor = (props: {
  editor: RefObject<HTMLDivElement>;
  bgImage: RefObject<Konva.Image>;
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
    bgImage,
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

      const { scaleFactor } = window.screenInfo;

      const x = e.pageX - startPos.current.x,
        y = e.pageY - startPos.current.y;

      setEditorOffset({
        x,
        y,
      });

      bgImage.current.offset({
        x: (editorPosSize.current.left + x) * scaleFactor,
        y: (editorPosSize.current.top + y) * scaleFactor,
      });
    });

    const onDone = () => {
      if (!interactiveState.current.move) return;
      interactiveState.current.move = false;

      setEditorPosSize({
        ...editorPosSize.current,
        top: editorPosSize.current.top + editorOffset.current.y,
        left: editorPosSize.current.left + editorOffset.current.x,
      });
      setEditorOffset({ x: 0, y: 0 });
    };

    document.body.addEventListener("mouseup", onDone);
    document.body.addEventListener("mouseout", onDone);
  }, []);
};
