export const number = { kind: "block", type: "math_number" };
export const arithmetic = { kind: "block", type: "math_arithmetic" };
export const single = { kind: "block", type: "math_single" };
export const trig = { kind: "block", type: "math_trig" };
export const constant = { kind: "block", type: "math_constant" };
export const numberProperty = { kind: "block", type: "math_number_property" };
export const change = {
  kind: "block",
  type: "math_change",
  inputs: {
    DELTA: {
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
export const round = { kind: "block", type: "math_round" };
export const modulo = { kind: "block", type: "math_modulo" };
export const constrain = {
  kind: "block",
  type: "math_constrain",
  inputs: {
    LOW: {
      block: {
        kind: "block",
        type: "math_number",
        fields: {
          NUM: "1",
        },
      },
    },
    HIGH: {
      block: {
        kind: "block",
        type: "math_number",
        fields: {
          NUM: "100",
        },
      },
    },
  },
};
export const randomInt = {
  kind: "block",
  type: "math_random_int",
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
          NUM: "100",
        },
      },
    },
  },
};
export const randomFloat = { kind: "block", type: "math_random_float" };
export const baseMap = { kind: "block", type: "base_map" };

export default {
  mcu: [
    number,
    arithmetic,
    single,
    trig,
    constant,
    numberProperty,
    change,
    round,
    modulo,
    constrain,
    randomInt,
    randomFloat,
    baseMap,
  ],
  mini: [
    number,
    arithmetic,
    single,
    trig,
    constant,
    numberProperty,
    change,
    round,
    modulo,
    constrain,
    randomInt,
    randomFloat,
    baseMap,
  ],
  esp32: [
    number,
    arithmetic,
    single,
    trig,
    constant,
    numberProperty,
    change,
    round,
    modulo,
    constrain,
    randomInt,
    randomFloat,
    baseMap,
  ],
};
