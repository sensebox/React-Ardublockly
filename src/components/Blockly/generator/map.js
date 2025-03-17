import * as Blockly from "blockly/core";

/**
 * Code generator for the map block.
 * Arduino code: loop { map(x, 0, 1024, 0, y) }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Generator.Arduino.forBlock["base_map"] = function (block, generator) {
  var valueNum =
    Blockly.Generator.Arduino.valueToCode(
      block,
      "NUM",
      Blockly.Generator.Arduino.ORDER_NONE,
    ) || "0";
  var fromMin =
    Blockly.Generator.Arduino.valueToCode(
      block,
      "FMIN",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || "0";
  var fromMax =
    Blockly.Generator.Arduino.valueToCode(
      block,
      "FMAX",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || "0";
  var valueDmin =
    Blockly.Generator.Arduino.valueToCode(
      block,
      "DMIN",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || "0";
  var valueDmax =
    Blockly.Generator.Arduino.valueToCode(
      block,
      "DMAX",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || "0";

  var code =
    "map(" +
    valueNum +
    "," +
    fromMin +
    "," +
    fromMax +
    "," +
    valueDmin +
    "," +
    valueDmax +
    ")";
  return [code, Blockly.Generator.Arduino.ORDER_NONE];
};
