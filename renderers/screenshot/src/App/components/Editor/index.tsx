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

    stage.current = new Konva.Stage({
      container: "editor-canvas",
    });
    stage.current.add(bgLayer.current);
  }, []);

  useEffect(() => {
    if (editorPosSize.width > 0) {
      onStartSelect();
    }
  }, [editorPosSize.width]);

  useSelectEditor({
    stage,
    bgLayer,
    startPos,
    bgCanvas,
    editorPosSize,
    interactiveState,
    setSizeInfo,
    setEditorPosSize,
  });

  // useMoveEditor({
  //   editor,
  //   startPos,
  //   editorOffset,
  //   editorOffsetRef,
  //   editorPosSizeRef,
  //   editorCanvasCtx,
  //   interactiveState,
  //   editorCanvasSizeRef,
  //   setEditorOffset,
  //   setEditorPosSize,
  // });

  // useDrawTool({
  //   drawTool: drawToolRef,
  //   editorCanvas,
  //   editorCanvasCtx,
  // });

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
      {/* <Toolbar
        drawTool={drawTool}
        editorCanvasCtx={editorCanvasCtx}
        setDrawTool={setDrawTool}
      /> */}
    </div>
  );
};
