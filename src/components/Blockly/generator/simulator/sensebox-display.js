import * as Blockly from "blockly/core";

Blockly.Generator.Simulator.forBlock["sensebox_display_clearDisplay"] =
  function () {
    Blockly.Generator.Simulator.modules_["senseBox_display"] =
      "senseBox_display";
    var code = "clearDisplay();\n";
    return code;
  };

Blockly.Generator.Simulator.forBlock["sensebox_display_printDisplay"] =
  function () {
    Blockly.Generator.Simulator.modules_["senseBox_display"] =
      "senseBox_display";
    var x = this.getFieldValue("X");
    var y = this.getFieldValue("Y");
    var printDisplay =
      Blockly.Generator.Simulator.valueToCode(
        this,
        "printDisplay",
        Blockly.Generator.Simulator.ORDER_ATOMIC,
      ) || '"Keine Eingabe"';
    var size = this.getFieldValue("SIZE");
    var color = this.getFieldValue("COLOR");
    var code = `drawText(${printDisplay}, ${x}, ${y}, ${size}, "${color.split(",")[0]}");\n`;
    return code;
  };
