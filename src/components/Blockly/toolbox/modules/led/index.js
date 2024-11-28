export const rgbLed = { kind: "block", type: "sensebox_rgb_led" };
export const led = { kind: "block", type: "sensebox_led" };
export const ws2818LedInit = {
  kind: "block",
  type: "sensebox_ws2818_led_init",
  inputs: {
    NUMBER: {
      block: { kind: "block", type: "math_number", fields: { NUM: "1" } },
    },
    BRIGHTNESS: {
      block: { kind: "block", type: "math_number", fields: { NUM: "30" } },
    },
  },
};
export const ws2818Led = {
  kind: "block",
  type: "sensebox_ws2818_led",
  inputs: {
    POSITION: {
      block: { kind: "block", type: "math_number", fields: { NUM: "0" } },
    },
    COLOR: {
      block: { kind: "block", type: "colour_picker" },
    },
  },
};
export const colourPicker = { kind: "block", type: "colour_picker" };
export const colourRandom = { kind: "block", type: "colour_random" };
export const colourRgb = {
  kind: "block",
  type: "colour_rgb",
  inputs: {
    RED: {
      block: { kind: "block", type: "math_number", fields: { NUM: "100" } },
    },
    GREEN: {
      block: { kind: "block", type: "math_number", fields: { NUM: "50" } },
    },
    BLUE: {
      block: { kind: "block", type: "math_number", fields: { NUM: "0" } },
    },
  },
};

export default {
  mcu: [
    rgbLed,
    led,
    ws2818LedInit,
    ws2818Led,
    colourPicker,
    colourRandom,
    colourRgb,
  ],
  mini: [
    rgbLed,
    led,
    ws2818LedInit,
    ws2818Led,
    colourPicker,
    colourRandom,
    colourRgb,
  ],
  esp32: [
    rgbLed,
    led,
    ws2818LedInit,
    ws2818Led,
    colourPicker,
    colourRandom,
    colourRgb,
  ],
};
