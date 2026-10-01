// Button on the MCU-S2. The board graphic (nodes/mcu-s2/svg.jsx) keeps the
// button state in data attributes of #mcu_switch_button.

function getButton() {
  return document.getElementById("mcu_switch_button");
}

export default function initButton(interpreter, globalObject) {
  const define = (name, fn) =>
    interpreter.setProperty(
      globalObject,
      name,
      interpreter.createNativeFunction(fn),
    );

  // Button is held down right now.
  define(
    "isPressed",
    () => getButton()?.getAttribute("aria-pressed") === "true",
  );

  // Button was pressed and released since the last call.
  define("wasPressed", () => {
    const button = getButton();
    const wasPressed = button?.getAttribute("data-was-pressed") === "true";
    button?.setAttribute("data-was-pressed", "false");
    return wasPressed;
  });

  // Button is held down for at least `time` milliseconds (Arduino: pressedFor).
  define("longPress", (time) => {
    const button = getButton();
    if (button?.getAttribute("aria-pressed") !== "true") {
      return false;
    }
    const pressedSince = Number(button.getAttribute("data-pressed-since"));
    return Date.now() - pressedSince >= Number(time);
  });

  // Switch state that flips with every press (Arduino: toggleState).
  define(
    "toggleButton",
    () => getButton()?.getAttribute("data-toggle-state") === "true",
  );
}
