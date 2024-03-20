import React, { useCallback, useEffect, useRef, useState } from "react";
import { Editor } from "./Editor";

import "./App.less";

export const App: React.FC = () => {
  const bgCanvas = useRef<HTMLCanvasElement>(null);
  const bgCanvasCtx = useRef<CanvasRenderingContext2D>();

  const setBg = useCallback(async () => {
    const { width, height, sourceId, scaleFactor } = window;

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
  }, []);

  useEffect(() => {
    bgCanvasCtx.current = bgCanvas.current?.getContext("2d")!;

    setBg();
  }, []);

  const { width, height, scaleFactor } = window;

  return (
    <>
      <div className="mask"></div>
      <canvas
        ref={bgCanvas}
        width={width * scaleFactor}
        height={height * scaleFactor}
        style={{
          width,
          height,
        }}
        className="bg"
      ></canvas>
      <Editor bgCanvasCtx={bgCanvasCtx}></Editor>
    </>
  );
};
