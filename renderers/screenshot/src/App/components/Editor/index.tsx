import React, {
  useEffect,
  useRef,
  RefObject,
  useState,
  useMemo,
  useCallback,
} from "react";
import Konva from "konva";

import { useSelectEditor } from "./hooks/useSelectEditor";
import { useMoveEditor } from "./hooks/useMoveEditor";
import { useRefState } from "../../../hooks";
import { Toolbar } from "./components/Toolbar";
import { useDrawTool } from "./hooks/useDrawTool";
import { DrawTool } from "./types";

import "./style.less";

export const Editor: React.FC<{
  bgCanvas: RefObject<HTMLCanvasElement>;
  onStartSelect(): void;
}> = (props) => {
  const { bgCanvas, onStartSelect } = props;

  const interactiveState = useRef({
    move: false,
    select: false,
    forbidMove: false,
    forbidSelect: false,
  });

  const editor = useRef<HTMLDivElement>(null);
  const stage = useRef<Konva.Stage>();
  const bgLayer = useRef(new Konva.Layer());
  const bgImage = useRef<Konva.Image>();
  const drawLayer = useRef(new Konva.Layer());

  const [drawTool, drawToolRef, _setDrawTool] = useRefState<DrawTool | null>(
    null
  );
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
      cursor: drawTool ? "unset" : "grab",
      transform:
        editorOffset.x || editorOffset.y
          ? `translate(${editorOffset.x}px, ${editorOffset.y}px)`
          : "unset",
    };
  }, [drawTool, editorPosSize, editorOffset]);

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

  useDrawTool({
    editor,
    drawTool: drawToolRef,
    drawLayer,
    editorPosSize: editorPosSizeRef,
  });

  const setDrawTool = useCallback((drawTool: DrawTool) => {
    if (drawTool) {
      interactiveState.current.forbidMove = true;
    }
    _setDrawTool(drawTool);
  }, []);

  return (
    <div ref={editor} style={editorStyle} className="editor">
      <div className="editor-size">{sizeInfo}</div>
      <div id="editor-canvas" />
      <Toolbar stage={stage} drawTool={drawTool} setDrawTool={setDrawTool} />
    </div>
  );
};
