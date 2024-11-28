export const controlsRepeatExt = {
  kind: "block",
  type: "controls_repeat_ext",
  inputs: {
    TIMES: {
      block: {
        kind: "block",
        type: "math_number",
        fields: {
          NUM: "10",
        },
      },
    },
  },
};

export const controlsWhileUntil = {
  kind: "block",
  type: "controls_whileUntil",
};

export const controlsFor = {
  kind: "block",
  type: "controls_for",
  inputs: {
    FROM: {
      block: {
        kind: "block",
        type: "math_number",
        fields: {
          NUM: "1",
        },
      },
    },
    TO: {
      block: {
        kind: "block",
        type: "math_number",
        fields: {
          NUM: "10",
        },
      },
    },
    BY: {
      block: {
        kind: "block",
        type: "math_number",
        fields: {
          NUM: "1",
        },
      },
    },
  },
};

export const controlsFlowStatements = {
  kind: "block",
  type: "controls_flow_statements",
};

export default {
  mcu: [
    controlsRepeatExt,
    controlsWhileUntil,
    controlsFor,
    controlsFlowStatements,
  ],
  mini: [
    controlsRepeatExt,
    controlsWhileUntil,
    controlsFor,
    controlsFlowStatements,
  ],
  esp32: [
    controlsRepeatExt,
    controlsWhileUntil,
    controlsFor,
    controlsFlowStatements,
  ],
};
