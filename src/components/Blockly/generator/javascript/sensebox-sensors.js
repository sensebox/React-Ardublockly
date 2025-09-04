import * as Blockly from "blockly";
import { selectedBoard } from "../../helpers/board";

/**
 * HDC1080 Temperature and Humidity Sensor
 *
 */

Blockly.Generator.Simulator.forBlock["sensebox_sensor_temp_hum"] = function () {
  Blockly.Generator.Simulator.modules_["senseBox_hdc1080"] = "senseBox_hdc1080";

  var dropdown_name = this.getFieldValue("NAME");

  var code = `read${dropdown_name}()`;
  return [code, Blockly.Generator.Simulator.ORDER_ATOMIC];
};

Blockly.Generator.Simulator.forBlock["sensebox_sensor_uv_light"] = function () {
  Blockly.Generator.Simulator.modules_["senseBox_lightUv"] = "senseBox_lightUv";

  var dropdown_name = this.getFieldValue("NAME");

  var code = `read${dropdown_name}()`;
  return [code, Blockly.Generator.Simulator.ORDER_ATOMIC];
};

Blockly.Generator.Simulator.forBlock["sensebox_sensor_watertemperature"] =
  function () {
    Blockly.Generator.Simulator.modules_["senseBox_waterTemp"] =
      "senseBox_waterTemp";

    var code = "readWaterTemperature()";
    return [code, Blockly.Generator.Simulator.ORDER_ATOMIC];
  };

Blockly.Generator.Simulator.forBlock["sensebox_esp32s2_light"] = function () {
  Blockly.Generator.Simulator.modules_["sensebox_esp32s2_light"] =
    "sensebox_esp32s2_light";

  var dropdown_name = this.getFieldValue("NAME");

  var code = `readPhotodiode()`;
  return [code, Blockly.Generator.Simulator.ORDER_ATOMIC];
};

Blockly.Generator.Simulator.forBlock["sensebox_sensor_ultrasonic_ranger"] =
  function () {
    Blockly.Generator.Simulator.modules_["sensebox_sensor_ultrasonic_ranger"] =
      "sensebox_sensor_ultrasonic_ranger";
    var code = "readUltrasonicDistance()";

    return [code, Blockly.Generator.Simulator.ORDER_ATOMIC];
  };

Blockly.Generator.Simulator.forBlock["sensebox_tof_imager"] = function () {
  Blockly.Generator.Simulator.modules_["sensebox_tof_imager"] =
    "sensebox_tof_imager";

  var dropdown_name = this.getFieldValue("dropdown");
  var code =
    dropdown_name === "DistanzCM" ? "readDistance()" : "getDistanceBitmap()";
  return [code, Blockly.Generator.Simulator.ORDER_ATOMIC];
};

Blockly.Generator.Simulator.forBlock["sensebox_sensor_bme680_bsec"] =
  function () {
    Blockly.Generator.Simulator.modules_["sensebox_sensor_bme680_bsec"] =
      "sensebox_sensor_bme680_bsec";

    var dropdown_name = this.getFieldValue("dropdown");
    var code = `read${dropdown_name}BME680()`;
    return [code, Blockly.Generator.Simulator.ORDER_ATOMIC];
  };

Blockly.Generator.Simulator.forBlock["sensebox_sensor_truebner_smt50_esp32"] =
  function () {
    Blockly.Generator.Simulator.modules_["senseBox_smt50"] = "senseBox_smt50";

    var dropdown_value = this.getFieldValue("value");
    var code =
      dropdown_value === "temp"
        ? "readSoilTemperature()"
        : "readSoilMoisture()";
    return [code, Blockly.Generator.Simulator.ORDER_ATOMIC];
  };

Blockly.Generator.Simulator.forBlock["sensebox_scd30"] = function () {
  Blockly.Generator.Simulator.modules_["sensebox_scd30"] = "sensebox_scd30";

  var dropdown_name = this.getFieldValue("NAME");

  var code = `read${dropdown_name}SCD30()`;
  return [code, Blockly.Generator.Simulator.ORDER_ATOMIC];
};

Blockly.Generator.Simulator.forBlock["sensebox_sensor_dps310"] = function () {
  Blockly.Generator.Simulator.modules_["sensebox_sensor_dps310"] =
    "sensebox_sensor_dps310";

  var dropdown_name = this.getFieldValue("NAME");

  var code = `read${dropdown_name}DPS310()`;
  return [code, Blockly.Generator.Simulator.ORDER_ATOMIC];
};

Blockly.Generator.Simulator.forBlock["sensebox_button"] = function () {
  Blockly.Generator.Simulator.modules_["sensebox_button"] = "sensebox_button";

  var dropdown = this.getFieldValue("FUNCTION");

  var code = `${dropdown}()`;

  return [code, Blockly.Generator.Simulator.ORDER_ATOMIC];
};

Blockly.Generator.Simulator.forBlock["sensebox_esp32s2_accelerometer"] =
  function () {
    Blockly.Generator.Simulator.modules_["sensebox_esp32s2_accelerometer"] =
      "sensebox_esp32s2_accelerometer";

    var dropdown = this.getFieldValue("value");

    var code = `${dropdown}()`;

    return [code, Blockly.Generator.Simulator.ORDER_ATOMIC];
  };

Blockly.Generator.Simulator.forBlock["sensebox_sensor_sds011"] = function () {
  Blockly.Generator.Simulator.modules_["sensebox_sensor_sds011"] =
    "sensebox_sensor_sds011";

  var dropdown = this.getFieldValue("value");

  var code = `${dropdown}()`;

  return [code, Blockly.Generator.Simulator.ORDER_ATOMIC];
};

Blockly.Generator.Simulator.forBlock["sensebox_sensor_sps30"] = function () {
  Blockly.Generator.Simulator.modules_["sensebox_sensor_sps30"] =
    "sensebox_sensor_sps30";

  var dropdown = this.getFieldValue("value");
  switch (dropdown) {
    case "1p0":
      dropdown = "PM1";
      break;
    case "2p5":
      dropdown = "PM25";
      break;
    case "4o0":
      dropdown = "PM4";
      break;
    case "10p0":
      dropdown = "PM10";
      break;
    default:
  }
  var code = `$read${dropdown}SPS30()`;

  return [code, Blockly.Generator.Simulator.ORDER_ATOMIC];
};

Blockly.Generator.Simulator.forBlock["sensebox_rg15_rainsensor"] = function () {
  Blockly.Generator.Simulator.modules_["sensebox_rg15_rainsensor"] =
    "sensebox_rg15_rainsensor";

  var dropdown = this.getFieldValue("VALUE");
  if (dropdown === "getEventAccumulation" || dropdown === "getAccumulation") {
    dropdown = "getTotalAccumulation";
  }

  var code = `${dropdown}()`;

  return [code, Blockly.Generator.Simulator.ORDER_ATOMIC];
};
