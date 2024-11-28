export const analogReadMillivolt = {
  kind: "block",
  type: "io_analogreadmillivolt",
};
export const digitalWrite = { kind: "block", type: "io_digitalwrite" };
export const digitalRead = { kind: "block", type: "io_digitalread" };
export const builtinLed = { kind: "block", type: "io_builtin_led" };
export const analogWrite = { kind: "block", type: "io_analogwrite" };
export const analogRead = { kind: "block", type: "io_analogread" };
export const highLow = { kind: "block", type: "io_highlow" };
export const pulseIn = {
  kind: "block",
  type: "io_pulsein",
  inputs: {
    PULSETYPE: {
      block: {
        kind: "block",
        type: "io_highlow",
        shadow: true,
      },
    },
  },
};
export const pulseTimeout = {
  kind: "block",
  type: "io_pulsetimeout",
  inputs: {
    PULSETYPE: {
      block: {
        kind: "block",
        type: "io_highlow",
        shadow: true,
      },
    },
    TIMEOUT: {
      block: {
        kind: "block",
        type: "math_number",
        shadow: true,
        fields: {
          NUM: "100",
        },
      },
    },
  },
};

export default {
  mcu: [
    digitalWrite,
    digitalRead,
    builtinLed,
    analogWrite,
    analogRead,
    highLow,
    pulseIn,
    pulseTimeout,
  ],
  mini: [
    digitalWrite,
    digitalRead,
    builtinLed,
    analogWrite,
    analogRead,
    highLow,
    pulseIn,
    pulseTimeout,
  ],
  esp32: [
    analogReadMillivolt,
    digitalWrite,
    digitalRead,
    builtinLed,
    analogWrite,
    analogRead,
    highLow,
    pulseIn,
    pulseTimeout,
  ],
};
