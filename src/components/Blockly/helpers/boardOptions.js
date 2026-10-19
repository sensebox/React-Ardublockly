/**
 * Boards that can be selected in the app (device selection, tutorial builder).
 * `value` is the identifier stored in redux / sessionStorage / tutorial steps.
 */
export const BOARD_OPTIONS = [
  {
    value: "MCU",
    alt: "Sensebox MCU",
    label: "senseBox MCU",
    src: "/media/hardware/blockly_mcu.png",
  },
  {
    value: "MCU-S2",
    alt: "Sensebox ESP",
    label: "senseBox MCU-S2",
    src: "/media/hardware/blockly_esp.png",
  },
  {
    value: "MCU:MINI",
    alt: "Sensebox Mini",
    label: "senseBox MCU:mini",
    src: "/media/hardware/blockly_mini.png",
  },
  {
    value: "MCU-EYE",
    alt: "Sensebox ESP32S3",
    label: "senseBox MCU Eye",
    src: "/media/hardware/blockly_eye.png",
  },
];

export const getBoardLabel = (value) =>
  BOARD_OPTIONS.find((b) => b.value === value)?.label || value;
