import Blockly from "blockly";

/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Arduino code generator for the Time blocks.
 *     Arduino built-in function docs: http://arduino.cc/en/Reference/HomePage
 */

/**
 * Code generator for the delay Arduino block.
 * Arduino code: loop { delay(X); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Arduino["time_delay"] = function (block) {
  var delayTime =
    Blockly.Arduino.valueToCode(
      block,
      "DELAY_TIME_MILI",
      Blockly.Arduino.ORDER_ATOMIC,
    ) || "0";
  var code = "delay(" + delayTime + ");\n";
  return code;
};

/**
 * Code generator for the delayMicroseconds block.
 * Arduino code: loop { delayMicroseconds(X); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Arduino["time_delaymicros"] = function (block) {
  var delayTimeMs =
    Blockly.Arduino.valueToCode(
      block,
      "DELAY_TIME_MICRO",
      Blockly.Arduino.ORDER_ATOMIC,
    ) || "0";
  var code = "delayMicroseconds(" + delayTimeMs + ");\n";
  return code;
};

/**
 * Code generator for the elapsed time in milliseconds block.
 * Arduino code: loop { millis() }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Arduino["time_millis"] = function (block) {
  var code = "millis()";
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

/**
 * Code generator for the elapsed time in microseconds block.
 * Arduino code: loop { micros() }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Arduino["time_micros"] = function (block) {
  var code = "micros()";
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

/**
 * Code generator for the wait forever (end of program) block
 * Arduino code: loop { while(true); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Arduino["infinite_loop"] = function (block) {
  return "while(true);\n";
};

// Blockly.Arduino.sensebox_interval_timer = function (block) {
//   var interval = this.getFieldValue("interval");
//   Blockly.Arduino.variables_["define_interval_variables"] =
//     "const long interval = " +
//     interval +
//     ";\nlong time_start = 0;\nlong time_actual = 0;";
//   var branch = Blockly.Arduino.statementToCode(block, "DO");
//   var code = "time_start = millis();\n";
//   code +=
//     "if (time_start > time_actual + interval) {\n  time_actual = millis();\n";
//   code += branch;
//   code += "}\n";
//   return code;
// };

/**
 * Code generator for deep sleep of ESP32-S2
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Arduino["deep_sleep_esp32s2"] = function (block) {
  Blockly.Arduino.libraries_["library_wire"] = `#include <Wire.h>`;
  Blockly.Arduino.variables_["sb041_solar_voltage"] = "float solar_voltage;";
  Blockly.Arduino.variables_["sb041_battery_voltage"] = "float battery_voltage;";
  Blockly.Arduino.variables_["sb041_battery_level"] = "int battery_level;";
  Blockly.Arduino.variables_["sb041_battery_temp"] = "float battery_temp;";
  return "while(true);\n";
};

Blockly.Arduino.sensebox_interval_timer = function (block) {
  var intervalTime = this.getFieldValue("interval");
  var intervalName = this.getFieldValue("name");
  Blockly.Arduino.variables_[`define_interval_variables${intervalName}`] = `
  const long interval${intervalName} = ${intervalTime};
  long time_start${intervalName} = 0;
  long time_actual${intervalName} = 0;`;
  Blockly.Arduino.loopCodeOnce_[`interval_loop${intervalName}`] =
    `time_start${intervalName} = millis();\n`;
  var branch = Blockly.Arduino.statementToCode(block, "DO");
  var code = `
  if (time_start${intervalName} > time_actual${intervalName} + interval${intervalName}) {\n  time_actual${intervalName} = millis();\n`;
  code += branch;
  code += "}\n";
  return code;
};
