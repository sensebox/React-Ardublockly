import * as Blockly from "blockly/core";

/**
 * Values the sensor sliders report (key = slider "type", see SensorNode).
 * label: Blockly.Msg key, sensor: shown in the graph view.
 */
export const SIMULATOR_VALUES = {
  senseBox_hdc1080_temp: {
    label: "simulator_value_temperature",
    sensor: "HDC1080",
  },
  senseBox_hdc1080_humidity: {
    label: "simulator_value_humidity",
    sensor: "HDC1080",
  },
  sensebox_light_lux: {
    label: "simulator_value_illuminance",
    sensor: "TSL45315",
  },
  sensebox_light_uv: { label: "simulator_value_uv", sensor: "VEML6070" },
  sensebox_esp32s2_light: {
    label: "simulator_value_light",
    sensor: "Photodiode",
  },
  sensebox_watertemp_temp: {
    label: "simulator_value_water_temperature",
    sensor: "DS18B20",
  },
  sensebox_ultrasonic_distance: {
    label: "simulator_value_distance_cm",
    sensor: "HC-SR04",
  },
  sensebox_tof_dist: {
    label: "simulator_value_distance_mm",
    sensor: "ToF",
  },
  sensebox_bme680_temp: {
    label: "simulator_value_temperature",
    sensor: "BME680",
  },
  sensebox_bme680_humidity: {
    label: "simulator_value_humidity",
    sensor: "BME680",
  },
  sensebox_bme680_pressure: {
    label: "simulator_value_pressure",
    sensor: "BME680",
  },
  sensebox_bme680_iaq: { label: "simulator_value_iaq", sensor: "BME680" },
  sensebox_bme680_iaq_accuracy: {
    label: "simulator_value_iaq_accuracy",
    sensor: "BME680",
  },
  sensebox_bme680_co2: {
    label: "simulator_value_co2_equivalent",
    sensor: "BME680",
  },
  sensebox_bme680_voc: { label: "simulator_value_voc", sensor: "BME680" },
  sensebox_smt50_temp: {
    label: "simulator_value_soil_temperature",
    sensor: "SMT50",
  },
  sensebox_smt50_moisture: {
    label: "simulator_value_soil_moisture",
    sensor: "SMT50",
  },
  sensebox_scd_co2: { label: "simulator_value_co2", sensor: "SCD30" },
  sensebox_scd_temp: { label: "simulator_value_temperature", sensor: "SCD30" },
  sensebox_scd_humi: { label: "simulator_value_humidity", sensor: "SCD30" },
  sensebox_dps310_temp: {
    label: "simulator_value_temperature",
    sensor: "DPS310",
  },
  sensebox_dps310_pressure: {
    label: "simulator_value_pressure",
    sensor: "DPS310",
  },
  sensebox_dps310_altitude: {
    label: "simulator_value_altitude",
    sensor: "DPS310",
  },
  accelerometer_x: {
    label: "simulator_value_acceleration_x",
    sensor: "MCU-S2",
  },
  accelerometer_y: {
    label: "simulator_value_acceleration_y",
    sensor: "MCU-S2",
  },
  accelerometer_z: {
    label: "simulator_value_acceleration_z",
    sensor: "MCU-S2",
  },
  accelerometer_temp: {
    label: "simulator_value_temperature",
    sensor: "MCU-S2",
  },
  sensebox_sds_pm10: { label: "simulator_value_pm10", sensor: "SDS011" },
  sensebox_sds_pm25: { label: "simulator_value_pm25", sensor: "SDS011" },
  sensebox_sps_pm1: { label: "simulator_value_pm1", sensor: "SPS30" },
  sensebox_sps_pm25: { label: "simulator_value_pm25", sensor: "SPS30" },
  sensebox_sps_pm4: { label: "simulator_value_pm4", sensor: "SPS30" },
  sensebox_sps_pm10: { label: "simulator_value_pm10", sensor: "SPS30" },
  sensebox_rg15_total_rainfall: {
    label: "simulator_value_rain_total",
    sensor: "RG15",
  },
  sensebox_rg15_rainfall_intensity: {
    label: "simulator_value_rain_intensity",
    sensor: "RG15",
  },
};

/**
 * Translated label of a value, e.g. "Temperatur (°C)".
 * @param {string} type Slider type, a key of SIMULATOR_VALUES.
 * @return {string}
 */
export function valueLabel(type) {
  const value = SIMULATOR_VALUES[type];
  return (value && Blockly.Msg[value.label]) || type;
}

/**
 * Label with the sensor, e.g. "Temperatur (°C) – HDC1080".
 * @param {string} type Slider type, a key of SIMULATOR_VALUES.
 * @return {string}
 */
export function valueLabelWithSensor(type) {
  const value = SIMULATOR_VALUES[type];
  return value ? `${valueLabel(type)} – ${value.sensor}` : type;
}
