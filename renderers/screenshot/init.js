async function init(sourceId, width, height, scaleFactor) {
  global.scaleFactor = scaleFactor;

  const bg = document.getElementById("bg");
  const video = document.createElement("video");

  bg.width = width * scaleFactor;
  bg.height = height * scaleFactor;
  bg.style.width = width + "px";
  bg.style.height = height + "px";

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
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

  video.style.cssText = "position: absolute; top: -10000px;";
  video.onloadedmetadata = () => {
    video.play();

    const ctx = bg.getContext("2d");
    ctx.drawImage(video, 0, 0, width * scaleFactor, height * scaleFactor);

    video.remove();
    stream.getVideoTracks()[0].stop();
  };
  video.srcObject = stream;
  document.body.append(video);
}
