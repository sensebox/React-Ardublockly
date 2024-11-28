export const timeDelay = { kind: "block", type: "time_delay" };
export const timeDelayMicros = { kind: "block", type: "time_delaymicros" };
export const timeMillis = { kind: "block", type: "time_millis" };
export const timeMicros = { kind: "block", type: "time_micros" };
export const infiniteLoop = { kind: "block", type: "infinite_loop" };
export const senseboxIntervalTimer = {
  kind: "block",
  type: "sensebox_interval_timer",
};
export const senseboxRtcInit = { kind: "block", type: "sensebox_rtc_init" };
export const senseboxRtcSet = {
  kind: "block",
  type: "sensebox_rtc_set",
  inputs: {
    second: {
      block: {
        kind: "block",
        type: "math_number",
        fields: {
          NUM: "00",
        },
      },
    },
    minutes: {
      block: {
        kind: "block",
        type: "math_number",
        fields: {
          NUM: "00",
        },
      },
    },
    hour: {
      block: {
        kind: "block",
        type: "math_number",
        fields: {
          NUM: "00",
        },
      },
    },
    day: {
      block: {
        kind: "block",
        type: "math_number",
        fields: {
          NUM: "01",
        },
      },
    },
    month: {
      block: {
        kind: "block",
        type: "math_number",
        fields: {
          NUM: "01",
        },
      },
    },
    year: {
      block: {
        kind: "block",
        type: "math_number",
        fields: {
          NUM: "1970",
        },
      },
    },
  },
};

export default {
  mcu: [
    timeDelay,
    timeDelayMicros,
    timeMillis,
    timeMicros,
    infiniteLoop,
    senseboxIntervalTimer,
    senseboxRtcInit,
    senseboxRtcSet,
  ],
  mini: [
    timeDelay,
    timeDelayMicros,
    timeMillis,
    timeMicros,
    infiniteLoop,
    senseboxIntervalTimer,
    senseboxRtcInit,
    senseboxRtcSet,
  ],
  esp32: [
    timeDelay,
    timeDelayMicros,
    timeMillis,
    timeMicros,
    infiniteLoop,
    senseboxIntervalTimer,
    senseboxRtcInit,
    senseboxRtcSet,
  ],
};
