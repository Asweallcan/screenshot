import React, {
  CSSProperties,
  useEffect,
  useRef,
  useState,
  RefObject,
  useCallback,
} from "react";

import "./App.less";

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

  const editor = useRef<HTMLDivElement>(null);
  const editorCanvas = useRef<HTMLCanvasElement>(null);
  const editorCanvasCtx = useRef<CanvasRenderingContext2D>();

  const startPos = useRef({ x: 0, y: 0 });
  const offset = useRef({ x: 0, y: 0 });

  const [size, setSize] = useState("");
  const editorStyleRef = useRef<CSSProperties>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    display: "none",
    transform: "",
  });
  const [editorStyle, _setEditorStyle] = useState(editorStyleRef.current);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const setEditorStyle = useCallback((style: CSSProperties) => {
    editorStyleRef.current = {
      ...editorStyleRef.current,
      ...style,
    };
    _setEditorStyle(editorStyleRef.current);
  }, []);

  useEffect(() => {
    editorCanvasCtx.current = editorCanvas.current?.getContext("2d")!;
  }, []);

  // 选取范围
  useEffect(() => {
    document.body.addEventListener("mousedown", (e) => {
      if (
        interactiveState.current.select ||
        interactiveState.current.forbidSelect
      ) {
        return;
      }

      interactiveState.current.select = true;

      startPos.current.x = e.pageX;
      startPos.current.y = e.pageY;
    });

    document.body.addEventListener("mousemove", (e) => {
      if (!interactiveState.current.select) return;

      const { x, y } = startPos.current;
      const { pageX, pageY } = e;
      const { scaleFactor } = window;

      const left = Math.min(x, pageX);
      const top = Math.min(y, pageY);
      const width = Math.abs(x - pageX);
      const height = Math.abs(y - pageY);

      setSize(`${width}x${height}`);
      setEditorStyle({
        top,
        left,
        width,
        height,
        display: "block",
      });
      setCanvasSize({
        width: width * scaleFactor,
        height: height * scaleFactor,
      });

      if (!width || !height) return;

      editorCanvasCtx.current.clearRect(
        0,
        0,
        width * scaleFactor,
        height * scaleFactor
      );
      editorCanvasCtx.current.putImageData(
        bgCanvasCtx.current.getImageData(
          x * scaleFactor,
          y * scaleFactor,
          width * scaleFactor,
          height * scaleFactor
        ),
        0,
        0
      );
    });

    document.body.addEventListener("mouseup", () => {
      if (!interactiveState.current.select) return;

      interactiveState.current.select = false;
      interactiveState.current.forbidSelect = true;
    });
  }, []);

  // 移动范围
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

      const { width, height, scaleFactor } = window;

      offset.current.x = e.pageX - startPos.current.x;
      offset.current.y = e.pageY - startPos.current.y;

      editorCanvasCtx.current.clearRect(0, 0, width, height);
      editorCanvasCtx.current.putImageData(
        bgCanvasCtx.current.getImageData(
          (+editorStyleRef.current.left + offset.current.x) * scaleFactor,
          (+editorStyleRef.current.top + offset.current.y) * scaleFactor,
          width * scaleFactor,
          height * scaleFactor
        ),
        0,
        0
      );

      setEditorStyle({
        transform: `translate(${offset.current.x}px, ${offset.current.y}px)`,
      });
    });

    document.body.addEventListener("mouseup", () => {
      if (!interactiveState.current.move) return;

      interactiveState.current.move = false;
      setEditorStyle({
        top: +editorStyleRef.current.top + offset.current.y,
        left: +editorStyleRef.current.left + offset.current.x,
      });
    });
  }, []);

  return (
    <div ref={editor} style={editorStyle} className="editor">
      <div className="editor-size">{size}</div>
      <canvas
        ref={editorCanvas}
        width={canvasSize.width}
        height={canvasSize.height}
        className="editor-canvas"
      ></canvas>
    </div>
  );
};
