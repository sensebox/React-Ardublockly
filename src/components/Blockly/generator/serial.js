import * as Blockly from "blockly/core";

Blockly.Generator.Arduino.forBlock["print_serial_monitor"] = function (
  block,
  generator,
) {
  var serialId = block.getFieldValue("SERIAL_ID");
  var content =
    Blockly.Generator.Arduino.valueToCode(
      block,
      "CONTENT",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || "0";
  var checkbox_name = block.getFieldValue("NEW_LINE") === "TRUE";
  var code = "";
  if (checkbox_name) {
    code = serialId + ".println(" + content + ");\n";
  } else {
    code = serialId + ".print(" + content + ");\n";
  }
  return code;
};

/**
 * Code generator for block for setting the serial com speed.
 * Arduino code: setup{ Serial.begin(X); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code.
 */
Blockly.Generator.Arduino.forBlock["init_serial_monitor"] = function (
  block,
  generator,
) {
  var serialId = block.getFieldValue("SERIAL_ID");
  var serialSpeed = block.getFieldValue("SPEED");
  Blockly.Generator.Arduino.setupCode_["init_serial"] =
    `${serialId}.begin(${serialSpeed});`;
  var code = "";
  return code;
};
