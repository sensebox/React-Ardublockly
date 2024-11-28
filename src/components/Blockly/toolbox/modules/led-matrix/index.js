export const ws2812MatrixInit = {
  kind: "block",
  type: "sensebox_ws2812_matrix_init",
};

export const ws2812MatrixClear = {
  kind: "block",
  type: "sensebox_ws2812_matrix_clear",
};

export const ws2812MatrixText = {
  kind: "block",
  type: "sensebox_ws2812_matrix_text",
};
export const ws2812MatrixDrawPixel = {
  kind: "block",
  type: "sensebox_ws2812_matrix_drawPixel",
};
export const ws2812MatrixShowBitmap = {
  kind: "block",
  type: "sensebox_ws2812_matrix_showBitmap",
};
export const ws2812MatrixBitmap = {
  kind: "block",
  type: "sensebox_ws2812_matrix_bitmap",
};
export const ws2812MatrixCustomBitmap = {
  kind: "block",
  type: "sensebox_ws2812_matrix_custom_bitmap",
};
export const ws2812MatrixDrawCustomBitmapExample = {
  kind: "block",
  type: "sensebox_ws2812_matrix_draw_custom_bitmap_example",
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
    ws2812MatrixInit,
    ws2812MatrixClear,
    ws2812MatrixText,
    ws2812MatrixDrawPixel,
    ws2812MatrixShowBitmap,
    ws2812MatrixBitmap,
    ws2812MatrixCustomBitmap,
    ws2812MatrixDrawCustomBitmapExample,
    colourPicker,
    colourRandom,
    colourRgb,
  ],
  mini: [
    ws2812MatrixInit,
    ws2812MatrixClear,
    ws2812MatrixText,
    ws2812MatrixDrawPixel,
    ws2812MatrixShowBitmap,
    ws2812MatrixBitmap,
    ws2812MatrixCustomBitmap,
    ws2812MatrixDrawCustomBitmapExample,
    colourPicker,
    colourRandom,
    colourRgb,
  ],
  esp32: [
    ws2812MatrixInit,
    ws2812MatrixClear,
    ws2812MatrixText,
    ws2812MatrixDrawPixel,
    ws2812MatrixShowBitmap,
    ws2812MatrixBitmap,
    ws2812MatrixCustomBitmap,
    ws2812MatrixDrawCustomBitmapExample,
    colourPicker,
    colourRandom,
    colourRgb,
  ],
};
