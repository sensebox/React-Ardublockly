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

Blockly.Generator.Simulator.forBlock["sensebox_sensor_watertemperature"] = function () {
  Blockly.Generator.Simulator.modules_["senseBox_waterTemp"] = "senseBox_waterTemp";

  var code = "readWaterTemperature()";
  return [code, Blockly.Generator.Simulator.ORDER_ATOMIC];
};

Blockly.Generator.Simulator.forBlock["sensebox_esp32s2_light"] = function () {
  Blockly.Generator.Simulator.modules_["sensebox_esp32s2_light"] = "sensebox_esp32s2_light";

  var dropdown_name = this.getFieldValue("NAME");

  var code = `readPhotodiode()`;
  return [code, Blockly.Generator.Simulator.ORDER_ATOMIC];
};

Blockly.Generator.Simulator.forBlock["sensebox_tof_imager"] = function () {
  Blockly.Generator.Simulator.modules_["sensebox_tof_imager"] = "sensebox_tof_imager";
  
  var dropdown_name = this.getFieldValue("dropdown");
  var code = dropdown_name === "DistanzCM" ? 
    "readDistance()" : 
    "getDistanceBitmap()";
    return [code, Blockly.Generator.Simulator.ORDER_ATOMIC];

}

Blockly.Generator.Simulator.forBlock["sensebox_sensor_bme680_bsec"] = function () {
  Blockly.Generator.Simulator.modules_["sensebox_sensor_bme680_bsec"] = "sensebox_sensor_bme680_bsec";

  var dropdown_name = this.getFieldValue("dropdown");
  var code = `read${dropdown_name}BME680()`;
  return [code, Blockly.Generator.Simulator.ORDER_ATOMIC];
}

Blockly.Generator.Simulator.forBlock["sensebox_sensor_truebner_smt50_esp32"] = function () {
  Blockly.Generator.Simulator.modules_["senseBox_smt50"] = "senseBox_smt50";
  
  var dropdown_value = this.getFieldValue("value");
  var code = dropdown_value === "temp" ? 
    "readSoilTemperature()" : 
    "readSoilMoisture()";
  return [code, Blockly.Generator.Simulator.ORDER_ATOMIC];

}

Blockly.Generator.Simulator.forBlock["sensebox_scd30"] = function () {
  Blockly.Generator.Simulator.modules_["sensebox_scd30"] = "sensebox_scd30";

  var dropdown_name = this.getFieldValue("NAME");

  var code = `read${dropdown_name}SCD30()`;
  return [code, Blockly.Generator.Simulator.ORDER_ATOMIC];
}

Blockly.Generator.Simulator.forBlock["sensebox_sensor_dps310"] = function () {
  Blockly.Generator.Simulator.modules_["sensebox_sensor_dps310"] = "sensebox_sensor_dps310";

  var dropdown_name = this.getFieldValue("NAME");

  var code = `read${dropdown_name}DPS310()`;
  return [code, Blockly.Generator.Simulator.ORDER_ATOMIC];
};

