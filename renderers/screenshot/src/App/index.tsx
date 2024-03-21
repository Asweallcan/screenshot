import React, { useCallback, useEffect, useRef, useState } from "react";
import { Editor } from "./components/Editor";
import { ColorPicker } from "./components/ColorPicker";

import "./style.less";

export const App: React.FC = () => {
  const bgCanvas = useRef<HTMLCanvasElement>(null);
  const bgCanvasCtx = useRef<CanvasRenderingContext2D>();

  const [initialized, setInitialized] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(true);
  const [{ width, height, scaleFactor }, setSize] = useState({
    width: 0,
    height: 0,
    scaleFactor: 0,
  });

  useEffect(() => {
    bgCanvasCtx.current = bgCanvas.current.getContext("2d")!;

    window.bridge.registerHandler(
      "initScreenshot",
      async function (screenInfo: Window["screenInfo"]) {
        window.screenInfo = screenInfo;

        const { width, height, sourceId, scaleFactor } = screenInfo;
        const scaleWidth = width * scaleFactor,
          scaleHeight = height * scaleFactor;

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
              minWidth: scaleWidth,
              minHeight: scaleHeight,
              maxWidth: scaleWidth,
              maxHeight: scaleHeight,
            },
          },
        });

        const video = document.createElement("video");
        video.style.cssText = "position: absolute; top: -10000px;";
        video.onloadedmetadata = () => {
          video.play();

          bgCanvasCtx.current.drawImage(video, 0, 0, scaleWidth, scaleHeight);
          video.remove();
          stream.getVideoTracks()[0].stop();
          setInitialized(true);
        };

        video.srcObject = stream;
        document.body.append(video);
      }
    );
  }, []);

  const onStartSelect = useCallback(() => {
    if (!showColorPicker) return;
    setShowColorPicker(false);
  }, [showColorPicker]);

  return (
    <>
      <canvas
        ref={bgCanvas}
        width={width * scaleFactor}
        height={height * scaleFactor}
        style={{
          width,
          height,
        }}
        className="bg"
      />
      {initialized ? (
        <>
          <div className="mask" />
          <Editor bgCanvas={bgCanvas} onStartSelect={onStartSelect}></Editor>
          {showColorPicker ? <ColorPicker bgCanvasCtx={bgCanvasCtx} /> : null}
        </>
      ) : null}
    </>
  );
};
