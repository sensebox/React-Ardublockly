// OLED display (128 x 64). Like the Adafruit library, clearDisplay() and
// drawText() work on a buffer that showDisplay() copies to the screen.
// Drawing on the screen directly would flicker, because the interpreter runs
// only one step per tick.

const SCALE = 2;
const BASE_TEXT_SIZE = 6;

let buffer = null;

function getScreen() {
  return document.getElementById("oled-display");
}

function getBuffer() {
  const screen = getScreen();
  if (!screen) {
    return null;
  }
  if (
    !buffer ||
    buffer.width !== screen.width ||
    buffer.height !== screen.height
  ) {
    buffer = document.createElement("canvas");
    buffer.width = screen.width;
    buffer.height = screen.height;
    clear(buffer);
  }
  return buffer;
}

function clear(canvas) {
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export default function initDisplay(interpreter, globalObject) {
  const define = (name, fn) =>
    interpreter.setProperty(
      globalObject,
      name,
      interpreter.createNativeFunction(fn),
    );

  define("drawText", (text, startX, startY, size, color) => {
    const canvas = getBuffer();
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    const textSize = BASE_TEXT_SIZE * SCALE * size;
    const x = startX * SCALE;
    const y = startY * SCALE + textSize;
    ctx.font = `${textSize}px monospace`;

    if (color === "BLACK") {
      // Black text on a white box
      const textWidth = ctx.measureText(String(text)).width;
      ctx.fillStyle = "white";
      ctx.fillRect(x, y - textSize, textWidth, textSize + 4);
      ctx.fillStyle = "black";
    } else {
      ctx.fillStyle = "white";
    }
    ctx.fillText(String(text), x, y);
  });

  define("clearDisplay", () => {
    const canvas = getBuffer();
    if (canvas) {
      clear(canvas);
    }
  });

  define("showDisplay", () => {
    const screen = getScreen();
    const canvas = getBuffer();
    if (screen && canvas) {
      screen.getContext("2d").drawImage(canvas, 0, 0);
    }
  });
}
