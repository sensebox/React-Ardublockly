export const ioTone = {
  kind: "block",
  type: "io_tone",
  inputs: {
    FREQUENCY: {
      block: {
        kind: "block",
        type: "math_number",
        shadow: true,
        fields: {
          NUM: "220",
        },
      },
    },
  },
};

export const ioNoTone = { kind: "block", type: "io_notone" };

export default {
  mcu: [ioTone, ioNoTone],
  mini: [ioTone, ioNoTone],
  esp32: [ioTone, ioNoTone],
};
