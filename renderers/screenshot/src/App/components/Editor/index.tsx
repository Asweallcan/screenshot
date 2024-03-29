import React, { useEffect, useRef, RefObject, useState, useMemo } from "react";
import { Stage, Layer, Image } from "react-konva";
import Konva from "konva";

import { DrawNode } from "./types";
import { useRefState } from "../../../hooks";
import { Toolbar } from "./components/Toolbar";
import { useMoveEditor } from "./hooks/useMoveEditor";
import { useSelectEditor } from "./hooks/useSelectEditor";

import "./style.less";

export const Editor: React.FC<{
  bgCanvas: RefObject<HTMLCanvasElement>;
  bgCanvasCtx: RefObject<CanvasRenderingContext2D>;
  onStartSelect(): void;
}> = (props) => {
  const { height: screenHeight, scaleFactor } = window.screenInfo;

  const { bgCanvas, bgCanvasCtx, onStartSelect } = props;

  const interactiveState = useRef({
    move: false,
    select: false,
    resize: false,
    forbidMove: false,
    forbidSelect: false,
    forbidResize: false,
  });

  const stage = useRef<Konva.Stage>();
  const editor = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const editorCanvas = useRef<HTMLDivElement>(null);
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
  const [drewNodes, drewNodesRef, setDrewNodes] = useRefState<Array<DrawNode>>(
    []
  );

  const editorStyle = useMemo(() => {
    return {
      ...editorPosSize,
      display: editorPosSize.width ? "block" : "none",
      transform:
        editorOffset.x || editorOffset.y
          ? `translate(${editorOffset.x}px, ${editorOffset.y}px)`
          : "unset",
    };
  }, [editorPosSize, editorOffset]);

  const editorSizeStyle = useMemo(() => {
    return {
      transform:
        editorOffset.y + editorPosSize.top < 40
          ? "translate(0, 0)"
          : "translate(0, calc(-100% - 8px))",
    };
  }, [editorOffset.y, editorPosSize.top]);

  const toolbarStyle = useMemo(() => {
    return {
      transform:
        editorOffset.y + editorPosSize.height + editorPosSize.top <
        screenHeight - 33
          ? "translate(0, calc(100% + 8px))"
          : "translate(0, 0)",
    };
  }, [editorOffset.y, editorPosSize.top, editorPosSize.height]);

  useEffect(() => {
    window.bridge.registerHandler("disableScreenshot", () => {
      interactiveState.current.forbidSelect = true;
    });
  }, []);

  useEffect(() => {
    if (editorPosSize.width > 0) {
      onStartSelect();
    }
  }, [editorPosSize.width]);

  useSelectEditor({
    startPos,
    editorPosSize: editorPosSizeRef,
    interactiveState,
    setSizeInfo,
    setEditorPosSize,
  });

  useMoveEditor({
    editor,
    startPos,
    editorOffset: editorOffsetRef,
    editorPosSize: editorPosSizeRef,
    interactiveState,
    setEditorOffset,
    setEditorPosSize,
  });

  return (
    <div ref={editor} style={editorStyle} className="editor">
      <div style={editorSizeStyle} className="editor-size">
        {sizeInfo}
      </div>
      <div ref={editorCanvas} className="editor-canvas">
        <Stage
          ref={stage}
          width={editorPosSize.width}
          height={editorPosSize.height}
        >
          <Layer>
            <Image
              image={bgCanvas.current}
              scaleX={1 / scaleFactor}
              scaleY={1 / scaleFactor}
              offsetY={(editorPosSize.top + editorOffset.y) * scaleFactor}
              offsetX={(editorPosSize.left + editorOffset.x) * scaleFactor}
            />
          </Layer>
          <Layer>
            {drewNodes.map(({ Node, props }, index) => {
              return (
                // @ts-ignore
                <Node {...props} key={index}>
                  {"childNodes" in props
                    ? props.childNodes.map(({ Node, props }) => {
                        return <Node {...props} />;
                      })
                    : null}
                </Node>
              );
            })}
          </Layer>
        </Stage>
      </div>
      <Toolbar
        style={toolbarStyle}
        stage={stage}
        drewNodes={drewNodesRef}
        bgCanvasCtx={bgCanvasCtx}
        editorCanvas={editorCanvas}
        editorPosSize={editorPosSizeRef}
        interactiveState={interactiveState}
        setDrewNodes={setDrewNodes}
      />
    </div>
  );
};
