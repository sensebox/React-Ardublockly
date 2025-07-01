import * as Blockly from "blockly";

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
Blockly.Generator.Arduino.forBlock["time_delay"] = function (block, generator) {
  var delayTime =
    Blockly.Generator.Arduino.valueToCode(
      block,
      "DELAY_TIME_MILI",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
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
Blockly.Generator.Arduino.forBlock["time_delaymicros"] = function (
  block,
  generator,
) {
  var delayTimeMs =
    Blockly.Generator.Arduino.valueToCode(
      block,
      "DELAY_TIME_MICRO",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
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
Blockly.Generator.Arduino.forBlock["time_millis"] = function (
  block,
  generator,
) {
  var code = "millis()";
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

/**
 * Code generator for the elapsed time in microseconds block.
 * Arduino code: loop { micros() }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Generator.Arduino.forBlock["time_micros"] = function (
  block,
  generator,
) {
  var code = "micros()";
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

/**
 * Code generator for the wait forever (end of program) block
 * Arduino code: loop { while(true); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Generator.Arduino.forBlock["infinite_loop"] = function (
  block,
  generator,
) {
  return "while(true);\n";
};

// Blockly.Generator.Arduino.forBlock["sensebox_interval_timer"] = function(block, generator) {

//   var interval = this.getFieldValue("interval");
//   Blockly.Generator.Arduino.variables_["define_interval_variables"] =
//     "const long interval = " +
//     interval +
//     ";\nlong time_start = 0;\nlong time_actual = 0;";
//   var branch = Blockly.Generator.Arduino.statementToCode(block, "DO");
//   var code = "time_start = millis();\n";
//   code +=
//     "if (time_start > time_actual + interval) {\n  time_actual = millis();\n";
//   code += branch;
//   code += "}\n";
//   return code;
// };

Blockly.Generator.Arduino.forBlock["sensebox_interval_timer"] = function (
  block,
  generator,
) {
  var intervalTime = this.getFieldValue("interval");
  var intervalName = this.getFieldValue("name");

  // Erstelle einen Schlüssel für das Intervall
  var key = `define_interval_variables${intervalName}`;

  // Falls dieser Name schon existiert, hänge einen leserlichen Suffix an (z.B. _Dup1, _Dup2, etc.)
  if (Blockly.Generator.Arduino.variables_[key]) {
    var duplicateCount = 1;
    var newKey = `define_interval_variables${intervalName}_Dup${duplicateCount}`;
    while (Blockly.Generator.Arduino.variables_[newKey]) {
      duplicateCount++;
      newKey = `define_interval_variables${intervalName}_Dup${duplicateCount}`;
    }
    intervalName = intervalName + "_Dup" + duplicateCount;
    key = newKey;
  }

  Blockly.Generator.Arduino.variables_[key] = `
  const long interval${intervalName} = ${intervalTime};
  long time_start${intervalName} = 0;
  long time_actual${intervalName} = 0;`;

  Blockly.Generator.Arduino.loopCodeOnce_[`interval_loop${intervalName}`] =
    `time_start${intervalName} = millis();\n`;

  var branch = Blockly.Generator.Arduino.statementToCode(block, "DO");
  var code = `
  if (time_start${intervalName} > time_actual${intervalName} + interval${intervalName}) {
    time_actual${intervalName} = millis();
    ${branch}
  }
  `;
  return code;
};
