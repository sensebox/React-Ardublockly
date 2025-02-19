
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