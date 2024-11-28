export const beginDisplay = {
  kind: "block",
  type: "sensebox_display_beginDisplay",
};
export const show = { kind: "block", type: "sensebox_display_show" };
export const clearDisplay = {
  kind: "block",
  type: "sensebox_display_clearDisplay",
};
export const printDisplay = {
  kind: "block",
  type: "sensebox_display_printDisplay",
  fields: {
    SIZE: {
      block: { kind: "block", type: "math_number", fields: { NUM: "1" } },
    },
    X: {
      block: { kind: "block", type: "math_number", fields: { NUM: "0" } },
    },
    Y: {
      block: { kind: "block", type: "math_number", fields: { NUM: "0" } },
    },
  },
};
export const fastPrint = {
  kind: "block",
  type: "sensebox_display_fastPrint",
  inputs: {
    Title1: {
      block: { kind: "block", type: "text", fields: { TEXT: "Title" } },
    },
    Dimension1: {
      block: { kind: "block", type: "text", fields: { TEXT: "Unit" } },
    },
    Title2: {
      block: { kind: "block", type: "text", fields: { TEXT: "Title" } },
    },
    Dimension2: {
      block: { kind: "block", type: "text", fields: { TEXT: "Unit" } },
    },
  },
};
export const plotDisplay = {
  kind: "block",
  type: "sensebox_display_plotDisplay",
  inputs: {
    Title: {
      block: { kind: "block", type: "text" },
    },
    YLabel: {
      block: { kind: "block", type: "text" },
    },
    XLabel: {
      block: { kind: "block", type: "text" },
    },
    XRange1: {
      block: { kind: "block", type: "math_number", fields: { NUM: "0" } },
    },
    XRange2: {
      block: { kind: "block", type: "math_number", fields: { NUM: "15" } },
    },
    YRange1: {
      block: { kind: "block", type: "math_number", fields: { NUM: "0" } },
    },
    YRange2: {
      block: { kind: "block", type: "math_number", fields: { NUM: "50" } },
    },
    XTick: {
      block: { kind: "block", type: "math_number", fields: { NUM: "5" } },
    },
    YTick: {
      block: { kind: "block", type: "math_number", fields: { NUM: "0" } },
    },
    TimeFrame: {
      block: { kind: "block", type: "math_number", fields: { NUM: "15" } },
    },
  },
};
export const fillCircle = {
  kind: "block",
  type: "sensebox_display_fillCircle",
  inputs: {
    X: {
      block: { kind: "block", type: "math_number", fields: { NUM: "0" } },
    },
    Y: {
      block: { kind: "block", type: "math_number", fields: { NUM: "0" } },
    },
    Radius: {
      block: { kind: "block", type: "math_number", fields: { NUM: "0" } },
    },
  },
};
export const drawRectangle = {
  kind: "block",
  type: "sensebox_display_drawRectangle",
  inputs: {
    X: {
      block: { kind: "block", type: "math_number", fields: { NUM: "0" } },
    },
    Y: {
      block: { kind: "block", type: "math_number", fields: { NUM: "0" } },
    },
    height: {
      block: { kind: "block", type: "math_number", fields: { NUM: "0" } },
    },
    width: {
      block: { kind: "block", type: "math_number", fields: { NUM: "0" } },
    },
  },
};

export default {
  mcu: [
    beginDisplay,
    show,
    clearDisplay,
    printDisplay,
    fastPrint,
    plotDisplay,
    fillCircle,
    drawRectangle,
  ],
  mini: [
    beginDisplay,
    show,
    clearDisplay,
    printDisplay,
    fastPrint,
    plotDisplay,
    fillCircle,
    drawRectangle,
  ],
  esp32: [
    beginDisplay,
    show,
    clearDisplay,
    printDisplay,
    fastPrint,
    plotDisplay,
    fillCircle,
    drawRectangle,
  ],
};
