(function () {
  const bg = document.getElementById("bg");
  const bgCtx = bg.getContext("2d");

  const colorPick = document.getElementById("color-pick");
  const color = document.getElementById("color");

  document.body.addEventListener("mousemove", (e) => {
    colorPick.style.cssText = `display: ${
      colorPick.style.display !== "none" ? "block" : "none"
    }; top: ${e.pageY + 20}px; left: ${e.pageX + 20}px;`;

    const [r, g, b, a] = bgCtx.getImageData(
      e.pageX * global.scaleFactor,
      e.pageY * global.scaleFactor,
      1,
      1
    ).data;

    color.textContent = `rgba(${r}, ${g}, ${b}, ${a})`;
  });
})();
