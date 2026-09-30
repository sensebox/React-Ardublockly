export default function initDisplay(interpreter, globalObject) {
  // Define 'drawText' function.
  var wrapper = function (text, startX, startY, size, color) {
    const SCALE = 2;
    const baseTextSize = 6;
    const textSize = baseTextSize * SCALE * size;
    const canvas = document.getElementById("oled-display");
    const ctx = canvas.getContext("2d");

    const x = startX * SCALE;
    const y = startY * SCALE + textSize;

    if (color === "BLACK") {
      // Measure text dimensions
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;
      const textHeight = textSize; // Approximation based on font size

      // Draw black box behind the text
      ctx.fillStyle = "white";
      ctx.fillRect(x, y - textHeight, textWidth, textHeight + 4);

      // Draw the text
      ctx.fillStyle = "black";
      ctx.font = `${textSize}px monospace`;
      ctx.fillText(text, x, y);
    } else {
      // Draw the text
      ctx.fillStyle = "white";
      ctx.font = `${textSize}px monospace`;
      ctx.fillText(text, x, y);
    }
  };

  interpreter.setProperty(
    globalObject,
    "drawText",
    interpreter.createNativeFunction(wrapper),
  );

  // Define 'display.clearDisplay' function.
  var wrapper = function clearDisplay() {
    const canvas = document.getElementById("oled-display");
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
  interpreter.setProperty(
    globalObject,
    "clearDisplay",
    interpreter.createNativeFunction(wrapper),
  );
}
