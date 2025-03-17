import * as Blockly from "blockly/core";

Blockly.Generator.Arduino.forBlock["lists_create_empty"] = function (
  block,
  generator,
) {
  var code = "";
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

Blockly.Generator.Arduino.forBlock["array_getIndex"] = function (
  block,
  generator,
) {
  var code = "";
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

Blockly.Generator.Arduino.forBlock["lists_length"] = function (
  block,
  generator,
) {
  var array = Blockly.Generator.Arduino.valueToCode(
    this,
    "ARRAY",
    Blockly.Generator.Arduino.ORDER_ATOMIC,
  );
  var code = `${array}.length`;
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};
