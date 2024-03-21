import React, { RefObject, useEffect, useMemo, useRef, useState } from "react";

import "./style.less";

function rgbaToHex(r: number, g: number, b: number, a: number) {
  let alpha = Math.round(a * 255).toString(16);
  if (alpha.length < 2) {
    alpha += alpha;
  }
  return (
    "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1) + alpha
  );
}

export const ColorPicker: React.FC<{
  bgCanvasCtx: RefObject<CanvasRenderingContext2D>;
}> = (props) => {
  const { bgCanvasCtx } = props;

  const zoomArea = useRef<HTMLCanvasElement>(null);
  const zoomAreaCtx = useRef<CanvasRenderingContext2D>(null);

  const [show, setShow] = useState(false);
  const [color, setColor] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    zoomAreaCtx.current = zoomArea.current.getContext("2d");
  }, []);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      const { pageX, pageY } = e;

      setShow(true);
      setMousePos({
        x: pageX,
        y: pageY,
      });
    }

    function onMouseOut() {
      setShow(false);
    }

    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseout", onMouseOut);
    return () => {
      document.body.removeEventListener("mousemove", onMouseMove);
      document.body.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  useEffect(() => {
    if (!window.screenInfo) return;

    const { scaleFactor } = window.screenInfo;
    const [r, g, b, a] = bgCanvasCtx.current.getImageData(
      mousePos.x * scaleFactor,
      mousePos.y * scaleFactor,
      1,
      1
    ).data;

    setColor(rgbaToHex(r, g, b, a));

    zoomAreaCtx.current.clearRect(0, 0, 100, 100);
    zoomAreaCtx.current.putImageData(
      bgCanvasCtx.current.getImageData(
        mousePos.x * scaleFactor - 25 * scaleFactor,
        mousePos.y * scaleFactor - 25 * scaleFactor,
        50 * scaleFactor,
        50 * scaleFactor
      ),
      0,
      0
    );

    // 画十字准星
    zoomAreaCtx.current.beginPath();
    zoomAreaCtx.current.moveTo(50, 0);
    zoomAreaCtx.current.lineTo(50, 100);
    zoomAreaCtx.current.moveTo(0, 50);
    zoomAreaCtx.current.lineTo(100, 50);
    zoomAreaCtx.current.stroke();
  }, [mousePos]);

  const style = useMemo(() => {
    return {
      display: show ? "block" : "none",
      transform: `translate(${mousePos.x + 20}px, ${mousePos.y + 20}px)`,
    };
  }, [show, mousePos]);

  return (
    <div style={style} className="color-picker">
      <canvas ref={zoomArea} className="zoom-area" width={100} height={100} />
      <div className="color">{color}</div>
    </div>
  );
};
