import * as Blockly from "blockly";

Blockly.Generator.Simulator.forBlock["sensebox_fluoroASM_init"] = function () {
  Blockly.Generator.Simulator.modules_["sensebox_fluoroASM_init"] =
    "sensebox_fluoroASM_init";

  var code = "";
  return code;
};

Blockly.Generator.Simulator.forBlock["sensebox_fluoroASM_setLED"] = function (
  block,
  generator,
) {
  Blockly.Generator.Simulator.modules_["sensebox_fluoroASM_setLED"] =
    "sensebox_fluoroASM_setLED";

  const led = this.getFieldValue("LED_NUMBER");
  // Like the Arduino generator: default brightness 50, "off" means 0.
  const brightness =
    block.getFieldValue("STAT") === "LOW"
      ? "0"
      : generator.valueToCode(block, "BRIGHTNESS", generator.ORDER_ATOMIC) ||
        "50";
  const code = `toggleLED(${led}, ${brightness});\n`;
  return code;
};
