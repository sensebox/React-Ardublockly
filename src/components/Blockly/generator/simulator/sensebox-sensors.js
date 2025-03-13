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


Blockly.Generator.Simulator.forBlock["sensebox_scd30"] = function () {
  Blockly.Generator.Simulator.modules_["sensebox_scd30"] = "sensebox_scd30";

  var dropdown_name = this.getFieldValue("NAME");

  var code = `read${dropdown_name}SCD30()`;

  return [code, Blockly.Generator.Simulator.ORDER_ATOMIC];
};

