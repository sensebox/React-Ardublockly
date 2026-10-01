import * as Blockly from "blockly";

/**
 * Sensor blocks. Each block registers its module, so the simulator shows the
 * sensor next to the board, and calls a read function provided by the
 * simulator runtime (src/components/Simulator/init/sensors).
 */

/**
 * Code for a sensor value, looked up by dropdown value.
 * @param {!Blockly.Block} block
 * @param {string} field Name of the dropdown field.
 * @param {!Object<string, string>} functions Dropdown value -> function name.
 * @return {!Array} Code and operator order.
 */
function readValue(block, field, functions) {
  const functionName = functions[block.getFieldValue(field)];
  if (!functionName) {
    Blockly.Generator.Simulator.markUnsupported(
      block,
      block.getField(field)?.getText(),
    );
    return ["0", Blockly.Generator.Simulator.ORDER_ATOMIC];
  }
  return [`${functionName}()`, Blockly.Generator.Simulator.ORDER_ATOMIC];
}

/**
 * Module entry with the GPIO port the sensor is plugged into, e.g.
 * "senseBox_smt50@B". The simulator draws the cable to this port.
 * @param {string} type Module type
 * @param {!Blockly.Block} block
 * @param {string} field Name of the port dropdown, showing "A", "B" or "C".
 * @return {string}
 */
function withPort(type, block, field) {
  const port = block.getField(field)?.getText();
  return port ? `${type}@${port}` : type;
}

/**
 * HDC1080 Temperature and Humidity Sensor
 */
Blockly.Generator.Simulator.forBlock["sensebox_sensor_temp_hum"] = function (
  block,
) {
  Blockly.Generator.Simulator.modules_["senseBox_hdc1080"] = "senseBox_hdc1080";
  return readValue(block, "NAME", {
    Temperature: "readTemperature",
    Humidity: "readHumidity",
  });
};

/**
 * TSL45315 illuminance and VEML6070 UV intensity
 */
Blockly.Generator.Simulator.forBlock["sensebox_sensor_uv_light"] = function (
  block,
) {
  Blockly.Generator.Simulator.modules_["senseBox_lightUv"] = "senseBox_lightUv";
  return readValue(block, "NAME", {
    Illuminance: "readIlluminance",
    UvIntensity: "readUvIntensity",
  });
};

/**
 * DS18B20 water temperature
 */
Blockly.Generator.Simulator.forBlock["sensebox_sensor_watertemperature"] =
  function (block) {
    Blockly.Generator.Simulator.modules_["senseBox_waterTemp"] = withPort(
      "senseBox_waterTemp",
      block,
      "Port",
    );
    return ["readWaterTemperature()", Blockly.Generator.Simulator.ORDER_ATOMIC];
  };

/**
 * Photodiode on the MCU-S2
 */
Blockly.Generator.Simulator.forBlock["sensebox_esp32s2_light"] = function () {
  Blockly.Generator.Simulator.modules_["sensebox_esp32s2_light"] =
    "sensebox_esp32s2_light";
  return ["readPhotodiode()", Blockly.Generator.Simulator.ORDER_ATOMIC];
};

/**
 * HC-SR04 ultrasonic distance
 */
Blockly.Generator.Simulator.forBlock["sensebox_sensor_ultrasonic_ranger"] =
  function (block) {
    Blockly.Generator.Simulator.modules_["sensebox_sensor_ultrasonic_ranger"] =
      withPort("sensebox_sensor_ultrasonic_ranger", block, "port");
    return [
      "readUltrasonicDistance()",
      Blockly.Generator.Simulator.ORDER_ATOMIC,
    ];
  };

/**
 * ToF imager. Only the distance is simulated, not the bitmap.
 */
Blockly.Generator.Simulator.forBlock["sensebox_tof_imager"] = function (block) {
  Blockly.Generator.Simulator.modules_["sensebox_tof_imager"] =
    "sensebox_tof_imager";
  return readValue(block, "dropdown", {
    DistanzCM: "readDistance",
  });
};

/**
 * BME680 environmental sensor
 */
Blockly.Generator.Simulator.forBlock["sensebox_sensor_bme680_bsec"] = function (
  block,
) {
  Blockly.Generator.Simulator.modules_["sensebox_sensor_bme680_bsec"] =
    "sensebox_sensor_bme680_bsec";
  return readValue(block, "dropdown", {
    temperature: "readTemperatureBME680",
    humidity: "readHumidityBME680",
    pressure: "readPressureBME680",
    IAQ: "readIAQBME680",
    IAQAccuracy: "readIAQAccuracyBME680",
    CO2: "readCO2EquivalentBME680",
    breathVocEquivalent: "readBreathVOCEquivalentBME680",
  });
};

/**
 * SMT50 soil temperature and moisture
 */
Blockly.Generator.Simulator.forBlock["sensebox_sensor_truebner_smt50_esp32"] =
  function (block) {
    Blockly.Generator.Simulator.modules_["senseBox_smt50"] = withPort(
      "senseBox_smt50",
      block,
      "Port",
    );
    return readValue(block, "value", {
      temp: "readSoilTemperature",
      soil: "readSoilMoisture",
    });
  };

/**
 * SCD30 CO2 sensor
 */
Blockly.Generator.Simulator.forBlock["sensebox_scd30"] = function (block) {
  Blockly.Generator.Simulator.modules_["sensebox_scd30"] = "sensebox_scd30";
  return readValue(block, "dropdown", {
    CO2: "readCO2SCD30",
    temperature: "readTemperatureSCD30",
    humidity: "readHumiditySCD30",
  });
};

/**
 * DPS310 pressure sensor
 */
Blockly.Generator.Simulator.forBlock["sensebox_sensor_dps310"] = function (
  block,
) {
  Blockly.Generator.Simulator.modules_["sensebox_sensor_dps310"] =
    "sensebox_sensor_dps310";
  return readValue(block, "NAME", {
    Pressure: "readPressureDPS310",
    Temperature: "readTemperatureDPS310",
    Altitude: "readAltitudeDPS310",
  });
};

/**
 * Button on the MCU-S2
 */
Blockly.Generator.Simulator.forBlock["sensebox_button"] = function (block) {
  Blockly.Generator.Simulator.modules_["sensebox_button"] = "sensebox_button";
  if (block.getFieldValue("FUNCTION") === "longPress") {
    const time = Number(block.getFieldValue("time")) || 0;
    return [`longPress(${time})`, Blockly.Generator.Simulator.ORDER_ATOMIC];
  }
  return readValue(block, "FUNCTION", {
    isPressed: "isPressed",
    wasPressed: "wasPressed",
    toggleButton: "toggleButton",
  });
};

/**
 * Accelerometer on the MCU-S2
 */
Blockly.Generator.Simulator.forBlock["sensebox_esp32s2_accelerometer"] =
  function (block) {
    Blockly.Generator.Simulator.modules_["sensebox_esp32s2_accelerometer"] =
      "sensebox_esp32s2_accelerometer";
    return readValue(block, "value", {
      accelerationX: "readAccelerationX",
      accelerationY: "readAccelerationY",
      accelerationZ: "readAccelerationZ",
      temperature: "readTemperatureAccelerometer",
    });
  };

/**
 * SDS011 particulate matter
 */
Blockly.Generator.Simulator.forBlock["sensebox_sensor_sds011"] = function (
  block,
) {
  Blockly.Generator.Simulator.modules_["sensebox_sensor_sds011"] =
    "sensebox_sensor_sds011";
  return readValue(block, "NAME", {
    25: "readPM25SDS011",
    10: "readPM10SDS011",
  });
};

/**
 * SPS30 particulate matter
 */
Blockly.Generator.Simulator.forBlock["sensebox_sensor_sps30"] = function (
  block,
) {
  Blockly.Generator.Simulator.modules_["sensebox_sensor_sps30"] =
    "sensebox_sensor_sps30";
  return readValue(block, "value", {
    "1p0": "readPM1SPS30",
    "2p5": "readPM25SPS30",
    "4p0": "readPM4SPS30",
    "10p0": "readPM10SPS30",
  });
};

/**
 * RG15 rain gauge. Accumulation values are simulated as total accumulation.
 */
Blockly.Generator.Simulator.forBlock["sensebox_rg15_rainsensor"] = function (
  block,
) {
  Blockly.Generator.Simulator.modules_["sensebox_rg15_rainsensor"] =
    "sensebox_rg15_rainsensor";
  return readValue(block, "VALUE", {
    getTotalAccumulation: "getTotalAccumulation",
    getAccumulation: "getTotalAccumulation",
    getEventAccumulation: "getTotalAccumulation",
    getRainfallIntensity: "getRainfallIntensity",
  });
};
