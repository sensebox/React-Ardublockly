export const hdc1080 = { kind: "block", type: "sensebox_sensor_temp_hum" };
export const light = { kind: "block", type: "sensebox_sensor_uv_light" };
export const sensebox_esp32s2_light = {
  kind: "block",
  type: "sensebox_esp32s2_light",
};
export const sensebox_esp32s2_mpu6050 = {
  kind: "block",
  type: "sensebox_esp32s2_mpu6050",
};
export const bmx055 = {
  kind: "block",
  type: "sensebox_sensor_bmx055_accelerometer",
};
export const sds011 = { kind: "block", type: "sensebox_sensor_sds011" };
export const sps30 = { kind: "block", type: "sensebox_sensor_sps30" };
export const pressure = { kind: "block", type: "sensebox_sensor_pressure" };
export const dps310 = { kind: "block", type: "sensebox_sensor_dps310" };
export const bme680 = { kind: "block", type: "sensebox_sensor_bme680_bsec" };
export const scd30 = { kind: "block", type: "sensebox_scd30" };
export const gps = { kind: "block", type: "sensebox_gps" };
export const ultrasonic = {
  kind: "block",
  type: "sensebox_sensor_ultrasonic_ranger",
};
export const tof = { kind: "block", type: "sensebox_tof_imager" };
export const sound = { kind: "block", type: "sensebox_sensor_sound" };
export const button = { kind: "block", type: "sensebox_button" };
export const smt50 = { kind: "block", type: "sensebox_sensor_truebner_smt50" };
export const watertemperature = {
  kind: "block",
  type: "sensebox_sensor_watertemperature",
};
export const windspeed = { kind: "block", type: "sensebox_windspeed" };
export const soundsensor = {
  kind: "block",
  type: "sensebox_soundsensor_dfrobot",
};
export const multiplexerInit = {
  kind: "block",
  type: "sensebox_multiplexer_init",
  inputs: {
    nrChannels: {
      block: {
        kind: "block",
        type: "math_number",
        fields: { NUM: 1 },
      },
    },
  },
};
export const multiplexerChangeChannel = {
  kind: "block",
  type: "sensebox_multiplexer_changeChannel",
  inputs: {
    Channel: {
      block: {
        kind: "block",
        type: "math_number",
        fields: { NUM: 1 },
      },
    },
  },
};

export default {
  mcu: [
    hdc1080,
    light,
    bmx055,
    sds011,
    sps30,
    pressure,
    dps310,
    bme680,
    scd30,
    gps,
    ultrasonic,
    sound,
    button,
    smt50,
    watertemperature,
    soundsensor,
    multiplexerInit,
    multiplexerChangeChannel,
  ],
  mini: [
    hdc1080,
    light,
    bmx055,
    sds011,
    sps30,
    pressure,
    dps310,
    bme680,
    scd30,
    gps,
    ultrasonic,
    sound,
    button,
    smt50,
    watertemperature,
    soundsensor,
    multiplexerInit,
    multiplexerChangeChannel,
  ],
  esp32: [
    hdc1080,
    light,
    sensebox_esp32s2_light,
    sensebox_esp32s2_mpu6050,
    sds011,
    sps30,
    pressure,
    dps310,
    bme680,
    scd30,
    gps,
    ultrasonic,
    tof,
    sound,
    button,
    smt50,
    watertemperature,
    soundsensor,
    multiplexerInit,
    multiplexerChangeChannel,
  ],
};
