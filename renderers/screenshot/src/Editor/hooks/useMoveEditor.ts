import { MutableRefObject, useEffect, CSSProperties, Ref } from "react";

export const useMoveEditor = (props: {
  editor: MutableRefObject<HTMLDivElement>;
  offset: MutableRefObject<{ x: number; y: number }>;
  startPos: MutableRefObject<{
    x: number;
    y: number;
  }>;
  bgCanvasCtx: MutableRefObject<CanvasRenderingContext2D>;
  editorCanvasCtx: MutableRefObject<CanvasRenderingContext2D>;
  interactiveState: MutableRefObject<{
    move: boolean;
    select: boolean;
    forbidMove: boolean;
    forbidSelect: boolean;
  }>;
}) => {
  const {
    editor,
    offset,
    startPos,
    bgCanvasCtx,
    editorCanvasCtx,
    interactiveState,
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

      const { width, height, scaleFactor } = window.screenInfo;

      offset.current.x = e.pageX - startPos.current.x;
      offset.current.y = e.pageY - startPos.current.y;

      editorCanvasCtx.current.clearRect(0, 0, width, height);
      editorCanvasCtx.current.putImageData(
        bgCanvasCtx.current.getImageData(
          (+editor.current.style.left.replace("px", "") + offset.current.x) *
            scaleFactor,
          (+editor.current.style.top.replace("px", "") + offset.current.y) *
            scaleFactor,
          width * scaleFactor,
          height * scaleFactor
        ),
        0,
        0
      );

      editor.current.style.transform = `translate(${offset.current.x}px, ${offset.current.y}px)`;
    });

    document.body.addEventListener("mouseup", () => {
      if (!interactiveState.current.move) return;
      interactiveState.current.move = false;

      editor.current.style.cssText += `transform: unset; left: ${
        +editor.current.style.left.replace("px", "") + offset.current.x
      }px; top: ${
        +editor.current.style.top.replace("px", "") + offset.current.y
      }px;`;
    });
  }, []);
};
