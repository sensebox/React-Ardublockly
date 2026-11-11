import { Position } from "@xyflow/react";

/**
 * Connectors of the senseBox MCU-S2 and the modules that plug into them.
 * The cables in the simulator show how to wire the real hardware.
 */

// How a module is connected to the board.
export const BUS = {
  I2C: "i2c",
  UART: "uart",
  GPIO: "gpio",
  // Part of the board itself, e.g. the light sensor
  ONBOARD: "onboard",
};

const MODULE_BUS = {
  senseBox_hdc1080: BUS.I2C,
  senseBox_lightUv: BUS.I2C,
  senseBox_display: BUS.I2C,
  sensebox_tof_imager: BUS.I2C,
  sensebox_sensor_bme680_bsec: BUS.I2C,
  sensebox_scd30: BUS.I2C,
  sensebox_sensor_dps310: BUS.I2C,
  sensebox_sensor_sps30: BUS.I2C,
  sensebox_sensor_sds011: BUS.UART,
  sensebox_rg15_rainsensor: BUS.UART,
  senseBox_waterTemp: BUS.GPIO,
  senseBox_smt50: BUS.GPIO,
  sensebox_sensor_ultrasonic_ranger: BUS.GPIO,
  sensebox_esp32s2_light: BUS.ONBOARD,
  sensebox_esp32s2_accelerometer: BUS.ONBOARD,
};

/**
 * @param {string} type Module type
 * @return {?string} One of BUS, or null for modules without a cable.
 */
export function busOf(type) {
  return MODULE_BUS[type] ?? null;
}

// Handles of a module node: the cable comes in on the left. I2C modules have
// a second connector on the right for the next module in the chain.
export const MODULE_IN = "in";
export const MODULE_OUT = "out";

/**
 * Connectors on the board graphic (283 x 258 px), centre and size in px.
 * `label` is shown on the cable at the board end.
 */
export const BOARD_PORTS = {
  "i2c-left": {
    bus: BUS.I2C,
    label: "I2C",
    x: 23,
    y: 25,
    width: 18,
    height: 28,
    position: Position.Left,
  },
  "i2c-right": {
    bus: BUS.I2C,
    label: "I2C",
    x: 247,
    y: 25,
    width: 18,
    height: 28,
    position: Position.Right,
  },
  uart: {
    bus: BUS.UART,
    label: "UART",
    x: 247,
    y: 64,
    width: 18,
    height: 28,
    position: Position.Right,
  },
  "gpio-A": {
    bus: BUS.GPIO,
    label: "GPIO A",
    x: 247,
    y: 103,
    width: 18,
    height: 28,
    position: Position.Bottom,
  },
  "gpio-B": {
    bus: BUS.GPIO,
    label: "GPIO B",
    x: 222,
    y: 103,
    width: 18,
    height: 28,
    position: Position.Bottom,
  },
  "gpio-C": {
    bus: BUS.GPIO,
    label: "GPIO C",
    x: 197,
    y: 103,
    width: 18,
    height: 28,
    position: Position.Bottom,
  },
  photodiode: {
    bus: BUS.ONBOARD,
    x: 205,
    y: 64,
    width: 26,
    height: 14,
    position: Position.Bottom,
  },
  imu: {
    bus: BUS.ONBOARD,
    x: 69,
    y: 56,
    width: 18,
    height: 18,
    position: Position.Bottom,
  },
};

// The I2C chain starts here unless the user plugs it in elsewhere.
export const DEFAULT_I2C_PORT = "i2c-left";

const ONBOARD_PORT = {
  sensebox_esp32s2_light: "photodiode",
  sensebox_esp32s2_accelerometer: "imu",
};

/**
 * Board connector of a module that is not on the I2C chain.
 * @param {{type: string, port?: string}} module
 * @return {?string} Handle id on the board
 */
export function fixedBoardPort(module) {
  switch (busOf(module.type)) {
    case BUS.UART:
      return "uart";
    case BUS.GPIO:
      return `gpio-${["A", "B", "C"].includes(module.port) ? module.port : "A"}`;
    case BUS.ONBOARD:
      return ONBOARD_PORT[module.type];
    default:
      return null;
  }
}
