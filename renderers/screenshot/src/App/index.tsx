import React, { useCallback, useEffect, useRef, useState } from "react";
import { Editor } from "../Editor";

import "./style.less";

export const App: React.FC = () => {
  const bgCanvas = useRef<HTMLCanvasElement>(null);
  const bgCanvasCtx = useRef<CanvasRenderingContext2D>();

  const [size, setSize] = useState({
    width: 0,
    height: 0,
    scaleFactor: 0,
  });

  useEffect(() => {
    bgCanvasCtx.current = bgCanvas.current?.getContext("2d")!;

    window.init = async function (screenInfo: Window["screenInfo"]) {
      window.screenInfo = screenInfo;

      const { width, height, sourceId, scaleFactor } = screenInfo;

      setSize({
        width,
        height,
        scaleFactor,
      });

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          // @ts-ignore
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: sourceId,
            minWidth: width * scaleFactor,
            minHeight: height * scaleFactor,
            maxWidth: width * scaleFactor,
            maxHeight: height * scaleFactor,
          },
        },
      });

      const video = document.createElement("video");
      video.style.cssText = "position: absolute; top: -10000px;";
      video.onloadedmetadata = () => {
        video.play();

        bgCanvasCtx.current.drawImage(
          video,
          0,
          0,
          width * scaleFactor,
          height * scaleFactor
        );

        video.remove();
        stream.getVideoTracks()[0].stop();
      };

      video.srcObject = stream;
      document.body.append(video);
    };
  }, []);

  return (
    <>
      <div className="mask"></div>
      <canvas
        ref={bgCanvas}
        width={size.width * size.scaleFactor}
        height={size.height * size.scaleFactor}
        style={{
          width: size.width,
          height: size.height,
        }}
        className="bg"
      ></canvas>
      <Editor bgCanvasCtx={bgCanvasCtx}></Editor>
    </>
  );
};
