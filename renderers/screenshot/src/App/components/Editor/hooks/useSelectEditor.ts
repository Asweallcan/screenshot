import Konva from "konva";
import { RefObject, MutableRefObject, useEffect } from "react";

export const useSelectEditor = (props: {
  stage: RefObject<Konva.Stage>;
  bgImage: RefObject<Konva.Image>;
  startPos: MutableRefObject<{
    x: number;
    y: number;
  }>;
  interactiveState: MutableRefObject<{
    move: boolean;
    select: boolean;
    forbidMove: boolean;
    forbidSelect: boolean;
  }>;
  setSizeInfo(sizeInfo: string): void;
  setEditorPosSize(posSize: {
    top: number;
    left: number;
    width: number;
    height: number;
  }): void;
}) => {
  const {
    stage,
    bgImage,
    startPos,
    interactiveState,
    setSizeInfo,
    setEditorPosSize,
  } = props;

  useEffect(() => {
    document.body.addEventListener("mousedown", (e) => {
      if (
        interactiveState.current.select ||
        interactiveState.current.forbidSelect
      ) {
        return;
      }

      window.bridge.disableScreenshot();

      interactiveState.current.select = true;

      startPos.current.x = e.pageX;
      startPos.current.y = e.pageY;
    });

    document.body.addEventListener("mousemove", (e) => {
      if (!interactiveState.current.select) return;

      const { x, y } = startPos.current;
      const { pageX, pageY } = e;

      const left = Math.min(x, pageX);
      const top = Math.min(y, pageY);
      const width = Math.abs(x - pageX);
      const height = Math.abs(y - pageY);

      setSizeInfo(`${width}x${height}`);
      setEditorPosSize({
        top,
        left,
        width,
        height,
      });

      if (!width || !height) return;

      const { scaleFactor } = window.screenInfo;

      stage.current.setSize({
        width,
        height,
      });
      bgImage.current.offset({
        x: left * scaleFactor,
        y: top * scaleFactor,
      });
    });

    document.body.addEventListener("mouseup", () => {
      if (!interactiveState.current.select) return;

      interactiveState.current.select = false;
      interactiveState.current.forbidSelect = true;
    });
  }, []);
};
