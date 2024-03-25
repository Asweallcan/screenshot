import React, { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { Stage, Layer, Image, Line } from "react-konva";

import "./style.less";

function rgbToHex(r: number, g: number, b: number) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export const ColorPicker: React.FC<{
  bgCanvas: RefObject<HTMLCanvasElement>;
  bgCanvasCtx: RefObject<CanvasRenderingContext2D>;
}> = (props) => {
  const { bgCanvas, bgCanvasCtx } = props;
  const {
    width: screenWidth,
    height: screenHeight,
    scaleFactor,
  } = window.screenInfo;

  const [show, setShow] = useState(false);
  const [color, setColor] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
    const { scaleFactor } = window.screenInfo;
    const [r, g, b] = bgCanvasCtx.current.getImageData(
      mousePos.x * scaleFactor,
      mousePos.y * scaleFactor,
      1,
      1
    ).data;

    setColor(rgbToHex(r, g, b));
  }, [mousePos]);

  const style = useMemo(() => {
    const translateX =
      mousePos.x + 120 > screenWidth ? mousePos.x - 120 : mousePos.x + 20;
    const translateY =
      mousePos.y + 120 > screenHeight ? mousePos.y - 120 : mousePos.y + 20;

    return {
      display: show ? "block" : "none",
      transform: `translate(${translateX}px, ${translateY}px)`,
    };
  }, [show, mousePos]);

  return (
    <div style={style} className="color-picker">
      <Stage width={100} height={100}>
        <Layer>
          <Image
            image={bgCanvas.current}
            scaleX={4}
            scaleY={4}
            offsetX={mousePos.x * scaleFactor - 50 / 4}
            offsetY={mousePos.y * scaleFactor - 50 / 4}
          />
        </Layer>
        <Layer>
          <Line stroke="#888" points={[50, 0, 50, 100]} />
          <Line stroke="#888" points={[0, 50, 100, 50]} />
        </Layer>
      </Stage>
      <div className="color">{color}</div>
    </div>
  );
};
