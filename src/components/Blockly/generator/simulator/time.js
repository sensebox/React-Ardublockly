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
Blockly.Generator.Simulator.forBlock["time_delay"] = function (
  block,
  generator,
) {
  var delayTime =
    Blockly.Generator.Simulator.valueToCode(
      block,
      "DELAY_TIME_MILI",
      Blockly.Generator.Simulator.ORDER_ATOMIC,
    ) || "0";
  var code = `delay(${delayTime});\n`;
  return code;
};