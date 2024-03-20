(function () {
  const mask = document.getElementById("mask");
  const wrapper = document.getElementById("wrapper");
  const size = document.getElementById("size");
  const screenshot = document.getElementById("screenshot");
  const bg = document.getElementById("bg");
  const screenshotCtx = screenshot.getContext("2d");
  const bgCtx = bg.getContext("2d");
  const colorPick = document.getElementById("color-pick");

  let isDragging = false,
    x0 = 0,
    x1 = 0,
    y0 = 0,
    y1 = 0,
    isDraggingWrapper = false,
    x2 = 0,
    y2 = 0,
    offsetX = 0,
    offsetY = 0,
    moved = false,
    x = 0,
    y = 0,
    width = 0,
    height = 0;

  mask.addEventListener("mousedown", (e) => {
    if (isDragging) return;
    isDragging = true;

    x0 = e.pageX;
    y0 = e.pageY;
  });

  const selectRect = (e) => {
    if (!isDragging) return;

    x1 = e.pageX;
    y1 = e.pageY;

    x = Math.min(x0, x1);
    width = Math.abs(x0 - x1);
    y = Math.min(y0, y1);
    height = Math.abs(y0 - y1);

    wrapper.style.cssText = `display: block; top: ${y}px; left: ${x}px; width: ${width}px; height: ${height}px`;

    size.textContent = `${width}x${height}`;
    screenshot.width = width * global.scaleFactor;
    screenshot.height = height * global.scaleFactor;

    if (!width || !height) return;

    screenshotCtx.clearRect(0, 0, screenshot.width, screenshot.height);
    screenshotCtx.putImageData(
      bgCtx.getImageData(
        x * global.scaleFactor,
        y * global.scaleFactor,
        width * global.scaleFactor,
        height * global.scaleFactor
      ),
      0,
      0
    );
  };

  document.body.addEventListener("mousemove", selectRect);

  document.body.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;

    wrapper.style.cursor = "grab";
    document.body.removeEventListener("mousemove", selectRect);
    colorPick.style.display = "none";
  });

  wrapper.addEventListener("mousedown", (e) => {
    if (isDragging || isDraggingWrapper) return;
    isDraggingWrapper = true;

    x2 = e.pageX;
    y2 = e.pageY;
  });

  document.body.addEventListener("mousemove", (e) => {
    if (!isDraggingWrapper) return;
    moved = true;

    offsetX = e.pageX - x2;
    offsetY = e.pageY - y2;

    wrapper.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

    screenshotCtx.clearRect(0, 0, screenshot.width, screenshot.height);
    screenshotCtx.putImageData(
      bgCtx.getImageData(
        (x + offsetX) * global.scaleFactor,
        (y + offsetY) * global.scaleFactor,
        width * global.scaleFactor,
        height * global.scaleFactor
      ),
      0,
      0
    );
  });

  document.body.addEventListener("mouseup", () => {
    if (!isDraggingWrapper || !moved) return;

    moved = false;
    isDraggingWrapper = false;

    x += offsetX;
    y += offsetY;
    wrapper.style.transform = "unset";
    wrapper.style.top = +wrapper.style.top.replace("px", "") + offsetY + "px";
    wrapper.style.left = +wrapper.style.left.replace("px", "") + offsetX + "px";
  });
})();
