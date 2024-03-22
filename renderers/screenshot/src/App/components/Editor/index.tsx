import React, { useEffect, useRef, RefObject, useState, useMemo } from "react";
import Konva from "konva";

import { useSelectEditor } from "./hooks/useSelectEditor";
import { useMoveEditor } from "./hooks/useMoveEditor";
import { useRefState } from "../../../hooks";
import { Toolbar } from "./components/Toolbar";

import "./style.less";

export const Editor: React.FC<{
  bgCanvas: RefObject<HTMLCanvasElement>;
  onStartSelect(): void;
}> = (props) => {
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
  const stage = useRef<Konva.Stage>();
  const bgLayer = useRef(new Konva.Layer());
  const bgImage = useRef<Konva.Image>();
  const drawLayer = useRef(new Konva.Layer());

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

  const startPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    window.bridge.registerHandler("disableScreenshot", () => {
      interactiveState.current.forbidSelect = true;
    });
  }, []);

  useEffect(() => {
    const { scaleFactor } = window.screenInfo;
    stage.current = new Konva.Stage({
      container: "editor-canvas",
    });
    bgImage.current = new Konva.Image({
      image: bgCanvas.current,
      scale: {
        x: 1 / scaleFactor,
        y: 1 / scaleFactor,
      },
    });
    bgLayer.current.add(bgImage.current);
    stage.current.add(bgLayer.current);
    stage.current.add(drawLayer.current);
  }, []);

  useEffect(() => {
    if (editorPosSize.width > 0) {
      onStartSelect();
    }
  }, [editorPosSize.width]);

  useSelectEditor({
    stage,
    bgImage,
    startPos,
    editorPosSize: editorPosSizeRef,
    interactiveState,
    setSizeInfo,
    setEditorPosSize,
  });

  useMoveEditor({
    editor,
    bgImage,
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
      <div id="editor-canvas" />
      <Toolbar
        stage={stage}
        editor={editor}
        drawLayer={drawLayer}
        editorPosSize={editorPosSizeRef}
        interactiveState={interactiveState}
      />
    </div>
  );
};
