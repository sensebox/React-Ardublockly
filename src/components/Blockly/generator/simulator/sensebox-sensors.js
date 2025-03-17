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

// Add this code to handle SMT50 blocks
Blockly.Generator.Simulator.forBlock["sensebox_sensor_truebner_smt50"] = function() {
  Blockly.Generator.Simulator.modules_["senseBox_smt50"] = "senseBox_smt50";
  
  var dropdown_value = this.getFieldValue("value");
  var code = "";
  
  if (dropdown_value === "temp") {
    code = "readSoilTemperature()";
  } else if (dropdown_value === "soil") {
    code = "readSoilMoisture()";
  }
  
  return [code, Blockly.Generator.Simulator.ORDER_ATOMIC];
};

// Add this code for SMT50 ESP32 block
Blockly.Generator.Simulator.forBlock["sensebox_sensor_truebner_smt50_esp32"] = function() {
  Blockly.Generator.Simulator.modules_["senseBox_smt50"] = "senseBox_smt50";
  
  var dropdown_value = this.getFieldValue("value");
  var code = "";
  
  if (dropdown_value === "temp") {
    code = "readSoilTemperature()";
  } else if (dropdown_value === "soil") {
    code = "readSoilMoisture()";
  }
  
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

