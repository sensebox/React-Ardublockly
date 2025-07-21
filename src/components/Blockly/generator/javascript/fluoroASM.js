import * as Blockly from "blockly";

Blockly.Generator.Simulator.forBlock["sensebox_fluoroASM_init"] = function () {
  Blockly.Generator.Simulator.modules_["sensebox_fluoroASM_init"] =
    "sensebox_fluoroASM_init";

  var code = "";
  return code;
};

Blockly.Generator.Simulator.forBlock["sensebox_fluoroASM_setLED"] =
  function () {
    Blockly.Generator.Simulator.modules_["sensebox_fluoroASM_setLED"] =
      "sensebox_fluoroASM_setLED";

    var led = this.getFieldValue("LED_NUMBER");
    var code = `toggleLED(${led});\n`;
    return code;
  };

Blockly.Generator.Simulator.forBlock["sensebox_fluoroASM_setLED2"] =
  function () {
    Blockly.Generator.Simulator.modules_["sensebox_fluoroASM_setLED2"] =
      "sensebox_fluoroASM_setLED2";

    var led = this.getFieldValue("LED_NUMBER");
    var on = this.getFieldValue("STAT");
    var code = `toggleLED(${led}, "${on}");\n`;
    return code;
  };
