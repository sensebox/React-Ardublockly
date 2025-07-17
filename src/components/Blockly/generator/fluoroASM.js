import * as Blockly from "blockly/core";

Blockly.Generator.Arduino.forBlock["sensebox_fluoroASM_init"] = function () {
  Blockly.Generator.Arduino.setupCode_["sensebox_fluoroASM_init"] =
    "fluoroASM_init();";
  let code = "";
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_fluoroASM_setLED"] = function (
  block,
) {
  const ledNumber = block.getFieldValue("LED_NUMBER");

  const code = `fluoroASM_setLED(${ledNumber});\n`;
  return code;
};
Blockly.Generator.Arduino.forBlock["sensebox_fluoroASM_setLED2"] = function (
  block,
) {
  const ledNumber = block.getFieldValue("LED_NUMBER");
  const status = block.getFieldValue("STAT");
  const code = `fluoroASM_setLED(${ledNumber}, ${status});\n`;
  return code;
};
